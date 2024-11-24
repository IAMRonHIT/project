import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  to?: string;
}

export function NavItem({ icon: Icon, label, to = '#' }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive 
          ? 'bg-white/10 text-white' 
          : 'text-white/80 hover:bg-white/10 hover:text-white'
      }`}
    >
      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}