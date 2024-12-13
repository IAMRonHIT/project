import React, { useState } from 'react';
import { Search, Plus, X, FolderPlus } from 'lucide-react';
import { Button } from './ui/button';
import type { Task } from '../types/task';
import { taskTypeConfig } from '../utils/taskTypeConfig';
import { CareJourneySearch } from './CareJourneySearch';
import { NewCareJourneyDialog } from './NewCareJourneyDialog';

interface Stakeholder {
  id: string;
  name: string;
  role: 'Guardian' | 'Provider' | 'Facility' | 'Health Plan' | 'Additional Contact';
  email?: string;
  phone?: string;
}

export function NewTaskForm() {
  const [selectedPatient, setSelectedPatient] = useState<{
    id: string;
    name: string;
    dob: string;
    profilePicture?: string;
  } | null>(null);
  
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [selectedCareJourney, setSelectedCareJourney] = useState<{
    id: string;
    name: string;
    parentId?: string;
    relatedTasks?: Array<{
      id: string;
      ticketNumber: string;
      title: string;
      issueType: string;
    }>;
  } | null>(null);
  const [selectedParentTask, setSelectedParentTask] = useState<{
    id: string;
    ticketNumber: string;
    title: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePatientSearch = (query: string) => {
    // TODO: Implement patient search
    console.log('Searching for patient:', query);
  };

  const handleAddStakeholder = (stakeholder: Stakeholder) => {
    setStakeholders([...stakeholders, stakeholder]);
  };

  const handleRemoveStakeholder = (stakeholderId: string) => {
    setStakeholders(stakeholders.filter(s => s.id !== stakeholderId));
  };

  return (
    <div className="space-y-6">
      {/* Patient Search */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-cyan-400">Patient</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-600" />
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full pl-10 pr-4 py-2 bg-[#020817] border border-cyan-900/30 rounded-lg text-cyan-400 placeholder:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handlePatientSearch(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Care Journey Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-cyan-400">Care Journey</label>
          <NewCareJourneyDialog />
        </div>
        <CareJourneySearch
          onSelect={setSelectedCareJourney}
          selectedPatient={selectedPatient}
        />
        {selectedCareJourney && (
          <div className="p-3 bg-[#020817] border border-cyan-900/30 rounded-lg">
            <p className="text-cyan-400 font-medium">{selectedCareJourney.name}</p>
            <p className="text-sm text-cyan-600">ID: {selectedCareJourney.id}</p>
            {selectedCareJourney.relatedTasks && selectedCareJourney.relatedTasks.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-cyan-500 mb-2">Related Tasks:</p>
                <select
                  className="w-full px-4 py-2 bg-[#020817] border border-cyan-900/30 rounded-lg text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  onChange={(e) => {
                    const task = selectedCareJourney.relatedTasks?.find(
                      t => t.id === e.target.value
                    );
                    if (task) {
                      setSelectedParentTask({
                        id: task.id,
                        ticketNumber: task.ticketNumber,
                        title: task.title
                      });
                    }
                  }}
                >
                  <option value="">Select a related task...</option>
                  {selectedCareJourney.relatedTasks.map(task => (
                    <option key={task.id} value={task.id}>
                      {task.ticketNumber} - {task.title} ({task.issueType})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Details */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-cyan-400">Task Type</label>
        <select className="w-full px-4 py-2 bg-[#020817] border border-cyan-900/30 rounded-lg text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500">
          {Object.keys(taskTypeConfig).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Priority & Due Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-cyan-400">Priority</label>
          <select className="w-full px-4 py-2 bg-[#020817] border border-cyan-900/30 rounded-lg text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-cyan-400">Due Date</label>
          <input
            type="date"
            className="w-full px-4 py-2 bg-[#020817] border border-cyan-900/30 rounded-lg text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-cyan-400">Description</label>
        <textarea
          className="w-full px-4 py-2 bg-[#020817] border border-cyan-900/30 rounded-lg text-cyan-400 placeholder:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[100px]"
          placeholder="Enter task description..."
        />
      </div>

      {/* Stakeholders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-cyan-400">Stakeholders</label>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Stakeholder
          </Button>
        </div>
        
        {/* Stakeholder List */}
        <div className="space-y-2">
          {stakeholders.map((stakeholder) => (
            <div
              key={stakeholder.id}
              className="flex items-center justify-between p-3 bg-[#020817] border border-cyan-900/30 rounded-lg"
            >
              <div>
                <p className="text-cyan-400">{stakeholder.name}</p>
                <p className="text-sm text-cyan-600">{stakeholder.role}</p>
              </div>
              <button
                onClick={() => handleRemoveStakeholder(stakeholder.id)}
                className="p-1 hover:bg-cyan-950 rounded-full"
              >
                <X className="w-4 h-4 text-cyan-600" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 mt-6 border-t border-cyan-900/30">
        <Button className="w-full">Create Task</Button>
      </div>
    </div>
  );
}