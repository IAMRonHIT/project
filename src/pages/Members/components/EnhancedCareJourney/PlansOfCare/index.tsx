import React, { useState } from 'react';
import { Activity, Calendar, Clock, FileText, Heart, MoreVertical, Plus } from 'lucide-react';
import { ProgressBar } from '../../../../../components/ProgressBar';

interface CarePlan {
  id: string;
  careJourneyId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'on-hold';
  goals: {
    id: string;
    title: string;
    progress: number;
    status: 'on-track' | 'at-risk' | 'behind';
  }[];
  metrics: {
    appointmentsAttended: number;
    totalAppointments: number;
    medicationAdherence: number;
    patientReportedScore: number;
  };
}

interface PlansOfCareProps {
  careJourneyId: string;
}

const mockCarePlans: CarePlan[] = [
  {
    id: 'POC-001',
    careJourneyId: 'CJ-001',
    title: 'Heart Failure Management Plan',
    description: 'Comprehensive plan to manage CHF symptoms and improve quality of life',
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    status: 'active',
    goals: [
      {
        id: 'GOAL-001',
        title: 'Reduce Salt Intake',
        progress: 75,
        status: 'on-track'
      },
      {
        id: 'GOAL-002',
        title: 'Daily Weight Monitoring',
        progress: 90,
        status: 'on-track'
      },
      {
        id: 'GOAL-003',
        title: 'Exercise Program Adherence',
        progress: 60,
        status: 'at-risk'
      }
    ],
    metrics: {
      appointmentsAttended: 6,
      totalAppointments: 8,
      medicationAdherence: 95,
      patientReportedScore: 7.5
    }
  }
];

export function PlansOfCare({ careJourneyId }: PlansOfCareProps) {
  const [isDark] = useState(document.documentElement.classList.contains('dark'));
  
  // Filter plans for this care journey
  const journeyPlans = mockCarePlans.filter(plan => plan.careJourneyId === careJourneyId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return isDark ? 'text-emerald-400' : 'text-emerald-500';
      case 'at-risk':
        return isDark ? 'text-amber-400' : 'text-amber-500';
      case 'behind':
        return isDark ? 'text-red-400' : 'text-red-500';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className={`${
        isDark
          ? 'bg-white/5 backdrop-blur-lg border-white/10'
          : 'bg-white border-ron-divider'
      } rounded-xl shadow-soft`}>
        <div className="p-6 border-b border-ron-divider">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-medium flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-ron-dark-navy'
            }`}>
              <Heart className="w-4 h-4 text-ron-primary dark:text-[#CCFF00]" />
              Plans of Care
            </h3>
            <button
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isDark
                  ? 'bg-[#CCFF00] text-ron-dark-navy hover:bg-[#CCFF00]/90'
                  : 'bg-ron-primary text-white hover:bg-ron-primary/90'
              } transition-colors`}
            >
              <Plus className="w-4 h-4" />
              New Care Plan
            </button>
          </div>
        </div>

        {/* Care Plans List */}
        <div className="divide-y divide-ron-divider">
          {journeyPlans.map((plan) => (
            <div key={plan.id}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`font-medium ${
                      isDark ? 'text-white' : 'text-ron-dark-navy'
                    }`}>{plan.title}</h4>
                    <p className={`mt-1 text-sm ${
                      isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                    }`}>{plan.description}</p>
                    
                    {/* Date Range */}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className={`w-4 h-4 ${
                          isDark ? 'text-white/40' : 'text-ron-dark-navy/40'
                        }`} />
                        <span className={`text-sm ${
                          isDark ? 'text-white/40' : 'text-ron-dark-navy/40'
                        }`}>{plan.startDate} - {plan.endDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className={`p-2 rounded-lg ${
                    isDark ? 'hover:bg-white/10' : 'hover:bg-ron-primary/10'
                  } transition-colors`}>
                    <MoreVertical className={`w-4 h-4 ${
                      isDark ? 'text-white/40' : 'text-ron-dark-navy/40'
                    }`} />
                  </button>
                </div>

                {/* Goals Section */}
                <div className="mt-6 space-y-4">
                  <h5 className={`text-sm font-medium ${
                    isDark ? 'text-white/80' : 'text-ron-dark-navy/80'
                  }`}>Treatment Goals</h5>
                  
                  <div className="space-y-4">
                    {plan.goals.map((goal) => (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${
                            isDark ? 'text-white' : 'text-ron-dark-navy'
                          }`}>{goal.title}</span>
                          <span className={`text-sm ${getStatusColor(goal.status)}`}>
                            {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                          </span>
                        </div>
                        <ProgressBar progress={goal.progress} variant={
                          goal.status === 'on-track' ? 'success' :
                          goal.status === 'at-risk' ? 'warning' : 'danger'
                        } />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics Section */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-lg ${
                    isDark ? 'bg-white/5' : 'bg-ron-primary/5'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Calendar className={isDark ? 'text-[#CCFF00]' : 'text-ron-primary'} />
                      <span className={`text-sm ${
                        isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                      }`}>Appointments</span>
                    </div>
                    <p className={`mt-2 text-2xl font-medium ${
                      isDark ? 'text-white' : 'text-ron-dark-navy'
                    }`}>{plan.metrics.appointmentsAttended}/{plan.metrics.totalAppointments}</p>
                  </div>

                  <div className={`p-4 rounded-lg ${
                    isDark ? 'bg-white/5' : 'bg-ron-primary/5'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Heart className={isDark ? 'text-[#CCFF00]' : 'text-ron-primary'} />
                      <span className={`text-sm ${
                        isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                      }`}>Medication Adherence</span>
                    </div>
                    <p className={`mt-2 text-2xl font-medium ${
                      isDark ? 'text-white' : 'text-ron-dark-navy'
                    }`}>{plan.metrics.medicationAdherence}%</p>
                  </div>

                  <div className={`p-4 rounded-lg ${
                    isDark ? 'bg-white/5' : 'bg-ron-primary/5'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Activity className={isDark ? 'text-[#CCFF00]' : 'text-ron-primary'} />
                      <span className={`text-sm ${
                        isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                      }`}>Patient Score</span>
                    </div>
                    <p className={`mt-2 text-2xl font-medium ${
                      isDark ? 'text-white' : 'text-ron-dark-navy'
                    }`}>{plan.metrics.patientReportedScore}/100</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
