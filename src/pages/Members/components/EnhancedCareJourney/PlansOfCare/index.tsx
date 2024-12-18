import React, { useState } from 'react';
import { FileText, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '../../../../../components/Badge';

export interface PlansOfCareProps {
  careJourneyId: string;
}

export function PlansOfCare({ careJourneyId }: PlansOfCareProps) {
  const [isDark] = useState(document.documentElement.classList.contains('dark'));

  // Mock data for care plans
  const carePlans = [
    {
      id: 'CP001',
      title: 'Cardiac Rehabilitation Plan',
      startDate: '2024-03-01',
      endDate: '2024-06-01',
      status: 'Active',
      progress: 35,
      provider: 'Dr. Sarah Johnson',
      goals: [
        'Improve cardiovascular endurance',
        'Reduce blood pressure to target range',
        'Maintain medication adherence above 90%'
      ],
      lastUpdated: '2024-03-15'
    },
    {
      id: 'CP002',
      title: 'Medication Management',
      startDate: '2024-03-01',
      endDate: '2024-09-01',
      status: 'Active',
      progress: 40,
      provider: 'Dr. Michael Chen',
      goals: [
        'Optimize beta blocker dosage',
        'Monitor side effects',
        'Regular blood pressure checks'
      ],
      lastUpdated: '2024-03-14'
    },
    {
      id: 'CP003',
      title: 'Lifestyle Modification Plan',
      startDate: '2024-03-05',
      endDate: '2024-06-05',
      status: 'Active',
      progress: 25,
      provider: 'Sarah Wilson, RD',
      goals: [
        'Implement low-sodium diet',
        'Establish exercise routine',
        'Stress management techniques'
      ],
      lastUpdated: '2024-03-12'
    }
  ];

  const getProgressVariant = (progress: number) => {
    if (progress >= 75) return 'success';
    if (progress >= 40) return 'warning';
    return 'info';
  };

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-ron-dark-navy'}`}>
        Active Care Plans
      </h3>

      <div className="grid grid-cols-1 gap-6">
        {carePlans.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-ron-divider'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className={`text-lg font-medium mb-1 ${
                  isDark ? 'text-white' : 'text-ron-dark-navy'
                }`}>
                  {plan.title}
                </h4>
                <div className="flex items-center gap-4">
                  <Badge variant="success" size="sm" glow>
                    {plan.status}
                  </Badge>
                  <span className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                  }`}>
                    Updated {plan.lastUpdated}
                  </span>
                </div>
              </div>
              <Badge 
                variant={getProgressVariant(plan.progress)} 
                size="sm" 
                glow
              >
                {plan.progress}% Complete
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                }`}>
                  Duration
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className={`w-4 h-4 ${
                    isDark ? 'text-[#CCFF00]' : 'text-ron-primary'
                  }`} />
                  <span className={isDark ? 'text-white' : 'text-ron-dark-navy'}>
                    {plan.startDate} - {plan.endDate}
                  </span>
                </div>
              </div>
              <div>
                <label className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                }`}>
                  Provider
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <FileText className={`w-4 h-4 ${
                    isDark ? 'text-[#CCFF00]' : 'text-ron-primary'
                  }`} />
                  <span className={isDark ? 'text-white' : 'text-ron-dark-navy'}>
                    {plan.provider}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className={`text-sm ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`}>
                Goals & Objectives
              </label>
              <ul className="mt-2 space-y-2">
                {plan.goals.map((goal, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className={`mt-1 w-1.5 h-1.5 rounded-full ${
                      isDark ? 'bg-[#CCFF00]' : 'bg-ron-primary'
                    }`} />
                    <span className={`text-sm ${
                      isDark ? 'text-white/80' : 'text-ron-dark-navy/80'
                    }`}>
                      {goal}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
