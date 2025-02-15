import React from 'react';
import { MapView } from './index';
import { PatientRecord } from '../PatientRegistry/types';

// Sample patient data with locations in San Francisco area
const samplePatients: PatientRecord[] = [
  {
    id: '1',
    patientId: 'P001',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    status: 'Active',
    riskLevel: 'High',
    riskTrend: 'up',
    lastVisit: '2025-01-15',
    nextAppointment: '2025-02-20',
    conditions: [
      { name: 'Diabetes', severity: 'severe' },
      { name: 'Hypertension', severity: 'moderate' }
    ],
    compliance: {
      overall: 85,
      medication: 90,
      appointments: 80,
      monitoring: 85
    },
    avatar: 'https://i.pravatar.cc/150?u=p1',
    contactInfo: {
      phone: '(555) 123-4567',
      email: 'john.doe@email.com'
    },
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: '123 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105'
    }
  },
  {
    id: '2',
    patientId: 'P002',
    name: 'Jane Smith',
    age: 32,
    gender: 'Female',
    status: 'Active',
    riskLevel: 'Low',
    riskTrend: 'stable',
    lastVisit: '2025-01-20',
    nextAppointment: '2025-03-01',
    conditions: [
      { name: 'Asthma', severity: 'mild' }
    ],
    compliance: {
      overall: 95,
      medication: 98,
      appointments: 100,
      monitoring: 92
    },
    avatar: 'https://i.pravatar.cc/150?u=p2',
    contactInfo: {
      phone: '(555) 234-5678',
      email: 'jane.smith@email.com'
    },
    location: {
      lat: 37.7858,
      lng: -122.4008,
      address: '456 Montgomery St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94111'
    }
  },
  {
    id: '3',
    patientId: 'P003',
    name: 'Robert Johnson',
    age: 68,
    gender: 'Male',
    status: 'Critical',
    riskLevel: 'High',
    riskTrend: 'up',
    lastVisit: '2025-02-01',
    nextAppointment: '2025-02-15',
    conditions: [
      { name: 'COPD', severity: 'severe' },
      { name: 'Heart Disease', severity: 'severe' },
      { name: 'Diabetes', severity: 'moderate' }
    ],
    compliance: {
      overall: 65,
      medication: 70,
      appointments: 80,
      monitoring: 45
    },
    contactInfo: {
      phone: '(555) 345-6789',
      email: 'robert.j@email.com'
    },
    location: {
      lat: 37.7694,
      lng: -122.4862,
      address: '789 Irving St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94122'
    }
  },
  {
    id: '4',
    patientId: 'P004',
    name: 'Maria Garcia',
    age: 28,
    gender: 'Female',
    status: 'Active',
    riskLevel: 'Low',
    riskTrend: 'down',
    lastVisit: '2025-01-25',
    nextAppointment: '2025-04-10',
    conditions: [
      { name: 'Anxiety', severity: 'mild' }
    ],
    compliance: {
      overall: 100,
      medication: 100,
      appointments: 100,
      monitoring: 100
    },
    avatar: 'https://i.pravatar.cc/150?u=p4',
    contactInfo: {
      phone: '(555) 456-7890',
      email: 'maria.g@email.com'
    },
    location: {
      lat: 37.7879,
      lng: -122.4074,
      address: '321 Pine St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94108'
    }
  }
];

export const MapViewDemo: React.FC = () => {
  const handleMarkerClick = (patient: PatientRecord) => {
    console.log('Patient clicked:', patient);
  };

  const handleTerritoryClick = (territory: any) => {
    console.log('Territory clicked:', territory);
  };

  const handleBoundsChange = (bounds: any) => {
    console.log('Map bounds changed:', bounds);
  };

  const handleZoomChange = (zoom: number) => {
    console.log('Map zoom changed:', zoom);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Patient Map View</h2>
      <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
        <MapView
          apiKey="YOUR_GOOGLE_MAPS_API_KEY"
          patients={samplePatients}
          initialConfig={{
            center: { lat: 37.7749, lng: -122.4194 }, // San Francisco
            zoom: 12
          }}
          showClusters={true}
          showHeatmap={true}
          showTerritories={true}
          onMarkerClick={handleMarkerClick}
          onTerritoryClick={handleTerritoryClick}
          onBoundsChange={handleBoundsChange}
          onZoomChange={handleZoomChange}
        />
      </div>
      <div className="mt-4 space-y-2 text-sm text-gray-500">
        <p>• Click on markers to view patient details</p>
        <p>• Toggle layers using the controls</p>
        <p>• View risk heatmap and territory overlays</p>
        <p>• Clusters automatically form when zooming out</p>
      </div>
    </div>
  );
};

export default MapViewDemo;