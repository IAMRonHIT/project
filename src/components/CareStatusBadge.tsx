import React, { useState } from 'react';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

interface CareStatusBadgeProps {
  status: string;
}

export function CareStatusBadge({ status }: CareStatusBadgeProps) {
  const [isDark] = useState(document.documentElement.classList.contains('dark'));

  const getStatusStyles = () => {
    const baseStyles = `
      inline-flex items-center justify-center
      min-w-[140px] px-3 py-1 text-xs font-medium
      rounded-full backdrop-blur-sm border
      transition-all duration-200
      bg-gradient-glossy
      shadow-glow hover:shadow-glow-hover
    `;
    
    switch (status.toLowerCase()) {
      case 'active':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-mint-400/10 border-ron-mint-400/20 text-ron-mint-200'
            : 'bg-ron-mint-50 border-ron-mint-200 text-ron-mint-700'
        }`;
      case 'intervene':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-coral-400/10 border-ron-coral-400/20 text-ron-coral-200'
            : 'bg-ron-coral-50 border-ron-coral-200 text-ron-coral-700'
        }`;
      case 'pending':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-lime-400/10 border-ron-lime-400/20 text-ron-lime-200'
            : 'bg-ron-lime-50 border-ron-lime-200 text-ron-lime-700'
        }`;
      default:
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-teal-400/10 border-ron-teal-400/20 text-ron-teal-200'
            : 'bg-ron-teal-50 border-ron-teal-200 text-ron-teal-700'
        }`;
    }
  };

  const getIcon = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="w-3.5 h-3.5 mr-1.5" />;
      case 'intervene':
        return <AlertCircle className="w-3.5 h-3.5 mr-1.5" />;
      default:
        return <Activity className="w-3.5 h-3.5 mr-1.5" />;
    }
  };

  // Convert "attention needed" to "intervene" for display
  const displayStatus = status.toLowerCase() === 'attention needed' ? 'Intervene' : status;

  return (
    <span className={getStatusStyles()}>
      {getIcon()}
      {displayStatus}
    </span>
  );
}