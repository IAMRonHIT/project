import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AlertCircle, Calendar, User } from 'lucide-react';

interface TaskProps {
  task: {
    id: string;
    title: string;
    priority: 'high' | 'medium' | 'low';
    dueDate: string;
    assignee: string;
  };
}

export function Task({ task }: TaskProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-amber-400';
      case 'low':
        return 'text-emerald-400';
      default:
        return '';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${
        isDark
          ? 'bg-white/5 hover:bg-white/10'
          : 'bg-ron-primary/5 hover:bg-ron-primary/10'
      } p-4 rounded-lg cursor-move transition-colors`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className={`font-medium ${
          isDark ? 'text-white' : 'text-dark-gun-metal'
        }`}>{task.title}</h4>
        <AlertCircle className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Calendar className={`w-4 h-4 ${
              isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
            }`} />
            <span className={`text-xs ${
              isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
            }`}>
              {new Date(task.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <User className={`w-4 h-4 ${
              isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
            }`} />
            <span className={`text-xs ${
              isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
            }`}>
              {task.assignee}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}