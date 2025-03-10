import React, { useState } from 'react';
import { CareJourney } from '../../services/fhirPatientService';
import { Activity, AlertCircle, Calendar, Heart, UserCircle } from 'lucide-react';
import { PatientDetailsView } from '../PatientDetailsView';
import styles from './styles.module.css';

interface CareJourneyCardProps {
  careJourney: CareJourney;
  isDark?: boolean;
  onClick?: () => void;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  refillDate: string;
  adherenceRate: number;
  lastTaken: string;
  nextDue: string;
  status: "ACTIVE" | "DISCONTINUED" | "PENDING_REFILL";
}

interface ClinicalTrend {
  metric: string;
  values: {
    date: string;
    value: number;
    unit: string;
  }[];
  trend: "DOWN" | "UP" | "STABLE";
  normalRange: {
    min: number;
    max: number;
  };
  unit: string;
}

interface PatientDetails {
  careTeam: {
    id: string;
    name: string;
    role: string;
    lastContact: string;
    nextAvailable: string;
  }[];
  interventions: {
    id: string;
    date: string;
    type: string;
    provider: string;
    outcome: string;
    followUpDate: string;
    notes: string;
  }[];
  appointments: {
    past: {
      date: string;
      type: string;
      provider: string;
      outcome: string;
    }[];
    upcoming: {
      date: string;
      type: string;
      provider: string;
    }[];
  };
  adherence: {
    medications: number;
    appointments: number;
    overall: number;
  };
  careGaps: {
    issue: string;
    priority: "High" | "Medium" | "Low";
    dueDate: string;
  }[];
  medications: Medication[];
  clinicalTrends: ClinicalTrend[];
  socialFactors: {
    transportation: boolean;
    housing: boolean;
    foodSecurity: boolean;
    financialStability: boolean;
  };
}

export const CareJourneyCard: React.FC<CareJourneyCardProps> = ({ 
  careJourney, 
  isDark = false,
  onClick 
}) => {
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const patientDetails: PatientDetails = {
    careTeam: [
      { id: 'ct1', name: 'Dr. Sarah Smith', role: 'Primary Care', lastContact: '2024-01-20', nextAvailable: '2024-02-10' },
      { id: 'ct2', name: 'John Doe', role: 'Social Worker', lastContact: '2024-01-25', nextAvailable: '2024-02-05' }
    ],
    interventions: [
      {
        id: 'int1',
        date: '2024-01-15',
        type: 'Home Visit',
        provider: 'Community Health Worker',
        outcome: 'Successful',
        followUpDate: '2024-02-15',
        notes: 'Provided transportation resources and food assistance information'
      }
    ],
    appointments: {
      past: [
        { date: '2024-01-10', type: 'Check-up', provider: 'Dr. Smith', outcome: 'Completed' }
      ],
      upcoming: [
        { date: '2024-02-15', type: 'Follow-up', provider: 'Dr. Smith' }
      ]
    },
    adherence: {
      medications: 85,
      appointments: 90,
      overall: 87
    },
    careGaps: [
      { issue: 'Annual wellness visit', priority: 'High', dueDate: '2024-03-01' },
      { issue: 'Diabetes screening', priority: 'Medium', dueDate: '2024-04-01' }
    ],
    medications: [
      {
        id: 'med1',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        refillDate: '2024-02-15',
        adherenceRate: 92,
        lastTaken: '2024-01-27 08:00 AM',
        nextDue: '2024-01-27 08:00 PM',
        status: 'ACTIVE'
      },
      {
        id: 'med2',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        refillDate: '2024-03-01',
        adherenceRate: 85,
        lastTaken: '2024-01-27 08:00 AM',
        nextDue: '2024-01-28 08:00 AM',
        status: 'ACTIVE'
      },
      {
        id: 'med3',
        name: 'Simvastatin',
        dosage: '20mg',
        frequency: 'Once daily at bedtime',
        refillDate: '2024-02-20',
        adherenceRate: 65,
        lastTaken: '2024-01-26 10:00 PM',
        nextDue: '2024-01-27 10:00 PM',
        status: 'ACTIVE'
      }
    ],
    clinicalTrends: [
      {
        metric: 'Blood Glucose',
        values: [
          { date: '2023-11-01', value: 170, unit: 'mg/dL' },
          { date: '2023-12-01', value: 150, unit: 'mg/dL' },
          { date: '2024-01-01', value: 130, unit: 'mg/dL' }
        ],
        trend: 'DOWN',
        normalRange: { min: 70, max: 130 },
        unit: 'mg/dL'
      },
      {
        metric: 'Blood Pressure',
        values: [
          { date: '2023-11-01', value: 150, unit: 'mmHg' },
          { date: '2023-12-01', value: 145, unit: 'mmHg' },
          { date: '2024-01-01', value: 140, unit: 'mmHg' }
        ],
        trend: 'DOWN',
        normalRange: { min: 90, max: 120 },
        unit: 'mmHg'
      }
    ],
    socialFactors: {
      transportation: true,
      housing: false,
      foodSecurity: true,
      financialStability: false
    }
  };

  // Type guard to ensure priority is one of the allowed values
  const normalizePriority = (priority: string): "High" | "Medium" | "Low" => {
    const normalizedPriority = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
    
    if (normalizedPriority === "High" || normalizedPriority === "Medium" || normalizedPriority === "Low") {
      return normalizedPriority as "High" | "Medium" | "Low";
    }
    // Default to Medium if an invalid priority is provided
    return "Medium";
  };

  // Normalize patient details to ensure they match the expected types
  const normalizedPatientDetails: PatientDetails = {
    ...patientDetails,
    careGaps: patientDetails.careGaps.map(gap => ({
      ...gap,
      priority: normalizePriority(gap.priority)
    }))
  };

  const cardClass = isDark 
    ? styles.darkCard 
    : styles.lightCard;

  const secondaryTextClass = isDark
    ? styles.darkSecondaryText
    : styles.lightSecondaryText;

  // Get type color
  const getTypeColor = () => {
    switch (careJourney.type) {
      case 'Chronic':
        return isDark ? styles.chronicDark : styles.chronicLight;
      case 'Acute':
        return isDark ? styles.acuteDark : styles.acuteLight;
      case 'Injury':
        return isDark ? styles.injuryDark : styles.injuryLight;
      case 'Mental Health':
        return isDark ? styles.mentalHealthDark : styles.mentalHealthLight;
      default:
        return isDark ? styles.defaultDark : styles.defaultLight;
    }
  };

  // Get risk level color
  const getRiskLevelBadgeColor = () => {
    switch (careJourney.riskLevel) {
      case 'High':
        return isDark ? styles.highRiskDark : styles.highRiskLight;
      case 'Medium':
        return isDark ? styles.mediumRiskDark : styles.mediumRiskLight;
      case 'Low':
        return isDark ? styles.lowRiskDark : styles.lowRiskLight;
      default:
        return isDark ? styles.defaultDark : styles.defaultLight;
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
    <>
      <div 
        className={`${styles.card} ${cardClass} transition-all duration-300 cursor-pointer`}
        onClick={onClick}
      >
        <div className={styles.cardContent}>
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor()}`}>
                  {careJourney.type}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${getRiskLevelBadgeColor()}`}>
                  {careJourney.riskLevel} Risk
                </span>
              </div>
              <h3 className="text-lg font-semibold">{careJourney.title}</h3>
              <p className={`mt-1 ${secondaryTextClass}`}>{careJourney.primaryCondition}</p>
            </div>
            
            {/* Severity Meter */}
            <div className="text-right">
              <span className={`text-sm ${secondaryTextClass}`}>Severity</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-16 h-2 rounded-full bg-black/10 dark:bg-white/10">
                  <div 
                    className={`h-full rounded-full ${
                      careJourney.severity >= 75 ? 'bg-ron-coral-500' :
                      careJourney.severity >= 50 ? 'bg-ron-lime-500' :
                      'bg-ron-mint-500'
                    } ${getWidthClass(careJourney.severity)}`}
                  />
                </div>
                <span className="text-sm font-medium">{careJourney.severity}%</span>
              </div>
            </div>
          </div>
          
          {/* Details */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`flex items-center gap-1 ${secondaryTextClass}`}>
              <Calendar className="w-4 h-4" />
              <span>Started {careJourney.startDate}</span>
            </div>
            <div className={`flex items-center gap-1 ${secondaryTextClass}`}>
              <Activity className="w-4 h-4" />
              <span>{careJourney.status}</span>
            </div>
          </div>
          
          {/* View Details Button - Exact copy from Member360View */}
          <div className="mb-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPatientDetails(true);
              }}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg
                ${isDark 
                  ? styles.darkButton 
                  : styles.lightButton
                }
                transition-colors
              `}
            >
              <UserCircle className="w-5 h-5" />
              <span>View Details</span>
            </button>
          </div>
          
          {/* Metrics */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div className="text-center p-2 rounded-lg bg-black/5 dark:bg-white/5">
              <div className="text-lg font-semibold">{careJourney.metrics.reviews}</div>
              <div className={`text-xs ${secondaryTextClass}`}>Reviews</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-black/5 dark:bg-white/5">
              <div className="text-lg font-semibold">{careJourney.metrics.activePlans}</div>
              <div className={`text-xs ${secondaryTextClass}`}>Plans</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-black/5 dark:bg-white/5">
              <div className="text-lg font-semibold">{careJourney.metrics.claims}</div>
              <div className={`text-xs ${secondaryTextClass}`}>Claims</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-black/5 dark:bg-white/5">
              <div className="text-lg font-semibold">{careJourney.metrics.communications}</div>
              <div className={`text-xs ${secondaryTextClass}`}>Comms</div>
            </div>
          </div>
          
          {/* Most recent prediction if available */}
          {careJourney.predictions && careJourney.predictions.length > 0 && (
            <div className={`mt-4 p-3 rounded-lg ${
              careJourney.predictions[0].priority === 'high' 
                ? isDark ? styles.highPriorityDark : styles.highPriorityLight 
                : careJourney.predictions[0].priority === 'medium'
                  ? isDark ? styles.mediumPriorityDark : styles.mediumPriorityLight
                  : isDark ? styles.lowPriorityDark : styles.lowPriorityLight
            }`}>
              <div className="flex items-center gap-2">
                <AlertCircle className={`w-4 h-4 ${
                  careJourney.predictions[0].priority === 'high' 
                    ? isDark ? styles.highPriorityDark : styles.highPriorityLight 
                    : careJourney.predictions[0].priority === 'medium'
                      ? isDark ? styles.mediumPriorityDark : styles.mediumPriorityLight
                      : isDark ? styles.lowPriorityDark : styles.lowPriorityLight
                }`} />
                <span className="font-medium text-sm">{careJourney.predictions[0].title}</span>
              </div>
              <p className={`text-xs mt-1 ${secondaryTextClass}`}>{careJourney.predictions[0].description}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Patient Details Modal - Exact copy from Member360View */}
      {showPatientDetails && (
        <PatientDetailsView
          details={normalizedPatientDetails}
          onClose={() => setShowPatientDetails(false)}
        />
      )}
    </>
  );
};
