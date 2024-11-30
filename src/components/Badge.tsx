import React from 'react';

interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'default';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  glow?: boolean;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export function Badge({ 
  variant = 'default', 
  children, 
  className = '', 
  icon, 
  glow = false,
  size = 'md',
  onClick
}: BadgeProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const getSizeStyles = () => {
    return size === 'sm' 
      ? 'px-2 py-0.5 text-xs'
      : 'px-3 py-1 text-sm';
  };

  const getVariantStyles = () => {
    const baseStyles = `
      inline-flex items-center justify-center
      ${getSizeStyles()}
      font-medium rounded-full 
      backdrop-blur-sm border 
      transition-all duration-200
      bg-gradient-glossy
      ${glow ? 'shadow-glow hover:shadow-glow-hover' : ''}
      ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
    `;
    
    switch (variant) {
      case 'success':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-teal-400/10 border-ron-teal-400/20 text-ron-teal-200'
            : 'bg-ron-teal-50 border-ron-teal-200 text-ron-teal-700'
        }`;
      case 'warning':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-lime-400/10 border-ron-lime-400/20 text-ron-lime-200'
            : 'bg-ron-lime-50 border-ron-lime-200 text-ron-lime-700'
        }`;
      case 'error':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-coral-400/10 border-ron-coral-400/20 text-ron-coral-200'
            : 'bg-ron-coral-50 border-ron-coral-200 text-ron-coral-700'
        }`;
      case 'info':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-teal-400/10 border-ron-teal-400/20 text-ron-teal-200'
            : 'bg-ron-teal-50 border-ron-teal-200 text-ron-teal-700'
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
    <span 
      className={`${getVariantStyles()} ${className}`}
      onClick={onClick}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
}
