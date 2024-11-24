import React, { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from './Task';
import { Plus } from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  assignee: string;
  status: 'todo' | 'inProgress' | 'completed';
}

const initialTasks: TaskItem[] = [
  {
    id: '1',
    title: 'Schedule follow-up appointment',
    priority: 'high',
    dueDate: '2024-03-15',
    assignee: 'Dr. Sarah Chen',
    status: 'todo',
  },
  {
    id: '2',
    title: 'Review medication adherence',
    priority: 'medium',
    dueDate: '2024-03-12',
    assignee: 'Emily Parker',
    status: 'inProgress',
  },
  {
    id: '3',
    title: 'Update care plan goals',
    priority: 'low',
    dueDate: '2024-03-18',
    assignee: 'Dr. Michael Ross',
    status: 'completed',
  },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [isDark] = useState(document.documentElement.classList.contains('dark'));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const getTasksByStatus = (status: TaskItem['status']) => 
    tasks.filter(task => task.status === status);

  const Column = ({ title, status, tasks }: { title: string; status: TaskItem['status']; tasks: TaskItem[] }) => (
    <div className={`flex-1 min-w-[320px] ${
      isDark
        ? 'bg-white/5 border-white/10'
        : 'bg-white border-ron-divider'
    } rounded-xl p-4 border`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-medium ${isDark ? 'text-white' : 'text-ron-dark-navy'}`}>
          {title}
          <span className={`ml-2 px-2 py-0.5 rounded-full text-sm ${
            isDark ? 'bg-white/10' : 'bg-ron-primary/10'
          }`}>
            {tasks.length}
          </span>
        </h3>
        <button className={`p-1 rounded-lg transition-colors ${
          isDark ? 'hover:bg-white/10' : 'hover:bg-ron-primary/10'
        }`}>
          <Plus className={`w-5 h-5 ${
            isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
          }`} />
        </button>
      </div>

      <div className="space-y-3">
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4">
        <Column title="To Do" status="todo" tasks={getTasksByStatus('todo')} />
        <Column title="In Progress" status="inProgress" tasks={getTasksByStatus('inProgress')} />
        <Column title="Completed" status="completed" tasks={getTasksByStatus('completed')} />
      </div>
    </DndContext>
  );
}