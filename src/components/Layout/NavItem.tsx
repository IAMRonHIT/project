import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Badge } from '../Badge';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  className?: string;
  badge?: number;
  collapsed?: boolean;
}

export function NavItem({ 
  icon: Icon, 
  label, 
  to, 
  className = '',
  badge,
  collapsed = false
}: NavItemProps) {
  const location = useLocation();
  const { theme } = useTheme();
  const themeStyles = theme === 'dark'
    ? 'bg-dark text-light'
    : 'bg-light text-dark';
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        flex items-center p-3
        ${themeStyles}
        ${isActive 
          ? 'bg-ron-teal-400/20 text-white shadow-glow-teal' 
          : 'text-gray-400 hover:text-white'}
        transition-all duration-200
        rounded-lg
        relative
        ${className}
      `}
    >
      <div className={`
        flex items-center justify-center
        ${collapsed ? 'w-full' : 'w-auto'}
        transition-all duration-200
      `}>
        <Icon className={`
          w-5 h-5
          ${collapsed ? 'mr-0' : 'mr-3'}
          transition-all duration-200
          ${isActive ? 'text-ron-teal-400' : ''}
        `} />
      </div>
      
      {!collapsed && (
        <span className={`
          flex-1 text-sm font-medium
          transition-all duration-200
          ${isActive ? 'text-white' : ''}
        `}>
          {label}
        </span>
      )}
      
      {badge !== undefined && (
        <div className={`
          absolute
          ${collapsed ? 'top-0 right-0' : 'top-1 right-1'}
          transition-all duration-200
        `}>
          <Badge
            variant="error"
            size="sm"
            glow
          >
            {badge}
          </Badge>
        </div>
      )}

      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className={`
          absolute left-full ml-2 px-2 py-1 
          min-w-max rounded-lg
          "bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10"-900/90 backdrop-blur-sm
          border border-ron-teal-400/20
          text-white text-sm
          opacity-0 group-hover:opacity-100
          pointer-events-none
          transition-all duration-200
          z-50
        `}>
          {label}
          {badge !== undefined && (
            <span className="ml-1 text-xs text-ron-coral-400">
              ({badge})
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
