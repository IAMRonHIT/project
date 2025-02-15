import React, { useState, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Badge } from '../../../../../components/Badge';
import { NavigationRibbon } from '../NavigationRibbon';
import { PredictiveInsights } from './PredictiveInsights';
import { KeyMetrics } from './KeyMetrics';
import { JourneyTimeline } from './JourneyTimeline';
import { mockCareJourneyData } from './mockData';
import { JourneyType } from './types';

interface OverviewProps extends Readonly<{
  careJourneyId?: string;
}> {}

interface CardWrapperProps extends Readonly<{
  children: ReactNode;
  className?: string;
}> {}

interface SectionTitleProps extends Readonly<{
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}> {}

type AlertType = 'High' | 'Medium' | 'Low';

interface JourneyHeaderProps extends Readonly<{
  type: JourneyType;
  diagnosis: string;
  duration: string;
  phase: string;
  severity: number;
  careTeam: ReadonlyArray<{ role: string; name: string }>;
}> {}

function JourneyHeader({ type, diagnosis, duration, phase, severity, careTeam }: JourneyHeaderProps) {
  const [isDark] = useState(document.documentElement.classList.contains('dark'));

  const getTypeColor = () => {
    switch (type) {
      case 'Chronic':
        return isDark ? 'text-[#CCFF00]' : 'text-ron-primary';
      case 'Acute':
        return isDark ? 'text-ron-coral-200' : 'text-ron-coral-600';
      case 'Injury':
        return isDark ? 'text-ron-lime-200' : 'text-ron-lime-600';
      case 'Mental Health':
        return isDark ? 'text-ron-teal-200' : 'text-ron-teal-600';
    }
  };

  const getSeverityColor = () => {
    if (severity >= 75) return 'bg-ron-coral-500';
    if (severity >= 50) return 'bg-ron-lime-500';
    return 'bg-ron-mint-500';
  };

  return (
    <div className={`p-6 ${isDark ? 'bg-white/5' : 'bg-white'} border ${
      isDark ? 'border-white/10' : 'border-ron-divider'
    } rounded-xl`}>
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="info" size="sm" className={getTypeColor()}>
              {type}
            </Badge>
            <div className={`h-1.5 w-1.5 rounded-full ${isDark ? 'bg-white/20' : 'bg-dark-gun-metal/20'}`} />
            <span className={isDark ? 'text-white/60' : 'text-dark-gun-metal/60'}>
              {duration}
            </span>
          </div>
          
          <div>
            <h2 className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-dark-gun-metal'
            }`}>
              {diagnosis}
            </h2>
            <p className={`mt-1 ${
              isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
            }`}>
              {phase}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <p className={`text-sm ${
                isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
              }`}>
                Severity
              </p>
              <div className="mt-1 flex items-center gap-2">
                <div className="w-24 h-2 rounded-full bg-black/10 dark:bg-white/10">
                  <div 
                    className={`h-full rounded-full ${getSeverityColor()} transition-all duration-300`}
                    style={{ width: `${severity}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{severity}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <p className={`text-sm mb-2 ${
            isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
          }`}>
            Care Team
          </p>
          <div className="flex flex-wrap gap-2">
            {careTeam.map((member) => (
              <div
                key={`${member.role}-${member.name}`}
                className={`px-3 py-1.5 rounded-lg ${
                  isDark 
                    ? 'bg-white/5 text-white' 
                    : 'bg-dark-gun-metal/5 text-dark-gun-metal'
                }`}
              >
                <p className="text-sm font-medium">{member.name}</p>
                <p className={`text-xs ${
                  isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                }`}>
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Overview() {
  const [isDark] = useState(document.documentElement.classList.contains('dark'));
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={isDark ? 'text-white' : 'text-dark-gun-metal'}>
      <NavigationRibbon activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="max-w-screen-2xl mx-auto p-6 space-y-6">
        <JourneyHeader {...mockCareJourneyData.header} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PredictiveInsights predictions={mockCareJourneyData.predictions} />
          <KeyMetrics metrics={mockCareJourneyData.metrics} />
        </div>

        <JourneyTimeline 
          events={mockCareJourneyData.timeline} 
          currentDate={new Date().toISOString().split('T')[0]} 
        />
      </div>
    </div>
  );
}
