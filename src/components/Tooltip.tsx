import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-ron-navy text-ron-silver text-xs rounded shadow-lg border border-ron-divider">
          {content}
        </div>
      )}
    </div>
  );
}