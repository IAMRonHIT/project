import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MedicationCard } from './MedicationCard';
import { ClinicalTrends } from './ClinicalTrends';
import { SocialFactorsPanel } from './SocialFactorsPanel';
import { useTheme } from '../hooks/useTheme';
import { luxuryEffects } from '../lib/themes';

export interface CareTeamMember {
  id: string;
  name: string;
  role: string;
  lastContact: string;
  nextAvailable: string;
}

export interface Intervention {
  id: string;
  date: string;
  type: string;
  provider: string;
  outcome: string;
  followUpDate: string;
  notes: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  refillDate: string;
  adherenceRate: number;
  lastTaken: string;
  nextDue: string;
  status: 'ACTIVE' | 'DISCONTINUED' | 'PENDING_REFILL';
}

export interface ClinicalTrend {
  metric: string;
  values: Array<{
    date: string;
    value: number;
    unit: string;
  }>;
  trend: 'UP' | 'DOWN' | 'STABLE';
  unit: string;
  normalRange?: {
    min: number;
    max: number;
  };
}

export interface PatientDetails {
  careTeam: CareTeamMember[];
  interventions: Intervention[];
  appointments: {
    past: Array<{ date: string; type: string; provider: string; outcome: string }>;
    upcoming: Array<{ date: string; type: string; provider: string }>;
  };
  adherence: {
    medications: number;
    appointments: number;
    overall: number;
  };
  careGaps: Array<{ issue: string; priority: 'High' | 'Medium' | 'Low'; dueDate: string }>;
  medications: Medication[];
  clinicalTrends: ClinicalTrend[];
  socialFactors: {
    transportation: boolean;
    housing: boolean;
    foodSecurity: boolean;
    financialStability: boolean;
  };
}

export interface PatientDetailsViewProps {
  details: PatientDetails;
  onClose: () => void;
}

export const PatientDetailsView: React.FC<PatientDetailsViewProps> = ({ details, onClose }) => {
  const [pinnedMedications, setPinnedMedications] = useState<Set<string>>(new Set());
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`
          ${luxuryEffects.glassmorphism[theme === 'dark' ? 'dark' : 'light']}
          rounded-lg max-w-6xl w-full p-6 max-h-[90vh] overflow-y-auto
          ${luxuryEffects.neonGlow.cyan}
        `}
      >
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-start mb-8"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Patient Overview
          </h2>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Close patient overview"
            aria-label="Close patient overview"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`
              rounded-lg p-4
              ${luxuryEffects.glassmorphism[theme === 'dark' ? 'dark' : 'light']}
              ${luxuryEffects.interaction.hover}
            `}
          >
            <h4 className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Overall Adherence
            </h4>
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mt-1"
            >
              {details.adherence.overall}%
            </motion.p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`
              rounded-lg p-4
              ${luxuryEffects.glassmorphism[theme === 'dark' ? 'dark' : 'light']}
              ${luxuryEffects.interaction.hover}
            `}
          >
            <h4 className="text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Active Care Gaps
            </h4>
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mt-1"
            >
              {details.careGaps.filter(gap => gap.priority === 'High').length}
            </motion.p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`
              rounded-lg p-4
              ${luxuryEffects.glassmorphism[theme === 'dark' ? 'dark' : 'light']}
              ${luxuryEffects.interaction.hover}
            `}
          >
            <h4 className="text-sm font-medium bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
              Next Appointment
            </h4>
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent mt-1"
            >
              {details.appointments.upcoming[0]?.date || 'None scheduled'}
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Medications Section */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <div className="space-y-4">
            {details.medications.map(medication => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                isExpanded={pinnedMedications.has(medication.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* Clinical Trends Section */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <ClinicalTrends trends={details.clinicalTrends} />
        </motion.div>

        {/* Social Factors Section */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <SocialFactorsPanel
            factors={details.socialFactors}
            onUpdate={(factor, value) => {
              // In a real app, this would update the backend
              console.log(`Updating ${factor} to ${value}`);
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Add default export
export default PatientDetailsView;
