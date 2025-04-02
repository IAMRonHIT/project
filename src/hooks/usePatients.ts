import { useState, useEffect } from 'react';
import { Patient } from '../components/RonAI/CareForm';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/data/Patients/New Member Schema.json');
        if (!response.ok) {
          throw new Error('Failed to fetch patients data');
        }
        const data = await response.json();
        console.log('Raw patient data:', data); // Debug log
        if (!Array.isArray(data)) {
          console.error('Patient data is not an array:', data);
          setPatients([]);
          return;
        }
        // Filter out any invalid patient data before setting state
        const validPatients = data.filter((patient: any): patient is Patient => {
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
        console.log('Filtered patients:', validPatients); // Debug log
        setPatients(validPatients);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch patients');
        console.error('Error fetching patients:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return { patients, isLoading, error };
}
