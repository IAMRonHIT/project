import React from 'react';
import { X, Search, RefreshCw } from 'lucide-react';
import ResearchAccordion from './ResearchAccordion';

interface DeepResearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  researchData: any;
  patientInfo: {
    name: string;
    age: string;
    gender: string;
    condition: string;
  };
}

const DeepResearchPanel: React.FC<DeepResearchPanelProps> = ({
  isOpen,
  onClose,
  researchData,
  patientInfo
}) => {
  return (
    <div 
      className={`
        fixed top-0 right-0 bottom-0 
        w-1/3 min-w-[380px] max-w-[480px] 
        bg-gradient-to-b from-gray-900 to-gray-950
        border-l border-gray-700/50 
        flex flex-col z-50 
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 shadow-2xl shadow-black/50' : 'translate-x-full'}
      `}
    >
      {/* Header */}
      <div className="flex flex-col border-b border-gray-700/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Search className="text-blue-400" size={20} />
            <h3 className="text-lg font-semibold text-white">Deep Research</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Research Status */}
        <div className="px-4 pb-3 flex items-center gap-2 text-sm text-gray-400">
          <RefreshCw className="animate-spin" size={14} />
          <span>Analyzing clinical data...</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ResearchAccordion
          sections={researchData.structured.sections}
          patientInfo={patientInfo}
        />
      </div>
    </div>
  );
};

export default DeepResearchPanel;
