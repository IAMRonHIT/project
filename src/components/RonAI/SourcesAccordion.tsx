import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Link as LinkIcon } from 'lucide-react';
import type { Citation } from '../../services/perplexityService'; // Assuming Citation type is exported

interface SourcesAccordionProps {
  sources: Citation[];
}

const SourcesAccordion: React.FC<SourcesAccordionProps> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) {
    return null;
  }

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mt-3 border border-gray-700/50 rounded-lg overflow-hidden shadow-md bg-gray-800/20">
      <button
        onClick={toggleAccordion}
        className="w-full flex items-center justify-between p-3 group hover:bg-gray-700/30 transition-colors"
        aria-expanded={isOpen}
        aria-controls="sources-content"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="text-teal-400" size={18} />
          <h3 className="text-sm font-medium text-gray-200 group-hover:text-teal-300 transition-colors">
            Sources ({sources.length})
          </h3>
        </div>
        {isOpen ? (
          <ChevronUp className="text-gray-400 group-hover:text-teal-300 transition-colors" size={16} />
        ) : (
          <ChevronDown className="text-gray-400 group-hover:text-teal-300 transition-colors" size={16} />
        )}
      </button>
      {isOpen && (
        <div id="sources-content" className="px-4 pb-4 pt-2 border-t border-gray-700/50">
          <ul className="space-y-2 text-sm">
            {sources.map((source, index) => (
              <li key={source.id || `source-${index}`} className="flex items-start gap-2 group">
                <LinkIcon className="text-gray-500 group-hover:text-teal-400 transition-colors mt-1 flex-shrink-0" size={14} />
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline transition-colors break-all"
                  title={source.url}
                >
                  {source.title || source.url}
                </a>
                {source.text && <p className="text-xs text-gray-400 mt-0.5">- {source.text}</p>}
              </li>
            ))}
          </ul>
          {sources.length === 0 && <p className="text-xs text-gray-500">No sources provided.</p>}
        </div>
      )}
    </div>
  );
};

export default SourcesAccordion;
