import React from 'react';
import { NoteIntegration, NoteProvider } from '../components/Note';

const NoteDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Note Component Demo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* FDA Results Example */}
          <div className="bg-white p-6 rounded-lg shadow-md relative">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">FDA Results</h2>
            <p className="text-gray-600 mb-4">
              This example shows how the Note component integrates with FDA results.
              Click the note button in the top-right corner to add notes about this FDA data.
            </p>
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">Sample FDA Data</h3>
              <p className="text-blue-700 text-sm">
                Drug: Acetaminophen<br />
                Dosage: 500mg<br />
                Warnings: May cause liver damage if taken in excess
              </p>
            </div>
            
            <NoteProvider>
              <NoteIntegration 
                entityType="CarePlan"
                buttonPosition="top-right"
                initialContent="FDA Results Notes:\n\nDrug: Acetaminophen\nDosage: 500mg\nWarnings: May cause liver damage if taken in excess\n\n"
              />
            </NoteProvider>
          </div>
          
          {/* PubMed Results Example */}
          <div className="bg-white p-6 rounded-lg shadow-md relative">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">PubMed Results</h2>
            <p className="text-gray-600 mb-4">
              This example shows how the Note component integrates with PubMed results.
              Click the note button in the top-right corner to add notes about this research.
            </p>
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">Sample PubMed Article</h3>
              <p className="text-green-700 text-sm">
                Title: Effects of Acetaminophen on Liver Function<br />
                Authors: Smith J, Johnson M<br />
                Journal: Medical Research Today, 2024
              </p>
            </div>
            
            <NoteProvider>
              <NoteIntegration 
                entityType="CareJourney"
                buttonPosition="top-right"
                initialContent="PubMed Research Notes:\n\nTitle: Effects of Acetaminophen on Liver Function\nAuthors: Smith J, Johnson M\nJournal: Medical Research Today, 2024\n\n"
              />
            </NoteProvider>
          </div>
          
          {/* Care Journey Example */}
          <div className="bg-white p-6 rounded-lg shadow-md relative">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Care Journey</h2>
            <p className="text-gray-600 mb-4">
              This example shows how the Note component integrates with a Care Journey.
              Click the note button to add notes about this patient's care journey.
            </p>
            <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
              <h3 className="font-medium text-purple-800 mb-2">Diabetes Management</h3>
              <p className="text-purple-700 text-sm">
                Patient: John Doe<br />
                Started: January 15, 2025<br />
                Status: Active<br />
                Next Appointment: April 20, 2025
              </p>
            </div>
            
            <NoteProvider>
              <NoteIntegration 
                entityType="CareJourney"
                entityId="diabetes-123"
                entityName="Diabetes Management - John Doe"
                buttonPosition="bottom-right"
                initialContent="Care Journey Notes:\n\nPatient: John Doe\nJourney: Diabetes Management\nStatus: Active\nNext Appointment: April 20, 2025\n\n"
              />
            </NoteProvider>
          </div>
          
          {/* Task Example */}
          <div className="bg-white p-6 rounded-lg shadow-md relative">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Task</h2>
            <p className="text-gray-600 mb-4">
              This example shows how the Note component integrates with a Task.
              Click the note button to add notes about this task.
            </p>
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
              <h3 className="font-medium text-amber-800 mb-2">Follow-up Call</h3>
              <p className="text-amber-700 text-sm">
                Task: Call patient to discuss lab results<br />
                Due: April 10, 2025<br />
                Priority: High<br />
                Assigned to: Dr. Sarah Johnson
              </p>
            </div>
            
            <NoteProvider>
              <NoteIntegration 
                entityType="Task"
                entityId="task-456"
                entityName="Follow-up Call - Lab Results"
                buttonPosition="inline"
                buttonClassName="absolute bottom-6 right-6"
                initialContent="Task Notes:\n\nTask: Call patient to discuss lab results\nDue: April 10, 2025\nPriority: High\nAssigned to: Dr. Sarah Johnson\n\n"
              />
            </NoteProvider>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">How to Use the Note Component</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800">Opening a Note</h3>
              <p className="text-gray-600">
                Click the note button (pencil icon) or press the 'n' key to open a note.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800">Text Highlighting</h3>
              <p className="text-gray-600">
                Click the highlight button in the toolbar, then select text anywhere on the page to add it to your note.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800">Screenshots</h3>
              <p className="text-gray-600">
                Click the screenshot button in the toolbar to capture a screenshot of the page or a specific area.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800">Voice Input</h3>
              <p className="text-gray-600">
                Click the microphone button in the toolbar to add text using speech-to-text.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800">Macros</h3>
              <p className="text-gray-600">
                Click the macros button to create and use text macros for frequently used content.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800">Attaching to Entities</h3>
              <p className="text-gray-600">
                Use the attachment button to link your note to a specific entity like a Ticket, Care Journey, etc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDemo;
