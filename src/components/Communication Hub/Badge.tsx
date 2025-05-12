import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  glow = false
}) => {
  // Mapping variants to colors
  const variantStyles = {
    success: 'bg-green-900/50 text-green-300 border-green-500/30',
    warning: 'bg-amber-900/50 text-amber-300 border-amber-500/30',
    error: 'bg-red-900/50 text-red-300 border-red-500/30',
    info: 'bg-blue-900/50 text-blue-300 border-blue-500/30',
    default: 'bg-indigo-900/50 text-indigo-300 border-indigo-500/30'
  };

  // Size variants
  const sizeStyles = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-2.5',
    lg: 'py-1.5 px-3'
  };

  // Glow effect based on variant
  const glowStyles = glow ? {
    success: 'shadow-[0_0_10px_rgba(34,197,94,0.3)]',
    warning: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]',
    error: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]',
    info: 'shadow-[0_0_10px_rgba(59,130,246,0.3)]',
    default: 'shadow-[0_0_10px_rgba(99,102,241,0.3)]'
  } : {
    success: '',
    warning: '',
    error: '',
    info: '',
    default: ''
  };

  return (
    <span className={`
      inline-flex items-center justify-center 
      rounded-full 
      whitespace-nowrap
      border
      font-medium
      ${variantStyles[variant]} 
      ${sizeStyles[size]}
      ${glowStyles[variant]}
      transition-all duration-200
    `}>
      {children}
    </span>
  );
};

export default Badge;