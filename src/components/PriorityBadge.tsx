import React from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface PriorityBadgeProps {
  priority: 'high' | 'medium' | 'low';
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const getPriorityStyles = () => {
    const baseStyles = `
      inline-flex items-center justify-center w-28
      px-3 py-1 text-xs font-medium
      rounded-full backdrop-blur-sm border
      transition-all duration-200
      bg-gradient-glossy
      shadow-glow hover:shadow-glow-hover
    `;
    
    switch (priority) {
      case 'high':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-coral-400/10 border-ron-coral-400/20 text-ron-coral-200'
            : 'bg-ron-coral-50 border-ron-coral-200 text-ron-coral-700'
        }`;
      case 'medium':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-lime-400/10 border-ron-lime-400/20 text-ron-lime-200'
            : 'bg-ron-lime-50 border-ron-lime-200 text-ron-lime-700'
        }`;
      case 'low':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-mint-400/10 border-ron-mint-400/20 text-ron-mint-200'
            : 'bg-ron-mint-50 border-ron-mint-200 text-ron-mint-700'
        }`;
    }
  };

  const getIcon = () => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-3.5 h-3.5 mr-1.5" />;
      case 'medium':
        return <Clock className="w-3.5 h-3.5 mr-1.5" />;
      case 'low':
        return <CheckCircle className="w-3.5 h-3.5 mr-1.5" />;
    }
  };

  return (
    <span className={getPriorityStyles()}>
      {getIcon()}
      {priority.toUpperCase()}
    </span>
  );
}