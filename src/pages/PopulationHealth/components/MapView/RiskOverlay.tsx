import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { themes } from '../../../lib/themes';
import { HeatmapData, Territory } from './types';

interface RiskOverlayProps {
  map: google.maps.Map | null;
  heatmapData?: HeatmapData[];
  territories?: Territory[];
  showHeatmap?: boolean;
  showTerritories?: boolean;
  onTerritoryClick?: (territory: Territory) => void;
}

export const RiskOverlay: React.FC<RiskOverlayProps> = ({
  map,
  heatmapData = [],
  territories = [],
  showHeatmap = true,
  showTerritories = true,
  onTerritoryClick,
}) => {
  const { theme: themeKey } = useTheme();
  const theme = themes[themeKey];
  const [heatmap, setHeatmap] = useState<google.maps.visualization.HeatmapLayer | null>(null);
  const [territoryPolygons, setTerritoryPolygons] = useState<google.maps.Polygon[]>([]);

  // Initialize and update heatmap
  useEffect(() => {
    if (!map || !showHeatmap) {
      if (heatmap) {
        heatmap.setMap(null);
        setHeatmap(null);
      }
      return;
    }

    const heatmapPoints = heatmapData.map(({ lat, lng, weight }) => ({
      location: new google.maps.LatLng(lat, lng),
      weight,
    }));

    if (!heatmap) {
      const newHeatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapPoints,
        map,
      });

      // Configure heatmap appearance
      newHeatmap.set('radius', 30);
      newHeatmap.set('opacity', 0.7);
      newHeatmap.set('gradient', [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)',
      ]);

      setHeatmap(newHeatmap);
    } else {
      heatmap.setData(heatmapPoints);
    }
  }, [map, heatmapData, showHeatmap]);

  // Initialize and update territory polygons
  useEffect(() => {
    if (!map || !showTerritories) {
      territoryPolygons.forEach((polygon) => polygon.setMap(null));
      setTerritoryPolygons([]);
      return;
    }

    // Clear existing polygons
    territoryPolygons.forEach((polygon) => polygon.setMap(null));

    // Create new polygons
    const newPolygons = territories.map((territory) => {
      const getRiskColor = (risk: Territory['riskLevel']) => {
        const isDark = themeKey === 'dark';
        switch (risk) {
          case 'High':
            return isDark ? '#DC2626' : '#EF4444';
          case 'Medium':
            return isDark ? '#F59E0B' : '#F59E0B';
          case 'Low':
            return isDark ? '#10B981' : '#10B981';
        }
      };

      const color = getRiskColor(territory.riskLevel);

      const polygon = new google.maps.Polygon({
        paths: territory.paths,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        map,
      });

      // Add hover effect
      polygon.addListener('mouseover', () => {
        polygon.setOptions({
          fillOpacity: 0.5,
          strokeWeight: 3,
        });
      });

      polygon.addListener('mouseout', () => {
        polygon.setOptions({
          fillOpacity: 0.35,
          strokeWeight: 2,
        });
      });

      // Add click handler
      if (onTerritoryClick) {
        polygon.addListener('click', () => {
          onTerritoryClick(territory);
        });
      }

      // Add territory label
      const bounds = new google.maps.LatLngBounds();
      territory.paths.forEach((path) => bounds.extend(path));
      
      const label = new google.maps.Marker({
        position: bounds.getCenter(),
        map,
        label: {
          text: `${territory.name}\n${territory.metrics.totalPatients} patients`,
          color: themeKey === 'dark' ? '#FFFFFF' : '#000000',
          fontSize: '12px',
          fontWeight: 'bold',
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 0,
        },
      });

      // Add info window with metrics
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-4">
            <h3 class="font-bold mb-2">${territory.name}</h3>
            <div class="space-y-1 text-sm">
              <p>Total Patients: ${territory.metrics.totalPatients}</p>
              <p>Active Patients: ${territory.metrics.activePatients}</p>
              <p>Average Risk: ${territory.metrics.averageRisk.toFixed(1)}%</p>
              <p>Average Compliance: ${territory.metrics.averageCompliance.toFixed(1)}%</p>
            </div>
          </div>
        `,
      });

      polygon.addListener('click', () => {
        infoWindow.open(map, label);
      });

      return { polygon, label, infoWindow };
    });

    setTerritoryPolygons(newPolygons.map(({ polygon }) => polygon));

    return () => {
      newPolygons.forEach(({ polygon, label, infoWindow }) => {
        polygon.setMap(null);
        label.setMap(null);
        infoWindow.close();
      });
    };
  }, [map, territories, showTerritories, themeKey, onTerritoryClick]);

  return null; // This component doesn't render anything directly
};

export default RiskOverlay;