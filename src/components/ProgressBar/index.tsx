import React from 'react';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  isDark?: boolean;
}

export function ProgressBar({
  progress,
  color = '#00A3FF',
  height = 4,
  showLabel = true,
  isDark = false
}: ProgressBarProps) {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className={`text-xs font-medium ${
            isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
          }`}>
            Progress
          </span>
          <span className={`text-xs font-medium ${
            isDark ? 'text-white' : 'text-dark-gun-metal'
          }`}>
            {normalizedProgress}%
          </span>
        </div>
      )}
      <div
        className={`w-full rounded-full ${
          isDark ? 'bg-white/10' : 'bg-ron-primary/10'
        }`}
        style={{ height: `${height}px` }}
      >
        <div
          className="rounded-full transition-all duration-300 ease-in-out"
          style={{
            width: `${normalizedProgress}%`,
            height: '100%',
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
}
