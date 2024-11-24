import React from 'react';
import { Search } from 'lucide-react';
import { PriorityBadge } from '@/components/PriorityBadge';
import { CareStatusBadge } from '@/components/CareStatusBadge';
import { RiskScoreTooltip } from '@/components/RiskScoreTooltip';

interface Member {
  id: string;
  name: string;
  healthPlan: string;
  riskScore: number;
  careStatus: string;
  lastContact: string;
  nextAppointment: string;
}

const data: Member[] = [
  {
    id: '1',
    name: 'Sarah Wilson',
    healthPlan: 'Premium Care Plus',
    riskScore: 41,
    careStatus: 'Active',
    lastContact: '2h ago',
    nextAppointment: 'Mar 15, 2024',
  },
  {
    id: '2',
    name: 'Michael Chen',
    healthPlan: 'Elite Health',
    riskScore: 78,
    careStatus: 'Attention Needed',
    lastContact: '1d ago',
    nextAppointment: 'Mar 12, 2024',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    healthPlan: 'Premium Care Plus',
    riskScore: 35,
    careStatus: 'Active',
    lastContact: '4h ago',
    nextAppointment: 'Mar 18, 2024',
  },
  {
    id: '4',
    name: 'James Thompson',
    healthPlan: 'Standard Care',
    riskScore: 62,
    careStatus: 'Pending',
    lastContact: '3d ago',
    nextAppointment: 'Mar 20, 2024',
  },
  {
    id: '5',
    name: 'Sofia Patel',
    healthPlan: 'Elite Health',
    riskScore: 29,
    careStatus: 'Active',
    lastContact: '1h ago',
    nextAppointment: 'Mar 14, 2024',
  },
];

interface MembersTableProps {
  onMemberClick: (memberId: string) => void;
}

export function MembersTable({ onMemberClick }: MembersTableProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));
  const [globalFilter, setGlobalFilter] = React.useState('');

  const getRiskLevel = (score: number): 'high' | 'medium' | 'low' => {
    if (score >= 75) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  };

  return (
    <div className={`${
      isDark ? 'bg-white/5' : 'bg-white'
    } rounded-xl shadow-soft border border-ron-divider`}>
      <div className="p-4 border-b border-ron-divider">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            isDark ? 'text-white/40' : 'text-ron-dark-navy/40'
          }`} />
          <input
            type="text"
            placeholder="Search members..."
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              isDark
                ? 'bg-white/5 text-white placeholder-white/40 border-white/10'
                : 'bg-ron-primary/5 text-ron-dark-navy placeholder-ron-dark-navy/40 border-ron-divider'
            } border focus:outline-none focus:ring-2 focus:ring-ron-primary/20`}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ron-divider">
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`}>Member Name</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`}>Health Plan</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`}>Risk Score</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`}>Care Status</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`}>Last Contact</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`}>Next Appointment</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onMemberClick(row.id)}
                className={`group border-b border-ron-divider ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-ron-primary/5'
                } transition-colors cursor-pointer`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full ${
                      isDark ? 'bg-white/10' : 'bg-ron-primary/10'
                    } flex items-center justify-center mr-3`}>
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-white' : 'text-ron-primary'
                      }`}>
                        {row.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className={isDark ? 'text-white' : 'text-ron-dark-navy'}>
                      {row.name}
                    </span>
                  </div>
                </td>
                <td className={`px-6 py-4 ${
                  isDark ? 'text-white' : 'text-ron-dark-navy'
                }`}>{row.healthPlan}</td>
                <td className="px-6 py-4">
                  <RiskScoreTooltip score={row.riskScore}>
                    <PriorityBadge priority={getRiskLevel(row.riskScore)} />
                  </RiskScoreTooltip>
                </td>
                <td className="px-6 py-4">
                  <CareStatusBadge status={row.careStatus} />
                </td>
                <td className={`px-6 py-4 ${
                  isDark ? 'text-white' : 'text-ron-dark-navy'
                }`}>{row.lastContact}</td>
                <td className={`px-6 py-4 ${
                  isDark ? 'text-white' : 'text-ron-dark-navy'
                }`}>{row.nextAppointment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}