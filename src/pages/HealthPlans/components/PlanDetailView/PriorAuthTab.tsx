import React from 'react';
import { ClipboardList, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '../../../../hooks/useTheme';
import { Badge } from '../../../../components/Badge';
import type { HealthPlan } from '../../types';

interface PriorAuthTabProps {
  plan: HealthPlan;
}

interface GuidelineCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function GuidelineCard({ title, description, icon }: GuidelineCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`
      p-4 rounded-lg
      ${isDark ? 'bg-ron-teal-400/5' : 'bg-cyan-50/50'}
      border border-ron-teal-400/20
    `}>
      <div className="flex items-start gap-3">
        <div className={`
          mt-1
          ${isDark ? 'text-ron-teal-400' : 'text-cyan-600'}
        `}>
          {icon}
        </div>
        <div>
          <h4 className={`
            font-medium mb-1
            ${isDark ? 'text-white' : 'text-gray-900'}
          `}>
            {title}
          </h4>
          <p className={`
            text-sm
            ${isDark ? 'text-gray-400' : 'text-gray-600'}
          `}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function PriorAuthTab({ plan }: PriorAuthTabProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const guidelines = [
    {
      title: 'Required Documentation',
      description: 'Clinical notes, imaging reports (if any), and referral from specialist required for all submissions.',
      icon: <ClipboardList className="w-5 h-5" />
    },
    {
      title: 'Submission Timeline',
      description: 'Submit at least 5 business days before the scheduled service. Urgent requests processed within 72 hours.',
      icon: <Clock className="w-5 h-5" />
    },
    {
      title: 'Medical Necessity',
      description: 'Include clear documentation of medical necessity and any failed conservative treatments.',
      icon: <AlertTriangle className="w-5 h-5" />
    },
    {
      title: 'Approval Process',
      description: 'Initial review within 48 hours. Additional documentation requests must be fulfilled within 7 days.',
      icon: <CheckCircle className="w-5 h-5" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Guidelines Section */}
      <section>
        <h3 className={`
          text-lg font-semibold mb-4
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}>
          Authorization Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guidelines.map((guideline, index) => (
            <GuidelineCard
              key={index}
              {...guideline}
            />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className={`
          text-lg font-semibold mb-4
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}>
          Quick Actions
        </h3>
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
            <h4 className="font-medium mb-1">Start New Authorization</h4>
            <p className={`
              text-sm
              ${isDark ? 'text-gray-400' : 'text-gray-600'}
            `}>
              Submit a new prior authorization request
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
            <h4 className="font-medium mb-1">Check Authorization Status</h4>
            <p className={`
              text-sm
              ${isDark ? 'text-gray-400' : 'text-gray-600'}
            `}>
              View status of pending authorizations
            </p>
          </button>
        </div>
      </section>

      {/* Service Requirements */}
      <section>
        <h3 className={`
          text-lg font-semibold mb-4
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}>
          Common Services Requirements
        </h3>
        <div className={`
          rounded-lg overflow-hidden
          border border-ron-teal-400/20
        `}>
          <table className="w-full">
            <thead>
              <tr className={`
                ${isDark ? 'bg-ron-teal-400/10' : 'bg-cyan-50'}
                border-b border-ron-teal-400/20
              `}>
                <th className={`
                  px-4 py-3 text-left text-sm font-medium
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}>
                  Service Type
                </th>
                <th className={`
                  px-4 py-3 text-left text-sm font-medium
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}>
                  Auth Required
                </th>
                <th className={`
                  px-4 py-3 text-left text-sm font-medium
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}>
                  Documentation
                </th>
              </tr>
            </thead>
            <tbody>
              {plan.coverage.benefits.map((benefit, index) => (
                <tr key={index} className={`
                  border-b border-ron-teal-400/20
                  ${isDark ? 'bg-black/50' : 'bg-white'}
                  last:border-b-0
                `}>
                  <td className={`
                    px-4 py-3 text-sm
                    ${isDark ? 'text-white' : 'text-gray-900'}
                  `}>
                    {benefit.serviceType}
                  </td>
                  <td className={`px-4 py-3`}>
                    <Badge
                      variant={benefit.requiresAuth ? 'warning' : 'success'}
                      size="sm"
                      glow
                    >
                      {benefit.requiresAuth ? 'Required' : 'Not Required'}
                    </Badge>
                  </td>
                  <td className={`
                    px-4 py-3 text-sm
                    ${isDark ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    {benefit.restrictions?.join(', ') || 'Standard documentation'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}