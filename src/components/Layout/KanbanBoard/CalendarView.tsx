import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { TaskCard } from './TaskCard';
import type { Task } from '../../../src/types/task';
import type { themes } from '../../../src/lib/themes';

type ViewMode = 'month' | 'week' | 'day';

interface CalendarViewProps {
  tasks: Task[];
  theme: typeof themes[keyof typeof themes];
}

export function CalendarView({ tasks, theme }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

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
    setCurrentDate(newDate);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 p-4">
        <div className="flex items-center gap-2">
          {viewModes.map(mode => (
            <Button
              key={mode.value}
              variant={viewMode === mode.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode(mode.value)}
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

      {/* Calendar Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-4 p-4">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} theme={theme} />
          ))}
        </div>
      </div>
    </div>
  );
}