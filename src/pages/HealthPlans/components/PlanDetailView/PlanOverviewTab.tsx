import React from 'react';
import { Phone, Mail, Globe, MapPin as Map, Calendar, Shield } from 'lucide-react';
import { useTheme } from '../../../../hooks/useTheme';
import type { HealthPlan } from '../../types';

interface PlanOverviewTabProps {
  plan: HealthPlan;
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoCard({ icon, label, value }: InfoCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`
      p-4 rounded-lg
      ${isDark ? 'bg-ron-teal-400/5' : 'bg-cyan-50/50'}
      border border-ron-teal-400/20
    `}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`
          ${isDark ? 'text-ron-teal-400' : 'text-cyan-600'}
        `}>
          {icon}
        </div>
        <span className={`
          text-sm font-medium
          ${isDark ? 'text-gray-400' : 'text-gray-600'}
        `}>
          {label}
        </span>
      </div>
      <div className={`
        text-base font-medium
        ${isDark ? 'text-white' : 'text-gray-900'}
      `}>
        {value}
      </div>
    </div>
  );
}

export function PlanOverviewTab({ plan }: PlanOverviewTabProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-8">
      {/* Contact Information */}
      <section>
        <h3 className={`
          text-lg font-semibold mb-4
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}>
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard
            icon={<Phone className="w-5 h-5" />}
            label="Provider Services"
            value={plan.contact.phone}
          />
          <InfoCard
            icon={<Mail className="w-5 h-5" />}
            label="Email"
            value={plan.contact.email}
          />
          <InfoCard
            icon={<Globe className="w-5 h-5" />}
            label="Website"
            value={plan.contact.website}
          />
        </div>
      </section>

      {/* Coverage Details */}
      <section>
        <h3 className={`
          text-lg font-semibold mb-4
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}>
          Coverage Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard
            icon={<Shield className="w-5 h-5" />}
            label="Coverage Type"
            value={plan.coverage.type}
          />
          <InfoCard
            icon={<Calendar className="w-5 h-5" />}
            label="Effective Date"
            value={new Date(plan.coverage.effectiveDate).toLocaleDateString()}
          />
          <InfoCard
            icon={<Map className="w-5 h-5" />}
            label="Network Type"
            value={plan.coverage.network.type}
          />
        </div>
      </section>

      {/* Benefits Summary */}
      <section>
        <h3 className={`
          text-lg font-semibold mb-4
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}>
          Benefits Summary
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {plan.coverage.benefits.map((benefit, index) => (
            <div
              key={index}
              className={`
                p-4 rounded-lg
                ${isDark ? 'bg-ron-teal-400/5' : 'bg-cyan-50/50'}
                border border-ron-teal-400/20
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`
                  font-medium
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}>
                  {benefit.serviceType}
                </span>
                <span className={`
                  px-2 py-1 rounded text-sm
                  ${benefit.requiresAuth
                    ? 'bg-amber-400/10 text-amber-400'
                    : 'bg-emerald-400/10 text-emerald-400'
                  }
                `}>
                  {benefit.requiresAuth ? 'Auth Required' : 'No Auth Required'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <span className={`
                    text-sm
                    ${isDark ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    Coverage
                  </span>
                  <p className={`
                    font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}
                  `}>
                    {benefit.coverage}%
                  </p>
                </div>
                <div>
                  <span className={`
                    text-sm
                    ${isDark ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    Deductible
                  </span>
                  <p className={`
                    font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}
                  `}>
                    ${benefit.deductible.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className={`
                    text-sm
                    ${isDark ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    Out of Pocket Max
                  </span>
                  <p className={`
                    font-medium
                    ${isDark ? 'text-white' : 'text-gray-900'}
                  `}>
                    ${benefit.outOfPocketMax.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}