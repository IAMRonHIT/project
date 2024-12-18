import React, { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { Badge } from '../../../../../components/Badge';

export interface ClinicalReviewsTableProps {
  careJourneyId: string;
  onNewReview: () => void;
}

export function ClinicalReviewsTable({ careJourneyId, onNewReview }: ClinicalReviewsTableProps) {
  const [isDark] = useState(document.documentElement.classList.contains('dark'));

  // Mock data for clinical reviews
  const reviews = [
    {
      id: 'CR001',
      date: '2024-03-15',
      type: 'Initial Assessment',
      reviewer: 'Dr. Sarah Johnson',
      status: 'Completed',
      findings: 'Patient shows signs of improvement in cardiac function'
    },
    {
      id: 'CR002',
      date: '2024-03-10',
      type: 'Medication Review',
      reviewer: 'Dr. Michael Chen',
      status: 'Pending Action',
      findings: 'Recommend adjustment to beta blocker dosage'
    },
    {
      id: 'CR003',
      date: '2024-03-05',
      type: 'Follow-up',
      reviewer: 'Dr. Sarah Johnson',
      status: 'Completed',
      findings: 'Blood pressure remains elevated, continue monitoring'
    }
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending Action':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-ron-dark-navy'}`}>
          Clinical Reviews
        </h3>
        <button
          onClick={onNewReview}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isDark 
              ? 'bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90' 
              : 'bg-ron-primary text-white hover:bg-ron-primary/90'
          }`}
        >
          <Plus className="w-4 h-4" />
          New Review
        </button>
      </div>

      {/* Table */}
      <div className={`rounded-xl border ${isDark ? 'border-white/10' : 'border-ron-divider'}`}>
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-white/10' : 'border-ron-divider'}`}>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`}>Date</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`}>Type</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`}>Reviewer</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`}>Status</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`}>Findings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ron-divider">
            {reviews.map((review) => (
              <tr
                key={review.id}
                className={`${isDark ? 'hover:bg-white/5' : 'hover:bg-ron-primary/5'}`}
              >
                <td className={`px-6 py-4 text-sm ${isDark ? 'text-white' : 'text-ron-dark-navy'}`}>
                  {review.date}
                </td>
                <td className={`px-6 py-4 text-sm ${isDark ? 'text-white' : 'text-ron-dark-navy'}`}>
                  <div className="flex items-center gap-2">
                    <FileText className={`w-4 h-4 ${
                      isDark ? 'text-[#CCFF00]' : 'text-ron-primary'
                    }`} />
                    {review.type}
                  </div>
                </td>
                <td className={`px-6 py-4 text-sm ${isDark ? 'text-white' : 'text-ron-dark-navy'}`}>
                  {review.reviewer}
                </td>
                <td className={`px-6 py-4 text-sm`}>
                  <Badge 
                    variant={getStatusVariant(review.status)} 
                    size="sm"
                    glow
                  >
                    {review.status}
                  </Badge>
                </td>
                <td className={`px-6 py-4 text-sm ${
                  isDark ? 'text-white/80' : 'text-ron-dark-navy/80'
                }`}>
                  {review.findings}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
