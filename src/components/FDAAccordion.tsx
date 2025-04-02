import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';

interface FDASection {
  title: string;
  content: string;
  isWarning?: boolean;
}

interface FDAAccordionProps {
  sections: FDASection[];
  meta?: {
    disclaimer?: string;
    searchQuery?: string;
  };
}

const FDAAccordion: React.FC<FDAAccordionProps> = ({ sections, meta }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionTitle)) {
        next.delete(sectionTitle);
      } else {
        next.add(sectionTitle);
      }
      return next;
    });
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gradient-to-b from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-indigo-500/30 bg-gray-800/50 relative">
        {/* Decorative elements */}
        <div className="absolute left-0 top-0 w-1/3 h-0.5 bg-gradient-to-r from-indigo-500/80 to-transparent"></div>
        <div className="absolute right-0 bottom-0 w-1/4 h-0.5 bg-gradient-to-l from-teal-500/80 to-transparent"></div>
        
        <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_5px_rgba(79,70,229,0.5)]">
            <AlertCircle className="w-4 h-4 text-indigo-400" />
          </div>
          Drug Information
        </h2>
        {meta?.disclaimer && (
          <p className="text-sm text-indigo-300/80">{meta.disclaimer}</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-3">
        {sections.map(section => (
          <div
            key={section.title}
            className={`
              rounded-lg overflow-hidden transition-all duration-200
              ${expandedSections.has(section.title) 
                ? 'bg-gray-900/90 border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
                : 'bg-gray-900/60 border border-indigo-500/20 shadow-[0_0_10px_rgba(79,70,229,0.2)] hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]'
              }
              ${section.isWarning ? 'border-red-500/30' : ''}
              backdrop-blur-sm
            `}
          >
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between p-4 group relative overflow-hidden"
            >
              {/* Subtle animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 
                group-hover:opacity-100 opacity-0 transition-opacity duration-300 animate-pulse-glow"></div>
              
              <div className="flex items-center gap-3 relative z-10">
                {section.isWarning ? (
                  <div className="p-1.5 rounded-md bg-red-500/10 border border-red-500/20 shadow-[0_0_5px_rgba(239,68,68,0.5)]">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  </div>
                ) : (
                  <div className="p-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_5px_rgba(79,70,229,0.5)]">
                    <AlertCircle className="w-4 h-4 text-indigo-400" />
                  </div>
                )}
                <h3 className={`text-sm font-medium transition-colors duration-200 ${
                  section.isWarning 
                    ? 'text-red-400 group-hover:text-red-300' 
                    : 'text-indigo-400 group-hover:text-indigo-300'
                }`}>
                  {section.title}
                </h3>
              </div>
              <div className={`transition-transform duration-200 relative z-10 ${
                expandedSections.has(section.title) ? 'rotate-180' : ''
              }`}>
                <ChevronDown className={`${
                  section.isWarning ? 'text-red-400' : 'text-indigo-400'
                }`} size={16} />
              </div>
            </button>
            
            {expandedSections.has(section.title) && (
              <div className="px-4 pb-4">
                <div className={`prose prose-sm max-w-none ${
                  section.isWarning 
                    ? 'prose-headings:text-red-300 prose-p:text-red-200 prose-strong:text-red-400' 
                    : 'prose-headings:text-indigo-300 prose-p:text-gray-300 prose-strong:text-indigo-400'
                }`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeSanitize]}
                    components={{
                      strong: ({ children }) => (
                        <strong className={section.isWarning ? 'text-red-400' : 'text-indigo-400'}>
                          {children}
                        </strong>
                      ),
                      blockquote: ({ children }) => (
                        <div className="flex items-start gap-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg my-4
                          shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                          <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={18} />
                          <blockquote className="m-0 text-red-200 text-sm leading-relaxed">
                            {children}
                          </blockquote>
                        </div>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-4 rounded-lg border border-indigo-500/30 
                          shadow-[0_0_10px_rgba(79,70,229,0.2)]">
                          <table className="min-w-full divide-y divide-indigo-500/30">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th className="px-4 py-3 bg-indigo-500/10 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-4 py-3 text-sm text-gray-300 border-t border-indigo-500/30">
                          {children}
                        </td>
                      ),
                      ul: ({ children }) => (
                        <ul className="space-y-2 list-disc list-inside marker:text-indigo-400">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="space-y-2 list-decimal list-inside marker:text-indigo-400">
                          {children}
                        </ol>
                      ),
                      a: ({ children, href }) => (
                        <a 
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 transition-colors underline 
                            decoration-indigo-400/30 hover:decoration-indigo-300 hover:shadow-[0_0_10px_rgba(79,70,229,0.4)]"
                        >
                          {children}
                        </a>
                      )
                    }}
                  >
                    {section.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FDAAccordion;
