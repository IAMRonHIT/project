import React, { useState } from 'react';
import { X } from 'lucide-react';

interface PatientContentModalProps {
  onClose: () => void;
  onGenerate: (prompt: string, patientInfo: any, contentType: "care-plan" | "education" | "exercise" | "diet") => Promise<void>;
  patientInfo?: any;
}

const PatientContentModal: React.FC<PatientContentModalProps> = ({ 
  onClose, 
  onGenerate,
  patientInfo = {
    name: 'John Doe',
    id: 'JD-123456',
    age: 45,
    gender: 'Male'
  }
}) => {
  const [contentType, setContentType] = useState<"care-plan" | "education" | "exercise" | "diet">('care-plan');
  const [prompt, setPrompt] = useState('');
  
  if (!onGenerate) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-light text-white">Generate Patient Content</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
            aria-label="Close modal"
            title="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Content Type</label>
          <select 
            value={contentType}
            onChange={(e) => setContentType(e.target.value as "care-plan" | "education" | "exercise" | "diet")}
            className="w-full bg-gray-700 text-white rounded-md p-2"
            aria-label="Content type"
            title="Select content type"
          >
            <option value="care-plan">Care Plan</option>
            <option value="education">Educational Material</option>
            <option value="exercise">Exercise Plan</option>
            <option value="diet">Dietary Guidelines</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Instructions</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            className="w-full bg-gray-700 text-white rounded-md p-3 h-32"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={() => {
              onGenerate(prompt, patientInfo, contentType);
              setPrompt('');
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Generate Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientContentModal;
