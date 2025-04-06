import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNote, Macro } from '../contexts/NoteContext';

interface NoteMacrosProps {
  onApplyMacro?: (content: string) => void;
}

const NoteMacros: React.FC<NoteMacrosProps> = ({ onApplyMacro }) => {
  const { state, dispatch } = useNote();
  const [isAddingMacro, setIsAddingMacro] = useState(false);
  const [isEditingMacro, setIsEditingMacro] = useState<string | null>(null);
  const [macroName, setMacroName] = useState('');
  const [macroContent, setMacroContent] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle adding a new macro
  const handleAddMacro = () => {
    if (!macroName.trim() || !macroContent.trim()) return;
    
    const newMacro: Macro = {
      id: uuidv4(),
      name: macroName.trim(),
      content: macroContent.trim()
    };
    
    dispatch({ type: 'ADD_MACRO', macro: newMacro });
    
    // Reset form
    setMacroName('');
    setMacroContent('');
    setIsAddingMacro(false);
  };
  
  // Handle updating an existing macro
  const handleUpdateMacro = () => {
    if (!isEditingMacro || !macroName.trim() || !macroContent.trim()) return;
    
    // Remove the old macro
    dispatch({ type: 'REMOVE_MACRO', id: isEditingMacro });
    
    // Add the updated macro
    const updatedMacro: Macro = {
      id: isEditingMacro,
      name: macroName.trim(),
      content: macroContent.trim()
    };
    
    dispatch({ type: 'ADD_MACRO', macro: updatedMacro });
    
    // Reset form
    setMacroName('');
    setMacroContent('');
    setIsEditingMacro(null);
  };
  
  // Handle editing a macro
  const startEditingMacro = (macro: Macro) => {
    setMacroName(macro.name);
    setMacroContent(macro.content);
    setIsEditingMacro(macro.id);
    setIsAddingMacro(true);
  };
  
  // Handle deleting a macro
  const handleDeleteMacro = (id: string) => {
    dispatch({ type: 'REMOVE_MACRO', id });
  };
  
  // Handle applying a macro
  const handleApplyMacro = (macro: Macro) => {
    dispatch({ type: 'APPLY_MACRO', id: macro.id });
    
    if (onApplyMacro) {
      onApplyMacro(macro.content);
    }
    
    setIsDropdownOpen(false);
  };
  
  // Cancel adding/editing a macro
  const handleCancel = () => {
    setMacroName('');
    setMacroContent('');
    setIsAddingMacro(false);
    setIsEditingMacro(null);
  };
  
  return (
    <div className="relative">
      {/* Macro dropdown button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`flex items-center gap-1 p-2 transition-all duration-200 rounded-md text-xs font-medium
          ${isDropdownOpen 
            ? 'text-indigo-400 bg-indigo-500/20 border border-indigo-500/40 shadow-[0_0_5px_rgba(79,70,229,0.4)]' 
            : 'text-gray-400 hover:bg-gray-700/50 hover:text-white border border-transparent'
          }
        `}
        aria-label="Macros"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
        </svg>
        <span>Macros</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      
      {/* Dropdown menu - Dark Mode Styling */}
      {isDropdownOpen && (
        <div className="absolute z-10 right-0 mt-1 w-64 bg-gray-800/95 backdrop-blur-md border border-indigo-500/30 rounded-md shadow-lg shadow-black/50">
          <div className="p-3 max-h-60 overflow-y-auto">
            <h3 className="text-xs font-medium text-indigo-300 mb-3 flex items-center">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2 shadow-[0_0_4px_rgba(79,70,229,0.7)]"></span>
              Your Macros
            </h3>
            
            {state.macros.length === 0 ? (
              <div className="text-xs text-indigo-300/60 p-2">No macros available</div>
            ) : (
              <ul className="space-y-1">
                {state.macros.map(macro => (
                  <li key={macro.id} className="flex items-center justify-between p-2 hover:bg-indigo-500/10 rounded-md border border-transparent hover:border-indigo-500/20 transition-colors">
                    <button
                      onClick={() => handleApplyMacro(macro)}
                      className="text-sm text-left text-gray-300 flex-1 truncate"
                      title={macro.name}
                    >
                      {macro.name}
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEditingMacro(macro)}
                        className="p-1 text-gray-400 hover:text-indigo-400 transition-colors"
                        aria-label={`Edit macro ${macro.name}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteMacro(macro.id)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        aria-label={`Delete macro ${macro.name}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="border-t border-gray-700/50 p-3">
            {isAddingMacro ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={macroName}
                  onChange={(e) => setMacroName(e.target.value)}
                  placeholder="Macro name"
                  className="w-full px-3 py-2 text-xs bg-gray-900/80 text-white border border-indigo-500/30 
                    rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 
                    shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] transition-all"
                  aria-label="Macro name"
                />
                <textarea
                  value={macroContent}
                  onChange={(e) => setMacroContent(e.target.value)}
                  placeholder="Macro content"
                  className="w-full px-3 py-2 text-xs bg-gray-900/80 text-white border border-indigo-500/30 
                    rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 
                    shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] transition-all"
                  rows={3}
                  aria-label="Macro content"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 text-xs text-gray-300 
                      hover:bg-gray-700/50 hover:text-white border border-transparent 
                      hover:border-gray-600/40 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  {isEditingMacro ? (
                    <button
                      onClick={handleUpdateMacro}
                      className="px-3 py-1 text-xs text-white bg-gradient-to-r from-indigo-600 to-indigo-700 
                        rounded-md hover:shadow-[0_0_10px_rgba(79,70,229,0.7)] hover:brightness-110 
                        transition-all duration-200 border border-indigo-500/30
                        disabled:opacity-50 disabled:hover:shadow-none disabled:hover:brightness-100"
                      disabled={!macroName.trim() || !macroContent.trim()}
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      onClick={handleAddMacro}
                      className="px-3 py-1 text-xs text-white bg-gradient-to-r from-indigo-600 to-indigo-700 
                        rounded-md hover:shadow-[0_0_10px_rgba(79,70,229,0.7)] hover:brightness-110 
                        transition-all duration-200 border border-indigo-500/30
                        disabled:opacity-50 disabled:hover:shadow-none disabled:hover:brightness-100"
                      disabled={!macroName.trim() || !macroContent.trim()}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingMacro(true)}
                className="w-full flex items-center justify-center gap-1 px-3 py-1.5 
                  text-xs text-indigo-400 hover:bg-indigo-500/10 rounded-md transition-colors
                  border border-transparent hover:border-indigo-500/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add New Macro
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteMacros;
