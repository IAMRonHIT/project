import React, { useState } from 'react';
import { MoreVertical, User, Pencil, Users, UserCircle, Trash2, type LucideIcon } from 'lucide-react';
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

export type IssueType = 
  | 'Chronic Illness (New)'
  | 'Chronic Illness (Existing)'
  | 'Acute Illness'
  | 'Injury/Accident'
  | 'Nutritional'
  | 'Mental Illness'
  | 'Appointment'
  | 'Telehealth'
  | 'New Voicemail'
  | 'New Email'
  | 'New Chat'
  | 'New Document';

export function TaskCard({ task, theme }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    setIsDragging(true);
    e.currentTarget.style.opacity = '1';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const typeConfig = taskTypeConfig[task.issueType];
  const TaskIcon = typeConfig?.icon || User;

  return (
    <div 
      className={`
        relative w-full min-h-[180px] ${theme.cardBg}
        rounded-xl p-4 border cursor-move
        ${isDragging 
          ? 'shadow-[0_0_30px_rgba(6,182,212,0.4)] border-cyan-400/80 scale-[1.02] rotate-1' 
          : `${theme.shadow} ${theme.border} ${theme.borderHover} hover:scale-[1.01]`
        }
        transition-all duration-300 ease-out backdrop-blur-sm
      `}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden">
              {task.profilePicture ? (
                <img
                  src={task.profilePicture}
                  alt={task.patientName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-7 h-7 text-cyan-500" />
              )}
            </div>
            <div>
              <h3 className={`text-lg font-bold ${theme.text}`}>{task.patientName}</h3>
              <div className="flex items-center gap-2">
                <p className={`text-sm ${theme.textSecondary}`}>DOB: {task.patientDOB}</p>
                <span className={`text-sm ${theme.textSecondary}`}>|</span>
                <p className={`text-sm ${theme.textSecondary}`}>{task.ticketNumber}</p>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1 hover:bg-cyan-500/10 rounded-full transition-colors group outline-none">
              <MoreVertical className={`w-5 h-5 ${theme.textSecondary} group-hover:${theme.text} transition-colors`} />
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

        {/* Task Info Row */}
        <div className="flex items-center gap-3 mb-3">
          <TaskIcon className={`w-5 h-5 ${theme.text}`} />
          <span className={`text-sm ${theme.text}`}>{task.issueType}</span>
          <span className={`px-3 py-1 ${theme.buttonBg} ${theme.buttonText} rounded-full text-xs tracking-wide`}>
            {task.priority}
          </span>
          <span className={`px-3 py-1 ${theme.buttonBg} ${theme.buttonText} rounded-full text-xs tracking-wide`}>
            Due {task.dueDate}
          </span>
        </div>

        {/* Description */}
        <p className={`${theme.textSecondary} text-sm mb-4 leading-relaxed`}>{task.description}</p>

        {/* Actions */}
        {isExpanded && task.actions && (
          <div className="flex flex-col gap-4 mt-4" onClick={(e) => e.stopPropagation()}>
            {task.actions.map((action) => (
              <button
                key={action.type}
                className={`w-full px-4 py-2 ${theme.buttonBg} ${theme.buttonText} rounded-lg text-sm font-medium transition-all duration-300 border ${theme.buttonBorder}`}
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