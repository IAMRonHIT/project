import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function DashboardCard({ title, value, description, icon: Icon, trend }: DashboardCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`
      ${isDark ? 'bg-black' : 'bg-white'} 
      backdrop-blur-xl rounded-xl p-6 
      shadow-soft hover:shadow-glow 
      transition-all duration-300 
      relative overflow-hidden 
      border ${isDark ? 'border-white/10' : 'border-ron-divider'}
    `}>
      <div className="absolute inset-0 bg-gradient-glossy from-violet-400/5 via-transparent to-transparent" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className={`
            p-2 rounded-lg 
            ${isDark ? 'bg-black/50' : 'bg-ron-primary/10'}
          `}>
            <Icon className={`
              w-5 h-5
              ${isDark ? 'text-white' : 'text-ron-primary'}
            `} />
          </div>
          <h3 className={`
            font-medium
            ${isDark ? 'text-white' : 'text-black'}
          `}>
            {title}
          </h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-end gap-3">
            <span className={`
              text-2xl font-bold
              ${isDark ? 'text-white' : 'text-black'}
            `}>
              {value}
            </span>
            {trend && (
              <span className={`
                text-sm font-medium mb-1
                ${trend.isPositive ? 'text-green-400' : 'text-red-400'}
              `}>
                {trend.isPositive ? '+' : '-'}{trend.value}%
              </span>
            )}
          </div>
          <p className={`
            text-sm
            ${isDark ? 'text-white/60' : 'text-black/60'}
          `}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
