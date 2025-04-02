import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDown } from 'lucide-react';

interface PubMedSection {
  title: string;
  content: string;
}

interface PubMedResponse {
  type: 'pubmed';
  sections: Array<PubMedSection>;
  meta?: {
    totalResults?: number;
    searchQuery?: string;
  };
}

interface PubMedResponseManagerProps {
  data: PubMedResponse;
}

const PubMedResponseManager: React.FC<PubMedResponseManagerProps> = ({ data }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['🔍 Search Results', '📝 Citation']));

  const toggleSection = (sectionId: string) => {
    const newExpandedSections = new Set(expandedSections);
    if (newExpandedSections.has(sectionId)) {
      newExpandedSections.delete(sectionId);
    } else {
      newExpandedSections.add(sectionId);
    }
    setExpandedSections(newExpandedSections);
  };

  useEffect(() => {
    console.log('PubMedResponseManager received data:', data);
    console.log('Rendering sections:', data.sections);
  }, [data]);
  
  return (
    <div className="font-sans bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-4">
          <h1 className="text-2xl font-bold">
            PubMed Search Results
          </h1>
          {data.meta?.totalResults && (
            <p className="text-sm text-green-100">
              Found {data.meta.totalResults} {data.meta.totalResults === 1 ? 'result' : 'results'}
            </p>
          )}
        </div>

        {/* Sections */}
        <div className="divide-y divide-gray-200">
          {data.sections.map((section, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-gray-900 font-medium">
                  {section.title}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                    expandedSections.has(section.title) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedSections.has(section.title) ? 'max-h-[2000px]' : 'max-h-0'
                }`}
              >
                <div className="p-4 bg-gray-50">
                  <div className="prose max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {section.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {data.meta?.searchQuery && (
          <div className="p-4 bg-gray-100 text-gray-600 text-sm">
            <p className="italic">Search query: {data.meta.searchQuery}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PubMedResponseManager;
