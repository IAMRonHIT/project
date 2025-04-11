import React from 'react';
import { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
  theme: any;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, theme }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      case 'LOW':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`rounded-lg p-4 border ${theme.border} ${theme.card} ${theme.cardHover} cursor-pointer shadow-sm`}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`text-xs px-2 py-1 rounded-full ${theme.border} border ${theme.text} opacity-70`}>
          {task.ticketNumber}
        </span>
        <div className={`h-3 w-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
      </div>
      
      <h4 className={`font-semibold mb-2 ${theme.text}`}>{task.title}</h4>
      
      <p className={`text-sm mb-3 line-clamp-2 ${theme.text} opacity-80`}>
        {task.description}
      </p>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {task.profilePicture ? (
            <img 
              src={task.profilePicture} 
              alt={task.patientName} 
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className={`w-6 h-6 rounded-full ${theme.accent} flex items-center justify-center`}>
              <span className="text-white text-xs">
                {task.patientName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
          <span className={`text-xs ${theme.text} opacity-80`}>
            {task.patientName}
          </span>
        </div>
        
        <span className={`text-xs ${theme.text} opacity-70`}>
          {task.dueDate}
        </span>
      </div>
    </div>
  );
};
