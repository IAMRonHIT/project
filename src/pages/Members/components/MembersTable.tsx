import React from "react";
import { Search } from "lucide-react";
import { PriorityBadge } from "@/components/PriorityBadge";
import { CareStatusBadge } from "@/components/CareStatusBadge";
import { RiskScoreTooltip } from "@/components/RiskScoreTooltip";

interface Member {
  id: string;
  name: string;
  priority: string;
  status: string;
  riskScore: number;
  lastContact: string;
  nextAction: string;
}

export function MembersTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Member
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Risk Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Next Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {/* Member rows would be mapped here */}
        </tbody>
      </table>
    </div>
  );
}