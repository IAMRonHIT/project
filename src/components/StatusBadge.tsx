import React from 'react';
import { AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  recommendation: string;
  urgency: 'high' | 'medium' | 'low';
}

export function StatusBadge({ recommendation, urgency }: StatusBadgeProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const getUrgencyIcon = () => {
    switch (urgency) {
      case "high":
        return <AlertCircle className="w-3.5 h-3.5 mr-1.5" />;
      case "medium":
        return <HelpCircle className="w-3.5 h-3.5 mr-1.5" />;
      case "low":
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />;
      default:
        return null;
    }
  };

  const getBadgeStyles = () => {
    const baseStyles = `
      inline-flex items-center justify-center
      min-w-[140px] px-3 py-1 text-xs font-medium
      rounded-full backdrop-blur-sm border
      transition-all duration-200
      bg-gradient-glossy
      shadow-glow hover:shadow-glow-hover
    `;
    
    switch (recommendation) {
      case "In Review":
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-mint-400/10 border-ron-mint-400/20 text-ron-mint-200'
            : 'bg-ron-mint-50 border-ron-mint-200 text-ron-mint-700'
        }`;
      case "Likely Denial":
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-coral-400/10 border-ron-coral-400/20 text-ron-coral-200'
            : 'bg-ron-coral-50 border-ron-coral-200 text-ron-coral-700'
        }`;
      case "Experimental":
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-lime-400/10 border-ron-lime-400/20 text-ron-lime-200'
            : 'bg-ron-lime-50 border-ron-lime-200 text-ron-lime-700'
        }`;
      case "MD Review":
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-teal-400/10 border-ron-teal-400/20 text-ron-teal-200'
            : 'bg-ron-teal-50 border-ron-teal-200 text-ron-teal-700'
        }`;
      case "Likely Approval":
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-mint-400/10 border-ron-mint-400/20 text-ron-mint-200'
            : 'bg-ron-mint-50 border-ron-mint-200 text-ron-mint-700'
        }`;
      default:
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-teal-400/10 border-ron-teal-400/20 text-ron-teal-200'
            : 'bg-ron-teal-50 border-ron-teal-200 text-ron-teal-700'
        }`;
    }
  };

  return (
    <span className={getBadgeStyles()}>
      {getUrgencyIcon()}
      {recommendation}
    </span>
  );
}