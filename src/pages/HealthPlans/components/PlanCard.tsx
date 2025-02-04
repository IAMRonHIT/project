import React, { memo } from 'react';
import { Phone, Mail, Globe2, ChevronRight } from 'lucide-react';
import { Badge } from '../../../components/Badge';
import type { HealthPlan } from '../types';

interface PlanCardProps {
  plan: HealthPlan;
  onClick: () => void;
}

export const PlanCard = memo(function PlanCard({ plan, onClick }: PlanCardProps) {
  return (
    <div
      onClick={onClick}
      className="card group cursor-pointer p-6 rounded-xl relative"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {plan.logo && (
            <img 
              src={plan.logo} 
              alt={`${plan.name} logo`}
              className="w-12 h-12 rounded-lg object-contain"
            />
          )}
          <div>
            <h3 className="text-primary text-lg font-semibold mb-1">
              {plan.name}
            </h3>
            <Badge
              variant="info"
              size="sm"
            >
              {plan.type}
            </Badge>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-secondary group-hover:text-[rgb(var(--accent))]" />
      </div>

      <p className="text-secondary mb-4 text-sm">
        {plan.description}
      </p>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-[rgb(var(--accent))]" />
          <span className="text-secondary text-sm">
            {plan.contact.phone}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[rgb(var(--accent))]" />
          <span className="text-secondary text-sm">
            {plan.contact.email}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-[rgb(var(--accent))]" />
          <span className="text-secondary text-sm">
            {plan.contact.website}
          </span>
        </div>
      </div>

      {/* Coverage Status Indicator */}
      <div className="absolute top-4 right-4">
        <Badge
          variant={plan.coverage.status === 'active' ? 'success' : plan.coverage.status === 'pending' ? 'warning' : 'error'}
          size="sm"
          glow
        >
          {plan.coverage.status.charAt(0).toUpperCase() + plan.coverage.status.slice(1)}
        </Badge>
      </div>
    </div>
  );
});