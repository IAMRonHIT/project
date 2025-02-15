import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = function({ progress, label = 'Progress' }) {
  const roundedProgress = Math.round(progress);
  
  return (
    <div className="mb-4">
      <label htmlFor="upload-progress" className="sr-only">{label}</label>
      <progress
        id="upload-progress"
        className="w-full h-2 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-blue-600 [&::-moz-progress-bar]:bg-blue-600"
        max={100}
        value={roundedProgress}
      >
        <div 
          className="progressBar"
        >
          <span className="sr-only">{roundedProgress}% complete</span>
        </div>
      </progress>
      <div className="mt-1 text-sm text-gray-600 text-center">
        {roundedProgress}% uploaded
      </div>
    </div>
  );
};

export default ProgressBar;