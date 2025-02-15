import React from 'react';
import type { Task } from '../types/task';
import type { ThemeConfig } from '../lib/themes';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task['status']) => void;
  theme: ThemeConfig;
}

interface Column {
  id: Task['status'];
  title: string;
}

const columns: Column[] = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' }
];

export function KanbanBoard({ tasks, onTaskMove, theme }: KanbanBoardProps) {
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, columnId: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    onTaskMove(taskId, columnId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {columns.map(column => (
        <div
          key={column.id}
          className={`
            rounded-xl p-4
            ${theme.columnBg}
            border ${theme.border}
          `}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <h3 className={`text-lg font-semibold mb-4 ${theme.columnText}`}>
            {column.title}
          </h3>
          
          <div className="space-y-4">
            {tasks
              .filter(task => task.status === column.id)
              .map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className={`
                    p-4 rounded-lg cursor-move
                    ${theme.cardBg}
                    border ${theme.border}
                    ${theme.hover}
                    transition-all duration-200
                  `}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`font-medium ${theme.text}`}>{task.title}</h4>
                    <span className={`text-sm ${theme.muted}`}>{task.ticketNumber}</span>
                  </div>
                  <p className={`text-sm ${theme.muted} mb-3`}>{task.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={task.profilePicture}
                        alt={task.patientName}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className={`text-sm ${theme.text}`}>{task.patientName}</span>
                    </div>
                    <span className={`
                      px-2 py-1 text-xs rounded
                      ${task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                        task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'}
                    `}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}