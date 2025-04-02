import React, { useEffect } from 'react';
import { usePatients } from '../../hooks/usePatients';
import CareForm, { Patient } from './CareForm';

interface CareFormWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'medication-reconciliation' | 'patient-content';
}

const CareFormWrapper: React.FC<CareFormWrapperProps> = ({ 
  isOpen, 
  onClose,
  initialMode = 'patient-content'
}) => {
  console.log('CareFormWrapper rendering, isOpen:', isOpen, 'initialMode:', initialMode);
  const { patients, isLoading, error } = usePatients();
  console.log('usePatients hook state:', { isLoading, error, patientCount: patients?.length });

  useEffect(() => {
    console.log('CareFormWrapper mounted');
    return () => {
      console.log('CareFormWrapper unmounted');
    };
  }, []);

  if (isLoading) {
    console.log('CareFormWrapper showing loading state');
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          Loading patients data...
        </div>
      </div>
    );
  }

  if (error) {
    console.log('CareFormWrapper showing error state:', error);
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <h3 className="text-red-400 mb-2">Error Loading Patients</h3>
          <p>{error}</p>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Ensure we never pass null/undefined patients array
  const validPatients = Array.isArray(patients) ? patients : [];
  console.log('CareFormWrapper rendering CareForm with patients:', validPatients);

  return (
    <CareForm
      isOpen={isOpen}
      onClose={onClose}
      patients={validPatients}
      initialMode={initialMode}
    />
  );
};

export default CareFormWrapper;
