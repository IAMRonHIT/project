import { PatientRecord } from '../PatientRegistry/types';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

export interface MapConfig {
  center: { lat: number; lng: number };
  zoom: number;
}

export interface ClusterManagerProps {
  map: google.maps.Map;
  markers?: google.maps.Marker[];
}

export interface RiskOverlayProps {
  map: google.maps.Map;
  data?: PatientRecord[];
  type?: 'heatmap' | 'territory';
}

export class ClusterManager {
  private map: google.maps.Map;
  private markers: google.maps.Marker[];
  private markerClusterer: MarkerClusterer;

  constructor(map: google.maps.Map) {
    this.map = map;
    this.markers = [];
    this.markerClusterer = new MarkerClusterer({
      map,
      markers: [],
      renderer: {
        render: ({ count, position }) => {
          const marker = new google.maps.Marker({
            position,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: Math.max(20, Math.min(count * 5, 40)),
              fillColor: '#4f46e5',
              fillOpacity: 0.8,
              strokeWeight: 2,
              strokeColor: '#ffffff',
            },
            label: {
              text: String(count),
              color: 'white',
              fontSize: '12px',
            },
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
          });
          return marker;
        },
      },
    });
  }

  public addMarkers(markers: google.maps.Marker[]) {
    this.markers = markers;
    this.markerClusterer.addMarkers(markers);
  }

  public clearMarkers() {
    this.markerClusterer.clearMarkers();
    this.markers = [];
  }
}

export class RiskOverlay {
  private map: google.maps.Map;
  private heatmap: google.maps.visualization.HeatmapLayer | null;
  private territory: google.maps.Polygon[] = [];

  constructor(map: google.maps.Map) {
    this.map = map;
    this.heatmap = null;
    this.initializeHeatmap();
  }

  private initializeHeatmap() {
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      map: this.map,
      data: [],
      radius: 50,
      gradient: [
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
      ],
    });
  }

  public updateData(patients: PatientRecord[]) {
    // Update heatmap data
    const heatmapData = patients.map(patient => ({
      location: new google.maps.LatLng(patient.location.lat, patient.location.lng),
      weight: patient.riskLevel === 'High' ? 3 :
              patient.riskLevel === 'Medium' ? 2 : 1,
    }));
    this.heatmap?.setData(heatmapData);

    // Clear existing territories
    this.territory.forEach(polygon => polygon.setMap(null));
    this.territory = [];

    // Create risk territories
    const riskGroups = this.groupPatientsByRisk(patients);
    Object.entries(riskGroups).forEach(([risk, patients]) => {
      if (patients.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        patients.forEach(patient => {
          bounds.extend(new google.maps.LatLng(patient.location.lat, patient.location.lng));
        });

        const territory = new google.maps.Polygon({
          paths: this.computeTerritory(patients.map(p => ({ lat: p.location.lat, lng: p.location.lng }))),
          strokeColor: risk === 'High' ? '#ef4444' :
                      risk === 'Medium' ? '#f59e0b' : '#10b981',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: risk === 'High' ? '#ef4444' :
                    risk === 'Medium' ? '#f59e0b' : '#10b981',
          fillOpacity: 0.15,
          map: this.map,
        });

        this.territory.push(territory);
      }
    });
  }

  private groupPatientsByRisk(patients: PatientRecord[]) {
    return patients.reduce((groups, patient) => {
      const risk = patient.riskLevel;
      groups[risk] = groups[risk] || [];
      groups[risk].push(patient);
      return groups;
    }, {} as Record<string, PatientRecord[]>);
  }

  private computeTerritory(points: { lat: number; lng: number }[]): google.maps.LatLng[] {
    // Simple convex hull algorithm for demo purposes
    // In production, use a more sophisticated algorithm
    const center = points.reduce(
      (acc, point) => ({
        lat: acc.lat + point.lat / points.length,
        lng: acc.lng + point.lng / points.length,
      }),
      { lat: 0, lng: 0 }
    );

    const sortedPoints = points.map(point => ({
      point,
      angle: Math.atan2(point.lat - center.lat, point.lng - center.lng),
    }))
    .sort((a, b) => a.angle - b.angle)
    .map(p => p.point);

    return sortedPoints.map(p => new google.maps.LatLng(p.lat, p.lng));
  }

  public setVisible(visible: boolean) {
    this.heatmap?.setMap(visible ? this.map : null);
    this.territory.forEach(polygon => polygon.setMap(visible ? this.map : null));
  }
}