import React, { useState } from 'react';
import { MoreVertical, User, Pencil, Users, UserCircle, Trash2 } from 'lucide-react';
import type { Task } from '../../../types/task';
import type { themes } from '../../../lib/themes';
import { taskTypeConfig } from '../../../utils/taskTypeConfig';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';

interface TaskCardProps {
  task: Task;
  theme: typeof themes[keyof typeof themes];
}

export function TaskCard({ task, theme }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const typeConfig = taskTypeConfig[task.issueType];
  const TaskIcon = typeConfig?.icon || User;

  return (
    <div 
      className={`
        relative w-full min-h-[180px]
        rounded-lg p-5 border cursor-move
        ${theme === 'dark' ? 'bg-[#334155] hover:bg-[#334155]/90' : 'bg-white hover:bg-white/90'}
        ${isDragging 
          ? 'shadow-[0_0_30px_rgba(0,255,255,0.3)] border-[#00FFFF]/60 scale-[1.02] rotate-1' 
          : 'border-gray-200 dark:border-[#1E3448] hover:scale-[1.02] hover:shadow-lg'
        }
        transition-all duration-200 ease-out group
      `}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Task Type Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className={`
          inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium
          ${typeConfig?.bgColor || '"bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10"-100 dark:"bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10"-700'}
          ${typeConfig?.textColor || 'text-gray-700 dark:text-gray-300'}
        `}>
          <TaskIcon className="w-3.5 h-3.5" />
          {task.issueType}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="p-1 rounded-md hover:"bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10"-100 dark:hover:"bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10"-700/50"
              onClick={e => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users className="w-4 h-4 mr-2" />
              Assign
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Task Title */}
      <h3 className={`font-medium mb-2 ${theme.textPrimary}`}>
        {task.title}
      </h3>

      {/* Task Description */}
      <p className={`text-sm mb-4 ${theme.textSecondary}`}>
        {task.description}
      </p>

      {/* Task Footer */}
      <div className="absolute bottom-5 left-5 right-5">
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {task.assignees.map((assignee, index) => (
              <UserCircle
                key={index}
                className={`w-6 h-6 ${theme.textSecondary} ${index > 0 ? 'ml-[-8px]' : ''}`}
              />
            ))}
          </div>
          <div className={`text-xs ${theme.textSecondary}`}>
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
