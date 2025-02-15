import { useCallback, useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '0.5rem'
};

const defaultCenter = {
  lat: 39.8283,  // Center of United States
  lng: -98.5795
};

const mapOptions = {
  styles: [
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#333333' }]
    }
  ],
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true
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
  const [selectedLocation, setSelectedLocation] = useState<HealthLocation | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
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

  return (
    <LoadScript googleMapsApiKey={apiKey}>
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
            <div className="bg-white rounded-lg shadow-lg p-4 min-w-[200px]">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{selectedLocation.title}</h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold">Population: </span>
                  <span className="text-gray-800">{selectedLocation.population.toLocaleString()}</span>
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Health Index: </span>
                  <span className={`font-medium ${
                    selectedLocation.healthIndex >= 80 
                      ? 'text-green-600' 
                      : selectedLocation.healthIndex >= 70 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                  }`}>
                    {selectedLocation.healthIndex}
                  </span>
                </p>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapsComponent;