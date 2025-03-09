import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { luxuryEffects } from '../lib/themes';

interface ProgressBarProps {
  value: number;
  variant?: 'success' | 'warning' | 'error' | 'info';
  showValue?: boolean;
  glow?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  variant = 'info',
  showValue = false,
  glow = false,
}) => {
  const { theme } = useTheme();

  const getVariantColors = () => {
    switch (variant) {
      case 'success':
        return 'from-emerald-500 to-green-500';
      case 'warning':
        return 'from-amber-500 to-orange-500';
      case 'error':
        return 'from-rose-500 to-red-500';
      case 'info':
      default:
        return 'from-cyan-500 to-blue-500';
    }
  };

  const getGlowColor = () => {
    switch (variant) {
      case 'success':
        return 'shadow-[0_0_20px_rgba(16,185,129,0.3)]';
      case 'warning':
        return 'shadow-[0_0_20px_rgba(245,158,11,0.3)]';
      case 'error':
        return 'shadow-[0_0_20px_rgba(239,68,68,0.3)]';
      case 'info':
      default:
        return 'shadow-[0_0_20px_rgba(6,182,212,0.3)]';
    }
  };

  return (
    <div className="relative">
      <div
        className={`
          h-2 rounded-full overflow-hidden
          ${luxuryEffects.glassmorphism[theme === 'dark' ? 'dark' : 'light']}
        `}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
          className={`
            h-full bg-gradient-to-r ${getVariantColors()}
            ${glow ? getGlowColor() : ''}
          `}
        />
      </div>
      {showValue && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute -top-6 right-0"
        >
          <span className={`text-sm font-medium bg-gradient-to-r ${getVariantColors()} bg-clip-text text-transparent`}>
            {value}%
          </span>
        </motion.div>
      )}
    </div>
  );
};
