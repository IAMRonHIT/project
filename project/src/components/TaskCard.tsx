import React, { useState } from 'react';
import { MoreVertical, User, Pencil, Users, UserCircle, Trash2 } from 'lucide-react';
import type { Task } from '../types/task';
import type { themes } from '../lib/themes';
import { taskTypeConfig } from '../utils/taskTypeConfig';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

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
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#1E2D3D]">
              {task.profilePicture ? (
                <img
                  src={task.profilePicture}
                  alt={task.patientName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-7 h-7 text-[#B0C7D1]" />
              )}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${theme.text}`}>{task.patientName}</h3>
              <div className="flex items-center gap-2">
                <p className={`text-sm ${theme.textSecondary}`}>DOB: {task.patientDOB}</p>
                <span className={`text-sm ${theme.textSecondary}`}>|</span>
                <p className={`text-sm ${theme.textSecondary}`}>{task.ticketNumber}</p>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 hover:bg-cyan-500/10 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-cyan-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="gap-2">
                <Pencil className="w-4 h-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Users className="w-4 h-4" />
                <span>Reassign</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <UserCircle className="w-4 h-4" />
                <span>Patient Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Users className="w-4 h-4" />
                <span>View Stakeholders</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="gap-2 text-red-400 focus:text-red-300 focus:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Issue</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            task.priority === 'HIGH' ? 'priority-high' :
            task.priority === 'MEDIUM' ? 'priority-medium' :
            'priority-low'
          }`}>
            {task.priority}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs ${theme.textSecondary} bg-cyan-950/50`}>
            Due {task.dueDate}
          </span>
        </div>

        <p className={`${theme.textSecondary} text-sm mb-4`}>{task.description}</p>

        {isExpanded && task.actions && (
          <div className="space-y-4 mt-6" onClick={(e) => e.stopPropagation()}>
            {task.actions.map((action) => (
              <button
                key={action.type}
                className={`w-full px-4 py-2 ${theme.buttonBg} ${theme.buttonText} rounded-lg text-sm font-medium transition-all duration-300 ${theme.buttonHover}`}
              >
                {action.type}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}