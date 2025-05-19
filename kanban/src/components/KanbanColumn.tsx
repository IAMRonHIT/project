import React from 'react';
import { TaskCard } from './TaskCard';
import type { Task } from '../types/task';
import type { themes } from '../lib/themes';

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  status: Task['status'];
  onTaskMove: (taskId: string, newStatus: Task['status']) => void;
  theme: typeof themes[keyof typeof themes];
}

export function KanbanColumn({ title, tasks, status, onTaskMove, theme }: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const column = e.currentTarget;
    column.classList.add('bg-cyan-950/30', 'scale-[1.01]');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    const column = e.currentTarget;
    column.classList.remove('bg-cyan-950/30', 'scale-[1.01]');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const column = e.currentTarget;
    column.classList.remove('bg-cyan-950/30', 'scale-[1.01]');
    const taskId = e.dataTransfer.getData('taskId');
    onTaskMove(taskId, status);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Glass Effect Background */}
      <div className={`absolute inset-0 ${theme.columnBg} rounded-xl border ${theme.border} circuit-pattern bg-gradient-to-b from-[#1E293B] to-[#1E293B]`} />

      {/* Column Header */}
      <div className="mb-4 p-4 relative backdrop-blur-sm z-10">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-semibold ${theme.columnText}`}>
            <span className="text-cyan-500">
              {title}
            </span>
          </h2>
          <span className={`px-3 py-1 ${theme.cardBg} rounded-full ${theme.textSecondary} text-sm border ${theme.border}`}>
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div
        className={`
          flex-1 overflow-y-auto space-y-4 px-4 py-4 relative transition-all duration-200 ease-out rounded-xl custom-scrollbar bg-transparent z-10
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
