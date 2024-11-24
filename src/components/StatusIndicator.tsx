import React from 'react';

interface StatusIndicatorProps {
  status: 'active' | 'pending' | 'completed' | 'inactive';
  size?: 'sm' | 'md';
  glow?: boolean;
}

export function StatusIndicator({ status, size = 'md', glow = false }: StatusIndicatorProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const getSizeStyles = () => {
    return size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : 'px-3 py-1 text-sm';
  };

  const getStatusStyles = () => {
    const baseStyles = `
      inline-flex items-center rounded-full 
      ${getSizeStyles()}
      font-medium backdrop-blur-sm border 
      transition-all duration-200
      bg-gradient-glossy
      ${glow ? 'shadow-glow hover:shadow-glow-hover' : ''}
    `;

    switch (status) {
      case 'active':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-teal-400/10 border-ron-teal-400/20 text-ron-teal-200'
            : 'bg-ron-teal-50 border-ron-teal-200 text-ron-teal-700'
        }`;
      case 'pending':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-lime-400/10 border-ron-lime-400/20 text-ron-lime-200'
            : 'bg-ron-lime-50 border-ron-lime-200 text-ron-lime-700'
        }`;
      case 'completed':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-teal-400/10 border-ron-teal-400/20 text-ron-teal-200'
            : 'bg-ron-teal-50 border-ron-teal-200 text-ron-teal-700'
        }`;
      case 'inactive':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-coral-400/10 border-ron-coral-400/20 text-ron-coral-200'
            : 'bg-ron-coral-50 border-ron-coral-200 text-ron-coral-700'
        }`;
      default:
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-teal-400/10 border-ron-teal-400/20 text-ron-teal-200'
            : 'bg-ron-teal-50 border-ron-teal-200 text-ron-teal-700'
        }`;
    }
  };

  const getStatusDot = () => {
    switch (status) {
      case 'active':
        return 'bg-ron-teal-400';
      case 'pending':
        return 'bg-ron-lime-400';
      case 'completed':
        return 'bg-ron-teal-400';
      case 'inactive':
        return 'bg-ron-coral-400';
      default:
        return 'bg-ron-teal-400';
    }
  };

  return (
    <span className={`${getStatusStyles()} hover:scale-[1.02]`}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${getStatusDot()}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}