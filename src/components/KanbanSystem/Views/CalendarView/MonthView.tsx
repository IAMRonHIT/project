import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import type { Task, KanbanTheme } from '../../types';
import { taskTypeConfig } from '../../utils/taskTypeConfig';

interface MonthViewProps {
  tasks: Task[];
  currentDate: Date;
  theme: KanbanTheme;
}

export function MonthView({ tasks, currentDate, theme }: MonthViewProps) {
  // Generate days for the current month view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Start day of the week (0 = Sunday, 1 = Monday, etc.)
  const startDay = monthStart.getDay();
  
  // Create a 7-column grid (days of the week)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get tasks for a specific day
  const getTasksForDay = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  // Maximum number of tasks to show per day cell before showing "+X more"
  const MAX_TASKS_PER_DAY = 3;

  return (
    <div className="h-full flex flex-col">
      {/* Days of the week header */}
      <div className="grid grid-cols-7 border-b border-cyan-900/30">
        {daysOfWeek.map(day => (
          <div 
            key={day} 
            className={`py-2 font-semibold text-center text-sm ${theme.textSecondary}`}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {/* Empty cells for days before the first of the month */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="border-b border-r border-cyan-900/20"></div>
        ))}
        
        {/* Actual days of the month */}
        {days.map(day => {
          const tasksForDay = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          
          return (
            <div 
              key={day.toString()} 
              className={`
                p-1 border-b border-r border-cyan-900/20 overflow-hidden
                ${isCurrentMonth ? '' : 'opacity-50'}
                ${isCurrentDay ? 'bg-cyan-900/30' : ''}
              `}
            >
              {/* Day number */}
              <div className={`text-xs font-medium p-1 ${theme.text}`}>
                {format(day, 'd')}
              </div>
              
              {/* Tasks for this day */}
              <div className="space-y-1 mt-1">
                {tasksForDay.slice(0, MAX_TASKS_PER_DAY).map(task => {
                  const typeConfig = taskTypeConfig[task.issueType];
                  return (
                    <div 
                      key={task.id} 
                      className={`
                        truncate text-xs px-1 py-0.5 rounded
                        ${typeConfig.bgColor} ${typeConfig.color}
                      `}
                      title={`${task.patientName}: ${task.description}`}
                    >
                      {task.patientName}
                    </div>
                  );
                })}
                
                {/* Show "+X more" if there are more tasks than can be displayed */}
                {tasksForDay.length > MAX_TASKS_PER_DAY && (
                  <div className={`text-xs ${theme.textSecondary} px-1`}>
                    +{tasksForDay.length - MAX_TASKS_PER_DAY} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}