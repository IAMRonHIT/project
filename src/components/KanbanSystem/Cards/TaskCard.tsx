import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, User, Pencil, Users, UserCircle, Trash2, Clock } from 'lucide-react';
import type { Task, KanbanTheme } from '../types';
import { taskTypeConfig } from '../utils/taskTypeConfig';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { format, isPast, isToday, addDays, differenceInDays } from 'date-fns';

interface TaskCardProps {
  task: Task;
  theme: KanbanTheme;
  onEdit: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, theme, onEdit, onDelete }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    data: {
      type: 'task',
      task,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const typeConfig = taskTypeConfig[task.issueType] || taskTypeConfig.ADMINISTRATIVE;
  const TaskIcon = typeConfig?.icon || User;
  
  // Due date formatting and status
  const dueDate = new Date(task.dueDate);
  const isOverdue = isPast(dueDate) && !isToday(dueDate);
  const isDueSoon = !isOverdue && differenceInDays(dueDate, new Date()) <= 2;
  
  const getDueDateDisplay = () => {
    if (isToday(dueDate)) return 'Due Today';
    if (isOverdue) return `Overdue: ${format(dueDate, 'MMM d')}`;
    if (isDueSoon) return `Due Soon: ${format(dueDate, 'MMM d')}`;
    return `Due ${format(dueDate, 'MMM d')}`;
  };
  
  const getDueDateClass = () => {
    if (isOverdue) return 'bg-red-900/50 text-red-300';
    if (isDueSoon) return 'bg-amber-900/50 text-amber-300';
    return 'bg-cyan-950/50 text-cyan-400';
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative w-full min-h-[180px]
        rounded-lg p-5 border cursor-move
        ${theme.name === 'dark' ? 'bg-[#1E293B]/90 hover:bg-[#1E293B]' : 'bg-white/90 hover:bg-white'}
        ${isDragging 
          ? 'shadow-[0_0_30px_rgba(0,255,255,0.3)] border-[#00FFFF]/60 scale-[1.02] rotate-1 z-10' 
          : `border-gray-200 dark:border-[#1E3448] hover:scale-[1.01] hover:shadow-lg ${theme.cardBg}`
        }
        transition-all duration-200 ease-out group
      `}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Priority Indicator */}
      <div 
        className={`absolute top-0 right-0 w-2 h-full rounded-tr-lg rounded-br-lg ${
          task.priority === 'HIGH' 
            ? 'bg-gradient-to-b from-red-400 to-red-600' 
            : task.priority === 'MEDIUM'
              ? 'bg-gradient-to-b from-amber-400 to-amber-600'
              : 'bg-gradient-to-b from-green-400 to-green-600'
        }`} 
      />
      
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
            <DropdownMenuTrigger className="p-2 hover:bg-cyan-500/10 rounded-full transition-colors" onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="w-5 h-5 text-cyan-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="gap-2" onClick={(e) => {
                e.stopPropagation();
                // Edit implementation would go here
              }}>
                <Pencil className="w-4 h-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onClick={(e) => e.stopPropagation()}>
                <Users className="w-4 h-4" />
                <span>Reassign</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2" onClick={(e) => e.stopPropagation()}>
                <UserCircle className="w-4 h-4" />
                <span>Patient Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onClick={(e) => e.stopPropagation()}>
                <Users className="w-4 h-4" />
                <span>View Stakeholders</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="gap-2 text-red-400 focus:text-red-300 focus:bg-red-900/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Task</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${typeConfig.bgColor} ${typeConfig.color}`}>
            <TaskIcon className="w-3 h-3" />
            <span>{typeConfig.label}</span>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${getDueDateClass()}`}>
            <Clock className="w-3 h-3" />
            <span>{getDueDateDisplay()}</span>
          </div>
        </div>

        <p className={`${theme.textSecondary} text-sm mb-4`}>{task.description}</p>

        {/* Stakeholders Section (collapsed by default) */}
        {isExpanded && task.stakeholders && task.stakeholders.length > 0 && (
          <div className="mt-4 pt-4 border-t border-cyan-900/30">
            <h4 className={`text-sm font-medium ${theme.textSecondary} mb-2`}>Stakeholders</h4>
            <div className="space-y-2">
              {task.stakeholders.map((stakeholder) => (
                <div key={stakeholder.id} className="flex items-center justify-between text-xs">
                  <span className={theme.text}>{stakeholder.name}</span>
                  <span className={`px-2 py-0.5 rounded-full ${theme.badge} bg-cyan-950/50`}>
                    {stakeholder.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions (collapsed by default) */}
        {isExpanded && task.actions && task.actions.length > 0 && (
          <div className="space-y-2 mt-4" onClick={(e) => e.stopPropagation()}>
            {task.actions.map((action) => (
              <button
                key={action.type}
                className={`w-full px-4 py-2 ${theme.buttonBg} ${theme.buttonText} rounded-lg text-sm font-medium transition-all duration-300 ${theme.buttonHover}`}
                onClick={() => action.handler && action.handler()}
              >
                {action.label || action.type}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}