import React, { useState } from 'react';
import { X, Search, Link as LinkIcon, AlertCircle, CheckCircle2, Clock, User } from 'lucide-react';
import type { Task } from '../types/task';
import { format } from 'date-fns';

interface LinkTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkTask: (sourceTaskId: string, targetTaskId: string) => void;
  tasks: Task[];
  currentTaskId: string;
  linkedTaskIds: string[];
}

export function LinkTaskDialog({
  isOpen,
  onClose,
  onLinkTask,
  tasks,
  currentTaskId,
  linkedTaskIds
}: LinkTaskDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  if (!isOpen) return null;
  
  // Filter tasks for display
  const filteredTasks = tasks.filter(task => {
    // Don't show current task
    if (task.id === currentTaskId) return false;
    
    // Don't show already linked tasks
    if (linkedTaskIds.includes(task.id)) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        task.patientName.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.ticketNumber.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
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
  
  const handleLinkTask = () => {
    if (selectedTaskId) {
      onLinkTask(currentTaskId, selectedTaskId);
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full max-w-2xl bg-[#121C2E] shadow-2xl text-gray-100 rounded-lg flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-500/30 bg-[#1A2333]">
          <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-indigo-400" />
            <span>Link Task</span>
          </h2>
          <button 
            className="p-2 rounded-full hover:bg-indigo-500/20 transition-colors text-gray-400 hover:text-gray-100"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search */}
        <div className="p-4 bg-[#1A2333]/70 border-b border-indigo-500/30">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks by patient name, ticket #, or description..."
              className="w-full bg-[#121C2E] border border-indigo-500/20 rounded-lg pl-10 pr-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Task List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <LinkIcon className="w-12 h-12 text-indigo-500/30 mb-4" />
              <h3 className="text-gray-300 font-medium mb-2">No available tasks to link</h3>
              <p className="text-gray-500 text-sm">
                {searchQuery 
                  ? "No tasks match your search. Try a different query."
                  : "There are no available tasks to link."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id === selectedTaskId ? null : task.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    task.id === selectedTaskId
                      ? 'bg-indigo-600/20 border-indigo-500/60'
                      : 'bg-[#1A2333] border-indigo-500/20 hover:bg-[#1A2333]/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-indigo-600/40">
                        {task.profilePicture ? (
                          <img src={task.profilePicture} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-indigo-200" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-200">{task.patientName}</p>
                        <p className="text-xs text-gray-500">Ticket #{task.ticketNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-gray-800/70">
                        {getStatusIcon(task.status)}
                        <span>
                          {task.status === 'TODO' ? 'To Do' : 
                          task.status === 'IN_PROGRESS' ? 'In Progress' : 
                          task.status === 'DONE' ? 'Complete' : task.status}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full
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
                  
                  <p className="text-sm text-gray-300 line-clamp-2">{task.description}</p>
                  
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                    <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="p-4 border-t border-indigo-500/30 bg-[#1A2333] flex justify-end gap-3">
          <button 
            className="px-4 py-2 text-gray-300 hover:text-gray-100 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={!selectedTaskId}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            onClick={handleLinkTask}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Link Task</span>
          </button>
        </div>
      </div>
    </div>
  );
}