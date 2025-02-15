import React from 'react';
import { Badge } from './Badge';

interface AdherenceBadgeProps {
  value: number;
}

export function AdherenceBadge({ value }: AdherenceBadgeProps) {
  const getVariant = () => {
    if (value >= 90) {
      return 'success';
    } else if (value >= 75) {
      return 'warning';
    } else {
      return 'error';
    }
  };

  return (
    <Badge 
      variant={getVariant()} 
      size="sm"
      glow
    >
      {value}% Adherent
    </Badge>
  );
}
