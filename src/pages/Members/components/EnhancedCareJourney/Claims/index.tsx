import React, { useState } from 'react';
import { Activity, AlertCircle, ArrowUpRight, DollarSign, FileText, Filter, Plus, Search } from 'lucide-react';

interface Claim {
  id: string;
  careJourneyId: string;
  submissionDate: string;
  status: 'processed' | 'pending' | 'denied';
  service: string;
  provider: string;
  billedAmount: number;
  paidAmount: number | null;
  cptCodes: string[];
  denialReason?: string;
}

interface ClaimsProps {
  careJourneyId: string;
}

const mockClaims: Claim[] = [
  {
    id: 'CLM-001',
    careJourneyId: 'CJ-001',
    submissionDate: '2024-03-01',
    status: 'processed',
    service: 'Cardiac Catheterization',
    provider: 'Memorial Hospital',
    billedAmount: 12500,
    paidAmount: 8750,
    cptCodes: ['93458', '93459']
  },
  {
    id: 'CLM-002',
    careJourneyId: 'CJ-001',
    submissionDate: '2024-03-05',
    status: 'denied',
    service: 'Follow-up Consultation',
    provider: 'Dr. Sarah Chen',
    billedAmount: 350,
    paidAmount: null,
    cptCodes: ['99214'],
    denialReason: 'Service not covered under current plan'
  },
  {
    id: 'CLM-003',
    careJourneyId: 'CJ-001',
    submissionDate: '2024-03-10',
    status: 'pending',
    service: 'Stress Test',
    provider: 'Cardiology Associates',
    billedAmount: 1200,
    paidAmount: null,
    cptCodes: ['93015', '93016']
  }
];

export function Claims({ careJourneyId }: ClaimsProps) {
  const [isDark] = useState(document.documentElement.classList.contains('dark'));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);

  // Filter claims for this care journey
  const journeyClaims = mockClaims.filter(claim => claim.careJourneyId === careJourneyId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return {
          bg: isDark ? 'bg-emerald-400/10' : 'bg-emerald-50',
          text: isDark ? 'text-emerald-400' : 'text-emerald-500'
        };
      case 'pending':
        return {
          bg: isDark ? 'bg-amber-400/10' : 'bg-amber-50',
          text: isDark ? 'text-amber-400' : 'text-amber-500'
        };
      case 'denied':
        return {
          bg: isDark ? 'bg-red-400/10' : 'bg-red-50',
          text: isDark ? 'text-red-400' : 'text-red-500'
        };
      default:
        return {
          bg: '',
          text: ''
        };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className={`${
      isDark
        ? 'bg-white/5 backdrop-blur-lg border-white/10'
        : 'bg-white border-ron-divider'
    } rounded-xl shadow-soft`}>
      {/* Header */}
      <div className="p-6 border-b border-ron-divider">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-medium flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-ron-dark-navy'
          }`}>
            <DollarSign className="w-4 h-4 text-ron-primary dark:text-[#CCFF00]" />
            Claims
          </h3>
          <div className="flex items-center gap-2">
            <button
              className={`p-2 rounded-lg ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-ron-primary/10'
              } transition-colors`}
            >
              <Filter className={`w-4 h-4 ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`} />
            </button>
            <button
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isDark
                  ? 'bg-[#CCFF00] text-ron-dark-navy hover:bg-[#CCFF00]/90'
                  : 'bg-ron-primary text-white hover:bg-ron-primary/90'
              } transition-colors`}
            >
              <Plus className="w-4 h-4" />
              New Claim
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDark ? 'text-white/40' : 'text-ron-dark-navy/40'
          }`} />
          <input
            type="text"
            placeholder="Search claims..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              isDark
                ? 'bg-white/5 text-white placeholder-white/40 border-white/10'
                : 'bg-ron-primary/5 text-ron-dark-navy placeholder-ron-dark-navy/40 border-ron-divider'
            } border focus:outline-none focus:ring-2 focus:ring-ron-primary/20`}
          />
        </div>
      </div>

      {/* Claims Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-white/10' : 'border-ron-divider'}`}>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              } uppercase tracking-wider`}>Claim ID</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              } uppercase tracking-wider`}>Date</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              } uppercase tracking-wider`}>Service</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              } uppercase tracking-wider`}>Provider</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              } uppercase tracking-wider`}>Amount</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              } uppercase tracking-wider`}>Status</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              } uppercase tracking-wider`}>Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-white/10' : 'divide-ron-divider'}`}>
            {journeyClaims.map((claim) => {
              const statusColors = getStatusColor(claim.status);
              
              return (
                <tr
                  key={claim.id}
                  onClick={() => setSelectedClaim(selectedClaim === claim.id ? null : claim.id)}
                  className={`${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-ron-primary/5'
                  } transition-colors cursor-pointer`}
                >
                  <td className={`px-6 py-4 text-sm font-medium ${
                    isDark ? 'text-white' : 'text-ron-dark-navy'
                  }`}>{claim.id}</td>
                  <td className={`px-6 py-4 text-sm ${
                    isDark ? 'text-white' : 'text-ron-dark-navy'
                  }`}>{claim.submissionDate}</td>
                  <td className={`px-6 py-4 text-sm ${
                    isDark ? 'text-white' : 'text-ron-dark-navy'
                  }`}>
                    <div>
                      <p>{claim.service}</p>
                      <p className={`text-xs mt-1 ${
                        isDark ? 'text-white/40' : 'text-ron-dark-navy/40'
                      }`}>CPT: {claim.cptCodes.join(', ')}</p>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm ${
                    isDark ? 'text-white' : 'text-ron-dark-navy'
                  }`}>{claim.provider}</td>
                  <td className={`px-6 py-4 text-sm ${
                    isDark ? 'text-white' : 'text-ron-dark-navy'
                  }`}>
                    <div>
                      <p>Billed: {formatCurrency(claim.billedAmount)}</p>
                      {claim.paidAmount !== null && (
                        <p className={`text-xs mt-1 ${
                          isDark ? 'text-white/40' : 'text-ron-dark-navy/40'
                        }`}>Paid: {formatCurrency(claim.paidAmount)}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusColors.bg
                    } ${statusColors.text}`}>
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                    {claim.denialReason && (
                      <p className={`text-xs mt-1 flex items-center gap-1 ${
                        isDark ? 'text-red-400' : 'text-red-500'
                      }`}>
                        <AlertCircle className="w-3 h-3" />
                        {claim.denialReason}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button className={`p-2 rounded-lg ${
                      isDark ? 'hover:bg-white/10' : 'hover:bg-ron-primary/10'
                    } transition-colors`}>
                      <ArrowUpRight className={`w-4 h-4 ${
                        isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                      }`} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
