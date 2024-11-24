import React from 'react';
import { Activity } from 'lucide-react';

interface AdherenceBadgeProps {
  value: number;
}

export function AdherenceBadge({ value }: AdherenceBadgeProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const getStyles = () => {
    const baseStyles = `
      inline-flex items-center justify-center w-28
      px-3 py-1 text-xs font-medium
      rounded-full backdrop-blur-sm border
      transition-all duration-200
      bg-gradient-glossy
      shadow-glow hover:shadow-glow-hover
    `;

    if (value >= 90) {
      return `${baseStyles} ${
        isDark 
          ? 'bg-ron-mint-400/10 border-ron-mint-400/20 text-ron-mint-200'
          : 'bg-ron-mint-50 border-ron-mint-200 text-ron-mint-700'
      }`;
    } else if (value >= 75) {
      return `${baseStyles} ${
        isDark 
          ? 'bg-ron-lime-400/10 border-ron-lime-400/20 text-ron-lime-200'
          : 'bg-ron-lime-50 border-ron-lime-200 text-ron-lime-700'
      }`;
    } else {
      return `${baseStyles} ${
        isDark 
          ? 'bg-ron-coral-400/10 border-ron-coral-400/20 text-ron-coral-200'
          : 'bg-ron-coral-50 border-ron-coral-200 text-ron-coral-700'
      }`;
    }
  };

  return (
    <span className={getStyles()}>
      <Activity className="w-3.5 h-3.5 mr-1.5" />
      {value}%
    </span>
  );
}