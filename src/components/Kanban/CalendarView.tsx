import React from 'react';
import { Task } from '../../types/task';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

interface CalendarViewProps {
  tasks: Task[];
  theme: any;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, theme }) => {
  const today = new Date();
  const startDay = startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday
  
  // Create an array of dates for the week
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDay, i));
  
  // Map task priority to color class
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'border-l-4 border-red-500';
      case 'MEDIUM':
        return 'border-l-4 border-yellow-500';
      case 'LOW':
        return 'border-l-4 border-green-500';
      default:
        return 'border-l-4 border-gray-500';
    }
  };

  // Group tasks by due date
  const tasksByDate = weekDays.map(date => {
    const dateString = format(date, 'yyyy-MM-dd');
    // Filter tasks due on this day
    const tasksForDay = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
    
    return {
      date,
      tasks: tasksForDay
    };
  });

  return (
    <div className={`rounded-lg border ${theme.border} ${theme.card} overflow-hidden shadow-lg`}>
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className={`p-2 text-center ${
              isSameDay(day, today) 
                ? 'bg-blue-50 dark:bg-blue-900/20' 
                : `${theme.card}`
            }`}
          >
            <div className={`font-medium mb-1 ${theme.text}`}>
              {format(day, 'EEE')}
            </div>
            <div className={`text-xs ${theme.text} opacity-70`}>
              {format(day, 'MMM d')}
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 h-[calc(100vh-350px)]">
        {tasksByDate.map((dayData, dayIndex) => (
          <div 
            key={dayIndex} 
            className={`overflow-y-auto p-2 ${
              isSameDay(dayData.date, today) 
                ? 'bg-blue-50 dark:bg-blue-900/20' 
                : `${theme.card}`
            }`}
          >
            {dayData.tasks.length > 0 ? (
              <div className="space-y-2">
                {dayData.tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`
                      p-2 rounded ${theme.card} shadow-sm 
                      ${getPriorityColor(task.priority)}
                      hover:shadow-md transition-shadow duration-200
                      border border-gray-200 dark:border-gray-700
                    `}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div 
                        className={`text-xs px-1.5 py-0.5 rounded-sm ${
                          task.status === 'TODO' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' 
                            : task.status === 'IN_PROGRESS' 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200' 
                            : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                        }`}
                      >
                        {task.status.replace('_', ' ')}
                      </div>
                    </div>
                    <h4 className={`text-sm font-medium mb-1 ${theme.text} line-clamp-1`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center">
                      {task.profilePicture ? (
                        <img 
                          src={task.profilePicture} 
                          alt={task.patientName} 
                          className="w-4 h-4 rounded-full mr-1"
                        />
                      ) : (
                        <div className={`w-4 h-4 rounded-full ${theme.accent} flex items-center justify-center mr-1`}>
                          <span className="text-white text-[8px]">
                            {task.patientName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      <span className={`text-xs ${theme.text} opacity-70 truncate`}>
                        {task.patientName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`h-full flex items-center justify-center ${theme.text} opacity-30 text-xs`}>
                No tasks
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
