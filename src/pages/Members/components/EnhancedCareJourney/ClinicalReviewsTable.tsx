import React from 'react';
import { Activity, Plus, ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';

interface ClinicalReview {
  id: string;
  type: string;
  requestDate: string;
  status: string;
  outcome: string;
  reviewer: string;
  diagnosis: string;
  service: string;
  urgency: 'high' | 'medium' | 'low';
}

const clinicalReviews: ClinicalReview[] = [
  {
    id: 'CR001',
    type: 'Initial Review',
    requestDate: '2024-02-15',
    status: 'In Review',
    outcome: 'Pending',
    reviewer: 'Dr. Sarah Miller',
    diagnosis: 'ACL Tear',
    service: 'Surgical Authorization',
    urgency: 'high'
  },
  {
    id: 'CR002',
    type: 'Concurrent Review',
    requestDate: '2024-03-01',
    status: 'In Review',
    outcome: 'Pending',
    reviewer: 'Dr. James Chen',
    diagnosis: 'ACL Post-Op',
    service: 'Physical Therapy',
    urgency: 'medium'
  },
  {
    id: 'CR003',
    type: 'Extension Request',
    requestDate: '2024-03-10',
    status: 'In Review',
    outcome: 'Pending',
    reviewer: 'Pending Assignment',
    diagnosis: 'ACL Rehabilitation',
    service: 'Physical Therapy Extension',
    urgency: 'low'
  }
];

interface ClinicalReviewsTableProps {
  careJourneyId: string;
  onNewReview: () => void;
}

export function ClinicalReviewsTable({ onNewReview }: ClinicalReviewsTableProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  return (
    <div className={`${
      isDark
        ? 'bg-white/5 backdrop-blur-lg border-white/10'
        : 'bg-white border-ron-divider'
    } rounded-xl shadow-soft`}>
      <div className="p-6 flex items-center justify-between border-b border-ron-divider">
        <h3 className={`text-lg font-medium flex items-center gap-2 ${
          isDark ? 'text-white' : 'text-ron-dark-navy'
        }`}>
          <Activity className="w-4 h-4 text-ron-primary dark:text-[#CCFF00]" />
          Clinical Reviews
        </h3>
        <button
          onClick={onNewReview}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            isDark
              ? 'bg-[#CCFF00] text-ron-dark-navy hover:bg-[#CCFF00]/90'
              : 'bg-ron-primary text-white hover:bg-ron-primary/90'
          } transition-colors`}
        >
          <Plus className="w-4 h-4" />
          New Clinical Review
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-white/10' : 'border-ron-divider'}`}>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              } uppercase tracking-wider`}>ID</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              } uppercase tracking-wider`}>Type</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              } uppercase tracking-wider`}>Date</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              } uppercase tracking-wider`}>Service</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              } uppercase tracking-wider`}>Status</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              } uppercase tracking-wider`}>Reviewer</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              } uppercase tracking-wider`}>Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-white/10' : 'divide-ron-divider'}`}>
            {clinicalReviews.map((review) => (
              <tr key={review.id} className={`${
                isDark ? 'hover:bg-white/5' : 'hover:bg-ron-primary/5'
              } transition-colors`}>
                <td className={`px-6 py-4 text-sm font-medium ${
                  isDark ? 'text-white' : 'text-ron-dark-navy'
                }`}>{review.id}</td>
                <td className={`px-6 py-4 text-sm ${
                  isDark ? 'text-white' : 'text-ron-dark-navy'
                }`}>{review.type}</td>
                <td className={`px-6 py-4 text-sm ${
                  isDark ? 'text-white' : 'text-ron-dark-navy'
                }`}>{review.requestDate}</td>
                <td className={`px-6 py-4 text-sm ${
                  isDark ? 'text-white' : 'text-ron-dark-navy'
                }`}>{review.service}</td>
                <td className="px-6 py-4">
                  <StatusBadge
                    recommendation={review.status}
                    urgency={review.urgency}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${
                      isDark ? 'bg-white/10' : 'bg-ron-primary/10'
                    } flex items-center justify-center`}>
                      <span className={`text-xs font-medium ${
                        isDark ? 'text-white' : 'text-ron-primary'
                      }`}>
                        {review.reviewer === 'Pending Assignment'
                          ? 'PA'
                          : review.reviewer.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className={`text-sm ${
                      isDark ? 'text-white' : 'text-ron-dark-navy'
                    }`}>{review.reviewer}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${
                    isDark
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-ron-primary/10 text-ron-primary hover:bg-ron-primary/20'
                  } transition-colors`}>
                    Details
                    <ChevronRight className="w-4 h-4" />
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