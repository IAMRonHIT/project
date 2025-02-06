import React from 'react';
import { IdentifiedPatientsTable } from './IdentifiedPatientsTable';
import { PatientRecord } from './types';

// Sample patient data
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
    status: 'New',
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
  },
  {
    id: '5',
    patientId: 'P005',
    name: 'William Chen',
    age: 52,
    gender: 'Male',
    status: 'Watch',
    riskLevel: 'Medium',
    riskTrend: 'up',
    lastVisit: '2024-11-30',
    nextAppointment: null,
    conditions: [
      { name: 'Hypertension', severity: 'moderate' },
      { name: 'High Cholesterol', severity: 'mild' }
    ],
    compliance: {
      overall: 45,
      medication: 50,
      appointments: 20,
      monitoring: 65
    },
    contactInfo: {
      phone: '(555) 567-8901',
      email: 'william.c@email.com'
    },
    location: {
      lat: 37.7833,
      lng: -122.4167,
      address: '987 Van Ness Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94109'
    }
  }
];

export const IdentifiedPatientsTableDemo: React.FC = () => {
  const handlePatientClick = (patient: PatientRecord) => {
    console.log('Patient clicked:', patient);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Identified Patients</h2>
      <div className="space-y-4">
        <IdentifiedPatientsTable
          patients={samplePatients}
          onPatientClick={handlePatientClick}
        />
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-2">Table Features</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>Click on any row to view detailed patient information</li>
            <li>Status badges with icons indicate patient status</li>
            <li>Risk level badges with trend indicators</li>
            <li>Condition tags with severity indicators</li>
            <li>Visual compliance indicators</li>
            <li>Quick access to contact information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IdentifiedPatientsTableDemo;