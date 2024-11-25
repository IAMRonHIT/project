import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  className?: string;
  badge?: number;
}

export function NavItem({ 
  icon: Icon, 
  label, 
  to, 
  className = '',
  badge 
}: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        flex items-center p-3 
        ${isActive 
          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
        transition-all duration-200
        rounded-lg
        relative
        ${className}
      `}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="flex-1 text-sm font-medium">{label}</span>
      
      {badge !== undefined && (
        <span className="
          absolute top-1 right-1 
          bg-red-500 text-white 
          text-xs font-bold 
          rounded-full 
          w-5 h-5 
          flex items-center justify-center
        ">
          {badge}
        </span>
      )}
    </Link>
  );
}