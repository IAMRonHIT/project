import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface ProviderStatusBadgeProps {
  status: 'active' | 'pending' | 'inactive';
}

export function ProviderStatusBadge({ status }: ProviderStatusBadgeProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const getStatusStyles = () => {
    const baseStyles = `
      inline-flex items-center justify-center
      min-w-[120px] px-3 py-1 text-xs font-medium
      rounded-full backdrop-blur-sm border
      transition-all duration-200
      bg-gradient-glossy
      shadow-glow hover:shadow-glow-hover
    `;
    
    switch (status) {
      case 'active':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-mint-400/10 border-ron-mint-400/20 text-ron-mint-200'
            : 'bg-ron-mint-50 border-ron-mint-200 text-ron-mint-700'
        }`;
      case 'pending':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-lime-400/10 border-ron-lime-400/20 text-ron-lime-200'
            : 'bg-ron-lime-50 border-ron-lime-200 text-ron-lime-700'
        }`;
      case 'inactive':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-coral-400/10 border-ron-coral-400/20 text-ron-coral-200'
            : 'bg-ron-coral-50 border-ron-coral-200 text-ron-coral-700'
        }`;
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-3.5 h-3.5 mr-1.5" />;
      case 'pending':
        return <Clock className="w-3.5 h-3.5 mr-1.5" />;
      case 'inactive':
        return <XCircle className="w-3.5 h-3.5 mr-1.5" />;
    }
  };

  return (
    <span className={getStatusStyles()}>
      {getIcon()}
      {status.toUpperCase()}
    </span>
  );
}