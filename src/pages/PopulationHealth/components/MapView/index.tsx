import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { PatientRecord } from '../PatientRegistry/types';
import { ClusterManager } from './ClusterManager';
import { RiskOverlay } from './RiskOverlay';

interface MapViewProps {
  apiKey: string;
  patients: PatientRecord[];
  initialConfig: {
    center: { lat: number; lng: number };
    zoom: number;
  };
  showClusters?: boolean;
  showHeatmap?: boolean;
  showTerritories?: boolean;
  onMarkerClick?: (patient: PatientRecord) => void;
}

function MapView({
  apiKey,
  patients,
  initialConfig,
  showClusters = true,
  showHeatmap = false,
  showTerritories = false,
  onMarkerClick,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [clusterManager, setClusterManager] = useState<ClusterManager | null>(null);
  const [riskOverlay, setRiskOverlay] = useState<RiskOverlay | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    if (!mapRef.current || map) return;

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'visualization', 'geometry'],
    });

    loader.load().then(() => {
      const mapInstance = new google.maps.Map(mapRef.current!, {
        center: initialConfig.center,
        zoom: initialConfig.zoom,
        styles: [
          {
            featureType: 'all',
            elementType: 'all',
            stylers: [{ saturation: -100 }],
          },
        ],
        mapTypeControl: false,
        streetViewControl: false,
      });

      setMap(mapInstance);

      if (showClusters) {
        setClusterManager(new ClusterManager(mapInstance));
      }

      if (showHeatmap || showTerritories) {
        setRiskOverlay(new RiskOverlay(mapInstance));
      }
    });
  }, [apiKey, initialConfig, showClusters, showHeatmap, showTerritories]);

  // Update markers when patients change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    // Create new markers
    const newMarkers = patients.map(patient => {
      const marker = new google.maps.Marker({
        position: { lat: patient.location.lat, lng: patient.location.lng },
        map: showClusters ? null : map, // Don't show markers directly if using clusters
        title: patient.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: patient.riskLevel === 'High' ? '#ef4444' : 
                    patient.riskLevel === 'Medium' ? '#f59e0b' : '#10b981',
          fillOpacity: 0.8,
          strokeWeight: 1,
          strokeColor: '#ffffff',
        },
      });

      if (onMarkerClick) {
        marker.addListener('click', () => onMarkerClick(patient));
      }

      return marker;
    });

    setMarkers(newMarkers);

    // Update clusters if enabled
    if (showClusters && clusterManager) {
      clusterManager.clearMarkers();
      clusterManager.addMarkers(newMarkers);
    }

    // Update risk overlay if enabled
    if ((showHeatmap || showTerritories) && riskOverlay) {
      riskOverlay.updateData(patients);
      riskOverlay.setVisible(true);
    }
  }, [map, patients, showClusters, showHeatmap, showTerritories, clusterManager, riskOverlay, onMarkerClick]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  );
}

export default MapView;