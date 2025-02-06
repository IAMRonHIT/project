import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const { theme } = useTheme();
  
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  
  const variantClasses = {
    default: theme === 'dark' 
      ? 'bg-gray-800 text-gray-300'
      : 'bg-gray-100 text-gray-900',
    success: theme === 'dark'
      ? 'bg-green-900/30 text-green-400'
      : 'bg-green-100 text-green-800',
    warning: theme === 'dark'
      ? 'bg-yellow-900/30 text-yellow-400'
      : 'bg-yellow-100 text-yellow-800',
    error: theme === 'dark'
      ? 'bg-red-900/30 text-red-400'
      : 'bg-red-100 text-red-800',
    info: theme === 'dark'
      ? 'bg-blue-900/30 text-blue-400'
      : 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}