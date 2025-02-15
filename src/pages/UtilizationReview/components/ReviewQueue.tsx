import React from 'react';
import { StatusBadge } from '@/components/StatusBadge';

export interface ReviewQueueProps {
  searchTerm: string;
  selectedFilters: {
    status: string[];
    priority: string[];
    type: string[];
  };
}

interface Review {
  id: string;
  patientName: string;
  type: string;
  status: string;
  submittedDate: string;
  priority: string;
}

export function ReviewQueue({ searchTerm, selectedFilters }: ReviewQueueProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Patient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {/* Reviews would be mapped here */}
        </tbody>
      </table>
    </div>
  );
}