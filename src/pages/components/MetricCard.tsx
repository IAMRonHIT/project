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
  const Icon = iconMap[icon];

  return (
    <div className="group relative bg-white dark:bg-ron-dark-surface backdrop-blur-xl rounded-xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 border border-ron-divider">
      <div className="flex items-center justify-between">
        <div className="relative">
          <div className="p-2 rounded-lg bg-ron-primary/10 dark:bg-[#CCFF00]/20">
            <Icon className="w-6 h-6 text-ron-primary dark:text-[#CCFF00] transition-transform duration-300 group-hover:scale-110" />
          </div>
        </div>
        {trend && (
          <span className={`text-sm font-medium ${
            trend.isPositive ? 'text-ron-success' : 'text-ron-error'
          }`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium text-ron-dark-navy dark:text-white">
            {title}
          </h3>
        </div>
        <p className="mt-2 text-2xl font-semibold text-ron-dark-navy dark:text-white tracking-tight">
          {value}
        </p>
        {description && (
          <p className="mt-2 text-sm text-ron-dark-navy/60 dark:text-white/60">
            {description}
          </p>
        )}
      </div>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-ron-primary/0 via-ron-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}