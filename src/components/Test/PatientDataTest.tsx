import React from 'react';
import { usePatients } from '../../hooks/usePatients';
import CareFormWrapper from '../RonAI/CareFormWrapper';

const PatientDataTest: React.FC = () => {
  const { patients, isLoading, error } = usePatients();
  const [showForm, setShowForm] = React.useState(false);

  if (isLoading) {
    return <div className="p-4 bg-gray-800 text-white">Loading patients...</div>;
  }

  if (error) {
    return <div className="p-4 bg-gray-800 text-red-400">Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-gray-800 text-white">
      <h2 className="text-xl font-bold mb-4">Patient Data Test</h2>
      
      <div className="mb-4">
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {showForm ? 'Hide' : 'Show'} Care Form
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Loaded {patients.length} patients:</h3>
        <ul className="space-y-1 max-h-60 overflow-auto">
          {patients.map(patient => (
            <li key={patient.member_id} className="border border-gray-700 p-2 rounded">
              {patient.member_name} (ID: {patient.member_id})
            </li>
          ))}
        </ul>
      </div>

      {showForm && (
        <CareFormWrapper
          isOpen={true}
          onClose={() => setShowForm(false)}
          initialMode="patient-content"
        />
      )}
    </div>
  );
};

export default PatientDataTest; 