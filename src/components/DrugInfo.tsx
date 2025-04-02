import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DrugInfoProps {
  data: {
    meta?: {
      last_updated?: string;
      disclaimer?: string;
    };
    results: Array<{
      boxed_warning?: string | string[];
      [key: string]: unknown;
    }>;
  };
}

type MarkdownProps = {
  node?: unknown;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

const remarkPlugins = [remarkGfm];

const DrugInfo: React.FC<DrugInfoProps> = ({ data }) => {
  if (!data || !data.results || data.results.length === 0) {
    return <div>No drug information found.</div>;
  }

    // Helper function to format content for markdown rendering
    const formatContent = (content?: string[] | string | Record<string, any>): string => {
        if (!content) {
            return '';
        }

        if (Array.isArray(content)) {
            return content.join('\n\n');
        }

        if (typeof content === 'object') {
            return '```json\n' + JSON.stringify(content, null, 2) + '\n```';
        }

        return String(content);
    };

    // Helper function to safely render content with potential HTML tables
    const renderContent = (content?: string[] | string | Record<string, any>) => {
        const formattedContent = formatContent(content);
        
        // If content contains HTML tables, use dangerouslySetInnerHTML
        if (formattedContent.includes('<table')) {
            return <div dangerouslySetInnerHTML={{ __html: formattedContent }} />;
        }

        // Otherwise use ReactMarkdown for better formatting
        return (
            <ReactMarkdown 
                remarkPlugins={remarkPlugins}
                className="prose max-w-none"
                components={{
                    // Style headers within markdown
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2" {...props} />,
                    // Style links
                    a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                    // Style lists
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                    // Style code blocks
                    code: ({inline, ...props}: MarkdownProps) => 
                        inline ? 
                            <code className="bg-gray-100 rounded px-1" {...props} /> :
                            <code className="block bg-gray-100 p-4 rounded" {...props} />,
                    // Style blockquotes
                    blockquote: ({node, ...props}) => 
                        <blockquote className="border-l-4 border-gray-200 pl-4 italic" {...props} />
                }}
            >
                {formattedContent}
            </ReactMarkdown>
        );
    };

  return (
    <div className="font-sans bg-gray-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">Drug Information</h1>
          {data.meta && (
            <div className="space-y-1 text-sm opacity-90">
              {data.meta.last_updated && (
                <p>Last Updated: {data.meta.last_updated}</p>
              )}
              {data.meta.disclaimer && (
                <p className="text-xs">{data.meta.disclaimer}</p>
              )}
            </div>
          )}
        </div>

        <div className="p-6 space-y-8">
          {data.results.map((drug: any, index: number) => (
            <div key={index} className="space-y-6">
              {drug.boxed_warning && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-900 p-6 rounded-r-lg shadow-sm" role="alert">
                  <h2 className="text-xl font-bold mb-3 flex items-center">
                    <span className="mr-2">⚠️</span>
                    Boxed Warning
                  </h2>
                  <div className="prose max-w-none text-red-800">
                    {renderContent(drug.boxed_warning)}
                  </div>
                </div>
              )}

              {Object.entries(drug)
                .filter(([key, value]) => {
                  if (!value || key === 'boxed_warning') return false;
                  if (typeof value === 'object' && Object.keys(value).length === 0) return false;
                  return true;
                })
                .sort(([a], [b]) => {
                  // Custom sort order for important sections
                  const order = [
                    'description',
                    'indications_and_usage',
                    'dosage_and_administration',
                    'warnings',
                    'contraindications',
                    'adverse_reactions',
                    'drug_interactions'
                  ];
                  const aIndex = order.indexOf(a);
                  const bIndex = order.indexOf(b);
                  if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
                  if (aIndex === -1) return 1;
                  if (bIndex === -1) return -1;
                  return aIndex - bIndex;
                })
                .map(([key, value]) => {
                  const title = key
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                  return (
                    <section key={key} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <h2 className="text-lg font-semibold bg-gray-50 px-6 py-4 border-b border-gray-200">
                        {title}
                      </h2>
                      <div className="p-6 prose max-w-none">
                        {renderContent(value as string | string[] | Record<string, any>)}
                      </div>
                    </section>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrugInfo;
