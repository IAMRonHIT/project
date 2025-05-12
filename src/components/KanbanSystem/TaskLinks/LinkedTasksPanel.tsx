import React from 'react';
import { Link as LinkIcon, ArrowUpRight, X, User, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Task } from '../types/task';
import { format } from 'date-fns';

interface LinkedTasksPanelProps {
  tasks: Task[];
  onUnlinkTask: (sourceTaskId: string, targetTaskId: string) => void;
  onViewTask: (taskId: string) => void;
  sourceTaskId: string;
}

export function LinkedTasksPanel({
  tasks,
  onUnlinkTask,
  onViewTask,
  sourceTaskId
}: LinkedTasksPanelProps) {
  if (tasks.length === 0) return null;
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TODO':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'IN_PROGRESS':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'DONE':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };
  
  return (
    <div className="bg-[#121C2E] border border-indigo-500/30 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
        <h3 className="text-md font-semibold text-indigo-300 flex items-center gap-2">
          <LinkIcon className="w-4 h-4" />
          <span>Linked Tasks ({tasks.length})</span>
        </h3>
      </div>
      
      <div className="space-y-2">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="p-3 bg-[#1A2333] rounded-lg border border-indigo-500/20 hover:border-indigo-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-indigo-600/40">
                  {task.profilePicture ? (
                    <img src={task.profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-indigo-200" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-200 text-sm">{task.patientName}</p>
                  <p className="text-xs text-gray-500">Ticket #{task.ticketNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onViewTask(task.id)}
                  className="p-1 rounded hover:bg-indigo-500/20 transition-colors"
                  title="View task details"
                >
                  <ArrowUpRight className="w-4 h-4 text-indigo-400" />
                </button>
                <button 
                  onClick={() => onUnlinkTask(sourceTaskId, task.id)}
                  className="p-1 rounded hover:bg-red-500/20 transition-colors"
                  title="Unlink task"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
            
            <p className="text-xs text-gray-300 line-clamp-2 mb-2">{task.description}</p>
            
            <div className="flex items-center justify-between mt-2 text-xs">
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-gray-800/70">
                  {getStatusIcon(task.status)}
                  <span>
                    {task.status === 'TODO' ? 'To Do' : 
                    task.status === 'IN_PROGRESS' ? 'In Progress' : 
                    task.status === 'DONE' ? 'Complete' : task.status}
                  </span>
                </div>
                <div className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded-full
                    ${task.priority === 'HIGH' 
                      ? 'bg-red-900/50 text-red-300' 
                      : task.priority === 'MEDIUM'
                        ? 'bg-amber-900/50 text-amber-300'
                        : 'bg-green-900/50 text-green-300'
                    }`}
                >
                  {task.priority}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}