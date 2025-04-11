import React, { useState, useEffect } from 'react';
import { Provider, getSpecialtyDisplayName } from '../../services/providerService';

interface ProviderMapProps {
  providers: Provider[];
  selectedProviderId?: string;
  onProviderSelect?: (id: string) => void;
  patientAddress?: string;
}

const ProviderMap: React.FC<ProviderMapProps> = ({ 
  providers, 
  selectedProviderId,
  onProviderSelect,
  patientAddress 
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  
  // Initialize map
  useEffect(() => {
    // Load Google Maps API manually
    if (typeof google === 'undefined' || !google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDQG_9FZUutksKQ75_W9-0hF3l6iC3wRe8&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
    
    return () => {
      // Clean up markers when component unmounts
      markers.forEach(marker => marker.setMap(null));
    };
  }, []);
  
  // Initialize map
  useEffect(() => {
    if (!mapLoaded) return;
    
    // Create map instance
    const mapElement = document.getElementById('provider-map');
    if (!mapElement) return;
    
    const mapOptions: google.maps.MapOptions = {
      zoom: 10,
      center: { lat: 40.7608, lng: -111.8910 }, // Default center (Salt Lake City)
      mapTypeId: 'roadmap',
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
        { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
        { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
        { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
        { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
        { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
        { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
        { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
        { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
        { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
        { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
        { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
      ],
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      }
    };
    
    const mapInstance = new google.maps.Map(mapElement, mapOptions);
    setMap(mapInstance);
    
    // Create info window
    const infoWindowInstance = new google.maps.InfoWindow();
    setInfoWindow(infoWindowInstance);
    
  }, [mapLoaded]);
  
  // Add markers when map and providers change
  useEffect(() => {
    if (!map || !providers.length) return;
    
    // Clear old markers
    markers.forEach(marker => marker.setMap(null));
    
    // Create bounds for centering the map
    const bounds = new google.maps.LatLngBounds();
    
    // Create markers for each provider
    const newMarkers = providers.map((provider, index) => {
      // Generate a position if not available
      let position: google.maps.LatLngLiteral;
      
      if (provider.location && provider.location.lat && provider.location.lng) {
        position = provider.location;
      } else {
        // Generate gridded positions so they're not all stacked
        const row = Math.floor(index / 3);
        const col = index % 3;
        
        // Base coordinates (Salt Lake City)
        const baseLat = 40.7608;
        const baseLng = -111.8910;
        
        // Offsets create a grid (0.01 degrees is roughly 1km)
        const latOffset = 0.01 * (row - 1);
        const lngOffset = 0.01 * (col - 1);
        
        // Add slight randomness to avoid exact alignment
        const jitter = 0.002;
        position = {
          lat: baseLat + latOffset + (Math.random() * jitter - jitter/2),
          lng: baseLng + lngOffset + (Math.random() * jitter - jitter/2)
        };
      }
      
      // Add to bounds
      bounds.extend(position);
      
      // Create marker
      const marker = new google.maps.Marker({
        position,
        map,
        title: provider.name,
        animation: provider.id === selectedProviderId ? google.maps.Animation.BOUNCE : undefined
      });
      
      // Add click listener
      marker.addListener('click', () => {
        if (infoWindow) {
          infoWindow.setContent(`
            <div style="color: #333; padding: 8px;">
              <h3 style="font-weight: bold; margin-bottom: 8px;">${provider.name}</h3>
              <p style="color: #4f46e5; margin-bottom: 4px;">${getSpecialtyDisplayName(provider.specialty)}</p>
              <p style="margin-bottom: 4px;">${provider.address}</p>
              <p>${provider.phone}</p>
            </div>
          `);
          infoWindow.open(map, marker);
        }
        
        if (onProviderSelect) {
          onProviderSelect(provider.id);
        }
      });
      
      return marker;
    });
    
    // Fit map to show all markers
    if (newMarkers.length > 0) {
      map.fitBounds(bounds);
      
      // Don't zoom in too far
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 14) {
          map.setZoom(14);
        }
        google.maps.event.removeListener(listener);
      });
    }
    
    setMarkers(newMarkers);
    
    // Cleanup function - remove markers when component unmounts
    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, providers, selectedProviderId, infoWindow]);
  
  // Highlight selected provider
  useEffect(() => {
    if (!map || !selectedProviderId) return;
    
    markers.forEach(marker => {
      marker.setAnimation(null);
    });
    
    const selectedMarker = markers.find((marker, index) => 
      providers[index]?.id === selectedProviderId
    );
    
    if (selectedMarker) {
      selectedMarker.setAnimation(google.maps.Animation.BOUNCE);
      
      // Handle possible null position safely
      const position = selectedMarker.getPosition();
      if (position) {
        map.panTo(position);
      }
      
      // Stop animation after a short period
      setTimeout(() => {
        selectedMarker.setAnimation(null);
      }, 1500);
    }
  }, [selectedProviderId, markers, providers, map]);
  
  return (
    <div className="relative w-full h-full">
      <div 
        id="provider-map" 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '300px' }}
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 rounded-lg">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default ProviderMap;
