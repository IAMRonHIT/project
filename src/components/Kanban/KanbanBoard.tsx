import React from 'react';
import { Task, Status } from '../../types/task';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  status: Status;
  onDrop: (taskId: string, newStatus: Status) => void;
  theme: any;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, tasks, status, onDrop, theme }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    onDrop(taskId, status);
  };

  return (
    <div 
      className={`flex-1 min-w-[320px] h-full flex flex-col rounded-lg ${theme.card} ${theme.border} border p-4 shadow-md`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${theme.text}`}>{title}</h3>
        <div className={`text-sm ${theme.text} opacity-70 px-2 py-1 rounded-full ${theme.border} border`}>
          {tasks.length}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            theme={theme}
          />
        ))}
        {tasks.length === 0 && (
          <div className={`text-center p-4 ${theme.text} opacity-50 border border-dashed ${theme.border} rounded-lg`}>
            No tasks
          </div>
        )}
      </div>
    </div>
  );
};

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Status) => void;
  theme: any;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskMove, theme }) => {
  const todoTasks = tasks.filter(task => task.status === 'TODO');
  const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(task => task.status === 'DONE');

  return (
    <div className={`h-[calc(100vh-220px)] flex gap-6 overflow-x-auto p-2 ${theme.background}`}>
      <KanbanColumn 
        title="To Do" 
        tasks={todoTasks} 
        status="TODO" 
        onDrop={onTaskMove}
        theme={theme}
      />
      <KanbanColumn 
        title="In Progress" 
        tasks={inProgressTasks} 
        status="IN_PROGRESS" 
        onDrop={onTaskMove}
        theme={theme}
      />
      <KanbanColumn 
        title="Done" 
        tasks={doneTasks} 
        status="DONE" 
        onDrop={onTaskMove}
        theme={theme}
      />
    </div>
  );
};
