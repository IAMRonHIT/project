import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PriorityBadge } from '@/components/PriorityBadge';
import { AdherenceBadge } from '@/components/AdherenceBadge';

interface CareJourney {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'pending' | 'discontinued';
  provider: string;
  adherence: number;
  priority: 'high' | 'medium' | 'low';
  nextAction?: string;
}

const careJourneys: CareJourney[] = [
  {
    id: 'CJ001',
    title: 'Diabetes Management',
    startDate: '2024-01-15',
    status: 'active',
    provider: 'Dr. Sarah Chen',
    adherence: 92,
    priority: 'medium',
    nextAction: 'HbA1c Test Due',
  },
  {
    id: 'CJ002',
    title: 'Hypertension Control',
    startDate: '2023-11-01',
    status: 'active',
    provider: 'Dr. Michael Ross',
    adherence: 88,
    priority: 'high',
    nextAction: 'BP Monitor Review',
  },
  {
    id: 'CJ003',
    title: 'Weight Management',
    startDate: '2023-09-15',
    endDate: '2024-01-15',
    status: 'completed',
    provider: 'Dr. Lisa Wong',
    adherence: 95,
    priority: 'low',
  },
];

export function CareJourneysTable() {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));
  const navigate = useNavigate();
  const { id: memberId } = useParams();

  const handleJourneyClick = (journeyId: string) => {
    navigate(`/members/${memberId}/care-journey/${journeyId}`);
  };

  return (
    <div className={`${
      isDark ? 'bg-white/5' : 'bg-white'
    } rounded-xl shadow-soft border border-ron-divider`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ron-divider">
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`}>Journey</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`}>Provider</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`}>Priority</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`}>Adherence</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {careJourneys.map((journey) => (
              <tr key={journey.id} className={`group border-b border-ron-divider ${
                isDark ? 'hover:bg-white/5' : 'hover:bg-ron-primary/5'
              } transition-colors cursor-pointer`}>
                <td className="px-6 py-4" onClick={() => handleJourneyClick(journey.id)}>
                  <div className={`font-medium ${
                    journey.status === 'completed'
                      ? isDark
                        ? 'text-ron-mint-200'
                        : 'text-ron-mint-700'
                      : isDark
                        ? 'text-white'
                        : 'text-ron-dark-navy'
                  } ${journey.status === 'completed' ? 'bg-gradient-glossy' : ''}`}>
                    {journey.title}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className={`text-sm ${
                      journey.status === 'completed'
                        ? isDark
                          ? 'text-ron-mint-200/60'
                          : 'text-ron-mint-700/60'
                        : isDark
                          ? 'text-white/60'
                          : 'text-ron-dark-navy/60'
                    }`}>{journey.startDate}</span>
                    {journey.endDate && (
                      <>
                        <span className={isDark ? 'text-white/20' : 'text-ron-dark-navy/20'}>→</span>
                        <span className={`text-sm ${
                          journey.status === 'completed'
                            ? isDark
                              ? 'text-ron-mint-200/60'
                              : 'text-ron-mint-700/60'
                            : isDark
                              ? 'text-white/60'
                              : 'text-ron-dark-navy/60'
                        }`}>{journey.endDate}</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4" onClick={() => handleJourneyClick(journey.id)}>
                  <div className={`${
                    journey.status === 'completed'
                      ? isDark
                        ? 'text-ron-mint-200'
                        : 'text-ron-mint-700'
                      : isDark
                        ? 'text-white'
                        : 'text-ron-dark-navy'
                  }`}>
                    {journey.provider}
                  </div>
                </td>
                <td className="px-6 py-4" onClick={() => handleJourneyClick(journey.id)}>
                  <PriorityBadge priority={journey.priority} />
                </td>
                <td className="px-6 py-4" onClick={() => handleJourneyClick(journey.id)}>
                  <AdherenceBadge value={journey.adherence} />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleJourneyClick(journey.id)}
                    className={`invisible group-hover:visible px-3 py-1 rounded-lg flex items-center gap-2 ${
                      isDark
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-ron-primary/10 text-ron-primary hover:bg-ron-primary/20'
                    } transition-colors`}
                  >
                    View Details
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}