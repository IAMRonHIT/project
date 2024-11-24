import React, { useState } from 'react';
import { Activity, Heart, AlertCircle, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CareJourneysTable } from './components/CareJourneysTable';

export function Member360View() {
  const navigate = useNavigate();
  const [isDark] = useState(document.documentElement.classList.contains('dark'));

  const metrics = [
    {
      title: 'Risk Score',
      value: '41.13',
      trend: { value: 3.2, isPositive: true },
      icon: Heart,
      color: 'emerald',
      details: '▼ 3.2% from last month'
    },
    {
      title: 'Care Timeline',
      value: '6 mo',
      icon: Clock,
      color: 'blue',
      details: '2 upcoming appointments'
    },
    {
      title: 'Activity Level',
      value: 'High',
      icon: Activity,
      color: 'purple',
      details: 'Daily monitoring active'
    },
    {
      title: 'Alerts',
      value: '2',
      icon: AlertCircle,
      color: 'amber',
      details: '1 requires attention'
    }
  ];

  const handleJourneyClick = (journeyId: string) => {
    // Handle journey click - can be expanded later to show detailed view
    console.log('Journey clicked:', journeyId);
  };

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <div className={`${
        isDark
          ? 'bg-white/5 backdrop-blur-xl border-white/10'
          : 'bg-white border-ron-divider'
      } mb-6 rounded-xl shadow-soft`}>
        <div className="p-6">
          <button
            onClick={() => navigate('/members')}
            className={`flex items-center gap-2 mb-4 ${
              isDark ? 'text-white/60 hover:text-white' : 'text-ron-dark-navy/60 hover:text-ron-dark-navy'
            } transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Members</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className={`text-3xl font-light ${
                isDark ? 'text-white' : 'text-ron-dark-navy'
              }`}>Sarah Wilson</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">●</span>
                  <span className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                  }`}>Active Care Plan</span>
                </div>
                <span className={isDark ? 'text-white/20' : 'text-ron-dark-navy/20'}>|</span>
                <span className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                }`}>ID: 89312</span>
                <span className={isDark ? 'text-white/20' : 'text-ron-dark-navy/20'}>|</span>
                <span className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                }`}>Last Updated: 2h ago</span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-4 gap-6 mt-8">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className={`${
                  isDark
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white border-ron-divider'
                } rounded-xl p-6 border`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${
                      isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                    }`}>{metric.title}</p>
                    <p className={`text-3xl font-light mt-1 ${
                      isDark ? 'text-white' : 'text-ron-dark-navy'
                    }`}>{metric.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-${metric.color}-500/20 flex items-center justify-center`}>
                    <metric.icon className={`w-6 h-6 text-${metric.color}-400`} />
                  </div>
                </div>
                {metric.details && (
                  <div className={`mt-4 pt-4 border-t ${
                    isDark ? 'border-white/10' : 'border-ron-divider'
                  }`}>
                    <p className={`text-sm ${
                      isDark ? 'text-white/40' : 'text-ron-dark-navy/40'
                    }`}>{metric.details}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Care Journeys Table */}
      <div className="space-y-6">
        <CareJourneysTable onMemberClick={handleJourneyClick} />
      </div>
    </div>
  );
}