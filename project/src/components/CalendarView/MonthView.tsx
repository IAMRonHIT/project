import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek } from 'date-fns';
import type { Task } from '../../types/task';
import type { themes } from '../../lib/themes';
import { TaskCard } from '../TaskCard';

interface MonthViewProps {
  tasks: Task[];
  currentDate: Date;
  theme: typeof themes[keyof typeof themes];
}

export function MonthView({ tasks, currentDate, theme }: MonthViewProps) {
  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      return task.dueDate === format(date, 'yyyy-MM-dd');
    });
  };

  return (
    <div className="grid grid-cols-7 h-full bg-gradient-to-br from-[#020817] to-[#0f172a]">
      {/* Week days header */}
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div
          key={day}
          className={`p-4 text-center font-semibold ${theme.columnBg} border-b ${theme.border} ${theme.columnText}`}
        >
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {days.map(day => {
        const dayTasks = getTasksForDate(day);
        const isCurrentMonth = isSameMonth(day, currentDate);
        const isCurrentDay = isToday(day);

        return (
          <div
            key={day.toString()}
            className={`min-h-[150px] p-2 border-b border-r ${theme.border} relative group transition-all duration-300
              ${!isCurrentMonth ? 'opacity-40' : ''}
              ${isCurrentDay ? 'bg-cyan-950/30' : ''}
              hover:bg-cyan-950/20`}
          >
            <div className={`flex items-center justify-between mb-2`}>
              <span className={`
                w-8 h-8 flex items-center justify-center rounded-full
                ${isCurrentDay ? 'bg-cyan-500 text-white font-bold' : theme.text}
                ${isCurrentMonth ? 'font-medium' : 'font-normal opacity-60'}
              `}>
                {format(day, 'd')}
              </span>
              {dayTasks.length > 0 && (
                <span className={`text-xs px-2 py-1 rounded-full ${theme.textSecondary} bg-cyan-950/50`}>
                  {dayTasks.length}
                </span>
              )}
            </div>
            <div className="space-y-1 overflow-y-auto max-h-[100px] custom-scrollbar">
              {dayTasks.map(task => (
                <div
                  key={task.id}
                  className={`text-xs p-2 rounded-lg backdrop-blur-sm ${theme.cardBg} border ${theme.border} ${
                    task.priority === 'HIGH' ? 'bg-red-500/10 text-red-400' :
                    task.priority === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-green-500/10 text-green-400'
                  } hover:scale-[1.02] transition-transform cursor-pointer`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full overflow-hidden">
                      {task.profilePicture && (
                        <img
                          src={task.profilePicture}
                          alt={task.patientName}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className={theme.text}>{task.title}</span>
                  </div>
                </div>
              ))}
            </div>
            {isCurrentMonth && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-cyan-950/30 pointer-events-none">
                <span className={`text-xs ${theme.textSecondary}`}>Click to add task</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}