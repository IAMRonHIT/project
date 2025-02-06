import React from 'react';
import { PatientRegistry } from './index';
import type { PatientRecord } from './types';

// Sample data
const SAMPLE_PATIENTS: PatientRecord[] = [
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
      { name: 'Type 2 Diabetes', severity: 'severe' },
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
    status: 'Watch',
    riskLevel: 'Medium',
    riskTrend: 'stable',
    lastVisit: '2025-01-20',
    nextAppointment: '2025-03-01',
    conditions: [
      { name: 'Asthma', severity: 'moderate' }
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
  }
];

// Initial columns configuration
const INITIAL_COLUMNS = [
  {
    id: 'patientId',
    label: 'Patient ID',
    accessor: 'patientId',
    visible: true,
    sortable: true,
    width: 120,
  },
  {
    id: 'name',
    label: 'Name',
    accessor: 'name',
    visible: true,
    sortable: true,
    filterable: true,
  },
  {
    id: 'status',
    label: 'Status',
    accessor: 'status',
    visible: true,
    sortable: true,
    width: 120,
  },
  {
    id: 'riskLevel',
    label: 'Risk Level',
    accessor: 'riskLevel',
    visible: true,
    sortable: true,
    width: 120,
  },
  {
    id: 'compliance',
    label: 'Compliance',
    accessor: 'compliance.overall',
    visible: true,
    sortable: true,
    width: 120,
  }
];

export const PatientRegistryDemo: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Patient Registry</h2>
        <p className="text-gray-500">
          Enhanced patient registry with table/map views, filtering, and detailed patient profiles.
        </p>
      </div>

      <PatientRegistry
        data={SAMPLE_PATIENTS}
        initialColumns={INITIAL_COLUMNS}
      />

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
        <h3 className="font-medium">Features</h3>
        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <li>Switch between table and map views</li>
          <li>Click on patients to view detailed profiles</li>
          <li>Status and risk level indicators with trends</li>
          <li>Compliance metrics visualization</li>
          <li>Quick access to patient communication and documents</li>
          <li>Map view with clustering and risk overlays</li>
        </ul>
      </div>
    </div>
  );
};

export default PatientRegistryDemo;