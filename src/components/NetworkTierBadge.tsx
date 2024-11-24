import React from 'react';
import { Star, Shield, Award } from 'lucide-react';

interface NetworkTierBadgeProps {
  tier: 'preferred' | 'standard' | 'specialty';
}

export function NetworkTierBadge({ tier }: NetworkTierBadgeProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const getTierStyles = () => {
    const baseStyles = `
      inline-flex items-center justify-center
      min-w-[140px] px-3 py-1 text-xs font-medium
      rounded-full backdrop-blur-sm border
      transition-all duration-200
      bg-gradient-glossy
      shadow-glow hover:shadow-glow-hover
    `;
    
    switch (tier) {
      case 'preferred':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-mint-400/10 border-ron-mint-400/20 text-ron-mint-200'
            : 'bg-ron-mint-50 border-ron-mint-200 text-ron-mint-700'
        }`;
      case 'specialty':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-lime-400/10 border-ron-lime-400/20 text-ron-lime-200'
            : 'bg-ron-lime-50 border-ron-lime-200 text-ron-lime-700'
        }`;
      case 'standard':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-teal-400/10 border-ron-teal-400/20 text-ron-teal-200'
            : 'bg-ron-teal-50 border-ron-teal-200 text-ron-teal-700'
        }`;
    }
  };

  const getIcon = () => {
    switch (tier) {
      case 'preferred':
        return <Star className="w-3.5 h-3.5 mr-1.5" />;
      case 'specialty':
        return <Award className="w-3.5 h-3.5 mr-1.5" />;
      case 'standard':
        return <Shield className="w-3.5 h-3.5 mr-1.5" />;
    }
  };

  return (
    <span className={getTierStyles()}>
      {getIcon()}
      {tier.toUpperCase()}
    </span>
  );
}