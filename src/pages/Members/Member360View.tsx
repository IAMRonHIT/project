import React, { useState, useEffect } from 'react';
import { Activity, Heart, AlertCircle, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { CareJourneysTable } from './components/CareJourneysTable';

export function Member360View() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDark] = React.useState(() => document.documentElement.classList.contains('dark'));

  // In a real app, you would fetch member data based on the ID
  // For now, we'll use Sarah Wilson's data since that's what we're testing
  const memberData = {
    id: '1',
    name: 'Sarah Wilson',
    healthPlan: 'Premium Care Plus',
    riskScore: 41.13,
    careStatus: 'Active',
    lastUpdated: '2h ago'
  };

  const metrics = [
    {
      title: 'Risk Score',
      value: memberData.riskScore.toFixed(2),
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
              }`}>{memberData.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">●</span>
                  <span className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                  }`}>{memberData.careStatus} Care Plan</span>
                </div>
                <span className={isDark ? 'text-white/20' : 'text-ron-dark-navy/20'}>|</span>
                <span className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                }`}>ID: {id}</span>
                <span className={isDark ? 'text-white/20' : 'text-ron-dark-navy/20'}>|</span>
                <span className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                }`}>Last Updated: {memberData.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className={`${
                  isDark ? 'bg-white/5' : 'bg-white'
                } rounded-xl shadow-soft border border-ron-divider p-6`}
              >
                <h2 className="text-lg font-semibold mb-4">{metric.title}</h2>
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

          {/* Care Journeys */}
          <div className={`mt-6 ${
            isDark ? 'bg-white/5' : 'bg-white'
          } rounded-xl shadow-soft border border-ron-divider p-6`}>
            <h2 className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-ron-dark-navy'
            }`}>Care Journeys</h2>
            <CareJourneysTable />
          </div>
        </div>
      </div>
    </div>
  );
}
