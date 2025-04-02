import * as React from 'react';
import { TaskCard } from './TaskCard';
import type { Task } from '../../types/task';
import type { themes } from '../../lib/themes';

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  status: Task['status'];
  onTaskMove: (taskId: string, newStatus: Task['status']) => void;
  onTaskEdit: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  theme: typeof themes[keyof typeof themes];
  className?: string;
}

export function KanbanColumn({ 
  title, 
  tasks, 
  status, 
  onTaskMove, 
  onTaskEdit,
  onTaskDelete,
  theme,
  className = ''
}: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const column = e.currentTarget;
    column.classList.add('bg-cyan-500/10', 'scale-[1.01]');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    const column = e.currentTarget;
    column.classList.remove('bg-cyan-500/10', 'scale-[1.01]');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const column = e.currentTarget;
    column.classList.remove('bg-cyan-500/10', 'scale-[1.01]');
    const taskId = e.dataTransfer.getData('taskId');
    onTaskMove(taskId, status);
  };

  return (
    <div className={`flex flex-col h-full relative rounded-xl transition-all duration-300 ease-out ${className}`}>
      {/* Glass Effect Background */}
      <div className={`absolute inset-0 ${theme.columnBg} rounded-xl border ${theme.border} backdrop-blur-lg`} />

      {/* Column Header */}
      <div className="mb-4 p-4 relative backdrop-blur-sm z-10">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-semibold ${theme.columnText}`}>
            <span className="text-cyan-400 text-glow">
              {title}
            </span>
          </h2>
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${theme.badge} bg-cyan-950/50`}>
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div
        className={`
          flex-1 overflow-y-auto space-y-4 px-4 py-4 relative transition-all duration-200 ease-out rounded-xl
          hover:bg-cyan-950/20 backdrop-blur-sm custom-scrollbar bg-transparent z-10
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
              theme={theme} 
            />
          ))
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className={`text-sm ${theme.muted} text-center`}>No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
