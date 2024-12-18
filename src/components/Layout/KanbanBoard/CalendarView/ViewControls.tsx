import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import type { themes } from '../../../../src/lib/themes';

type ViewMode = 'month' | 'week' | 'day';

interface ViewControlsProps {
  viewMode: ViewMode;
  currentDate: Date;
  onViewModeChange: (mode: ViewMode) => void;
  onDateChange: (date: Date) => void;
  theme: typeof themes[keyof typeof themes];
}

export function ViewControls({
  viewMode,
  currentDate,
  onViewModeChange,
  onDateChange,
  theme
}: ViewControlsProps) {
  const viewModes: { value: ViewMode; label: string }[] = [
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'day', label: 'Day' },
  ];

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'month':
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {viewModes.map(mode => (
          <Button
            key={mode.value}
            variant={viewMode === mode.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange(mode.value)}
          >
            {mode.label}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className={`text-lg font-medium ${theme.text}`}>
          {currentDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
            ...(viewMode !== 'month' && { day: 'numeric' }),
          })}
        </span>
        <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}