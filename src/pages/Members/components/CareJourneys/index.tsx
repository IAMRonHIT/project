import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertCircle, ArrowUpRight, Heart, Scale, Apple, Stethoscope } from 'lucide-react';

interface CareJourney {
  id: string;
  title: string;
  icon: any;
  startDate: string;
  status: 'active' | 'completed' | 'on-hold';
  primaryCondition: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  lastUpdated: string;
  metrics: {
    reviews: number;
    activePlans: number;
    claims: number;
    communications: number;
  };
}

const mockCareJourneys: CareJourney[] = [
  {
    id: 'CJ-001',
    title: 'Diabetes Management',
    icon: Activity,
    startDate: '2024-01-15',
    status: 'active',
    primaryCondition: 'Type 2 Diabetes',
    riskLevel: 'High',
    lastUpdated: '2024-03-15',
    metrics: {
      reviews: 8,
      activePlans: 3,
      claims: 12,
      communications: 25
    }
  },
  {
    id: 'CJ-002',
    title: 'Hypertension Control',
    icon: Heart,
    startDate: '2024-02-01',
    status: 'active',
    primaryCondition: 'Hypertension',
    riskLevel: 'Medium',
    lastUpdated: '2024-03-14',
    metrics: {
      reviews: 5,
      activePlans: 2,
      claims: 8,
      communications: 15
    }
  },
  {
    id: 'CJ-003',
    title: 'Weight Management',
    icon: Scale,
    startDate: '2024-02-15',
    status: 'active',
    primaryCondition: 'Obesity',
    riskLevel: 'Medium',
    lastUpdated: '2024-03-13',
    metrics: {
      reviews: 4,
      activePlans: 2,
      claims: 6,
      communications: 12
    }
  },
  {
    id: 'CJ-004',
    title: 'Cardiac Rehabilitation',
    icon: Heart,
    startDate: '2024-01-30',
    status: 'active',
    primaryCondition: 'Coronary Artery Disease',
    riskLevel: 'High',
    lastUpdated: '2024-03-15',
    metrics: {
      reviews: 10,
      activePlans: 4,
      claims: 15,
      communications: 30
    }
  },
  {
    id: 'CJ-005',
    title: 'Nutrition Counseling',
    icon: Apple,
    startDate: '2024-02-10',
    status: 'active',
    primaryCondition: 'Dietary Management',
    riskLevel: 'Low',
    lastUpdated: '2024-03-12',
    metrics: {
      reviews: 3,
      activePlans: 1,
      claims: 4,
      communications: 8
    }
  }
];

export function CareJourneys() {
  const [isDark] = useState(document.documentElement.classList.contains('dark'));
  const navigate = useNavigate();

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return isDark ? 'text-red-400 bg-red-400/10' : 'text-red-500 bg-red-50';
      case 'medium':
        return isDark ? 'text-amber-400 bg-amber-400/10' : 'text-amber-500 bg-amber-50';
      case 'low':
        return isDark ? 'text-emerald-400 bg-emerald-400/10' : 'text-emerald-500 bg-emerald-50';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      {mockCareJourneys.map((journey) => {
        const Icon = journey.icon;
        return (
          <div
            key={journey.id}
            onClick={() => navigate(`journey/${journey.id}`)}
            className={`p-6 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-white/5 border-white/10 hover:bg-white/10'
                : 'bg-white border-ron-divider hover:border-ron-primary/20'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-white/10' : 'bg-ron-primary/10'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isDark ? 'text-[#CCFF00]' : 'text-ron-primary'
                  }`} />
                </div>
                <div>
                  <h3 className={`text-lg font-medium mb-1 ${
                    isDark ? 'text-white' : 'text-ron-dark-navy'
                  }`}>{journey.title}</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-2 py-0.5 text-sm rounded-full ${
                      isDark ? 'bg-emerald-400/10 text-emerald-400' : 'bg-emerald-50 text-emerald-500'
                    }`}>
                      {journey.status.charAt(0).toUpperCase() + journey.status.slice(1)}
                    </span>
                    <span className={`text-sm ${
                      isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                    }`}>
                      Started {journey.startDate}
                    </span>
                    <span className={`px-2 py-0.5 text-sm rounded-full ${getRiskLevelColor(journey.riskLevel)}`}>
                      {journey.riskLevel} Risk
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className={`text-sm mb-1 ${
                        isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                      }`}>Reviews</p>
                      <p className={`text-2xl font-semibold ${
                        isDark ? 'text-white' : 'text-ron-dark-navy'
                      }`}>{journey.metrics.reviews}</p>
                    </div>
                    <div>
                      <p className={`text-sm mb-1 ${
                        isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                      }`}>Active Plans</p>
                      <p className={`text-2xl font-semibold ${
                        isDark ? 'text-white' : 'text-ron-dark-navy'
                      }`}>{journey.metrics.activePlans}</p>
                    </div>
                    <div>
                      <p className={`text-sm mb-1 ${
                        isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                      }`}>Claims</p>
                      <p className={`text-2xl font-semibold ${
                        isDark ? 'text-white' : 'text-ron-dark-navy'
                      }`}>{journey.metrics.claims}</p>
                    </div>
                    <div>
                      <p className={`text-sm mb-1 ${
                        isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                      }`}>Communications</p>
                      <p className={`text-2xl font-semibold ${
                        isDark ? 'text-white' : 'text-ron-dark-navy'
                      }`}>{journey.metrics.communications}</p>
                    </div>
                  </div>
                </div>
              </div>
              <button className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-ron-primary/10'
              }`}>
                <ArrowUpRight className={`w-5 h-5 ${
                  isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                }`} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}