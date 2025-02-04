import React from 'react';
import { useTheme } from '../../../hooks/useTheme';
import { PlanCard } from './PlanCard';
import type { HealthPlan } from '../types';

interface PlansListProps {
  plans: HealthPlan[];
  onPlanSelect: (plan: HealthPlan) => void;
  isLoading?: boolean;
}

export function PlansList({ plans, onPlanSelect, isLoading = false }: PlansListProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`
              h-64 rounded-xl
              animate-pulse
              ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}
            `}
          />
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className={`
        flex flex-col items-center justify-center
        p-12 rounded-xl
        ${isDark 
          ? 'bg-black/50 border border-ron-teal-400/20' 
          : 'bg-white/50 border border-gray-200'
        }
        backdrop-blur-xl
      `}>
        <p className={`
          text-lg font-medium mb-2
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}>
          No health plans found
        </p>
        <p className={`
          text-sm
          ${isDark ? 'text-gray-400' : 'text-gray-600'}
        `}>
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map(plan => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onClick={() => onPlanSelect(plan)}
        />
      ))}
    </div>
  );
}