import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function NewTaskDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          bg-white/10 text-white
          hover:bg-white/20 transition-colors duration-200
        `}
      >
        <PlusCircle size={20} />
        <span className="hidden sm:inline">New Task</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`
            w-full max-w-2xl rounded-xl p-6
            ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}
            ${theme === 'light' ? 'text-gray-900' : 'text-white'}
          `}>
            <h2 className="text-2xl font-bold mb-6">Create New Task</h2>
            
            <form className="space-y-4">
              {/* Form fields would go here */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`
                    px-4 py-2 rounded-lg
                    ${theme === 'light' ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-700'}
                  `}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700"
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
}