import React, { useState } from 'react';
import { AlertCircle, DollarSign, Calendar, Building, FileText } from 'lucide-react';
import { Badge } from '../../../../../components/Badge';

export interface ClaimsProps {
  careJourneyId: string;
}

export function Claims(_props: ClaimsProps) {
  const [isDark] = useState(document.documentElement.classList.contains('dark'));

  // Mock data for claims
  const claims = [
    {
      id: 'CLM001',
      date: '2024-03-15',
      provider: 'City General Hospital',
      type: 'Emergency Room Visit',
      status: 'Processed',
      amount: 2500.00,
      covered: 2000.00,
      patientResponsibility: 500.00,
      codes: ['99285', 'J0630'],
      description: 'Emergency room visit, high severity'
    },
    {
      id: 'CLM002',
      date: '2024-03-10',
      provider: 'Dr. Michael Chen',
      type: 'Office Visit',
      status: 'Pending',
      amount: 350.00,
      covered: 280.00,
      patientResponsibility: 70.00,
      codes: ['99214'],
      description: 'Follow-up visit, moderate complexity'
    },
    {
      id: 'CLM003',
      date: '2024-03-05',
      provider: 'MedLab Diagnostics',
      type: 'Laboratory Services',
      status: 'Paid',
      amount: 180.00,
      covered: 180.00,
      patientResponsibility: 0.00,
      codes: ['80053', '85025'],
      description: 'Comprehensive metabolic panel, CBC'
    }
  ];

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processed':
        return 'warning';
      case 'pending':
        return 'info';
      case 'paid':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-dark-gun-metal'}`}>
          Claims History
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isDark ? 'text-white/60' : 'text-dark-gun-metal/60'}`}>
            Total Claims: {claims.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {claims.map((claim) => (
          <div
            key={claim.id}
            className={`p-6 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-ron-divider'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className={`text-lg font-medium mb-1 ${
                  isDark ? 'text-white' : 'text-dark-gun-metal'
                }`}>
                  {claim.type}
                </h4>
                <div className="flex items-center gap-4">
                  <Badge 
                    variant={getStatusVariant(claim.status)} 
                    size="sm"
                    glow
                  >
                    {claim.status}
                  </Badge>
                  <span className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                  }`}>
                    Claim ID: {claim.id}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-medium ${
                  isDark ? 'text-white' : 'text-dark-gun-metal'
                }`}>
                  {formatCurrency(claim.amount)}
                </div>
                <div className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                }`}>
                  Total Amount
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <label className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                }`}>
                  Date of Service
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className={`w-4 h-4 ${
                    isDark ? 'text-[#CCFF00]' : 'text-ron-primary'
                  }`} />
                  <span className={isDark ? 'text-white' : 'text-dark-gun-metal'}>
                    {claim.date}
                  </span>
                </div>
              </div>
              <div>
                <label className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                }`}>
                  Provider
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Building className={`w-4 h-4 ${
                    isDark ? 'text-[#CCFF00]' : 'text-ron-primary'
                  }`} />
                  <span className={isDark ? 'text-white' : 'text-dark-gun-metal'}>
                    {claim.provider}
                  </span>
                </div>
              </div>
              <div>
                <label className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                }`}>
                  Covered Amount
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <DollarSign className={`w-4 h-4 ${
                    isDark ? 'text-[#CCFF00]' : 'text-ron-primary'
                  }`} />
                  <span className={isDark ? 'text-white' : 'text-dark-gun-metal'}>
                    {formatCurrency(claim.covered)}
                  </span>
                </div>
              </div>
              <div>
                <label className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                }`}>
                  Patient Responsibility
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <DollarSign className={`w-4 h-4 ${
                    isDark ? 'text-[#CCFF00]' : 'text-ron-primary'
                  }`} />
                  <span className={isDark ? 'text-white' : 'text-dark-gun-metal'}>
                    {formatCurrency(claim.patientResponsibility)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                }`}>
                  Description
                </label>
                <p className={`mt-1 text-sm ${
                  isDark ? 'text-white/80' : 'text-dark-gun-metal/80'
                }`}>
                  {claim.description}
                </p>
              </div>
              <div>
                <label className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                }`}>
                  Procedure Codes
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {claim.codes.map((code, index) => (
                    <Badge 
                      key={index}
                      variant="default" 
                      size="sm"
                      glow
                    >
                      {code}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
