import React, { useState } from 'react';
import { Copy, Check, X, Edit, Trash2, Plus, Save, Clock, FileText, ArrowRight } from 'lucide-react';
import type { Task, TaskStatus, TaskPriority, TaskType } from '../types';

interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  taskType: TaskType;
  priority: TaskPriority;
  subtasks: string[];
  stakeholders: Array<{
    role: string;
  }>;
}

interface TaskTemplatesProps {
  onCreateTaskFromTemplate: (template: TaskTemplate) => void;
  existingTemplates?: TaskTemplate[];
}

export function TaskTemplates({ onCreateTaskFromTemplate, existingTemplates = [] }: TaskTemplatesProps) {
  const [templates, setTemplates] = useState<TaskTemplate[]>([
    ...existingTemplates,
    {
      id: 'template-1',
      name: 'Medical Prior Authorization',
      description: 'Process a prior authorization request for medical procedure or medication',
      category: 'Administrative',
      taskType: 'ADMINISTRATIVE',
      priority: 'MEDIUM',
      subtasks: [
        'Gather clinical documentation',
        'Complete prior authorization form',
        'Submit to health plan',
        'Follow up on approval status'
      ],
      stakeholders: [
        { role: 'Provider' },
        { role: 'Health Plan' }
      ]
    },
    {
      id: 'template-2',
      name: 'Care Coordination',
      description: 'Coordinate care services between multiple providers',
      category: 'Medical',
      taskType: 'MEDICAL',
      priority: 'HIGH',
      subtasks: [
        'Identify required services',
        'Contact all providers',
        'Schedule appointments',
        'Arrange transportation if needed'
      ],
      stakeholders: [
        { role: 'Provider' },
        { role: 'Facility' }
      ]
    },
    {
      id: 'template-3',
      name: 'Follow-up Appointment',
      description: 'Schedule and coordinate follow-up appointment',
      category: 'Follow-up',
      taskType: 'FOLLOW_UP',
      priority: 'MEDIUM',
      subtasks: [
        'Contact patient',
        'Coordinate with provider',
        'Schedule appointment',
        'Send reminder'
      ],
      stakeholders: [
        { role: 'Provider' }
      ]
    }
  ]);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<TaskTemplate>>({
    name: '',
    description: '',
    category: 'Administrative',
    taskType: 'ADMINISTRATIVE',
    priority: 'MEDIUM',
    subtasks: [],
    stakeholders: []
  });
  const [editingSubtask, setEditingSubtask] = useState('');
  
  const handleTemplateUse = (template: TaskTemplate) => {
    onCreateTaskFromTemplate(template);
  };
  
  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.description) return;
    
    const template: TaskTemplate = {
      id: `template-${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description,
      category: newTemplate.category || 'Administrative',
      taskType: newTemplate.taskType || 'ADMINISTRATIVE',
      priority: newTemplate.priority || 'MEDIUM',
      subtasks: newTemplate.subtasks || [],
      stakeholders: newTemplate.stakeholders || []
    };
    
    setTemplates([...templates, template]);
    setIsCreating(false);
    setNewTemplate({
      name: '',
      description: '',
      category: 'Administrative',
      taskType: 'ADMINISTRATIVE',
      priority: 'MEDIUM',
      subtasks: [],
      stakeholders: []
    });
  };
  
  const handleAddSubtask = () => {
    if (!editingSubtask) return;
    
    setNewTemplate({
      ...newTemplate,
      subtasks: [...(newTemplate.subtasks || []), editingSubtask]
    });
    
    setEditingSubtask('');
  };
  
  const handleRemoveSubtask = (index: number) => {
    const updatedSubtasks = [...(newTemplate.subtasks || [])];
    updatedSubtasks.splice(index, 1);
    
    setNewTemplate({
      ...newTemplate,
      subtasks: updatedSubtasks
    });
  };
  
  const handleAddStakeholder = (role: string) => {
    setNewTemplate({
      ...newTemplate,
      stakeholders: [...(newTemplate.stakeholders || []), { role }]
    });
  };
  
  const handleRemoveStakeholder = (index: number) => {
    const updatedStakeholders = [...(newTemplate.stakeholders || [])];
    updatedStakeholders.splice(index, 1);
    
    setNewTemplate({
      ...newTemplate,
      stakeholders: updatedStakeholders
    });
  };
  
  return (
    <div className="bg-[#121C2E] border border-indigo-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-indigo-300">Task Templates</h2>
        {!isCreating && (
          <button
            className="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-sm flex items-center gap-2 hover:bg-indigo-600/30 transition-colors"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="w-4 h-4" />
            <span>New Template</span>
          </button>
        )}
      </div>
      
      {isCreating ? (
        <div className="bg-[#1A2333] border border-indigo-500/20 rounded-lg p-4 mb-4">
          <h3 className="text-md font-medium text-gray-200 mb-3">Create New Template</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Template Name</label>
              <input
                type="text"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                className="w-full bg-[#121C2E] border border-indigo-500/20 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-indigo-500/50"
                placeholder="e.g., Medical Referral"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                className="w-full bg-[#121C2E] border border-indigo-500/20 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-indigo-500/50 resize-none h-20"
                placeholder="Describe what this template is for..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  className="w-full bg-[#121C2E] border border-indigo-500/20 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="Administrative">Administrative</option>
                  <option value="Medical">Medical</option>
                  <option value="Follow-up">Follow-up</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Priority</label>
                <select
                  value={newTemplate.priority}
                  onChange={(e) => setNewTemplate({ ...newTemplate, priority: e.target.value as TaskPriority })}
                  className="w-full bg-[#121C2E] border border-indigo-500/20 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Task Type</label>
              <select
                value={newTemplate.taskType}
                onChange={(e) => setNewTemplate({ ...newTemplate, taskType: e.target.value as TaskType })}
                className="w-full bg-[#121C2E] border border-indigo-500/20 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-indigo-500/50"
              >
                <option value="ADMINISTRATIVE">Administrative</option>
                <option value="MEDICAL">Medical</option>
                <option value="FOLLOW_UP">Follow-up</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Subtasks</label>
              <div className="space-y-2 mb-2">
                {newTemplate.subtasks?.map((subtask, index) => (
                  <div key={index} className="flex items-center justify-between bg-[#121C2E] p-2 rounded-lg border border-indigo-500/10">
                    <span className="text-sm text-gray-300">{subtask}</span>
                    <button
                      className="p-1 rounded-full text-red-400 hover:bg-red-500/10"
                      onClick={() => handleRemoveSubtask(index)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingSubtask}
                  onChange={(e) => setEditingSubtask(e.target.value)}
                  className="flex-1 bg-[#121C2E] border border-indigo-500/20 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-indigo-500/50"
                  placeholder="Add a subtask..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && editingSubtask) {
                      handleAddSubtask();
                    }
                  }}
                />
                <button
                  className="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors"
                  onClick={handleAddSubtask}
                  disabled={!editingSubtask}
                >
                  Add
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Stakeholder Roles</label>
              <div className="space-y-2 mb-2">
                {newTemplate.stakeholders?.map((stakeholder, index) => (
                  <div key={index} className="flex items-center justify-between bg-[#121C2E] p-2 rounded-lg border border-indigo-500/10">
                    <span className="text-sm text-gray-300">{stakeholder.role}</span>
                    <button
                      className="p-1 rounded-full text-red-400 hover:bg-red-500/10"
                      onClick={() => handleRemoveStakeholder(index)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <select
                  className="flex-1 bg-[#121C2E] border border-indigo-500/20 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-indigo-500/50"
                  onChange={(e) => e.target.value && handleAddStakeholder(e.target.value)}
                  value=""
                >
                  <option value="" disabled>Select a role...</option>
                  <option value="Provider">Provider</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Facility">Facility</option>
                  <option value="Health Plan">Health Plan</option>
                  <option value="Additional Contact">Additional Contact</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-colors"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
                onClick={handleAddTemplate}
                disabled={!newTemplate.name || !newTemplate.description}
              >
                <Save className="w-4 h-4" />
                <span>Save Template</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-indigo-500/30 mx-auto mb-4" />
              <h3 className="text-gray-300 font-medium mb-2">No templates yet</h3>
              <p className="text-gray-500 text-sm mb-4">Create a template to quickly generate common tasks</p>
              <button
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="w-4 h-4" />
                <span>Create Template</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="bg-[#1A2333] border border-indigo-500/20 rounded-lg p-4 hover:border-indigo-500/40 transition-colors">
                  <h3 className="text-md font-semibold text-gray-200 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      template.priority === 'HIGH'
                        ? 'bg-red-900/30 text-red-300'
                        : template.priority === 'MEDIUM'
                          ? 'bg-amber-900/30 text-amber-300'
                          : 'bg-green-900/30 text-green-300'
                    }`}>
                      {template.priority} Priority
                    </span>
                    
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      template.taskType === 'MEDICAL'
                        ? 'bg-blue-900/30 text-blue-300'
                        : template.taskType === 'ADMINISTRATIVE'
                          ? 'bg-purple-900/30 text-purple-300'
                          : 'bg-teal-900/30 text-teal-300'
                    }`}>
                      {template.taskType === 'MEDICAL' ? 'Medical' :
                       template.taskType === 'ADMINISTRATIVE' ? 'Administrative' : 'Follow-up'}
                    </span>
                  </div>
                  
                  {template.subtasks.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-xs font-medium text-gray-400 mb-1">Subtasks</h4>
                      <ul className="text-xs text-gray-300 list-disc list-inside space-y-1">
                        {template.subtasks.map((subtask, index) => (
                          <li key={index}>{subtask}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <button
                      className="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-sm hover:bg-indigo-600/30 transition-colors flex items-center gap-2"
                      onClick={() => handleTemplateUse(template)}
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Use Template</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}