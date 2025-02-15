import React from "react";
import { Activity, Plus, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

interface ClinicalReview {
  id: string;
  type: string;
  status: string;
  date: string;
  provider: string;
  notes: string;
}

export function ClinicalReviewsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Provider
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Notes
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {/* Clinical review rows would be mapped here */}
        </tbody>
      </table>
    </div>
  );
}