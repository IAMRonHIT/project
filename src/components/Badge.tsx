import React, { memo } from 'react';

interface BadgeProps extends Readonly<{
  variant: 'success' | 'warning' | 'error' | 'info' | 'default';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  onClick?: () => void;
}> {}

export const Badge = memo(function Badge({ 
  variant = 'default', 
  children, 
  className = '', 
  icon,
  size = 'md',
  onClick
}: BadgeProps) {
  const getBaseStyles = () => {
    const sizeStyles = size === 'sm' 
      ? 'min-w-[100px] px-2 py-0.5 text-xs'
      : 'min-w-[120px] px-3 py-1 text-sm';

    return `
      inline-flex items-center justify-center
      ${sizeStyles} font-medium
      rounded-full backdrop-blur-xl
      transition-all duration-200
      bg-black bg-gradient-glossy
      border border-white/10
      text-white/90
    `;
  };

  const getGlowStyles = () => {
    switch (variant) {
      case 'success':
        return 'shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]';
      case 'warning':
        return 'shadow-[0_0_15px_rgba(255,171,0,0.3)] hover:shadow-[0_0_20px_rgba(255,171,0,0.5)]';
      case 'error':
        return 'shadow-[0_0_15px_rgba(255,86,86,0.3)] hover:shadow-[0_0_20px_rgba(255,86,86,0.5)]';
      case 'info':
        return 'shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]';
      default:
        return 'shadow-[0_0_15px_rgba(156,163,175,0.3)] hover:shadow-[0_0_20px_rgba(156,163,175,0.5)]';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'success':
        return 'text-[#00F0FF]';
      case 'warning':
        return 'text-[#FFAB00]';
      case 'error':
        return 'text-[#FF5656]';
      case 'info':
        return 'text-[#6366F1]';
      default:
        return 'text-gray-400';
    }
  };

  const Element = onClick ? 'button' : 'span';
  const interactiveProps = onClick ? {
    onClick,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
    role: 'button',
    tabIndex: 0,
  } : {};

  return (
    <Element 
      className={`${getBaseStyles()} ${getGlowStyles()} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      {...interactiveProps}
    >
      {icon && <span className={`mr-1.5 ${getIconColor()}`} aria-hidden="true">{icon}</span>}
      {typeof children === 'string' ? children.toUpperCase() : children}
    </Element>
  );
});
