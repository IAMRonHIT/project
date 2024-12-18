import React from 'react';
import { format, isToday, addHours } from 'date-fns';
import type { Task } from '../../../../src/types/task';
import type { themes } from '../../../../src/lib/themes';

interface DayViewProps {
  tasks: Task[];
  currentDate: Date;
  theme: typeof themes[keyof typeof themes];
}

export function DayView({ tasks, currentDate, theme }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getTasksForDateAndHour = (date: Date, hour: number) => {
    return tasks.filter(task => {
      return task.dueDate === format(date, 'yyyy-MM-dd');
    });
  };

  return (
    <div className="flex h-full overflow-auto custom-scrollbar">
      {/* Time column */}
      <div className={`w-20 border-r ${theme.border}`}>
        {hours.map(hour => (
          <div
            key={hour}
            className={`h-20 border-b ${theme.border} px-2 py-1 ${theme.textSecondary} text-sm sticky left-0`}
          >
            {format(new Date().setHours(hour), 'ha')}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Day header */}
        <div
          className={`h-12 border-b ${theme.border} p-2 text-center sticky top-0 ${
            isToday(currentDate) ? 'bg-cyan-500/10' : theme.columnBg
          }`}
        >
          <div className={`${theme.columnText} font-medium`}>
            {format(currentDate, 'EEEE')}
          </div>
          <div className={`text-sm ${theme.textSecondary}`}>
            {format(currentDate, 'MMMM d, yyyy')}
          </div>
        </div>

        {/* Hour cells */}
        {hours.map(hour => {
          const hourTasks = getTasksForDateAndHour(currentDate, hour);
          return (
            <div
              key={hour}
              className={`h-20 border-b ${theme.border} relative group transition-all duration-300 hover:bg-cyan-950/20`}
            >
              {hourTasks.map(task => (
                <div
                  key={task.id}
                  className={`absolute left-1 right-1 p-2 rounded-lg ${theme.cardBg} border ${theme.border}
                    ${task.priority === 'HIGH' ? 'bg-red-500/10 border-red-500/30' :
                      task.priority === 'MEDIUM' ? 'bg-yellow-500/10 border-yellow-500/30' :
                      'bg-green-500/10 border-green-500/30'
                    } hover:scale-[1.02] transition-transform cursor-pointer z-10`}
                  style={{
                    top: '4px',
                    minHeight: '2rem'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0">
                      {task.profilePicture && (
                        <img
                          src={task.profilePicture}
                          alt={task.patientName}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className={`${theme.text} text-sm`}>{task.title}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}