import React, { useState } from 'react';
import { ProfileDrawer } from './ProfileDrawer';
import { PatientRecord } from '../PatientRegistry/types';

// Sample patient data
const samplePatient: PatientRecord = {
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
    { name: 'Hypertension', severity: 'moderate' },
    { name: 'Obesity', severity: 'moderate' }
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
};

export const ProfileDrawerDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  const handleOpenProfile = () => {
    setSelectedPatient(samplePatient);
    setIsOpen(true);
  };

  const handleCloseProfile = () => {
    setIsOpen(false);
  };

  const handleScheduleAppointment = (patient: PatientRecord) => {
    console.log('Schedule appointment for:', patient);
    // In a real application, this would open an appointment scheduling dialog
  };

  const handleSendMessage = (patient: PatientRecord) => {
    console.log('Send message to:', patient);
    // In a real application, this would open the messaging interface
  };

  const handleViewDocuments = (patient: PatientRecord) => {
    console.log('View documents for:', patient);
    // In a real application, this would open the documents viewer
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Patient Profile Drawer</h2>
      
      {/* Demo Controls */}
      <div className="space-y-4 mb-8">
        <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-4">
          <div className="flex items-center space-x-4">
            {samplePatient.avatar ? (
              <img
                src={samplePatient.avatar}
                alt={samplePatient.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xl text-gray-500">
                  {samplePatient.name[0]}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-medium">{samplePatient.name}</h3>
              <p className="text-sm text-gray-500">
                {samplePatient.age} years • {samplePatient.gender}
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenProfile}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            View Patient Profile
          </button>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Instructions</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Click "View Patient Profile" to open the drawer</li>
            <li>Try the quick action buttons (Schedule, Message, Documents)</li>
            <li>Explore the different sections of patient information</li>
            <li>Notice the responsive design and theme support</li>
            <li>Click the close button or outside to dismiss</li>
          </ul>
        </div>
      </div>

      {/* Profile Drawer */}
      <ProfileDrawer
        patient={selectedPatient}
        isOpen={isOpen}
        onClose={handleCloseProfile}
        onScheduleAppointment={handleScheduleAppointment}
        onSendMessage={handleSendMessage}
        onViewDocuments={handleViewDocuments}
      />
    </div>
  );
};

export default ProfileDrawerDemo;