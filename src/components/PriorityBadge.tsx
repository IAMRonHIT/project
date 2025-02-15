import React from 'react';
import { Badge } from './Badge';

type Priority = 'high' | 'medium' | 'low';

interface PriorityBadgeProps extends Readonly<{
  priority: Priority;
  className?: string;
}> {}

const priorityVariantMap: Record<Priority, 'error' | 'warning' | 'success'> = {
  high: 'error',
  medium: 'warning',
  low: 'success'
};

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  return (
    <Badge
      variant={priorityVariantMap[priority]}
      size="sm"
      className={className}
    >
      {priority.toUpperCase()}
    </Badge>
  );
}
