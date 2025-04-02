import * as React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from '../Cards/TaskCard';
import type { Task, KanbanTheme, TaskStatus } from '../types';
import { useKanban } from '../context/KanbanContext';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  status: TaskStatus;
  theme: KanbanTheme;
}

export function KanbanColumn({ 
  id,
  title, 
  tasks, 
  status, 
  theme
}: KanbanColumnProps) {
  const { dispatch } = useKanban();
  const { setNodeRef, isOver } = useDroppable({
    id: status
  });

  const handleTaskEdit = (taskId: string, updates: Partial<Task>) => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: { id: taskId, updates }
    });
  };

  const handleTaskDelete = (taskId: string) => {
    dispatch({
      type: 'DELETE_TASK',
      payload: taskId
    });
  };

  return (
    <div className={`flex flex-col h-full relative rounded-xl transition-all duration-300 ease-out ${
      isOver ? 'scale-[1.02] shadow-lg' : ''
    }`}>
      {/* Glass Effect Background */}
      <div className={`absolute inset-0 ${theme.columnBg} rounded-xl border ${theme.border} backdrop-blur-lg ${
        isOver ? 'bg-cyan-500/10' : ''
      }`} />

      {/* Column Header */}
      <div className="mb-4 p-4 relative backdrop-blur-sm z-10">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-semibold ${theme.text}`}>
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
        ref={setNodeRef}
        className={`
          flex-1 overflow-y-auto space-y-4 px-4 py-4 relative transition-all duration-200 ease-out rounded-xl
          hover:bg-cyan-950/20 backdrop-blur-sm custom-scrollbar bg-transparent z-10
          ${isOver ? 'bg-cyan-950/30' : ''}
        `}
      >
        <SortableContext 
          items={tasks.map(task => task.id)} 
          strategy={verticalListSortingStrategy}
        >
          {tasks.length > 0 ? (
            tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={handleTaskEdit}
                onDelete={handleTaskDelete}
                theme={theme} 
              />
            ))
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className={`text-sm ${theme.muted} text-center`}>No tasks yet</p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}