import React, { useState } from 'react';
import { Activity, AlertTriangle, ArrowDown, ArrowRight, ArrowUp, Circle, Pill } from 'lucide-react';
import { Observation, Condition, Medication } from '../../services/fhirPatientService';

interface HealthMetricsPanelProps {
  observations: Observation[];
  conditions: Condition[];
  medications: Medication[];
  isDark?: boolean;
}

export const HealthMetricsPanel: React.FC<HealthMetricsPanelProps> = ({
  observations,
  conditions,
  medications,
  isDark = false
}) => {
  const [activeTab, setActiveTab] = useState<'observations' | 'conditions' | 'medications'>('observations');
  
  const cardClass = isDark 
    ? 'bg-white/5 border border-white/10 text-white' 
    : 'bg-white border border-ron-divider text-dark-gun-metal';

  const secondaryTextClass = isDark
    ? 'text-white/60'
    : 'text-dark-gun-metal/60';
    
  const activeTabClass = isDark
    ? 'bg-white/10 text-white'
    : 'bg-ron-primary-500 text-white';
    
  const inactiveTabClass = isDark
    ? 'text-white/60 hover:bg-white/5'
    : 'text-dark-gun-metal/60 hover:bg-gray-50';

  // Helper to get interpretations for observations
  const getObservationStatus = (observation: Observation) => {
    if (!observation.interpretation) return { color: 'text-gray-500', icon: Circle };
    
    const interpretation = observation.interpretation.toLowerCase();
    if (interpretation.includes('high') || interpretation.includes('abnormal') || interpretation.includes('critical')) {
      return { 
        color: isDark ? 'text-ron-coral-300' : 'text-ron-coral-600', 
        icon: ArrowUp 
      };
    }
    if (interpretation.includes('low')) {
      return { 
        color: isDark ? 'text-ron-lime-300' : 'text-ron-lime-600', 
        icon: ArrowDown 
      };
    }
    return { 
      color: isDark ? 'text-ron-mint-300' : 'text-ron-mint-600', 
      icon: ArrowRight 
    };
  };

  // Helper to get condition severity color
  const getConditionSeverityColor = (condition: Condition) => {
    if (!condition.severity) return isDark ? 'text-white' : 'text-gray-700';
    
    const severity = condition.severity.toLowerCase();
    if (severity.includes('severe') || severity.includes('critical')) {
      return isDark ? 'text-ron-coral-300' : 'text-ron-coral-600';
    }
    if (severity.includes('moderate')) {
      return isDark ? 'text-ron-lime-300' : 'text-ron-lime-600';
    }
    return isDark ? 'text-ron-mint-300' : 'text-ron-mint-600';
  };

  // Helper to get medication status color
  const getMedicationStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return isDark ? 'text-emerald-400' : 'text-emerald-500';
      case 'PENDING_REFILL':
        return isDark ? 'text-amber-400' : 'text-amber-500';
      case 'COMPLETED':
        return isDark ? 'text-blue-400' : 'text-blue-500';
      case 'STOPPED':
        return isDark ? 'text-gray-400' : 'text-gray-500';
      default:
        return isDark ? 'text-gray-400' : 'text-gray-500';
    }
  };

  // Convert percentage to Tailwind width class
  const getWidthClass = (percentage: number): string => {
    // Round to nearest 5%
    const roundedPercentage = Math.round(percentage / 5) * 5;
    
    // Map to Tailwind width classes
    return `w-[${roundedPercentage}%]`;
  };

  return (
    <div className={`rounded-xl overflow-hidden ${cardClass}`}>
      {/* Tabs */}
      <div className="flex rounded-t-xl">
        <button
          onClick={() => setActiveTab('observations')}
          className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
            activeTab === 'observations' ? activeTabClass : inactiveTabClass
          }`}
        >
          Observations ({observations.length})
        </button>
        <button
          onClick={() => setActiveTab('conditions')}
          className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
            activeTab === 'conditions' ? activeTabClass : inactiveTabClass
          }`}
        >
          Conditions ({conditions.length})
        </button>
        <button
          onClick={() => setActiveTab('medications')}
          className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
            activeTab === 'medications' ? activeTabClass : inactiveTabClass
          }`}
        >
          Medications ({medications.length})
        </button>
      </div>
      
      {/* Content */}
      <div className="p-0">
        {activeTab === 'observations' && (
          <div className="divide-y divide-white/10">
            {observations.length === 0 ? (
              <div className="p-6 text-center">
                <p className={secondaryTextClass}>No observations found</p>
              </div>
            ) : (
              observations.map((observation) => {
                const status = getObservationStatus(observation);
                const StatusIcon = status.icon;
                
                return (
                  <div key={observation.id} className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{observation.display}</h4>
                      <p className={`text-sm ${secondaryTextClass}`}>
                        {observation.date ? new Date(observation.date).toLocaleDateString() : 'Date unknown'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="font-semibold">
                          {observation.value} {observation.unit}
                        </span>
                        <StatusIcon className={`w-4 h-4 ${status.color}`} />
                      </div>
                      <p className={`text-sm ${status.color}`}>{observation.interpretation || 'Normal'}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
        
        {activeTab === 'conditions' && (
          <div className="divide-y divide-white/10">
            {conditions.length === 0 ? (
              <div className="p-6 text-center">
                <p className={secondaryTextClass}>No conditions found</p>
              </div>
            ) : (
              conditions.map((condition) => (
                <div key={condition.id} className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{condition.display}</h4>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        condition.type === 'Chronic' 
                          ? isDark ? 'bg-ron-primary/10 text-ron-primary-500' : 'bg-ron-primary/10 text-ron-primary-500'
                          : condition.type === 'Acute'
                            ? isDark ? 'bg-ron-coral-500/10 text-ron-coral-500' : 'bg-ron-coral-500/10 text-ron-coral-500'
                            : condition.type === 'Injury'
                              ? isDark ? 'bg-ron-lime-500/10 text-ron-lime-500' : 'bg-ron-lime-500/10 text-ron-lime-500'
                              : isDark ? 'bg-ron-teal-500/10 text-ron-teal-500' : 'bg-ron-teal-500/10 text-ron-teal-500'
                      }`}>
                        {condition.type}
                      </span>
                      {condition.onsetDate && (
                        <span className={`ml-2 text-xs ${secondaryTextClass}`}>
                          Onset: {new Date(condition.onsetDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <AlertTriangle className={`w-4 h-4 ${getConditionSeverityColor(condition)}`} />
                      <span className={`font-medium ${getConditionSeverityColor(condition)}`}>
                        {condition.severity || 'Unknown severity'}
                      </span>
                    </div>
                    <p className={`text-sm ${secondaryTextClass}`}>{condition.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {activeTab === 'medications' && (
          <div className="divide-y divide-white/10">
            {medications.length === 0 ? (
              <div className="p-6 text-center">
                <p className={secondaryTextClass}>No medications found</p>
              </div>
            ) : (
              medications.map((medication) => (
                <div key={medication.id} className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{medication.name}</h4>
                    <p className={`text-sm ${secondaryTextClass}`}>
                      {medication.dosage} • {medication.frequency}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Pill className={`w-4 h-4 ${getMedicationStatusColor(medication.status)}`} />
                      <span className={`font-medium ${getMedicationStatusColor(medication.status)}`}>
                        {medication.status.replace('_', ' ')}
                      </span>
                    </div>
                    {medication.adherenceRate && (
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <div className="w-16 h-1.5 rounded-full bg-black/10 dark:bg-white/10">
                          <div 
                            className={`h-full rounded-full ${
                              medication.adherenceRate >= 90 ? 'bg-ron-mint-500' :
                              medication.adherenceRate >= 70 ? 'bg-ron-lime-500' :
                              'bg-ron-coral-500'
                            } ${getWidthClass(medication.adherenceRate)}`}
                          />
                        </div>
                        <span className="text-xs font-medium">{medication.adherenceRate}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
