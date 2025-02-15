import React from "react";
import { Search, ArrowUpRight } from "lucide-react";
import { PriorityBadge } from "@/components/PriorityBadge";
import { CareStatusBadge } from "@/components/CareStatusBadge";
import { RiskScoreTooltip } from "@/components/RiskScoreTooltip";
import { useNavigate } from "react-router-dom";

interface Member {
  id: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'pending' | 'completed';
  riskScore: number;
  lastContact: string;
  nextAction: string;
}

// Mock data for demonstration
const members: Member[] = [
  {
    id: "M001",
    name: "John Smith",
    priority: "high",
    status: "active",
    riskScore: 85,
    lastContact: "2024-02-05",
    nextAction: "Follow-up appointment"
  },
  {
    id: "M002",
    name: "Sarah Johnson",
    priority: "medium",
    status: "pending",
    riskScore: 65,
    lastContact: "2024-02-03",
    nextAction: "Review medication plan"
  },
  {
    id: "M003",
    name: "Michael Brown",
    priority: "low",
    status: "completed",
    riskScore: 35,
    lastContact: "2024-02-01",
    nextAction: "Annual check-up"
  },
  {
    id: "M004",
    name: "Emily Davis",
    priority: "high",
    status: "active",
    riskScore: 78,
    lastContact: "2024-02-04",
    nextAction: "Specialist referral"
  },
  {
    id: "M005",
    name: "Robert Wilson",
    priority: "medium",
    status: "active",
    riskScore: 60,
    lastContact: "2024-02-02",
    nextAction: "Care plan review"
  }
];

export function MembersTable() {
  const [isDark] = React.useState(() => document.documentElement.classList.contains('dark'));
  const navigate = useNavigate();

  const handleMemberClick = (memberId: string) => {
    navigate(`/members/${memberId}`);
  };

  return (
    <div className={`${
      isDark ? 'bg-white/5' : 'bg-white'
    } rounded-xl shadow-soft overflow-hidden border border-ron-divider`}>
      {/* Search Header */}
      <div className={`p-4 ${isDark ? 'border-white/10' : 'border-ron-divider'} border-b`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
          }`} />
          <input
            type="text"
            placeholder="Search members..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              isDark
                ? 'bg-white/5 text-white placeholder-white/40 border-white/10'
                : 'bg-ron-primary/5 text-dark-gun-metal placeholder-dark-gun-metal/40 border-ron-divider'
            } border focus:outline-none focus:ring-2 focus:ring-ron-primary/20`}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-white/10' : 'border-ron-divider'}`}>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${
                isDark ? 'text-white/90' : 'text-dark-gun-metal/90'
              }`}>
                Member
              </th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${
                isDark ? 'text-white/90' : 'text-dark-gun-metal/90'
              }`}>
                Priority
              </th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${
                isDark ? 'text-white/90' : 'text-dark-gun-metal/90'
              }`}>
                Status
              </th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${
                isDark ? 'text-white/90' : 'text-dark-gun-metal/90'
              }`}>
                Risk Score
              </th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${
                isDark ? 'text-white/90' : 'text-dark-gun-metal/90'
              }`}>
                Last Contact
              </th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${
                isDark ? 'text-white/90' : 'text-dark-gun-metal/90'
              }`}>
                Next Action
              </th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${
                isDark ? 'text-white/90' : 'text-dark-gun-metal/90'
              }`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member.id}
                className={`group border-b ${isDark ? 'border-white/10' : 'border-ron-divider'} ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-ron-primary/5'
                } transition-colors cursor-pointer`}
                onClick={() => handleMemberClick(member.id)}
              >
                <td className="px-6 py-4">
                  <div className={`font-medium ${
                    isDark ? 'text-white/90' : 'text-dark-gun-metal/90'
                  }`}>
                    {member.name}
                  </div>
                  <div className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                  }`}>
                    ID: {member.id}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <PriorityBadge priority={member.priority} />
                </td>
                <td className="px-6 py-4">
                  <CareStatusBadge status={member.status} />
                </td>
                <td className="px-6 py-4">
                  <RiskScoreTooltip score={member.riskScore} />
                </td>
                <td className="px-6 py-4">
                  <div className={`text-sm ${
                    isDark ? 'text-white/80' : 'text-dark-gun-metal/80'
                  }`}>
                    {new Date(member.lastContact).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`text-sm ${
                    isDark ? 'text-white/80' : 'text-dark-gun-metal/80'
                  }`}>
                    {member.nextAction}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMemberClick(member.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                      isDark
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-ron-primary/10 text-ron-primary hover:bg-ron-primary/20'
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
    </div>
  );
}
