import React, { useEffect, useState } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useTheme } from '../../../contexts/ThemeContext';
import { themes } from '../../../lib/themes';
import { MapMarker } from './types';

interface ClusterManagerProps {
  map: google.maps.Map | null;
  markers: MapMarker[];
  gridSize?: number;
  minimumClusterSize?: number;
  onClusterClick?: (
    cluster: google.maps.Marker,
    markers: MapMarker[]
  ) => void;
}

export const ClusterManager: React.FC<ClusterManagerProps> = ({
  map,
  markers,
  gridSize = 60,
  minimumClusterSize = 2,
  onClusterClick,
}) => {
  const { theme: themeKey } = useTheme();
  const theme = themes[themeKey];
  const [markerClusterer, setMarkerClusterer] = useState<MarkerClusterer | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);

  // Initialize MarkerClusterer when map is ready
  useEffect(() => {
    if (!map) return;

    const clusterer = new MarkerClusterer({
      map,
      markers: [],
      onClusterClick: (_, cluster) => {
        if (onClusterClick) {
          const clusterMarkers = cluster.markers as google.maps.Marker[];
          const clusterData = clusterMarkers.map((marker, index) => markers[index]);
          const clusterCenter = cluster.position as google.maps.LatLng;
          onClusterClick(
            new google.maps.Marker({ position: clusterCenter }),
            clusterData
          );
        }
      },
      renderer: {
        render: ({ count, position }) => {
          const isDark = themeKey === 'dark';
          const size = Math.min(54, Math.max(34, Math.floor(count / 100) * 8 + 34));
          
          // Calculate color based on count
          const getColor = () => {
            if (count >= 100) return isDark ? '#DC2626' : '#EF4444';
            if (count >= 50) return isDark ? '#F59E0B' : '#F59E0B';
            return isDark ? '#10B981' : '#10B981';
          };

          // Create SVG marker with glow effect
          const color = getColor();
          const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <circle 
                cx="${size/2}" 
                cy="${size/2}" 
                r="${size/2-4}"
                fill="${color}"
                opacity="0.9"
                filter="url(#glow)"
              />
              <circle 
                cx="${size/2}" 
                cy="${size/2}" 
                r="${size/2-6}"
                fill="${color}"
              />
              <text 
                x="50%" 
                y="50%" 
                text-anchor="middle" 
                dy=".3em"
                fill="${isDark ? '#1E293B' : '#FFFFFF'}"
                font-family="Arial"
                font-size="${size/3}px"
                font-weight="bold"
              >
                ${count}
              </text>
            </svg>
          `;

          return new google.maps.Marker({
            position,
            icon: {
              url: `data:image/svg+xml;base64,${btoa(svg)}`,
              scaledSize: new google.maps.Size(size, size),
              anchor: new google.maps.Point(size/2, size/2),
            },
            label: {
              text: count.toString(),
              color: isDark ? '#1E293B' : '#FFFFFF',
              fontSize: '12px',
              fontWeight: 'bold',
            },
            zIndex: 1000,
          });
        },
      },
    });

    setMarkerClusterer(clusterer);

    return () => {
      clusterer.setMap(null);
    };
  }, [map, gridSize, minimumClusterSize, onClusterClick, themeKey, markers]);

  // Update markers when they change
  useEffect(() => {
    if (!markerClusterer) return;

    // Clear existing markers
    mapMarkers.forEach(marker => marker.setMap(null));

    // Create new markers
    const newMarkers = markers.map(({ lat, lng, title, icon }) => {
      const marker = new google.maps.Marker({
        position: { lat, lng },
        title,
        icon,
      });

      return marker;
    });

    // Add markers to clusterer
    markerClusterer.clearMarkers();
    markerClusterer.addMarkers(newMarkers);

    setMapMarkers(newMarkers);

    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [markerClusterer, markers]);

  return null; // This component doesn't render anything directly
};

export default ClusterManager;