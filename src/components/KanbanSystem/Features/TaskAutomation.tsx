import React, { useState } from 'react';
import { Clock, Play, X, Zap, Calendar, Calendar as CalendarIcon, Sliders, PlusCircle, Check, RefreshCw, Bell, AlarmClock, Mail, User, Pencil } from 'lucide-react';
import type { Task, TaskStatus } from '../types';

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'status_change' | 'due_date' | 'scheduled' | 'manual';
    criteria?: string;
  };
  action: {
    type: 'notification' | 'status_update' | 'email' | 'create_task' | 'assign';
    details: string;
  };
  enabled: boolean;
}

interface TaskAutomationProps {
  tasks: Task[];
  onRunAutomation: (automation: Automation, taskIds: string[]) => void;
}

export function TaskAutomation({ tasks, onRunAutomation }: TaskAutomationProps) {
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: 'auto-1',
      name: 'Due Date Reminder',
      description: 'Send notification 1 day before task due date',
      trigger: {
        type: 'due_date',
        criteria: '1_day_before'
      },
      action: {
        type: 'notification',
        details: 'Task {task_name} for {patient_name} is due tomorrow'
      },
      enabled: true
    },
    {
      id: 'auto-2',
      name: 'Auto Close Completed Tasks',
      description: 'Mark tasks as DONE after 3 days in IN_PROGRESS with no activity',
      trigger: {
        type: 'status_change',
        criteria: 'in_progress_3days'
      },
      action: {
        type: 'status_update',
        details: 'DONE'
      },
      enabled: true
    },
    {
      id: 'auto-3',
      name: 'Overdue Task Alert',
      description: 'Send email notification when tasks become overdue',
      trigger: {
        type: 'due_date',
        criteria: 'overdue'
      },
      action: {
        type: 'email',
        details: 'Task overdue notification to assigned users'
      },
      enabled: false
    }
  ]);
  
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<Partial<Automation>>({});
  
  const handleToggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(auto => 
      auto.id === id ? { ...auto, enabled: !auto.enabled } : auto
    ));
  };
  
  const handleSelectAutomation = (automation: Automation) => {
    setSelectedAutomation(automation);
    setSelectedTasks([]);
  };
  
  const handleSelectTask = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };
  
  const handleSelectAllTasks = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map(task => task.id));
    }
  };
  
  const handleRunAutomation = () => {
    if (selectedAutomation && selectedTasks.length > 0) {
      onRunAutomation(selectedAutomation, selectedTasks);
      setSelectedAutomation(null);
      setSelectedTasks([]);
    }
  };
  
  const handleEditAutomation = (automation: Automation) => {
    setEditingAutomation(automation);
    setIsEditing(true);
  };
  
  const handleSaveAutomation = () => {
    if (!editingAutomation.name || !editingAutomation.description) return;
    
    const updatedAutomation: Automation = {
      id: editingAutomation.id || `auto-${Date.now()}`,
      name: editingAutomation.name,
      description: editingAutomation.description,
      trigger: editingAutomation.trigger || {
        type: 'manual',
      },
      action: editingAutomation.action || {
        type: 'notification',
        details: 'Default notification'
      },
      enabled: editingAutomation.enabled || false
    };
    
    if (editingAutomation.id) {
      // Update existing
      setAutomations(prev => prev.map(auto => 
        auto.id === updatedAutomation.id ? updatedAutomation : auto
      ));
    } else {
      // Add new
      setAutomations(prev => [...prev, updatedAutomation]);
    }
    
    setIsEditing(false);
    setEditingAutomation({});
  };
  
  const handleCreateNewAutomation = () => {
    setEditingAutomation({
      name: '',
      description: '',
      trigger: {
        type: 'manual',
      },
      action: {
        type: 'notification',
        details: ''
      },
      enabled: true
    });
    setIsEditing(true);
  };
  
  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return <RefreshCw className="w-4 h-4 text-blue-400" />;
      case 'due_date':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-indigo-400" />;
      case 'manual':
        return <Play className="w-4 h-4 text-green-400" />;
      default:
        return <Zap className="w-4 h-4 text-indigo-400" />;
    }
  };
  
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'notification':
        return <Bell className="w-4 h-4 text-amber-400" />;
      case 'status_update':
        return <RefreshCw className="w-4 h-4 text-blue-400" />;
      case 'email':
        return <Mail className="w-4 h-4 text-green-400" />;
      case 'create_task':
        return <PlusCircle className="w-4 h-4 text-indigo-400" />;
      case 'assign':
        return <User className="w-4 h-4 text-purple-400" />;
      default:
        return <Zap className="w-4 h-4 text-indigo-400" />;
    }
  };
  
  return (
    <div className="bg-[#121C2E] border border-indigo-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-indigo-300 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          <span>Task Automation</span>
        </h2>
        
        <button
          className="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-sm flex items-center gap-2 hover:bg-indigo-600/30 transition-colors"
          onClick={handleCreateNewAutomation}
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Automation</span>
        </button>
      </div>
      
      {/* Editing form */}
      {isEditing && (
        <div className="bg-[#1A2333] border border-indigo-500/20 rounded-lg p-4 mb-4">
          <h3 className="text-md font-medium text-gray-200 mb-3 flex items-center gap-2">
            {editingAutomation.id ? 'Edit Automation' : 'Create Automation'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={editingAutomation.name || ''}
                onChange={(e) => setEditingAutomation({ ...editingAutomation, name: e.target.value })}
                className="w-full bg-[#121C2E] border border-indigo-500/20 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-indigo-500/50"
                placeholder="Automation name..."
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea
                value={editingAutomation.description || ''}
                onChange={(e) => setEditingAutomation({ ...editingAutomation, description: e.target.value })}
                className="w-full bg-[#121C2E] border border-indigo-500/20 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-indigo-500/50 resize-none h-20"
                placeholder="Describe what this automation does..."
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Trigger Type</label>
              <select
                value={editingAutomation.trigger?.type || 'manual'}
                onChange={(e) => setEditingAutomation({ 
                  ...editingAutomation, 
                  trigger: { 
                    ...editingAutomation.trigger,
                    type: e.target.value as any
                  } 
                })}
                className="w-full bg-[#121C2E] border border-indigo-500/20 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-indigo-500/50"
              >
                <option value="status_change">Status Change</option>
                <option value="due_date">Due Date</option>
                <option value="scheduled">Scheduled</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            
            {editingAutomation.trigger?.type !== 'manual' && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Trigger Criteria</label>
                <input
                  type="text"
                  value={editingAutomation.trigger?.criteria || ''}
                  onChange={(e) => setEditingAutomation({ 
                    ...editingAutomation, 
                    trigger: { 
                      ...editingAutomation.trigger,
                      criteria: e.target.value
                    } 
                  })}
                  className="w-full bg-[#121C2E] border border-indigo-500/20 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-indigo-500/50"
                  placeholder="e.g., 1_day_before, overdue..."
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Action Type</label>
              <select
                value={editingAutomation.action?.type || 'notification'}
                onChange={(e) => setEditingAutomation({ 
                  ...editingAutomation, 
                  action: { 
                    ...editingAutomation.action,
                    type: e.target.value as any,
                    details: editingAutomation.action?.details || ''
                  } 
                })}
                className="w-full bg-[#121C2E] border border-indigo-500/20 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-indigo-500/50"
              >
                <option value="notification">Send Notification</option>
                <option value="status_update">Update Status</option>
                <option value="email">Send Email</option>
                <option value="create_task">Create Task</option>
                <option value="assign">Assign to User</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Action Details</label>
              <textarea
                value={editingAutomation.action?.details || ''}
                onChange={(e) => setEditingAutomation({ 
                  ...editingAutomation, 
                  action: { 
                    ...editingAutomation.action!,
                    details: e.target.value
                  } 
                })}
                className="w-full bg-[#121C2E] border border-indigo-500/20 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-indigo-500/50 resize-none h-20"
                placeholder="Details for this action..."
              />
              <p className="text-xs text-gray-500 mt-1">
                You can use {"{task_name}"}, {"{patient_name}"}, {"{due_date}"} as variables.
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enabled"
                checked={editingAutomation.enabled || false}
                onChange={(e) => setEditingAutomation({ ...editingAutomation, enabled: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="enabled" className="text-sm text-gray-300">Enable automation</label>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-colors"
                onClick={() => {
                  setIsEditing(false);
                  setEditingAutomation({});
                }}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                onClick={handleSaveAutomation}
                disabled={!editingAutomation.name || !editingAutomation.description}
              >
                Save Automation
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Automation list */}
      <div className="space-y-3 mb-6">
        {automations.map((automation) => (
          <div 
            key={automation.id}
            className={`border rounded-lg p-3 ${
              automation.enabled 
                ? 'bg-[#1A2333]/80 border-indigo-500/20 hover:border-indigo-500/40' 
                : 'bg-[#1A2333]/30 border-gray-700/30 hover:border-gray-700/50'
            } transition-colors ${selectedAutomation?.id === automation.id ? 'ring-2 ring-indigo-500/50' : ''}`}
            onClick={() => handleSelectAutomation(automation)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-medium ${automation.enabled ? 'text-gray-200' : 'text-gray-400'}`}>
                {automation.name}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  className="p-1 rounded-full hover:bg-indigo-500/20 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditAutomation(automation);
                  }}
                >
                  <Pencil className="w-4 h-4 text-indigo-400" />
                </button>
                <button
                  className={`w-10 h-5 rounded-full transition-colors flex items-center ${
                    automation.enabled ? 'bg-indigo-600 justify-end' : 'bg-gray-700 justify-start'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleAutomation(automation.id);
                  }}
                >
                  <span className={`block w-4 h-4 rounded-full mx-0.5 ${
                    automation.enabled ? 'bg-white' : 'bg-gray-400'
                  }`}></span>
                </button>
              </div>
            </div>
            
            <p className={`text-sm mb-3 ${automation.enabled ? 'text-gray-400' : 'text-gray-500'}`}>
              {automation.description}
            </p>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {getTriggerIcon(automation.trigger.type)}
                  <span className={automation.enabled ? 'text-gray-400' : 'text-gray-500'}>
                    {automation.trigger.type === 'status_change' ? 'Status Change' : 
                     automation.trigger.type === 'due_date' ? 'Due Date' : 
                     automation.trigger.type === 'scheduled' ? 'Scheduled' : 'Manual'}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-gray-500" />
                </div>
                
                <div className="flex items-center gap-1">
                  {getActionIcon(automation.action.type)}
                  <span className={automation.enabled ? 'text-gray-400' : 'text-gray-500'}>
                    {automation.action.type === 'notification' ? 'Notification' : 
                     automation.action.type === 'status_update' ? 'Update Status' : 
                     automation.action.type === 'email' ? 'Email' : 
                     automation.action.type === 'create_task' ? 'Create Task' : 
                     'Assign'}
                  </span>
                </div>
              </div>
              
              {automation.trigger.type === 'manual' && automation.enabled && (
                <button
                  className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAutomation(automation);
                  }}
                >
                  <Play className="w-3 h-3" />
                  <span>Run</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Selected automation panel */}
      {selectedAutomation && selectedAutomation.trigger.type === 'manual' && (
        <div className="bg-[#1A2333] border border-indigo-500/20 rounded-lg p-4">
          <h3 className="text-md font-medium text-gray-200 mb-3 flex items-center gap-2">
            <Play className="w-4 h-4 text-indigo-400" />
            <span>Run {selectedAutomation.name}</span>
          </h3>
          
          <p className="text-sm text-gray-400 mb-4">{selectedAutomation.description}</p>
          
          <div className="border border-indigo-500/10 rounded-lg overflow-hidden mb-4">
            <div className="flex items-center justify-between bg-[#121C2E] px-3 py-2">
              <label className="text-sm text-gray-300 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedTasks.length === tasks.length}
                  onChange={handleSelectAllTasks}
                />
                <span>Select all tasks</span>
              </label>
              <span className="text-xs text-gray-400">{selectedTasks.length} selected</span>
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {tasks.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No tasks available</div>
              ) : (
                <div className="divide-y divide-indigo-500/10">
                  {tasks.map((task) => (
                    <div 
                      key={task.id}
                      className={`flex items-center px-3 py-2 hover:bg-[#121C2E]/50 transition-colors ${
                        selectedTasks.includes(task.id) ? 'bg-indigo-600/10' : ''
                      }`}
                    >
                      <label className="flex items-center w-full cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTasks.includes(task.id)}
                          onChange={() => handleSelectTask(task.id)}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-300">{task.patientName}</p>
                          <p className="text-xs text-gray-400">{task.description.substring(0, 60)}...</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            task.status === 'TODO' ? 'bg-blue-900/30 text-blue-300' : 
                            task.status === 'IN_PROGRESS' ? 'bg-amber-900/30 text-amber-300' : 
                            'bg-green-900/30 text-green-300'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              className="px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-colors"
              onClick={() => setSelectedAutomation(null)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
              onClick={handleRunAutomation}
              disabled={selectedTasks.length === 0}
            >
              <Zap className="w-4 h-4" />
              <span>Run Automation</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}