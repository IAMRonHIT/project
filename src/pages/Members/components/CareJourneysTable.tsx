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
    provider: 'Dr. Sarah Chen',
    priority: 'medium',
    adherence: 92,
    status: 'active'
  },
  {
    id: 'CJ002',
    title: 'Hypertension Control',
    startDate: '2023-11-01',
    provider: 'Dr. Michael Ross',
    priority: 'high',
    adherence: 88,
    status: 'active'
  },
  {
    id: 'CJ003',
    title: 'Weight Management',
    startDate: '2023-09-15',
    endDate: '2024-01-15',
    provider: 'Dr. Lisa Wong',
    priority: 'low',
    adherence: 95,
    status: 'completed'
  },
  {
    id: 'CJ004',
    title: 'Cardiac Rehabilitation',
    startDate: '2024-02-01',
    provider: 'Dr. James Wilson',
    priority: 'high',
    adherence: 85,
    status: 'active'
  },
  {
    id: 'CJ005',
    title: 'Nutrition Counseling',
    startDate: '2024-01-20',
    provider: 'Dr. Emily Martinez',
    priority: 'medium',
    adherence: 90,
    status: 'active'
  }
];

export function CareJourneysTable() {
  const [isDark] = React.useState(() => document.documentElement.classList.contains('dark'));
  const navigate = useNavigate();
  const { id: memberId } = useParams();

  const handleJourneyClick = (journeyId: string) => {
    navigate(`/members/${memberId}/care-journey/${journeyId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-ron-divider">
            <th
              className={`px-6 py-4 text-left text-sm font-semibold ${
                isDark ? 'text-white/90' : 'text-ron-dark-navy/90'
              }`}
            >
              Journey
            </th>
            <th
              className={`px-6 py-4 text-left text-sm font-semibold ${
                isDark ? 'text-white/90' : 'text-ron-dark-navy/90'
              }`}
            >
              Provider
            </th>
            <th
              className={`px-6 py-4 text-left text-sm font-semibold ${
                isDark ? 'text-white/90' : 'text-ron-dark-navy/90'
              }`}
            >
              Priority
            </th>
            <th
              className={`px-6 py-4 text-left text-sm font-semibold ${
                isDark ? 'text-white/90' : 'text-ron-dark-navy/90'
              }`}
            >
              Adherence
            </th>
            <th
              className={`px-6 py-4 text-left text-sm font-semibold ${
                isDark ? 'text-white/90' : 'text-ron-dark-navy/90'
              }`}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {careJourneys.map((journey) => (
            <tr
              key={journey.id}
              className={`group border-b border-ron-divider ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-ron-primary/10'
              } transition-colors cursor-pointer`}
            >
              <td className="px-6 py-4" onClick={() => handleJourneyClick(journey.id)}>
                <div className={`font-medium text-base ${
                  isDark ? 'text-white/90' : 'text-ron-dark-navy/90'
                }`}>
                  {journey.title}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className={`text-sm ${
                    isDark ? 'text-white/80' : 'text-ron-dark-navy/80'
                  }`}>
                    {journey.startDate}
                  </span>
                  {journey.endDate && (
                    <React.Fragment>
                      <span className={isDark ? 'text-white/40' : 'text-ron-dark-navy/40'}>→</span>
                      <span className={`text-sm ${
                        isDark ? 'text-white/80' : 'text-ron-dark-navy/80'
                      }`}>
                        {journey.endDate}
                      </span>
                    </React.Fragment>
                  )}
                </div>
              </td>
              <td className="px-6 py-4" onClick={() => handleJourneyClick(journey.id)}>
                <div
                  className={`text-base ${
                    isDark ? 'text-white/90' : 'text-ron-dark-navy/90'
                  }`}
                >
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
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-glow ${
                    isDark
                      ? 'bg-white/15 text-white hover:bg-white/25 hover:shadow-glow-white'
                      : 'bg-ron-primary/15 text-ron-primary hover:bg-ron-primary/25 hover:shadow-glow-primary'
                  }`}
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
  );
}