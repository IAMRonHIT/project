import React, { useState } from 'react';
import { format, addMonths, addWeeks, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../ui/button';
import type { Task } from '../../../../types/task';
import type { themes } from '../../../../lib/themes';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';

type ViewMode = 'month' | 'week' | 'day';

interface CalendarViewProps {
  tasks: Task[];
  theme: typeof themes[keyof typeof themes];
  onTaskEdit: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
}

export function CalendarView({ tasks, theme, onTaskEdit, onTaskDelete }: CalendarViewProps) {
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
        setCurrentDate(addMonths(currentDate, direction === 'next' ? 1 : -1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, direction === 'next' ? 1 : -1));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, direction === 'next' ? 1 : -1));
        break;
    }
  };

  const getDateRangeText = () => {
    switch (viewMode) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        return `Week of ${format(currentDate, 'MMM d, yyyy')}`;
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {viewModes.map(mode => (
            <Button
              key={mode.value}
              className={viewMode === mode.value ? 'bg-primary' : ''}
              onClick={() => setViewMode(mode.value)}
            >
              {mode.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Button
            className="flex items-center"
            onClick={() => navigateDate('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className={`text-lg font-medium ${theme.text}`}>
            {getDateRangeText()}
          </span>
          <Button
            className="flex items-center"
            onClick={() => navigateDate('next')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className={`flex-1 ${theme.cardBg} border ${theme.border} rounded-xl overflow-hidden`}>
        {viewMode === 'month' && (
          <MonthView
            tasks={tasks}
            currentDate={currentDate}
            theme={theme}
          />
        )}
        {viewMode === 'week' && (
          <WeekView
            tasks={tasks}
            currentDate={currentDate}
            theme={theme}
          />
        )}
        {viewMode === 'day' && (
          <DayView
            tasks={tasks}
            currentDate={currentDate}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}
