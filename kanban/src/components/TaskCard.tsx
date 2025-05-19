import React, { useState } from 'react';
import { User, Pencil, Users, UserCircle, Trash2, MoreVertical, Clock } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { Task } from '../types/task';
import { taskTypeConfig } from '../utils/taskTypeConfig';

// Define a flexible theme interface 
interface CardTheme {
  cardBg?: string;
  text?: string;
  textSecondary?: string;
  border?: string;
  shadow?: string;
  buttonBg?: string;
  buttonText?: string;
}

interface TaskCardProps {
  task: Task;
  theme?: CardTheme;
}

// Default theme values
const defaultTheme: CardTheme = {
  cardBg: 'bg-white dark:bg-gray-800', 
  text: 'text-gray-900 dark:text-white',
  textSecondary: 'text-gray-500 dark:text-gray-400',
  border: 'border-gray-200 dark:border-gray-700',
  shadow: 'shadow-sm',
  buttonBg: 'bg-gray-100 dark:bg-gray-800',
  buttonText: 'text-gray-700 dark:text-gray-300',
};

export function TaskCard({ task, theme = {} }: TaskCardProps) {
  // Merge default theme with provided theme
  const mergedTheme = { ...defaultTheme, ...theme };
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

  // Get the task type icon (if available in taskTypeConfig)
  const typeInfo = taskTypeConfig[task.issueType] || {
    icon: User,
    color: { base: 'gray-500' }
  };
  const TaskIcon = typeInfo.icon;

  return (
    <div 
      className={`
        relative w-full ${mergedTheme.cardBg}
        rounded-lg p-3 border cursor-move
        ${isDragging 
          ? 'shadow-md border-cyan-400/50' 
          : `${mergedTheme.shadow} ${mergedTheme.border} hover:shadow-md`
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
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            {task.profilePicture ? (
              <img 
                src={task.profilePicture} 
                alt={task.patientName}
                className="w-8 h-8 rounded-full object-cover" 
              />
            ) : (
              <TaskIcon className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <div>
            <h3 className={`text-sm font-medium ${mergedTheme.text}`}>{task.patientName}</h3>
            <span className={`text-xs ${mergedTheme.textSecondary}`}>{task.ticketNumber}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full outline-none">
            <MoreVertical className={`w-4 h-4 ${mergedTheme.textSecondary}`} />
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
        <span className={`text-xs font-medium ${mergedTheme.text}`}>{task.issueType}</span>
      </div>

      {/* Description - Only show first line with ellipsis */}
      <p className={`${mergedTheme.textSecondary} text-xs mb-3 line-clamp-2`}>
        {task.description}
      </p>

      {/* Footer with badges */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Clock className={`w-3 h-3 ${mergedTheme.textSecondary}`} />
          <span className={`text-xs ${mergedTheme.textSecondary}`}>{task.dueDate}</span>
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
                className={`px-2 py-1 ${mergedTheme.buttonBg} ${mergedTheme.buttonText} rounded text-xs font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-700`}
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
