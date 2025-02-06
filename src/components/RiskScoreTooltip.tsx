import React from 'react';

interface RiskScoreTooltipProps {
  score: number;
  className?: string;
}

export function RiskScoreTooltip({ score, className = '' }: RiskScoreTooltipProps) {
  const getColor = () => {
    if (score >= 80) return 'bg-red-100 text-red-800';
    if (score >= 60) return 'bg-orange-100 text-orange-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    if (score >= 20) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getColor()}`}>
        {score}
      </span>
      <div className="ml-2 text-sm text-gray-500">
        Risk Score
      </div>
    </div>
  );
}