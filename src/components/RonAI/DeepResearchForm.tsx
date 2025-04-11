import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DeepResearchFormProps {
  // Optional patient list if the research is patient-related
  patients?: { id: string; name: string }[];
}

const DeepResearchForm: React.FC<DeepResearchFormProps> = ({ patients }) => {
  const [isPatientRelated, setIsPatientRelated] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [researchPrompt, setResearchPrompt] = useState('');
  const [researchReport, setResearchReport] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEnhancePrompt = async () => {
    if (!researchPrompt.trim()) return;
    setIsEnhancing(true);
    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: researchPrompt,
          model: "gemini-2.0-flash-thinking-exp-01-21"
        })
      });
      if (!response.ok) throw new Error('Enhancement failed');
      const data = await response.json();
      if (data.enhancedPrompt) {
        setResearchPrompt(data.enhancedPrompt);
      }
    } catch (error) {
      console.error('Error enhancing prompt:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = async () => {
    if (!researchPrompt.trim()) return;
    setIsSubmitting(true);
    try {
      const payload: any = { researchPrompt };
      if (isPatientRelated && selectedPatient) {
        payload.patientId = selectedPatient;
      }
      const response = await fetch('/api/deepresearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Deep research request failed');
      const data = await response.json();
      setResearchReport(data.report);
    } catch (error) {
      console.error('Error submitting deep research:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-gray-900/80 rounded-md shadow-md">
      <h2 className="text-white text-lg font-medium mb-3">Deep Research</h2>
      <div className="mb-3">
        <label className="text-gray-300 text-sm">
          Research Topic:
        </label>
<textarea title="Research Topic" 
          value={researchPrompt} 
          onChange={(e) => setResearchPrompt(e.target.value)} 
          rows={3} 
          className="w-full p-2 mt-1 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Enter your research query..."
        />
      </div>
      <div className="mb-3 flex items-center">
<input title="Patient Research Toggle" 
          type="checkbox" 
          checked={isPatientRelated}
          onChange={(e) => setIsPatientRelated(e.target.checked)}
          className="mr-2"
        />
        <span className="text-gray-300 text-sm">Is this research about a patient?</span>
      </div>
      {isPatientRelated && patients && (
        <div className="mb-3">
          <label className="text-gray-300 text-sm">Select Patient:</label>
<select title="Select Patient" 
            value={selectedPatient} 
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="w-full p-2 mt-1 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">-- Select Patient --</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>{patient.name}</option>
            ))}
          </select>
        </div>
      )}
      <div className="flex space-x-2 mb-3">
        <button 
          onClick={handleEnhancePrompt}
          disabled={isEnhancing}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm focus:outline-none"
        >
          {isEnhancing ? 'Enhancing...' : 'Enhance Prompt'}
        </button>
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm focus:outline-none"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Research'}
        </button>
      </div>
      {researchReport && (
        <div className="mt-4">
          <h3 className="text-indigo-300 text-sm font-medium mb-2">Research Report:</h3>
          <div className="p-3 bg-gray-800 border border-indigo-500 rounded text-gray-300 text-xs whitespace-pre-wrap">
            {researchReport}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeepResearchForm;
