import React from 'react';
import { format, addMonths, addWeeks, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { useKanban, useFilteredTasks } from '../../context/KanbanContext';
import type { KanbanTheme } from '../../types';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';

interface CalendarViewProps {
  theme: KanbanTheme;
}

export function CalendarView({ theme }: CalendarViewProps) {
  const { state, dispatch } = useKanban();
  const { calendarViewMode, currentDate } = state;
  const tasks = useFilteredTasks();

  const viewModes = [
    { value: 'month' as const, label: 'Month' },
    { value: 'week' as const, label: 'Week' },
    { value: 'day' as const, label: 'Day' },
  ];

  const handleSetViewMode = (mode: typeof calendarViewMode) => {
    dispatch({ type: 'SET_CALENDAR_MODE', payload: mode });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    let newDate;
    switch (calendarViewMode) {
      case 'month':
        newDate = addMonths(currentDate, direction === 'next' ? 1 : -1);
        break;
      case 'week':
        newDate = addWeeks(currentDate, direction === 'next' ? 1 : -1);
        break;
      case 'day':
        newDate = addDays(currentDate, direction === 'next' ? 1 : -1);
        break;
      default:
        newDate = currentDate;
    }
    dispatch({ type: 'SET_CURRENT_DATE', payload: newDate });
  };

  const getDateRangeText = () => {
    switch (calendarViewMode) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        return `Week of ${format(currentDate, 'MMM d, yyyy')}`;
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      default:
        return '';
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="flex items-center gap-2">
          {viewModes.map(mode => (
            <Button
              key={mode.value}
              variant={calendarViewMode === mode.value ? 'default' : 'outline'}
              onClick={() => handleSetViewMode(mode.value)}
            >
              {mode.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className={`text-lg font-medium ${theme.text}`}>
            {getDateRangeText()}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate('next')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className={`flex-1 ${theme.cardBg} border ${theme.border} rounded-xl overflow-hidden mx-4`}>
        {calendarViewMode === 'month' && (
          <MonthView
            tasks={tasks}
            currentDate={currentDate}
            theme={theme}
          />
        )}
        {calendarViewMode === 'week' && (
          <WeekView
            tasks={tasks}
            currentDate={currentDate}
            theme={theme}
          />
        )}
        {calendarViewMode === 'day' && (
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