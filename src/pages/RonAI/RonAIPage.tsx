import React, { FC } from 'react';
import RonAIExperience from '../../components/RonAI/RonExperience';
import PatientDataTest from '../../components/Test/PatientDataTest';
import { useNotePanel } from '../../hooks';
import Sidebar from '../../components/Sidebar';

export const RonAIPage: FC = () => {
  const [showTest, setShowTest] = React.useState(false);
  
  const { openNote } = useNotePanel();
  
  const handleSaveNotes = () => {
    const timestamp = new Date().toLocaleString();
    let notesContent = `IntelAgents Conversation Notes\nDate: ${timestamp}\n\n`;
    
    // Add actual conversation data here
    // For now, adding placeholder text
    notesContent += `This is a placeholder for IntelAgents conversation notes.\n`;
    notesContent += `You can add your notes about this IntelAgents session here.\n\n`;
    
    openNote(notesContent);
  };

  return (
    <div className="h-full">
      <div className="grid gap-4">
        <div className="flex items-center justify-between bg-ron-light-surface dark:bg-ron-dark-surface p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">IntelAgents</h1>
          
          <div className="flex gap-2">
            <button
              onClick={handleSaveNotes}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Save to Notes
            </button>
            
            <button
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={() => setShowTest(!showTest)}
            >
              {showTest ? 'Hide Test Data' : 'Show Test Data'}
            </button>
          </div>
        </div>
        
        {showTest && (
          <div className="absolute top-16 right-4 z-50 w-96 bg-gray-800 rounded-lg shadow-xl">
            <PatientDataTest />
          </div>
        )}
        
        <RonAIExperience />
      </div>
    </div>
  );
};
