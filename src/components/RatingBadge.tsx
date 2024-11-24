import React from 'react';
import { Star } from 'lucide-react';

interface RatingBadgeProps {
  rating: number;
}

export function RatingBadge({ rating }: RatingBadgeProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const getStyles = () => {
    const baseStyles = `
      inline-flex items-center justify-center
      min-w-[100px] px-3 py-1 text-xs font-medium
      rounded-full backdrop-blur-sm border
      transition-all duration-200
      bg-gradient-glossy
      shadow-glow hover:shadow-glow-hover
    `;
    
    if (rating >= 4.5) {
      return `${baseStyles} ${
        isDark 
          ? 'bg-ron-mint-400/10 border-ron-mint-400/20 text-ron-mint-200'
          : 'bg-ron-mint-50 border-ron-mint-200 text-ron-mint-700'
      }`;
    } else if (rating >= 4.0) {
      return `${baseStyles} ${
        isDark 
          ? 'bg-ron-lime-400/10 border-ron-lime-400/20 text-ron-lime-200'
          : 'bg-ron-lime-50 border-ron-lime-200 text-ron-lime-700'
      }`;
    } else {
      return `${baseStyles} ${
        isDark 
          ? 'bg-ron-teal-400/10 border-ron-teal-400/20 text-ron-teal-200'
          : 'bg-ron-teal-50 border-ron-teal-200 text-ron-teal-700'
      }`;
    }
  };

  return (
    <span className={getStyles()}>
      <Star className="w-3.5 h-3.5 mr-1.5 fill-current" />
      {rating.toFixed(1)}
    </span>
  );
}