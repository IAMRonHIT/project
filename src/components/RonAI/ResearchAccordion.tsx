import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  FileText, 
  Stethoscope, 
  ClipboardList, 
  Activity, 
  LineChart, 
  Brain, 
  BookOpen 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';

interface Section {
  id: string;
  title: string;
  content: string[];
  markdown: string;
}

interface ResearchAccordionProps {
  sections: Section[];
  patientInfo: {
    name: string;
    age: string;
    gender: string;
    condition: string;
  };
  researchReport?: string | null;
}

const ResearchAccordion: React.FC<ResearchAccordionProps> = ({
  sections,
  patientInfo,
  researchReport
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Map section IDs to icons
  const sectionIcons: Record<string, React.ReactNode> = {
    'assessment': <Stethoscope className="text-blue-400" size={18} />,
    'diagnosis': <ClipboardList className="text-green-400" size={18} />,
    'planning': <FileText className="text-purple-400" size={18} />,
    'intervention': <Activity className="text-orange-400" size={18} />,
    'evaluation': <LineChart className="text-yellow-400" size={18} />,
    'clinical-reasoning': <Brain className="text-pink-400" size={18} />,
    'sources': <BookOpen className="text-teal-400" size={18} />
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Patient Info Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800/50">
        <h2 className="text-lg font-semibold text-white mb-1">
          {patientInfo.name}
        </h2>
        <p className="text-sm text-gray-400">
          {patientInfo.age} year old {patientInfo.gender} • {patientInfo.condition}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-3">
        {sections.map(section => (
          <div
            key={section.id}
            className={`
              border border-gray-700/50 rounded-lg overflow-hidden
              shadow-lg shadow-black/10
              transition-all duration-200
              ${expandedSections.includes(section.id) ? 'bg-gray-800/30' : 'bg-gray-800/10 hover:bg-gray-800/20'}
            `}
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-3 group"
            >
              <div className="flex items-center gap-3">
                {sectionIcons[section.id]}
                <h3 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                  {section.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {section.content.length > 0 && (
                  <span className="text-xs text-gray-500 px-2 py-1 rounded-full bg-gray-800">
                    {section.content.length} items
                  </span>
                )}
                {expandedSections.includes(section.id) ? (
                  <ChevronUp className="text-gray-400 group-hover:text-blue-400 transition-colors" size={16} />
                ) : (
                  <ChevronDown className="text-gray-400 group-hover:text-blue-400 transition-colors" size={16} />
                )}
              </div>
            </button>
            
            {expandedSections.includes(section.id) && (
              <div className="px-4 pb-4 pt-2">
                {section.markdown ? (
                  <div className="prose prose-invert prose-sm max-w-none prose-headings:text-blue-300 prose-p:text-gray-300 prose-strong:text-blue-400">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeSanitize]}
                      components={{
                        // Custom component for clinical terms
                        strong: ({ children }) => (
                          <strong className="text-blue-400">{children}</strong>
                        ),
                        // Custom component for warnings/alerts
                        blockquote: ({ children }) => (
                          <div className="flex items-start gap-3 p-3 bg-red-900/20 border border-red-700/50 rounded-lg my-4">
                            <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={18} />
                            <blockquote className="m-0 text-red-200 text-sm leading-relaxed">{children}</blockquote>
                          </div>
                        ),
                        // Enhanced table styling
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-4 rounded-lg border border-gray-700/50">
                            <table className="min-w-full divide-y divide-gray-700/50">
                              {children}
                            </table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="px-4 py-3 bg-gray-800/50 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="px-4 py-3 text-sm text-gray-300 border-t border-gray-700/50">
                            {children}
                          </td>
                        ),
                        // Enhanced list styling
                        ul: ({ children }) => (
                          <ul className="space-y-2 list-disc list-inside marker:text-blue-400">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="space-y-2 list-decimal list-inside marker:text-blue-400">
                            {children}
                          </ol>
                        ),
                        // Highlight references
                        a: ({ children, href }) => (
                          <a 
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-400/30 hover:decoration-blue-300"
                          >
                            {children}
                          </a>
                        ),
                        // Enhanced code block support
                        code: ({ node, className, children, ...props }: any) => {
                          const match = /language-(\w+)/.exec(className || '');
                          const language = match ? match[1] : '';
                          const isJsx = language === 'jsx' || language === 'tsx';
                          const inline = !className || !/language-/.test(className);
                          
                          return !inline ? (
                            <div className="relative">
                              <pre className={`rounded-lg p-4 my-4 bg-gray-900 overflow-auto ${isJsx ? 'text-blue-300' : ''}`}>
                                <code
                                  className={className}
                                  {...props}
                                >
                                  {children}
                                </code>
                              </pre>
                              {language && (
                                <div className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-gray-800 text-gray-400">
                                  {language.toUpperCase()}
                                </div>
                              )}
                            </div>
                          ) : (
                            <code
                              className={`px-1 py-0.5 rounded bg-gray-800 text-blue-300 font-mono text-sm ${className}`}
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {section.markdown}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <ul className="space-y-2 text-sm text-gray-300">
                    {section.content.map((item, index) => (
                      <li 
                        key={index} 
                        className="flex items-start gap-2 group"
                      >
                        <span className="text-blue-400 mt-1">•</span>
                        <span className="flex-1 group-hover:text-gray-200 transition-colors">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
        {researchReport && (
          <div
            className={`
              rounded-lg overflow-hidden
              border border-indigo-500/30 shadow-[0_0_5px_rgba(79,70,229,0.3),inset_0_0_5px_rgba(79,70,229,0.1)]
              shadow-lg shadow-black/10
              bg-gradient-to-b from-indigo-900/10 via-purple-900/10 to-indigo-900/10
              transition-all duration-200
            `}
          >
            <div className="p-3">
              <h3 className="text-sm font-medium text-white mb-2">Deep Research Report</h3>
              <div className="text-sm text-gray-300 whitespace-pre-wrap">
                {researchReport}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchAccordion;
