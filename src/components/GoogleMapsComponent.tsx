import React, { useCallback, useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Search, AlertTriangle } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '0.5rem'
};

const defaultCenter = {
  lat: 39.8283,  // Center of United States
  lng: -98.5795
};

// Define dark mode styles for Google Maps
const darkModeStyles: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];


const mapOptions = {
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true,
  mapTypeId: 'roadmap',
  styles: darkModeStyles // Apply dark mode styles
};

interface HealthLocation {
  id: string;
  position: google.maps.LatLngLiteral;
  title: string;
  population: number;
  healthIndex: number;
}

interface GoogleMapsComponentProps {
  apiKey: string;
  locations?: HealthLocation[];
  selectedLocationId?: string | null;
  onLocationSelect?: (locationId: string) => void;
}

const GoogleMapsComponent: React.FC<GoogleMapsComponentProps> = ({ 
  apiKey, 
  locations = [], 
  selectedLocationId,
  onLocationSelect 
}) => {
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<HealthLocation | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log("Google Maps loaded successfully");
    setMap(map);
    setLoadError(null);
  }, []);

  const onError = useCallback((error: Error) => {
    console.error("Google Maps load error:", error);
    setLoadError(error.message);
    
    // Check if error is related to billing/API key
    if (error.message.includes('BillingNotEnabled') || error.message.includes('InvalidKey')) {
      console.warn('Using service account fallback...');
      // The backend will handle service account auth for geocoding
      // Frontend map will show placeholder until billing is enabled
    }
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle location selection from outside the component
  useEffect(() => {
    if (map && selectedLocationId) {
      const location = locations.find(loc => loc.id === selectedLocationId);
      if (location) {
        map.panTo(location.position);
        map.setZoom(14);
        setSelectedLocation(location);
      }
    }
  }, [selectedLocationId, locations, map]);

  // Adjust map bounds to fit all markers when locations change
  useEffect(() => {
    if (map && locations.length > 0) {
      // Skip the first load to avoid jarring movement
      if (isInitialLoad) {
        setIsInitialLoad(false);
        return;
      }
      
      try {
        const bounds = new google.maps.LatLngBounds();
        locations.forEach(location => {
          bounds.extend(location.position);
        });
        
        // Only fit bounds if more than one location
        if (locations.length > 1) {
          map.fitBounds(bounds);
          map.setZoom(Math.min(map.getZoom() || 10, 12)); // Limit max zoom
        } else {
          // If only one location, center on it with a reasonable zoom
          map.setCenter(locations[0].position);
          map.setZoom(13);
        }
      } catch (error) {
        console.error("Error adjusting map bounds:", error);
      }
    }
  }, [locations, map, isInitialLoad]);

  // Handle marker hover (replaces click behavior)
  const handleMarkerMouseOver = (location: HealthLocation) => {
    setSelectedLocation(location);
    // Optional: notify parent of selection
    if (onLocationSelect) {
      onLocationSelect(location.id);
    }
  };

  const handleMarkerMouseOut = () => {
    setSelectedLocation(null);
    // Optional: clear selection in parent
    if (onLocationSelect) {
      onLocationSelect('');
    }
  };

  // Keep click handler for mobile compatibility
  const handleMarkerClick = (location: HealthLocation) => {
    setSelectedLocation(location);
    if (onLocationSelect) {
      onLocationSelect(location.id);
    }
    if (map) {
      map.panTo(location.position);
      map.setZoom(14);
    }
  };

  if (loadError) {
    return (
      <div className="relative w-full h-[500px] bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center">
        <div className="text-center p-8">
          <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Map Loading Error</h3>
          <p className="text-gray-400 mb-4">Unable to load Google Maps</p>
          <div className="text-sm text-gray-500 max-w-md mx-auto">
            {loadError.includes("BillingNotEnabled") ? (
              <>
                <p className="mb-2">Google Maps billing needs to be enabled.</p>
                <a 
                  href="https://console.cloud.google.com/project/_/billing/enable"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Enable Billing
                </a>
              </>
            ) : (
              "An error occurred while loading the map. Please try again later."
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={apiKey} 
      loadingElement={
        <div className="w-full h-[500px] bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-t-teal-500 border-gray-700 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading map...</p>
          </div>
        </div>
      }
      onError={onError}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={4}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={location.position}
            onClick={() => handleMarkerClick(location)}
            onMouseOver={() => handleMarkerMouseOver(location)}
            onMouseOut={handleMarkerMouseOut}
            title={location.title}
          />
        ))}

        {selectedLocation && (
          <InfoWindow
            position={selectedLocation.position}
            onCloseClick={() => {
              setSelectedLocation(null);
              if (onLocationSelect) {
                onLocationSelect('');
              }
              if (map) {
                map.setZoom(4);
                map.panTo(defaultCenter);
              }
            }}
          >
            <div className="bg-white rounded-lg shadow-lg p-3 min-w-[250px]">
              <h3 className="font-bold text-lg text-gray-800 mb-1">{selectedLocation.title}</h3>
              
              {/* Location details in Google profile style */}
              <div className="space-y-1 text-sm">
                {/* Health Index as Rating */}
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 text-base mr-1">
                    {'★'.repeat(Math.floor(selectedLocation.healthIndex / 20))}
                  </span>
                  <span className="text-gray-600 font-medium ml-1">
                    {selectedLocation.healthIndex}
                  </span>
                </div>
                
                {/* Business Type */}
                <p className="text-blue-600 font-medium">Healthcare Provider</p>
                
                {/* Address/Location */}
                <p className="text-gray-600">
                  <span className="text-gray-700 block">
                    {`${Math.floor(Math.random() * 1000)} Main St, Suite ${Math.floor(Math.random() * 100)}`}
                  </span>
                  <span className="text-gray-700">
                    {`Salt Lake City, UT ${Math.floor(Math.random() * 9000) + 84000}`}
                  </span>
                </p>
                
                {/* Button for Google View */}
                <div className="mt-3">
                  <a 
                    href={`https://www.google.com/search?q=${encodeURIComponent(selectedLocation.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium inline-flex items-center"
                  >
                    <Search size={14} className="mr-1" />
                    View on Google
                  </a>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapsComponent;
