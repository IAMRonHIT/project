import React from 'react';

interface RatingBadgeProps {
  rating: number;
  className?: string;
}

export function RatingBadge({ rating, className = '' }: RatingBadgeProps) {
  const getColor = () => {
    if (rating >= 4.5) return 'bg-green-100 text-green-800';
    if (rating >= 4.0) return 'bg-blue-100 text-blue-800';
    if (rating >= 3.0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getColor()} ${className}`}>
      {rating.toFixed(1)}
    </span>
  );
}