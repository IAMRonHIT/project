import React from 'react';
import { Activity, Users, Clock, FileCheck2, Brain, Zap } from 'lucide-react';

const iconMap = {
  Activity,
  Users,
  Clock,
  FileCheck2,
  Brain,
  Zap,
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: keyof typeof iconMap;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isPriority?: boolean;
  description?: string;
}

export function MetricCard({ 
  title, 
  value, 
  icon,
  trend, 
  isPriority,
  description 
}: MetricCardProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));
  const Icon = iconMap[icon];

  return (
    <div className={`
      group relative rounded-xl p-6 
      ${isDark ? 'bg-white/5' : 'bg-white'} 
      backdrop-blur-xl border border-ron-divider
      shadow-soft hover:shadow-glow
      transition-all duration-300
    `}>
      <div className="flex items-center justify-between">
        <div className="relative">
          <div className={`
            p-2 rounded-lg 
            ${isDark ? 'bg-ron-mint-200/10' : 'bg-ron-mint-50'}
          `}>
            <Icon className={`
              w-6 h-6 
              ${isDark ? 'text-ron-mint-200' : 'text-ron-mint-600'}
              transition-transform duration-300 group-hover:scale-110
            `} />
          </div>
        </div>
        {trend && (
          <span className={`
            text-sm font-medium
            ${trend.isPositive 
              ? isDark ? 'text-ron-mint-200' : 'text-ron-mint-600'
              : isDark ? 'text-ron-coral-200' : 'text-ron-coral-600'
            }
          `}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <h3 className={`
            text-base font-medium
            ${isDark ? 'text-white' : 'text-ron-dark-navy'}
          `}>
            {title}
          </h3>
        </div>
        <p className={`
          mt-2 text-2xl font-semibold tracking-tight
          ${isDark ? 'text-white' : 'text-ron-dark-navy'}
        `}>
          {value}
        </p>
        {description && (
          <p className={`
            mt-2 text-sm
            ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}
          `}>
            {description}
          </p>
        )}
      </div>
      <div className="
        absolute inset-0 rounded-xl 
        bg-gradient-glossy from-ron-mint-200/5 via-transparent to-transparent 
        opacity-0 group-hover:opacity-100 
        transition-opacity duration-300
      " />
    </div>
  );
}