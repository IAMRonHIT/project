import React, { useEffect, useState } from 'react';
import { PatientProfileCard } from './PatientProfileCard';
import { CareJourneyCard } from './CareJourneyCard';
import { HealthMetricsPanel } from './HealthMetricsPanel';
import { PatientData, loadPatientFromFHIR } from '../../services/fhirPatientService';

interface PatientDashboardProps {
  patientFhirUrl: string;
  isDark?: boolean;
  onCareJourneySelected?: (careJourneyId: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  patientFhirUrl,
  isDark = false,
  onCareJourneySelected
}) => {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPatientData = async () => {
      try {
        setLoading(true);
        const data = await loadPatientFromFHIR(patientFhirUrl);
        setPatientData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading patient data:', err);
        setError('Failed to load patient data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadPatientData();
  }, [patientFhirUrl]);

  if (loading) {
    return (
      <div className="w-full p-8 flex items-center justify-center">
        <div className="animate-pulse flex flex-col w-full gap-4">
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full p-8 text-center ${isDark ? 'text-white' : 'text-red-600'}`}>
        <p className="text-lg">{error}</p>
        <button 
          className={`mt-4 px-4 py-2 rounded-md ${
            isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-red-100 hover:bg-red-200'
          }`}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!patientData) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Patient Profile Card */}
      <div className="mb-6">
        <PatientProfileCard 
          patient={patientData.profile}
          isDark={isDark}
        />
      </div>

      {/* Care Journeys and Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Health Metrics Panel */}
        <div>
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-dark-gun-metal'}`}>
            Health Data
          </h3>
          <HealthMetricsPanel
            observations={patientData.observations}
            conditions={patientData.conditions}
            medications={patientData.medications}
            isDark={isDark}
          />
        </div>

        {/* Care Journeys */}
        <div>
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-dark-gun-metal'}`}>
            Care Journeys
          </h3>
          <div className="space-y-4">
            {patientData.careJourneys.map(journey => (
              <CareJourneyCard
                key={journey.id}
                careJourney={journey}
                isDark={isDark}
                onClick={() => onCareJourneySelected?.(journey.id)}
              />
            ))}
            {patientData.careJourneys.length === 0 && (
              <div className={`p-6 text-center rounded-xl border ${
                isDark ? 'border-white/10 bg-white/5 text-white/60' : 'border-ron-divider bg-white text-dark-gun-metal/60'
              }`}>
                <p>No care journeys found for this patient.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
