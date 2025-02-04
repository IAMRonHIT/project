import React, { memo } from 'react';
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../../hooks/useTheme';
import { Badge } from '../../../../components/Badge';
import type { HealthPlan, Appeal } from '../../types';

interface AppealsTabProps {
  plan: HealthPlan;
}

const mockAppeals: Appeal[] = [
  {
    id: '1',
    type: 'clinical',
    status: 'in-review',
    submittedDate: '2025-01-15',
  },
  {
    id: '2',
    type: 'administrative',
    status: 'decided',
    submittedDate: '2025-01-10',
    decision: {
      date: '2025-01-20',
      outcome: 'approved',
      reason: 'Additional documentation supports medical necessity'
    }
  }
];

interface StatusBadgeProps {
  status: Appeal['status'];
}

const StatusBadge = memo(function StatusBadge({ status }: StatusBadgeProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const getVariant = () => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'submitted':
        return 'info';
      case 'in-review':
        return 'warning';
      case 'decided':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Badge variant={getVariant()} size="sm" glow>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
});

export function AppealsTab({ plan }: AppealsTabProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className={`
            p-4 rounded-lg text-left
            transition-all duration-200
            ${isDark 
              ? 'bg-ron-teal-400/10 hover:bg-ron-teal-400/20 text-white' 
              : 'bg-cyan-50 hover:bg-cyan-100 text-gray-900'
            }
            border border-ron-teal-400/20
            hover:shadow-glow-teal
            group
          `}>
            <h4 className="font-medium mb-1">Start New Appeal</h4>
            <p className={`
              text-sm
              ${isDark ? 'text-gray-400' : 'text-gray-600'}
            `}>
              Submit a new appeal request
            </p>
          </button>

          <button className={`
            p-4 rounded-lg text-left
            transition-all duration-200
            ${isDark 
              ? 'bg-ron-teal-400/10 hover:bg-ron-teal-400/20 text-white' 
              : 'bg-cyan-50 hover:bg-cyan-100 text-gray-900'
            }
            border border-ron-teal-400/20
            hover:shadow-glow-teal
            group
          `}>
            <h4 className="font-medium mb-1">Appeal Guidelines</h4>
            <p className={`
              text-sm
              ${isDark ? 'text-gray-400' : 'text-gray-600'}
            `}>
              View appeal submission requirements
            </p>
          </button>
        </div>
      </section>

      {/* Active Appeals */}
      <section>
        <h3 className={`
          text-lg font-semibold mb-4
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}>
          Active Appeals
        </h3>
        <div className="space-y-4">
          {mockAppeals.map(appeal => (
            <div
              key={appeal.id}
              className={`
                p-4 rounded-lg
                ${isDark ? 'bg-ron-teal-400/5' : 'bg-cyan-50/50'}
                border border-ron-teal-400/20
              `}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`
                      font-medium
                      ${isDark ? 'text-white' : 'text-gray-900'}
                    `}>
                      Appeal #{appeal.id}
                    </span>
                    <StatusBadge status={appeal.status} />
                  </div>
                  <span className={`
                    text-sm
                    ${isDark ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    {appeal.type.charAt(0).toUpperCase() + appeal.type.slice(1)} Appeal
                  </span>
                </div>
                <div className="text-right">
                  <div className={`
                    text-sm
                    ${isDark ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    Submitted
                  </div>
                  <div className={`
                    font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}
                  `}>
                    {new Date(appeal.submittedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {appeal.decision && (
                <div className={`
                  p-3 rounded
                  ${appeal.decision.outcome === 'approved'
                    ? 'bg-emerald-400/10 border-emerald-400/20'
                    : 'bg-red-400/10 border-red-400/20'
                  }
                  border
                `}>
                  <div className="flex items-start gap-2">
                    {appeal.decision.outcome === 'approved' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                    )}
                    <div>
                      <div className={`
                        font-medium mb-1
                        ${isDark ? 'text-white' : 'text-gray-900'}
                      `}>
                        {appeal.decision.outcome === 'approved' ? 'Appeal Approved' : 'Appeal Denied'}
                      </div>
                      <div className={`
                        text-sm
                        ${isDark ? 'text-gray-400' : 'text-gray-600'}
                      `}>
                        {appeal.decision.reason}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Appeal Process */}
      <section>
        <h3 className={`
          text-lg font-semibold mb-4
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}>
          Appeal Process
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`
            p-4 rounded-lg
            ${isDark ? 'bg-ron-teal-400/5' : 'bg-cyan-50/50'}
            border border-ron-teal-400/20
          `}>
            <div className={`
              mb-2
              ${isDark ? 'text-ron-teal-400' : 'text-cyan-600'}
            `}>
              <FileText className="w-5 h-5" />
            </div>
            <h4 className={`
              font-medium mb-1
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}>
              1. Submit Documentation
            </h4>
            <p className={`
              text-sm
              ${isDark ? 'text-gray-400' : 'text-gray-600'}
            `}>
              Provide all relevant clinical documentation and reason for appeal
            </p>
          </div>

          <div className={`
            p-4 rounded-lg
            ${isDark ? 'bg-ron-teal-400/5' : 'bg-cyan-50/50'}
            border border-ron-teal-400/20
          `}>
            <div className={`
              mb-2
              ${isDark ? 'text-ron-teal-400' : 'text-cyan-600'}
            `}>
              <Clock className="w-5 h-5" />
            </div>
            <h4 className={`
              font-medium mb-1
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}>
              2. Review Period
            </h4>
            <p className={`
              text-sm
              ${isDark ? 'text-gray-400' : 'text-gray-600'}
            `}>
              Appeals are reviewed within 30 calendar days
            </p>
          </div>

          <div className={`
            p-4 rounded-lg
            ${isDark ? 'bg-ron-teal-400/5' : 'bg-cyan-50/50'}
            border border-ron-teal-400/20
          `}>
            <div className={`
              mb-2
              ${isDark ? 'text-ron-teal-400' : 'text-cyan-600'}
            `}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <h4 className={`
              font-medium mb-1
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}>
              3. Decision
            </h4>
            <p className={`
              text-sm
              ${isDark ? 'text-gray-400' : 'text-gray-600'}
            `}>
              Written notification of appeal decision
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}