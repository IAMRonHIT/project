import React from 'react';

interface CareStatusBadgeProps {
  status: string;
  className?: string;
}

export function CareStatusBadge({ status, className = '' }: CareStatusBadgeProps) {
  const getColor = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getColor()} ${className}`}>
      {status}
    </span>
  );
}