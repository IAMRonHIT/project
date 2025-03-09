import React from 'react';
import { motion } from 'framer-motion';
import { ProgressBar } from './ProgressBar';
import { luxuryEffects } from '../lib/themes';

interface MedicationCardProps {
  medication: {
    name: string;
    dosage: string;
    frequency: string;
    status: string;
    adherenceRate: number;
    lastTaken: string;
    nextDue: string;
    refillDate?: string;
  };
  isExpanded: boolean;
}

const contentVariants = {
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-gradient-to-r from-green-500 to-emerald-500';
    case 'pending':
      return 'bg-gradient-to-r from-yellow-500 to-amber-500';
    case 'discontinued':
      return 'bg-gradient-to-r from-red-500 to-rose-500';
    default:
      return 'bg-gradient-to-r from-gray-500 to-slate-500';
  }
};

export const MedicationCard: React.FC<MedicationCardProps> = ({ medication, isExpanded }) => {
  const needsRefill = medication.refillDate ? new Date(medication.refillDate) > new Date() : false;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative"
    >
      <motion.div
        layout
        className={`
          p-4 rounded-xl
          bg-gradient-to-br from-white/90 to-white/50 dark:from-gray-800/90 dark:to-gray-900/50
          border border-gray-200/50 dark:border-gray-700/50
          ${luxuryEffects.frost.primary}
          backdrop-blur-sm
          shadow-xl
        `}
      >
        <div className="flex justify-between items-start">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {medication.name}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {medication.dosage} • {medication.frequency}
          </span>
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={`
              px-3 py-1 rounded-full text-sm font-medium text-white shadow-sm
              ${getStatusColor(medication.status)}
            `}
          >
            {medication.status.replace('_', ' ')}
          </motion.span>
        </div>

        {needsRefill && medication.refillDate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              mt-2 p-3 rounded-md
              bg-gradient-to-r from-amber-500/10 to-orange-500/10
              border border-orange-500/20
              ${luxuryEffects.frost.accent}
              backdrop-blur-sm
            `}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Refill needed by {new Date(medication.refillDate).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={contentVariants}
          initial="collapsed"
          animate={isExpanded ? 'expanded' : 'collapsed'}
          className="mt-4 space-y-4"
        >
          <div>
            <p className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-1">
              Adherence Rate
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <ProgressBar
                value={medication.adherenceRate}
                variant={medication.adherenceRate >= 90 ? 'success' : medication.adherenceRate >= 75 ? 'warning' : 'error'}
                showValue
                glow
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Taken
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(medication.lastTaken).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Next Due
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(medication.nextDue).toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MedicationCard;
