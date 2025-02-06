import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useTheme } from '../../../contexts/ThemeContext';
import { themes } from '../../../lib/themes';
import { MapConfig, MapLocation, MapBounds, MapMarker } from './types';

const defaultMapConfig: MapConfig = {
  center: { lat: 37.7749, lng: -122.4194 }, // San Francisco
  zoom: 12,
  minZoom: 3,
  maxZoom: 18,
};

// Map styles for light/dark modes
const mapStyles = {
  light: [
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#000000' }],
    },
    {
      featureType: 'all',
      elementType: 'labels.text.stroke',
      stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { weight: 2 }],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.fill',
      stylers: [{ color: '#000000' }],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#f5f7f9' }],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ color: '#eef1f5' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#d8dbe0' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#c4d7d9' }],
    },
  ],
  dark: [
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#ffffff' }],
    },
    {
      featureType: 'all',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#000000' }, { weight: 2 }],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.fill',
      stylers: [{ color: '#1e293b' }],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#1e293b' }],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ color: '#2a3f5f' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#2a3f5f' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2a3f5f' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#193a70' }],
    },
  ],
};

interface MapContainerProps {
  apiKey: string;
  config?: Partial<MapConfig>;
  markers?: MapMarker[];
  onMapLoad?: (map: google.maps.Map) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
  onZoomChange?: (zoom: number) => void;
  onMarkerClick?: (marker: MapMarker) => void;
  className?: string;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  apiKey,
  config = {},
  markers = [],
  onMapLoad,
  onBoundsChange,
  onZoomChange,
  onMarkerClick,
  className = '',
}) => {
  const { theme: themeKey } = useTheme();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || map) return;

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'visualization', 'geometry'],
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      const mapConfig: MapConfig = {
        ...defaultMapConfig,
        ...config,
        styles: mapStyles[themeKey === 'dark' ? 'dark' : 'light'],
      };

      const newMap = new google.maps.Map(mapRef.current, {
        center: mapConfig.center,
        zoom: mapConfig.zoom,
        minZoom: mapConfig.minZoom,
        maxZoom: mapConfig.maxZoom,
        styles: mapConfig.styles,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP,
        },
      });

      // Set up event listeners
      newMap.addListener('bounds_changed', () => {
        const bounds = newMap.getBounds();
        if (bounds && onBoundsChange) {
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          onBoundsChange({
            north: ne.lat(),
            south: sw.lat(),
            east: ne.lng(),
            west: sw.lng(),
          });
        }
      });

      newMap.addListener('zoom_changed', () => {
        onZoomChange?.(newMap.getZoom() ?? defaultMapConfig.zoom);
      });

      setMap(newMap);
      onMapLoad?.(newMap);
    });
  }, [apiKey, config, onMapLoad, onBoundsChange, onZoomChange, themeKey]);

  // Update map style when theme changes
  useEffect(() => {
    if (!map) return;
    map.setOptions({
      styles: mapStyles[themeKey === 'dark' ? 'dark' : 'light'],
    });
  }, [map, themeKey]);

  // Update markers when they change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    mapMarkers.forEach(marker => marker.setMap(null));

    // Create new markers
    const newMarkers = markers.map(markerData => {
      const marker = new google.maps.Marker({
        position: markerData,
        map,
        title: markerData.title,
        icon: markerData.icon,
      });

      if (onMarkerClick) {
        marker.addListener('click', () => onMarkerClick(markerData));
      }

      return marker;
    });

    setMapMarkers(newMarkers);

    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, markers, onMarkerClick]);

  // Update map center and zoom when config changes
  useEffect(() => {
    if (!map) return;

    if (config.center) {
      map.setCenter(config.center);
    }
    if (config.zoom) {
      map.setZoom(config.zoom);
    }
  }, [map, config.center, config.zoom]);

  return (
    <div
      ref={mapRef}
      className={`w-full h-full min-h-[400px] rounded-lg overflow-hidden ${className}`}
    />
  );
};

export default MapContainer;