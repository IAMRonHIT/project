import React from 'react';
import type { Task } from '../../types/task';

interface CalendarViewProps {
  tasks: Task[];
  theme: {
    text: string;
    background: string;
    border: string;
  };
}

export function CalendarView({ tasks, theme }: CalendarViewProps) {
  return (
    <div className={`p-6 rounded-xl ${theme.background} ${theme.text}`}>
      <h2 className="text-2xl font-bold mb-4">Calendar View</h2>
      {/* Calendar implementation will go here */}
      <div className="grid gap-4">
        {tasks.map(task => (
          <div 
            key={task.id}
            className={`p-4 rounded-lg ${theme.border} border`}
          >
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-sm opacity-70">Due: {task.dueDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}