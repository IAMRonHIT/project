import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { TaskCard } from '../../Layout/KanbanBoard/TaskCard';
import type { Task } from '../../../types/task';
import type { themes } from '../../../lib/themes';

type ViewMode = 'month' | 'week' | 'day';

interface CalendarViewProps {
  tasks: Task[];
  onTaskEdit: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  theme: typeof themes[keyof typeof themes];
}

export function CalendarView({ tasks, onTaskEdit, onTaskDelete, theme }: CalendarViewProps) {
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className={`text-lg font-semibold ${theme.textPrimary}`}>
            {currentDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
              ...(viewMode !== 'month' && { day: 'numeric' }),
            })}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        {/* Implement calendar grid based on viewMode */}
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onTaskEdit}
            onDelete={onTaskDelete}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}
