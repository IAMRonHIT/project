import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown, MoreVertical, User, Pencil, Users, UserCircle, Trash2 } from 'lucide-react';
import type { Task, TaskPriority, TaskStatus } from '../../../types/task';
import type { themes } from '../../../lib/themes';
import { taskTypeConfig } from '../../../utils/taskTypeConfig';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/Layout/KanbanBoard/ui/dropdown-menu';

interface ListViewProps {
  tasks: Task[];
  onTaskEdit: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  theme: typeof themes[keyof typeof themes];
}

export function ListView({ tasks, onTaskEdit, onTaskDelete, theme }: ListViewProps) {
  const [sortField, setSortField] = useState<'patientName' | 'issueType' | 'priority' | 'dueDate' | 'status'>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: typeof sortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const priorityOrder: Record<TaskPriority, number> = {
    HIGH: 0,
    MEDIUM: 1,
    LOW: 2,
  };

  const statusOrder: Record<TaskStatus, number> = {
    TODO: 0,
    IN_PROGRESS: 1,
    DONE: 2,
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'patientName':
        return ((a.patientName || '') > (b.patientName || '') ? 1 : -1) * direction;
      case 'issueType':
        return a.issueType.localeCompare(b.issueType) * direction;
      case 'priority':
        return (priorityOrder[a.priority] - priorityOrder[b.priority]) * direction;
      case 'dueDate':
        return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * direction;
      case 'status':
        return (statusOrder[a.status] - statusOrder[b.status]) * direction;
      default:
        return 0;
    }
  });

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Table Header */}
      <div className={`
        grid grid-cols-6 gap-4 p-4 text-sm font-medium
        ${theme.textPrimary} border-b ${theme.border}
      `}>
        <button
          className="flex items-center gap-2"
          onClick={() => handleSort('patientName')}
        >
          Patient Name {getSortIcon('patientName')}
        </button>
        <button
          className="flex items-center gap-2"
          onClick={() => handleSort('issueType')}
        >
          Type {getSortIcon('issueType')}
        </button>
        <button
          className="flex items-center gap-2"
          onClick={() => handleSort('priority')}
        >
          Priority {getSortIcon('priority')}
        </button>
        <button
          className="flex items-center gap-2"
          onClick={() => handleSort('dueDate')}
        >
          Due Date {getSortIcon('dueDate')}
        </button>
        <button
          className="flex items-center gap-2"
          onClick={() => handleSort('status')}
        >
          Status {getSortIcon('status')}
        </button>
        <div>Actions</div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-auto">
        {sortedTasks.map(task => {
          const typeConfig = taskTypeConfig[task.issueType];
          const TaskIcon = typeConfig?.icon || User;

          return (
            <div
              key={task.id}
              className={`
                grid grid-cols-6 gap-4 p-4 text-sm
                ${theme.textPrimary} border-b ${theme.border}
                hover:bg-black/5 dark:hover:bg-white/5
              `}
            >
              <div className="flex items-center gap-2">
                <UserCircle className={`w-6 h-6 ${theme.textSecondary}`} />
                {task.patientName}
              </div>
              <div className="flex items-center gap-2">
                <div className={`
                  inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium
                  ${typeConfig?.color || 'text-gray-500'}
                `}>
                  <TaskIcon className="w-3.5 h-3.5" />
                  {task.issueType}
                </div>
              </div>
              <div className={`
                inline-flex items-center px-2 py-1 rounded-md text-xs font-medium
                ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}
              `}>
                {task.priority}
              </div>
              <div>{new Date(task.dueDate).toLocaleDateString()}</div>
              <div className={`
                inline-flex items-center px-2 py-1 rounded-md text-xs font-medium
                ${task.status === 'TODO' ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300' :
                  task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}
              `}>
                {task.status}
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onTaskEdit(task.id, {})}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="w-4 h-4 mr-2" />
                      Assign
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => onTaskDelete(task.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
