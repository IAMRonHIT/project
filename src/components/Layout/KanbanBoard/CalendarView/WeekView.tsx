import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, addHours, isSameDay } from 'date-fns';
import type { Task } from '../../../../src/types/task';
import type { themes } from '../../../../src/lib/themes';

interface WeekViewProps {
  tasks: Task[];
  currentDate: Date;
  theme: typeof themes[keyof typeof themes];
}

export function WeekView({ tasks, currentDate, theme }: WeekViewProps) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getTasksForDateAndHour = (date: Date, hour: number) => {
    return tasks.filter(task => {
      return task.dueDate === format(date, 'yyyy-MM-dd');
    });
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex h-full overflow-auto custom-scrollbar">
      {/* Time column */}
      <div className={`w-20 border-r ${theme.border}`}>
        <div className="h-12 border-b ${theme.border}" /> {/* Header spacer */}
        {hours.map(hour => (
          <div
            key={hour}
            className={`h-20 border-b ${theme.border} px-2 py-1 ${theme.textSecondary} text-sm sticky left-0`}
          >
            {format(new Date().setHours(hour), 'ha')}
          </div>
        ))}
      </div>

      {/* Days columns */}
      {days.map(day => (
        <div
          key={day.toString()}
          className={`flex-1 min-w-[200px] border-r ${theme.border} relative`}
        >
          {/* Day header */}
          <div
            className={`h-12 border-b ${theme.border} p-2 text-center ${
              isToday(day) ? 'bg-cyan-500/10' : theme.columnBg
            }`}
          >
            <div className={`${theme.columnText} font-medium`}>
              {format(day, 'EEE')}
            </div>
            <div className={`text-sm ${theme.textSecondary}`}>
              {format(day, 'MMM d')}
            </div>
          </div>

          {/* Hour cells */}
          {hours.map(hour => (
            <div
              key={hour}
              className={`h-20 border-b ${theme.border} relative group transition-all duration-300 hover:bg-cyan-950/20`}
            >
              {getTasksForDateAndHour(day, hour).map(task => (
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
                    <span className={`${theme.text} text-xs truncate`}>
                      {task.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}