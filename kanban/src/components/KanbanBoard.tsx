import React from 'react';
import { KanbanColumn } from './KanbanColumn';
import type { Task } from '../types/task';
import type { themes } from '../lib/themes';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task['status']) => void;
  theme: typeof themes[keyof typeof themes];
}

export function KanbanBoard({ tasks, onTaskMove, theme }: KanbanBoardProps) {
  const todoTasks = tasks.filter(task => task.status === 'TODO');
  const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(task => task.status === 'DONE');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      <KanbanColumn title="To Do" tasks={todoTasks} status="TODO" onTaskMove={onTaskMove} theme={theme} />
      <KanbanColumn title="In Progress" tasks={inProgressTasks} status="IN_PROGRESS" onTaskMove={onTaskMove} theme={theme} />
      <KanbanColumn title="Done" tasks={doneTasks} status="DONE" onTaskMove={onTaskMove} theme={theme} />
    </div>
  );
}