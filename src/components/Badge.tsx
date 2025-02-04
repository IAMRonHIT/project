import React, { memo } from 'react';

interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'default';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  glow?: boolean;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export const Badge = memo(function Badge({ 
  variant = 'default', 
  children, 
  className = '', 
  icon, 
  glow = false,
  size = 'md',
  onClick
}: BadgeProps) {
  const baseClasses = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    glow ? 'shadow-glow hover:shadow-glow-hover' : '',
    onClick ? 'cursor-pointer hover:scale-[1.02]' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <span 
      className={baseClasses}
      onClick={onClick}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
});
