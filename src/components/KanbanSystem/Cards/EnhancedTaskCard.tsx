import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  MoreVertical,
  User,
  Pencil,
  Users,
  UserCircle,
  Trash2,
  Clock,
  MessageSquare,
  Link as LinkIcon,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Flag,
  Tag,
  Layers,
  Eye,
  Lock
} from 'lucide-react';
import type { Task, KanbanTheme } from '../types';
import { taskTypeConfig } from '../utils/taskTypeConfig';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../../../components/Badge';
import { format, isPast, isToday, addDays, differenceInDays } from 'date-fns';

interface EnhancedTaskCardProps {
  task: Task;
  theme: KanbanTheme;
  onEdit: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  onOpenChatInterface?: (taskId: string) => void;
  onViewTaskDetails?: (taskId: string) => void;
  onLinkTask?: (taskId: string) => void;
  linkedTasks?: Task[];
  childTasks?: Task[];
  parentTask?: Task | null;
}

export function EnhancedTaskCard({ 
  task, 
  theme, 
  onEdit, 
  onDelete, 
  onOpenChatInterface,
  onViewTaskDetails,
  onLinkTask,
  linkedTasks = [],
  childTasks = [],
  parentTask = null
}: EnhancedTaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLinkedTasks, setShowLinkedTasks] = useState(false);
  const [showChildTasks, setShowChildTasks] = useState(false);
  
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
  
  const getDueDateVariant = () => {
    if (isOverdue) return 'error';
    if (isDueSoon) return 'warning';
    return 'info';
  };

  const getPriorityIcon = () => {
    switch (task.priority) {
      case 'HIGH':
        return <Flag className="w-3 h-3 text-red-400" />;
      case 'MEDIUM':
        return <Flag className="w-3 h-3 text-amber-400" />;
      case 'LOW':
        return <Flag className="w-3 h-3 text-green-400" />;
      default:
        return null;
    }
  };

  const getStatusIndicator = () => {
    switch (task.status) {
      case 'TODO':
        return <span className="flex items-center gap-1 text-xs text-blue-300"><Clock className="w-3 h-3" /> To Do</span>;
      case 'IN_PROGRESS':
        return <span className="flex items-center gap-1 text-xs text-amber-300"><AlertCircle className="w-3 h-3" /> In Progress</span>;
      case 'DONE':
        return <span className="flex items-center gap-1 text-xs text-green-300"><CheckCircle2 className="w-3 h-3" /> Complete</span>;
      default:
        return <span className="flex items-center gap-1 text-xs text-gray-300"><Clock className="w-3 h-3" /> {task.status}</span>;
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-id={task.id}
      className={`
        relative w-full
        rounded-lg p-5 border cursor-move
        bg-gradient-to-br from-gray-900/90 to-gray-800/90
        border-indigo-500/30 hover:border-indigo-500/50
        ${isDragging
          ? 'shadow-[0_0_30px_rgba(99,102,241,0.3)] border-indigo-500/60 scale-[1.02] rotate-1 z-10 backdrop-blur-sm'
          : 'hover:scale-[1.01] hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
        }
        transition-all duration-200 ease-out group
      `}
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
      
      {/* Hierarchy Indicator */}
      {parentTask && (
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600 rounded-tl-lg"></div>
      )}
      
      {childTasks && childTasks.length > 0 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500 rounded-bl-lg"></div>
      )}
      
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
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/60 to-indigo-800/60">
                  <User className="w-8 h-8 text-indigo-200" />
                </div>
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
          
          <div className="flex items-center gap-2">
            {/* Task Details Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onViewTaskDetails && onViewTaskDetails(task.id);
              }}
              className="p-2 rounded-full hover:bg-indigo-500/20 transition-colors"
              title="View Task Details"
            >
              <Eye className="w-5 h-5 text-indigo-400" />
            </button>
            
            {/* Chat Interface Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onOpenChatInterface && onOpenChatInterface(task.id);
              }}
              className="p-2 rounded-full hover:bg-indigo-500/20 transition-colors"
              title="Open AI Chat"
            >
              <MessageSquare className="w-5 h-5 text-indigo-400" />
            </button>
            
            {/* More Options */}
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 hover:bg-indigo-500/20 rounded-full transition-colors" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="w-5 h-5 text-indigo-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-850 border border-indigo-500/30 text-gray-200">
                <DropdownMenuItem className="gap-2 hover:bg-indigo-600/20" onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task.id, {});
                }}>
                  <Pencil className="w-4 h-4" />
                  <span>Edit Task</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 hover:bg-indigo-600/20" onClick={(e) => {
                  e.stopPropagation();
                  onLinkTask && onLinkTask(task.id);
                }}>
                  <LinkIcon className="w-4 h-4" />
                  <span>Link Task</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 hover:bg-indigo-600/20" onClick={(e) => e.stopPropagation()}>
                  <Users className="w-4 h-4" />
                  <span>Reassign Task</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-indigo-500/20" />
                <DropdownMenuItem className="gap-2 hover:bg-indigo-600/20" onClick={(e) => e.stopPropagation()}>
                  <UserCircle className="w-4 h-4" />
                  <span>Patient Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 hover:bg-indigo-600/20" onClick={(e) => e.stopPropagation()}>
                  <FileText className="w-4 h-4" />
                  <span>View Clinical Notes</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 hover:bg-indigo-600/20" onClick={(e) => e.stopPropagation()}>
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Follow-up</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-indigo-500/20" />
                <DropdownMenuItem 
                  className="gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
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
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {/* Task Type */}
          <Badge
            variant={task.issueType === 'MEDICAL' ? 'info' :
                   task.issueType === 'ADMINISTRATIVE' ? 'default' : 'success'}
            size="sm"
            icon={<TaskIcon className="w-3 h-3" />}
          >
            {typeConfig.label}
          </Badge>

          {/* Due Date */}
          <Badge
            variant={getDueDateVariant()}
            size="sm"
            icon={<Clock className="w-3 h-3" />}
          >
            {getDueDateDisplay()}
          </Badge>

          {/* Status Badge */}
          <Badge
            variant={task.status === 'TODO' ? 'info' :
                   task.status === 'IN_PROGRESS' ? 'warning' : 'success'}
            size="sm"
            icon={task.status === 'TODO' ?
                  <Clock className="w-3 h-3" /> :
                  task.status === 'IN_PROGRESS' ?
                  <AlertCircle className="w-3 h-3" /> :
                  <CheckCircle2 className="w-3 h-3" />}
          >
            {task.status === 'TODO' ? 'TO DO' :
             task.status === 'IN_PROGRESS' ? 'IN PROGRESS' : 'COMPLETE'}
          </Badge>

          {/* Priority Indicator */}
          <Badge
            variant={task.priority === 'HIGH' ? 'error' :
                   task.priority === 'MEDIUM' ? 'warning' : 'success'}
            size="sm"
            icon={<Flag className="w-3 h-3" />}
          >
            {task.priority} PRIORITY
          </Badge>
          
          {/* Parent/Child Indicators */}
          {parentTask && (
            <Badge
              variant="info"
              size="sm"
              icon={<Layers className="w-3 h-3" />}
            >
              SUBTASK
            </Badge>
          )}

          {childTasks && childTasks.length > 0 && (
            <Badge
              variant="info"
              size="sm"
              icon={<Layers className="w-3 h-3" />}
            >
              {childTasks.length} SUBTASKS
            </Badge>
          )}

          {/* Linked Tasks Indicator */}
          {linkedTasks && linkedTasks.length > 0 && (
            <Badge
              variant="default"
              size="sm"
              icon={<LinkIcon className="w-3 h-3" />}
            >
              {linkedTasks.length} LINKED
            </Badge>
          )}
        </div>

        {/* Task Description */}
        <div 
          className={`${theme.textSecondary} text-sm mb-4 p-3 bg-[#121C2E]/50 rounded-lg border border-indigo-500/20 hover:border-indigo-500/40 transition-colors`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <p className="leading-relaxed">{task.description}</p>
          
          {/* Expand/collapse button */}
          {!isExpanded && (task.stakeholders?.length > 0 || linkedTasks?.length > 0 || childTasks?.length > 0) && (
            <button 
              className="mt-2 text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
            >
              <ChevronRight className="w-3 h-3" />
              <span>Show more details</span>
            </button>
          )}
        </div>

        {/* Expanded details sections */}
        {isExpanded && (
          <div className="space-y-4">
            {/* Stakeholders Section */}
            {task.stakeholders && task.stakeholders.length > 0 && (
              <div className="pt-4 border-t border-indigo-500/30">
                <h4 className={`text-sm font-medium ${theme.textSecondary} mb-2 flex items-center gap-2`}>
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Stakeholders</span>
                </h4>
                <div className="space-y-2 bg-[#121C2E]/50 rounded-lg p-3 border border-indigo-500/20">
                  {task.stakeholders.map((stakeholder) => (
                    <div key={stakeholder.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <UserCircle className="w-4 h-4 text-indigo-300" />
                        <span className={theme.text}>{stakeholder.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full bg-indigo-950/70 text-indigo-300 border border-indigo-500/30`}>
                        {stakeholder.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Linked Tasks Section */}
            {linkedTasks && linkedTasks.length > 0 && (
              <div className="pt-4 border-t border-indigo-500/30">
                <button 
                  className={`text-sm font-medium ${theme.textSecondary} mb-2 flex items-center gap-2 w-full justify-between`}
                  onClick={() => setShowLinkedTasks(!showLinkedTasks)}
                >
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-purple-400" />
                    <span>Linked Tasks ({linkedTasks.length})</span>
                  </div>
                  {showLinkedTasks ? 
                    <ChevronDown className="w-4 h-4 text-indigo-400" /> : 
                    <ChevronRight className="w-4 h-4 text-indigo-400" />
                  }
                </button>
                
                {showLinkedTasks && (
                  <div className="space-y-2 bg-[#121C2E]/50 rounded-lg p-3 border border-indigo-500/20">
                    {linkedTasks.map((linkedTask) => (
                      <div key={linkedTask.id} className="flex items-center justify-between text-xs p-2 bg-[#172338] rounded border border-indigo-500/10 hover:border-indigo-500/30 transition-colors">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3 h-3 text-purple-400" />
                          <span className={theme.text}>{linkedTask.patientName}: {linkedTask.description.substring(0, 30)}...</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full ${
                            linkedTask.priority === 'HIGH'
                              ? 'bg-red-900/50 text-red-300'
                              : linkedTask.priority === 'MEDIUM'
                                ? 'bg-amber-900/50 text-amber-300'
                                : 'bg-green-900/50 text-green-300'
                          }`}>
                            {linkedTask.priority}
                          </span>
                          <ArrowUpRight className="w-3 h-3 text-purple-400 cursor-pointer" title="Go to task" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Child Tasks Section */}
            {childTasks && childTasks.length > 0 && (
              <div className="pt-4 border-t border-indigo-500/30">
                <button 
                  className={`text-sm font-medium ${theme.textSecondary} mb-2 flex items-center gap-2 w-full justify-between`}
                  onClick={() => setShowChildTasks(!showChildTasks)}
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Subtasks ({childTasks.length})</span>
                  </div>
                  {showChildTasks ? 
                    <ChevronDown className="w-4 h-4 text-indigo-400" /> : 
                    <ChevronRight className="w-4 h-4 text-indigo-400" />
                  }
                </button>
                
                {showChildTasks && (
                  <div className="space-y-2 bg-[#121C2E]/50 rounded-lg p-3 border border-indigo-500/20">
                    {childTasks.map((childTask) => (
                      <div key={childTask.id} className="flex items-center justify-between text-xs p-2 bg-[#172338] rounded border border-indigo-500/10 hover:border-indigo-500/30 transition-colors">
                        <div className="flex items-center gap-2">
                          {childTask.status === 'DONE' ? 
                            <CheckCircle2 className="w-3 h-3 text-green-400" /> :
                            childTask.status === 'IN_PROGRESS' ?
                              <Clock className="w-3 h-3 text-amber-400" /> :
                              <Clock className="w-3 h-3 text-blue-400" />
                          }
                          <span className={`${theme.text} ${childTask.status === 'DONE' ? 'line-through opacity-70' : ''}`}>
                            {childTask.description.substring(0, 40)}...
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full ${
                            childTask.status === 'DONE'
                              ? 'bg-green-900/50 text-green-300'
                              : childTask.status === 'IN_PROGRESS'
                                ? 'bg-amber-900/50 text-amber-300'
                                : 'bg-blue-900/50 text-blue-300'
                          }`}>
                            {childTask.status === 'TODO' ? 'To Do' : 
                             childTask.status === 'IN_PROGRESS' ? 'In Progress' : 
                             'Complete'}
                          </span>
                          <ArrowUpRight className="w-3 h-3 text-cyan-400 cursor-pointer" title="Go to task" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Actions Section */}
            {task.actions && task.actions.length > 0 && (
              <div className="pt-4 border-t border-indigo-500/30">
                <h4 className={`text-sm font-medium ${theme.textSecondary} mb-2 flex items-center gap-2`}>
                  <ArrowUpRight className="w-4 h-4 text-indigo-400" />
                  <span>Actions</span>
                </h4>
                <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                  {task.actions.map((action) => (
                    <button
                      key={action.type}
                      className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 
                        rounded-lg text-sm font-medium transition-all duration-300 border border-indigo-500/30 hover:border-indigo-500/60
                        focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                      onClick={() => action.handler && action.handler()}
                    >
                      {action.label || action.type}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Collapse button */}
            <button 
              className="w-full mt-2 text-xs flex items-center justify-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors py-1"
              onClick={() => setIsExpanded(false)}
            >
              <ChevronDown className="w-3 h-3" />
              <span>Show less</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}