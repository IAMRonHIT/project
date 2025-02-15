import React from 'react';
import { Badge } from './Badge';

interface RiskScoreTooltipProps extends Readonly<{
  score: number;
  className?: string;
}> {}

const getRiskLevel = (score: number): 'error' | 'warning' | 'success' => {
  if (score >= 75) return 'error';
  if (score >= 50) return 'warning';
  return 'success';
};

export function RiskScoreTooltip({ score, className = '' }: RiskScoreTooltipProps) {
  return (
    <Badge
      variant={getRiskLevel(score)}
      size="sm"
      className={className}
    >
      {score}
    </Badge>
  );
}
