import React, { useState } from 'react';
import { LucideIcon, User, Pencil, Users, UserCircle, Trash2, MoreVertical, Calendar, Clock } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { Task } from '../types/task';
import type { themes } from '../lib/themes';

// Define TaskTypeConfig interface here since it's not in the types file
export interface TaskTypeConfig {
  [key: string]: {
    icon: LucideIcon;
    color: string;
    bgColor: string;
  };
}

// Task type configuration with more appropriate icons
export const taskTypeConfig: TaskTypeConfig = {
  'Authorization': {
    icon: UserCircle,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100'
  },
  'Treatment Task': {
    icon: User,
    color: 'text-green-500',
    bgColor: 'bg-green-100'
  },
  'Care Plan': {
    icon: Users,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100'
  },
  'Benefit/Eligibility Inquiry': {
    icon: UserCircle,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100'
  },
  'In Office Appointment': {
    icon: Calendar,
    color: 'text-teal-500',
    bgColor: 'bg-teal-100'
  },
  'Telehealth': {
    icon: User,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-100'
  },
  'Form Request': {
    icon: Pencil,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100'
  },
  'New Voicemail': {
    icon: User,
    color: 'text-red-500',
    bgColor: 'bg-red-100'
  },
  'New Email': {
    icon: User,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100'
  },
  'New Chat': {
    icon: User,
    color: 'text-pink-500',
    bgColor: 'bg-pink-100'
  },
  'New Document': {
    icon: User,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-100'
  }
};

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

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const typeConfig = taskTypeConfig[task.issueType];
  const TaskIcon = typeConfig?.icon || User;

  return (
    <div 
      className={`
        relative w-full ${theme.cardBg}
        rounded-lg p-3 border cursor-move
        ${isDragging 
          ? 'shadow-md border-cyan-400/50' 
          : `shadow-sm ${theme.border} hover:shadow-md`
        }
        transition-all duration-200
      `}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Task Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${typeConfig?.bgColor}`}>
            <TaskIcon className={`w-4 h-4 ${typeConfig?.color}`} />
          </div>
          <div>
            <h3 className={`text-sm font-medium ${theme.text}`}>{task.patientName}</h3>
            <span className={`text-xs ${theme.textSecondary}`}>{task.ticketNumber}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <MoreVertical className={`w-4 h-4 ${theme.textSecondary}`} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2 text-xs">
              <Pencil className="w-3 h-3" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-xs">
              <Users className="w-3 h-3" />
              <span>Reassign</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-xs">
              <UserCircle className="w-3 h-3" />
              <span>Patient Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-xs text-red-500">
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Task Type & Info */}
      <div className="mb-2">
        <span className={`text-xs font-medium ${theme.text}`}>{task.issueType}</span>
      </div>

      {/* Description - Only show first line with ellipsis */}
      <p className={`${theme.textSecondary} text-xs mb-3 line-clamp-2`}>
        {task.description}
      </p>

      {/* Footer with badges */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Clock className={`w-3 h-3 ${theme.textSecondary}`} />
          <span className={`text-xs ${theme.textSecondary}`}>{task.dueDate}</span>
        </div>
        <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      {/* Expanded Actions */}
      {isExpanded && task.actions && (
        <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-2 flex-wrap">
            {task.actions.map((action) => (
              <button
                key={action.type}
                className={`px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                {action.type}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
