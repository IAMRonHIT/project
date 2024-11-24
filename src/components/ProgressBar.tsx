import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showValue?: boolean;
  glow?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showValue = false,
  glow = false
}: ProgressBarProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'h-1.5';
      case 'lg':
        return 'h-4';
      default:
        return 'h-2.5';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return isDark ? 'bg-ron-mint-400' : 'bg-ron-mint-300';
      case 'warning':
        return isDark ? 'bg-ron-lime-400' : 'bg-ron-lime-300';
      case 'error':
        return isDark ? 'bg-ron-coral-400' : 'bg-ron-coral-300';
      default:
        return isDark ? 'bg-ron-teal-400' : 'bg-ron-teal-300';
    }
  };

  return (
    <div className="relative">
      <div className={`
        w-full rounded-full overflow-hidden
        ${getSizeStyles()}
        ${isDark ? 'bg-white/10' : 'bg-ron-primary/10'}
        ${glow ? 'shadow-glow' : ''}
      `}>
        <div
          className={`
            ${getSizeStyles()}
            ${getVariantStyles()}
            transition-all duration-500 ease-out
            bg-gradient-glossy
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <span className={`
          absolute right-0 -top-6 text-sm font-medium
          ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}
        `}>
          {percentage.toFixed(0)}%
        </span>
      )}
    </div>
  );
}