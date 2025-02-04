import React, { memo } from 'react';
import { CircleDollarSign, Search, Clock, CheckCircle } from 'lucide-react';
import { useTheme } from '../../../../hooks/useTheme';
import { Badge } from '../../../../components/Badge';
import type { HealthPlan, Claim } from '../../types';

interface ClaimsTabProps {
  plan: HealthPlan;
}

const mockClaims: Claim[] = [
  {
    id: '1',
    serviceDate: '2025-01-15',
    provider: 'Dr. Smith Medical Group',
    serviceType: 'Office Visit',
    status: 'pending',
    amount: {
      billed: 250.00,
      allowed: 200.00,
      paid: 160.00,
      patientResponsibility: 40.00
    },
    network: {
      type: 'in-network',
      tier: 'preferred',
    }
  },
  {
    id: '2',
    serviceDate: '2025-01-10',
    provider: 'City Imaging Center',
    serviceType: 'MRI',
    status: 'approved',
    amount: {
      billed: 1200.00,
      allowed: 800.00,
      paid: 640.00,
      patientResponsibility: 160.00
    },
    network: {
      type: 'in-network',
      tier: 'standard',
    }
  }
];

interface StatusBadgeProps {
  status: Claim['status'];
}

const StatusBadge = memo(function StatusBadge({ status }: StatusBadgeProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const getVariant = () => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'denied':
        return 'error';
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

export function ClaimsTab({ plan }: ClaimsTabProps) {
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
            <h4 className="font-medium mb-1">Submit New Claim</h4>
            <p className={`
              text-sm
              ${isDark ? 'text-gray-400' : 'text-gray-600'}
            `}>
              Start a new claim submission
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
            <h4 className="font-medium mb-1">Check Claim Status</h4>
            <p className={`
              text-sm
              ${isDark ? 'text-gray-400' : 'text-gray-600'}
            `}>
              View status of submitted claims
            </p>
          </button>
        </div>
      </section>

      {/* Recent Claims */}
      <section>
        <h3 className={`
          text-lg font-semibold mb-4
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}>
          Recent Claims
        </h3>
        <div className="space-y-4">
          {mockClaims.map(claim => (
            <div
              key={claim.id}
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
                      Claim #{claim.id}
                    </span>
                    <StatusBadge status={claim.status} />
                  </div>
                  <span className={`
                    text-sm
                    ${isDark ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    {claim.provider}
                  </span>
                </div>
                <div className="text-right">
                  <div className={`
                    text-sm
                    ${isDark ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    Service Date
                  </div>
                  <div className={`
                    font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}
                  `}>
                    {new Date(claim.serviceDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className={`
                    text-sm mb-1
                    ${isDark ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    Billed Amount
                  </div>
                  <div className={`
                    font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}
                  `}>
                    ${claim.amount.billed.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className={`
                    text-sm mb-1
                    ${isDark ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    Allowed Amount
                  </div>
                  <div className={`
                    font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}
                  `}>
                    ${claim.amount.allowed.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className={`
                    text-sm mb-1
                    ${isDark ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    Plan Paid
                  </div>
                  <div className={`
                    font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}
                  `}>
                    ${claim.amount.paid.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className={`
                    text-sm mb-1
                    ${isDark ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    Patient Responsibility
                  </div>
                  <div className={`
                    font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}
                  `}>
                    ${claim.amount.patientResponsibility.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Claims Process */}
      <section>
        <h3 className={`
          text-lg font-semibold mb-4
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}>
          Claims Process
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`
            p-4 rounded-lg
            ${isDark ? 'bg-ron-teal-400/5' : 'bg-cyan-50/50'}
            border border-ron-teal-400/20
          `}>
            <div className={`
              mb-2
              ${isDark ? 'text-ron-teal-400' : 'text-cyan-600'}
            `}>
              <Search className="w-5 h-5" />
            </div>
            <h4 className={`
              font-medium mb-1
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}>
              1. Submission
            </h4>
            <p className={`
              text-sm
              ${isDark ? 'text-gray-400' : 'text-gray-600'}
            `}>
              Submit claim with required documentation
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
              2. Processing
            </h4>
            <p className={`
              text-sm
              ${isDark ? 'text-gray-400' : 'text-gray-600'}
            `}>
              Claims processed within 30 days
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
              Claim approved or denied
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
              <CircleDollarSign className="w-5 h-5" />
            </div>
            <h4 className={`
              font-medium mb-1
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}>
              4. Payment
            </h4>
            <p className={`
              text-sm
              ${isDark ? 'text-gray-400' : 'text-gray-600'}
            `}>
              Payment processed to provider
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}