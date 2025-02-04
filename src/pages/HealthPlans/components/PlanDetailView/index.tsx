import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../../../hooks/useTheme';
import type { HealthPlan } from '../../types';
import { PlanOverviewTab } from './PlanOverviewTab';
import { PriorAuthTab } from './PriorAuthTab';
import { AppealsTab } from './AppealsTab';
import { ClaimsTab } from './ClaimsTab';

type TabType = 'overview' | 'prior-auth' | 'appeals' | 'claims';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, isActive, onClick }: TabButtonProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium
        transition-all duration-200
        ${isActive
          ? `${isDark ? 'bg-ron-teal-400/20' : 'bg-cyan-50'} 
             ${isDark ? 'text-ron-teal-400' : 'text-cyan-700'} 
             shadow-glow-teal`
          : `${isDark ? 'text-gray-400' : 'text-gray-600'} 
             hover:text-white hover:bg-ron-teal-400/5`
        }
        border border-transparent
        hover:border-ron-teal-400/20
      `}
    >
      {label}
    </button>
  );
}

interface PlanDetailViewProps {
  plan: HealthPlan;
  onClose: () => void;
}

export function PlanDetailView({ plan, onClose }: PlanDetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const tabs: Array<{ type: TabType; label: string }> = [
    { type: 'overview', label: 'Overview' },
    { type: 'prior-auth', label: 'Prior Authorization' },
    { type: 'appeals', label: 'Appeals' },
    { type: 'claims', label: 'Claims' }
  ];

  return (
    <div className={`
      fixed inset-0 z-50
      flex items-center justify-center
      p-4 md:p-8
      bg-black/50 backdrop-blur-sm
    `}>
      <div className={`
        w-full max-w-6xl max-h-[90vh]
        rounded-xl
        ${isDark ? 'bg-black' : 'bg-white'}
        border border-ron-teal-400/20
        shadow-2xl
        overflow-hidden
        relative
      `}>
        {/* Header */}
        <div className={`
          p-6 border-b
          ${isDark ? 'border-ron-teal-400/20' : 'border-gray-200'}
          sticky top-0 z-10
          ${isDark ? 'bg-black' : 'bg-white'}
        `}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {plan.logo && (
                <img 
                  src={plan.logo} 
                  alt={`${plan.name} logo`}
                  className="w-12 h-12 rounded-lg object-contain"
                />
              )}
              <div>
                <h2 className={`
                  text-2xl font-bold mb-1
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}>
                  {plan.name}
                </h2>
                <span className={`
                  inline-block px-3 py-1 rounded-full text-sm
                  ${isDark 
                    ? 'bg-ron-teal-400/10 text-ron-teal-400' 
                    : 'bg-cyan-50 text-cyan-700'
                  }
                  border border-ron-teal-400/20
                `}>
                  {plan.type}
                </span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className={`
                p-2 rounded-lg
                transition-all duration-200
                ${isDark 
                  ? 'hover:bg-ron-teal-400/10 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }
              `}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex space-x-2">
            {tabs.map(tab => (
              <TabButton
                key={tab.type}
                label={tab.label}
                isActive={activeTab === tab.type}
                onClick={() => setActiveTab(tab.type)}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && <PlanOverviewTab plan={plan} />}
          {activeTab === 'prior-auth' && <PriorAuthTab plan={plan} />}
          {activeTab === 'appeals' && <AppealsTab plan={plan} />}
          {activeTab === 'claims' && <ClaimsTab plan={plan} />}
        </div>
      </div>
    </div>
  );
}