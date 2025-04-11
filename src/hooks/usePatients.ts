import { useState, useEffect } from 'react';
import { Patient } from '../components/RonAI/CareForm';
import { patients as localPatientData } from '../data/patientData';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use local patient data instead of fetching
    console.log('Using local patient data');
    try {
      // Check if the local patient data is valid
      if (!Array.isArray(localPatientData)) {
        console.error('Local patient data is not an array');
        setPatients([]);
        setError('Invalid patient data format');
        return;
      }
      
      // Filter out any invalid patient data before setting state
      const validPatients = localPatientData.filter((patient: any): patient is Patient => {
        if (!patient || typeof patient !== 'object') {
          console.warn('Invalid patient object:', patient);
          return false;
        }
        if (!patient.member_id || typeof patient.member_id !== 'string') {
          console.warn('Patient missing member_id:', patient);
          return false;
        }
        if (!patient.member_name || typeof patient.member_name !== 'string') {
          console.warn('Patient missing member_name:', patient);
          return false;
        }
        return true;
      });
      
      console.log('Local patient data loaded:', validPatients.length, 'patients');
      setPatients(validPatients);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patients');
      console.error('Error loading patients:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { patients, isLoading, error };
}
