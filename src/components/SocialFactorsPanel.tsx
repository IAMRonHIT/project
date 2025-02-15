import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { luxuryEffects } from '../lib/themes';

interface SocialFactors {
  transportation: boolean;
  housing: boolean;
  foodSecurity: boolean;
  financialStability: boolean;
}

interface SocialFactorsPanelProps {
  factors: SocialFactors;
  onUpdate: (factor: keyof SocialFactors, value: boolean) => void;
}

export const SocialFactorsPanel: React.FC<SocialFactorsPanelProps> = ({
  factors,
  onUpdate,
}) => {
  const { theme } = useTheme();

  const factorLabels: Record<keyof SocialFactors, string> = {
    transportation: 'Transportation Access',
    housing: 'Housing Stability',
    foodSecurity: 'Food Security',
    financialStability: 'Financial Stability',
  };

  const factorDescriptions: Record<keyof SocialFactors, { good: string; bad: string }> = {
    transportation: {
      good: 'Reliable transportation available',
      bad: 'Transportation barriers present',
    },
    housing: {
      good: 'Stable housing situation',
      bad: 'Housing instability concerns',
    },
    foodSecurity: {
      good: 'Food security maintained',
      bad: 'Food insecurity identified',
    },
    financialStability: {
      good: 'Financially stable',
      bad: 'Financial strain present',
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
        Social & Financial Factors
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(factors) as Array<keyof SocialFactors>).map((factor) => (
          <motion.div
            key={factor}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className={`
              rounded-lg p-4 cursor-pointer
              ${luxuryEffects.glassmorphism[theme === 'dark' ? 'dark' : 'light']}
              ${factors[factor] ? luxuryEffects.neonGlow.cyan : luxuryEffects.neonGlow.purple}
              transition-all duration-300
            `}
            onClick={() => onUpdate(factor, !factors[factor])}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: [1, 1.2, 1],
                      transition: { duration: 0.3 },
                    }}
                    className={`
                      flex-shrink-0 w-8 h-8 rounded-full 
                      ${factors[factor]
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                        : 'bg-gradient-to-r from-rose-500 to-red-500'
                      }
                      flex items-center justify-center text-white
                    `}
                  >
                    {factors[factor] ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </motion.div>
                  <div>
                    <h4 className="font-medium bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                      {factorLabels[factor]}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {factors[factor]
                        ? factorDescriptions[factor].good
                        : factorDescriptions[factor].bad}
                    </p>
                  </div>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  ml-4 p-2 rounded-full
                  ${factors[factor]
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-rose-500/10 text-rose-500'
                  }
                `}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
