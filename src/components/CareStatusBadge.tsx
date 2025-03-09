import React from 'react';
import { Badge } from './Badge';

type CareStatus = 'active' | 'pending' | 'completed';

interface CareStatusBadgeProps extends Readonly<{
  status: CareStatus;
  className?: string;
}> {}

const statusVariantMap: Record<CareStatus, 'success' | 'warning' | 'info'> = {
  active: 'success',
  pending: 'warning',
  completed: 'info'
};

export function CareStatusBadge({ status, className = '' }: CareStatusBadgeProps) {
  return (
    <Badge
      variant={statusVariantMap[status]}
      size="sm"
      className={className}
    >
      {status.toUpperCase()}
    </Badge>
  );
}
