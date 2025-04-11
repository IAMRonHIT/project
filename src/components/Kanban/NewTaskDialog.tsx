import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface NewTaskDialogProps {
  // In a real implementation, this would accept an onCreateTask function
}

export const NewTaskDialog: React.FC<NewTaskDialogProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would create a new task
    closeDialog();
  };

  return (
    <>
      <button
        onClick={openDialog}
        className="bg-white text-[#00425A] hover:bg-white/90 px-4 py-2 rounded-lg font-medium flex items-center gap-1.5 transition-colors duration-150"
        title="Create new task"
      >
        <Plus size={16} />
        <span>New Task</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeDialog}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Close dialog"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create New Task</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Task title"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Task description"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      defaultValue="MEDIUM"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Patient
                  </label>
                  <select
                    id="patientId"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>Select a patient</option>
                    <option value="12345">Jane Doe</option>
                    <option value="12346">John Smith</option>
                    <option value="12347">Robert Johnson</option>
                    <option value="12348">Sarah Williams</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Issue Type
                  </label>
                  <select
                    id="issueType"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>Select issue type</option>
                    <option value="Authorization">Authorization</option>
                    <option value="Treatment Task">Treatment Task</option>
                    <option value="Care Plan">Care Plan</option>
                    <option value="In Office Appointment">In Office Appointment</option>
                    <option value="Telehealth">Telehealth</option>
                    <option value="Form Request">Form Request</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
