import React, { useState } from 'react';
import { NoteIntegration, NoteProvider } from '../components/Note';

const NoteTest: React.FC = () => {
  const [showNote, setShowNote] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Note Component Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Test Controls</h2>
          
          <div className="flex flex-col gap-4">
            <div>
              <button
                onClick={() => setShowNote(!showNote)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                {showNote ? 'Hide Note Button' : 'Show Note Button'}
              </button>
              <p className="mt-2 text-sm text-gray-600">
                Click the button above to show/hide the note button. The note should not open automatically.
              </p>
            </div>
            
            {showNote && (
              <div className="p-4 border border-gray-200 rounded-md relative">
                <p className="text-gray-700 mb-4">
                  This is a test area with a note button. Click the purple button in the bottom-right corner to open the note.
                </p>
                
                <NoteProvider>
                  <NoteIntegration 
                    entityType="Task"
                    buttonPosition="bottom-right"
                    initialContent="Test Note\n\nThis is a test note to verify that the note component doesn't open automatically."
                  />
                </NoteProvider>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Expected Behavior</h2>
          
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>When you click "Show Note Button", a test area with a note button should appear.</li>
            <li>The note should NOT open automatically.</li>
            <li>When you click the purple note button, the note should open.</li>
            <li>When you click the X button in the note, the note should close.</li>
            <li>You can also press the 'n' key to toggle the note open/closed.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NoteTest;
