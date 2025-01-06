import React from 'react';

interface RiskScoreTooltipProps {
  score: number;
  children: React.ReactNode;
}

export function RiskScoreTooltip({ score, children }: RiskScoreTooltipProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div className={`
          absolute z-50 -top-12 left-1/2 transform -translate-x-1/2
          px-3 py-2 rounded-lg text-xs
          ${isDark 
            ? 'bg-white/10 backdrop-blur-lg border border-white/10 text-white'
            : 'bg-white border border-ron-divider text-dark-gun-metal shadow-lg'
          }
        `}>
          <div className="font-medium">Risk Score</div>
          <div className="text-center text-lg font-bold">{score}</div>
          <div className={`
            absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2
            w-2 h-2 rotate-45
            ${isDark ? 'bg-white/10' : 'bg-white border-r border-b border-ron-divider'}
          `} />
        </div>
      )}
    </div>
  );
}