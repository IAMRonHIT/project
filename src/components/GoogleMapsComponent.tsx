import React, { useCallback, useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { Search, AlertTriangle, Navigation, Map, Layers, MapPin } from 'lucide-react';

// Customizable map container style
const getContainerStyle = (height = 500) => ({
  width: '100%',
  height: `${height}px`,
  borderRadius: '0.5rem'
});

// Default map center point (United States)
const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795
};

// Default map options
const getDefaultMapOptions = (darkMode = true) => ({
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true,
  mapTypeId: 'hybrid', // Changed from 'roadmap' to 'hybrid' for aerial satellite view
  styles: darkMode ? darkModeStyles : [],
  gestureHandling: 'cooperative',
  zoomControl: true,
  clickableIcons: false, // Reduce unnecessary API calls
  maxZoom: 18, // Prevent over-zoom which increases billing
  minZoom: 3,  // Prevent extreme zoom-out
});

// Enhanced dark mode styles for Google Maps with better performance
const darkModeStyles = [
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


// Direction route styling options
const routeOptions = {
  strokeColor: '#5cb8ff',
  strokeOpacity: 0.8,
  strokeWeight: 5,
};

// Map layer types for toggling visibility
export enum MapLayerType {
  TRAFFIC = 'traffic',
  TRANSIT = 'transit',
  BICYCLING = 'bicycling'
}

export interface MapLocation {
  id: string;
  position: google.maps.LatLngLiteral;
  title: string;
  population?: number;
  healthIndex?: number;
  type?: string;
  icon?: string;
  address?: string;
}

export interface DirectionsResult {
  origin: string;
  destination: string;
  route?: any; // Polyline path
  steps?: any[]; // Turn-by-turn directions
  distance?: string;
  duration?: string;
}

interface GoogleMapsComponentProps {
  apiKey: string;
  locations?: MapLocation[];
  selectedLocationId?: string | null;
  onLocationSelect?: (locationId: string) => void;
  height?: number;
  darkMode?: boolean;
  directions?: DirectionsResult | null;
  showLayers?: MapLayerType[];
  patientLocation?: google.maps.LatLngLiteral;
  onBoundsChange?: (bounds: google.maps.LatLngBounds) => void;
  optimizeMarkers?: boolean;
  staticMapFallback?: boolean;
}

const GoogleMapsComponent: React.FC<GoogleMapsComponentProps> = ({ 
  apiKey, 
  locations = [], 
  selectedLocationId,
  onLocationSelect,
  height = 500,
  darkMode = true,
  directions = null,
  showLayers = [],
  patientLocation = null,
  onBoundsChange = null,
  optimizeMarkers = true,
  staticMapFallback = true
}) => {
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeLayers, setActiveLayers] = useState<{[key in MapLayerType]?: google.maps.TrafficLayer | google.maps.TransitLayer | google.maps.BicyclingLayer}>({}); 
  const [visibleMarkers, setVisibleMarkers] = useState<MapLocation[]>([]);
  const [staticMapUrl, setStaticMapUrl] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const containerStyle = getContainerStyle(height);
  const mapOptions = getDefaultMapOptions(darkMode);

  // Generate a static map URL as fallback
  const generateStaticMapUrl = useCallback(() => {
    if (!apiKey || !locations || locations.length === 0) return null;
    
    try {
      // Check if Google Maps API is loaded first
      if (typeof google === 'undefined') {
        console.warn("Google Maps API not loaded yet - cannot generate static map with bounds");
        // Generate a basic static map without bounds calculation
        let url = `https://maps.googleapis.com/maps/api/staticmap?key=${apiKey}`;
        url += `&size=800x${height}`;
        url += `&maptype=hybrid`;
        
        // Center on first location or use default US center
        if (locations.length > 0) {
          url += `&center=${locations[0].position.lat},${locations[0].position.lng}&zoom=12`;
          // Add basic markers without clustering
          locations.slice(0, 20).forEach(loc => {
            url += `&markers=color:blue|${loc.position.lat},${loc.position.lng}`;
          });
        } else {
          url += `&center=39.8283,-98.5795&zoom=4`; // Default US center
        }
        
        // Add patient marker if provided
        if (patientLocation) {
          url += `&markers=color:green|label:P|${patientLocation.lat},${patientLocation.lng}`;
        }
        
        return url;
      }
      
      // If Google Maps API is loaded, proceed with the enhanced version
      // Base URL
      let url = `https://maps.googleapis.com/maps/api/staticmap?key=${apiKey}`;
      
      // Set size
      url += `&size=800x${height}`;
      
      // Set map type and style
      url += `&maptype=hybrid`; // Changed from 'roadmap' to 'hybrid' for aerial satellite view
      if (darkMode) {
        url += '&map_id=8f348d1f8dc40ebb'; // Use a predefined dark style map ID
      }
      
      // Add markers (limit to 20 to stay under URL length limits)
      const markersToShow = locations.slice(0, 20);
      if (markersToShow.length > 0) {
        // If many markers, use icon clustering
        if (markersToShow.length > 5) {
          try {
            // Center the map on the average position
            const bounds = new google.maps.LatLngBounds();
            markersToShow.forEach(loc => {
              bounds.extend(new google.maps.LatLng(loc.position));
            });
            const center = bounds.getCenter();
            url += `&center=${center.lat()},${center.lng()}&zoom=10`;
            
            // Add markers with labels
            markersToShow.forEach((loc, index) => {
              url += `&markers=color:blue|label:${index + 1}|${loc.position.lat},${loc.position.lng}`;
            });
          } catch (error) {
            console.error("Error calculating bounds:", error);
            // Fallback - just use the first marker as center
            if (markersToShow.length > 0) {
              url += `&center=${markersToShow[0].position.lat},${markersToShow[0].position.lng}&zoom=10`;
              markersToShow.forEach((loc, index) => {
                url += `&markers=color:blue|label:${index + 1}|${loc.position.lat},${loc.position.lng}`;
              });
            }
          }
        } 
        // For fewer markers, make them more distinct
        else {
          markersToShow.forEach(loc => {
            url += `&markers=color:blue|label:${loc.title.charAt(0)}|${loc.position.lat},${loc.position.lng}`;
          });
          
          // Set center and zoom
          if (markersToShow.length === 1) {
            url += `&center=${markersToShow[0].position.lat},${markersToShow[0].position.lng}&zoom=14`;
          }
        }
      }
      
      // Add patient marker if provided
      if (patientLocation) {
        url += `&markers=color:green|label:P|${patientLocation.lat},${patientLocation.lng}`;
      }
      
      // Add directions if provided
      if (directions && directions.route) {
        url += `&path=color:0x5cb8ff|weight:5|enc:${encodeURIComponent(directions.route)}`;
      }
      
      return url;
    } catch (error) {
      console.error("Error generating static map:", error);
      return null;
    }
  }, [apiKey, locations, height, darkMode, patientLocation, directions]);
  
  // Handle map load
  const onLoad = useCallback((map: google.maps.Map) => {
    console.log("Google Maps loaded successfully");
    setMap(map);
    mapRef.current = map;
    setLoadError(null);
    
    // Set up layers based on props
    const newLayers: {[key in MapLayerType]?: any} = {};
    
    showLayers.forEach(layer => {
      switch(layer) {
        case MapLayerType.TRAFFIC:
          const trafficLayer = new google.maps.TrafficLayer();
          trafficLayer.setMap(map);
          newLayers[MapLayerType.TRAFFIC] = trafficLayer;
          break;
          
        case MapLayerType.TRANSIT:
          const transitLayer = new google.maps.TransitLayer();
          transitLayer.setMap(map);
          newLayers[MapLayerType.TRANSIT] = transitLayer;
          break;
          
        case MapLayerType.BICYCLING:
          const bicyclingLayer = new google.maps.BicyclingLayer();
          bicyclingLayer.setMap(map);
          newLayers[MapLayerType.BICYCLING] = bicyclingLayer;
          break;
      }
    });
    
    setActiveLayers(newLayers);
    
    // Set bounds change listener if needed
    if (onBoundsChange) {
      map.addListener('bounds_changed', () => {
        const bounds = map.getBounds();
        if (bounds) {
          onBoundsChange(bounds);
        }
      });
    }
  }, [showLayers, onBoundsChange]);

  // Handle map load errors - generate static map if possible
  const onError = useCallback((error: Error) => {
    console.error("Google Maps load error:", error);
    setLoadError(error.message);
    
    // Generate a static map URL as fallback if enabled
    if (staticMapFallback) {
      const staticUrl = generateStaticMapUrl();
      if (staticUrl) {
        console.log("Using static map fallback");
        setStaticMapUrl(staticUrl);
      }
    }
  }, [staticMapFallback, generateStaticMapUrl]);

  // Clean up map resources on unmount
  const onUnmount = useCallback(() => {
    // Clear all layers
    Object.values(activeLayers).forEach(layer => {
      if (layer) layer.setMap(null);
    });
    
    setActiveLayers({});
    setMap(null);
    mapRef.current = null;
  }, [activeLayers]);

  // Update map options when props change
  useEffect(() => {
    if (map) {
      map.setOptions({
        ...mapOptions,
        styles: darkMode ? darkModeStyles : []
      });
    }
  }, [darkMode, map]);
  
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

  // Optimize marker rendering - only show markers in current viewport if optimizeMarkers is enabled
  const updateVisibleMarkers = useCallback(() => {
    if (!map || !optimizeMarkers) {
      setVisibleMarkers(locations);
      return;
    }
    
    try {
      const bounds = map.getBounds();
      if (bounds) {
        const visible = locations.filter(location => {
          if (!location.position || typeof location.position.lat !== 'number' || typeof location.position.lng !== 'number') {
            console.warn("Invalid location position:", location);
            return false;
          }
          return bounds.contains(new google.maps.LatLng(
            location.position.lat,
            location.position.lng
          ));
        });
        
        setVisibleMarkers(visible);
      } else {
        setVisibleMarkers(locations);
      }
    } catch (error) {
      console.error("Error updating visible markers:", error);
      setVisibleMarkers(locations);
    }
  }, [map, locations, optimizeMarkers]);
  
  // Adjust map bounds to fit all markers when locations change
  useEffect(() => {
    if (map && locations.length > 0) {
      // Skip the first load to avoid jarring movement
      if (isInitialLoad) {
        setIsInitialLoad(false);
        updateVisibleMarkers();
        return;
      }
      
      try {
        const bounds = new google.maps.LatLngBounds();
        
        // Add all location markers to bounds
        locations.forEach(location => {
          bounds.extend(location.position);
        });
        
        // Add patient location to bounds if provided
        if (patientLocation) {
          bounds.extend(patientLocation);
        }
        
        // Only fit bounds if there are enough locations
        if (locations.length > 1 || (locations.length === 1 && patientLocation)) {
          map.fitBounds(bounds);
          // Prevent excessive zoom (better UX and fewer detailed tile loads = lower billing)
          const zoom = map.getZoom() || 10;
          if (zoom > 15) map.setZoom(15);
        } else if (locations.length === 1) {
          // If only one location, center on it with a reasonable zoom
          map.setCenter(locations[0].position);
          map.setZoom(13);
        }
        
        updateVisibleMarkers();
      } catch (error) {
        console.error("Error adjusting map bounds:", error);
      }
    }
  }, [locations, patientLocation, map, isInitialLoad, updateVisibleMarkers]);
  
  // Listen for bounds changes to update visible markers
  useEffect(() => {
    if (map && optimizeMarkers) {
      const listener = map.addListener('bounds_changed', () => {
        updateVisibleMarkers();
      });
      
      return () => {
        google.maps.event.removeListener(listener);
      };
    }
  }, [map, optimizeMarkers, updateVisibleMarkers]);

  // Handle marker hover (replaces click behavior)
  const handleMarkerMouseOver = (location: MapLocation) => {
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
  const handleMarkerClick = (location: MapLocation) => {
    setSelectedLocation(location);
    if (onLocationSelect) {
      onLocationSelect(location.id);
    }
    if (map) {
      map.panTo(location.position);
      // Don't zoom too far (keeps billing costs down)
      map.setZoom(Math.min(14, map.getZoom() || 14));
    }
  };
  
  // Toggle map layers
  const toggleLayer = (layerType: MapLayerType) => {
    if (!map) return;
    
    const newLayers = {...activeLayers};
    
    // If layer exists, remove it
    if (newLayers[layerType]) {
      newLayers[layerType]?.setMap(null);
      delete newLayers[layerType];
    }
    // Otherwise, add it
    else {
      let layer;
      switch(layerType) {
        case MapLayerType.TRAFFIC:
          layer = new google.maps.TrafficLayer();
          break;
        case MapLayerType.TRANSIT:
          layer = new google.maps.TransitLayer();
          break;
        case MapLayerType.BICYCLING:
          layer = new google.maps.BicyclingLayer();
          break;
      }
      
      if (layer) {
        layer.setMap(map);
        newLayers[layerType] = layer;
      }
    }
    
    setActiveLayers(newLayers);
  };
  
  // Update static map URL when relevant props change
  useEffect(() => {
    if (staticMapFallback) {
      const staticUrl = generateStaticMapUrl();
      setStaticMapUrl(staticUrl);
    }
  }, [staticMapFallback, generateStaticMapUrl]);

  // Display error with static map fallback if available
  if (loadError) {
    return (
      <div className="relative w-full" style={{ height: `${height}px` }}>
        {/* Static Map Fallback */}
        {staticMapUrl && (
          <div className="relative w-full h-full">
            <img 
              src={staticMapUrl}
              alt="Static Map" 
              className="w-full h-full object-cover rounded-lg"
              onError={() => setStaticMapUrl(null)} // Hide if image fails to load
            />
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
              Static Map View
            </div>
          </div>
        )}
        
        {/* Error Message (shows if no static map or on top of faded static map) */}
        <div className={`absolute inset-0 ${staticMapUrl ? 'bg-gray-900/70' : 'bg-gray-900'} rounded-lg border border-gray-700 flex items-center justify-center`}>
          <div className="text-center p-8 max-w-md">
            <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Map Loading Error</h3>
            <p className="text-gray-400 mb-4">Unable to load interactive Google Maps</p>
            <div className="text-sm text-gray-300 max-w-md mx-auto">
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
              
              {staticMapUrl && (
                <p className="mt-4 text-green-400">
                  A static map is displayed in the background.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <LoadScript 
        googleMapsApiKey={apiKey} 
        loadingElement={
          <div className="w-full bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center" style={{ height: `${height}px` }}>
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
          {/* Patient location marker (e.g., your location) */}
          {patientLocation && (
            <Marker
              position={patientLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#4CAF50',
                fillOpacity: 0.9,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
                scale: 8,
              }}
              zIndex={1000} // Always on top
              title="Your Location"
            />
          )}
          
          {/* Directions polyline */}
          {directions && directions.route && (
            <Polyline
              path={google.maps.geometry.encoding.decodePath(directions.route)}
              options={routeOptions}
            />
          )}
          
          {/* Location markers - only render visible ones if optimizing */}
          {(optimizeMarkers ? visibleMarkers : locations).map((location) => (
            <Marker
              key={location.id}
              position={location.position}
              onClick={() => handleMarkerClick(location)}
              onMouseOver={() => handleMarkerMouseOver(location)}
              onMouseOut={handleMarkerMouseOut}
              title={location.title}
              icon={location.icon ? { url: location.icon } : undefined}
              zIndex={location.id === selectedLocationId ? 999 : undefined}
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
              }}
            >
              <div className="bg-white rounded-lg shadow-lg p-3 min-w-[250px]">
                <h3 className="font-bold text-lg text-gray-800 mb-1">{selectedLocation.title}</h3>
                
                {/* Location details in Google profile style */}
                <div className="space-y-1 text-sm">
                  {/* Health Index as Rating (if available) */}
                  {selectedLocation.healthIndex !== undefined && (
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500 text-base mr-1">
                        {'★'.repeat(Math.floor(selectedLocation.healthIndex / 20))}
                      </span>
                      <span className="text-gray-600 font-medium ml-1">
                        {selectedLocation.healthIndex}
                      </span>
                    </div>
                  )}
                  
                  {/* Type */}
                  <p className="text-blue-600 font-medium">
                    {selectedLocation.type || 'Healthcare Provider'}
                  </p>
                  
                  {/* Address */}
                  <p className="text-gray-600">
                    {selectedLocation.address || 'Address information not available'}
                  </p>
                  
                  {/* Show directions button if patient location available */}
                  {patientLocation && (
                    <div className="mt-3 flex gap-2">
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&origin=${patientLocation.lat},${patientLocation.lng}&destination=${selectedLocation.position.lat},${selectedLocation.position.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium inline-flex items-center"
                      >
                        <Navigation size={14} className="mr-1" />
                        Directions
                      </a>
                      
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
                  )}
                  
                  {/* Button for Google View if no patient location */}
                  {!patientLocation && (
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
                  )}
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Layer toggle buttons */}
        <button
          onClick={() => toggleLayer(MapLayerType.TRAFFIC)}
          className={`p-2 rounded-full bg-white shadow-md ${activeLayers[MapLayerType.TRAFFIC] ? 'text-blue-500' : 'text-gray-500'}`}
          title="Toggle traffic layer"
        >
          <Map size={18} />
        </button>
        
        <button
          onClick={() => toggleLayer(MapLayerType.TRANSIT)}
          className={`p-2 rounded-full bg-white shadow-md ${activeLayers[MapLayerType.TRANSIT] ? 'text-blue-500' : 'text-gray-500'}`}
          title="Toggle transit layer"
        >
          <Layers size={18} />
        </button>
      </div>
    </div>
  );
};

export default GoogleMapsComponent;
