import React, { useState, useEffect } from 'react';
import { Search, Book, Share2, FileText, ExternalLink } from 'lucide-react';
import { Badge } from '../Badge';
import { useTheme } from '../../hooks/useTheme';

interface Article {
  id: number;
  title: string;
  summary: string;
  link: string;
  relevance: number;
  tags?: string[];
}

interface KnowledgeBaseProps {
  ticketContent: string;
}

// Mock data and functions
const mockSuggestedArticles: Article[] = [
  {
    id: 1,
    title: 'Managing Side Effects of Medication X',
    summary: 'Learn how to manage common side effects associated with Medication X.',
    link: '#',
    relevance: 0.9,
    tags: ['Medication', 'Side Effects', 'Patient Care']
  },
  {
    id: 2,
    title: 'Guidelines for Prescription Refills',
    summary: 'Understand the process for refilling prescriptions safely and efficiently.',
    link: '#',
    relevance: 0.85,
    tags: ['Prescriptions', 'Guidelines', 'Safety']
  },
];

const mockSearchResults: Article[] = [
  {
    id: 3,
    title: 'Best Practices for Patient Communication',
    summary: 'Enhance your communication skills with patients for better outcomes.',
    link: '#',
    relevance: 0.8,
    tags: ['Communication', 'Best Practices']
  },
  {
    id: 4,
    title: 'Understanding Patient Sentiment',
    summary: 'Learn how to interpret and respond to patient emotions effectively.',
    link: '#',
    relevance: 0.75,
    tags: ['Patient Care', 'Psychology']
  },
];

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ ticketContent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    setArticles(mockSuggestedArticles);
  }, [ticketContent]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() !== '') {
      setArticles(mockSearchResults);
    } else {
      setArticles(mockSuggestedArticles);
    }
  };

  return (
    <div className="mb-6">
      {/* Search Bar */}
      <div className={`
        relative rounded-lg overflow-hidden mb-4
        ${isDark ? 'bg-black/50' : 'bg-white/50'}
        backdrop-blur-sm
        border
        ${isDark 
          ? 'border-ron-teal-400/20 focus-within:border-ron-teal-400/40' 
          : 'border-ron-teal-200/50 focus-within:border-ron-teal-400/60'
        }
        transition-all duration-200
        focus-within:shadow-glow-teal
      `}>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search Knowledge Base..."
          className={`
            block w-full pl-10 pr-3 py-2
            bg-transparent text-sm
            ${isDark ? 'text-white' : 'text-gray-900'}
            placeholder:text-gray-400
            focus:outline-none
          `}
        />
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div
              key={article.id}
              className={`
                p-4 rounded-lg
                ${isDark ? 'bg-black/50' : 'bg-white/50'}
                backdrop-blur-sm
                border border-ron-teal-400/20
                transition-all duration-200
                hover:shadow-glow-teal
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className={`
                    text-base font-semibold mb-2
                    ${isDark ? 'text-white' : 'text-gray-900'}
                  `}>
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">{article.summary}</p>
                  
                  {/* Tags */}
                  {article.tags && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {article.tags.map((tag, idx) => (
                        <Badge key={idx} variant="info" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className={`
                      flex items-center gap-1 text-xs
                      ${isDark ? 'text-ron-teal-400' : 'text-ron-teal-600'}
                      hover:text-ron-teal-400
                      transition-colors
                    `}>
                      <ExternalLink size={14} />
                      Open Article
                    </button>
                    <button className={`
                      flex items-center gap-1 text-xs
                      ${isDark ? 'text-ron-teal-400' : 'text-ron-teal-600'}
                      hover:text-ron-teal-400
                      transition-colors
                    `}>
                      <Share2 size={14} />
                      Share
                    </button>
                    <button className={`
                      flex items-center gap-1 text-xs
                      ${isDark ? 'text-ron-teal-400' : 'text-ron-teal-600'}
                      hover:text-ron-teal-400
                      transition-colors
                    `}>
                      <FileText size={14} />
                      Add to Notes
                    </button>
                  </div>
                </div>

                {/* Relevance Indicator */}
                <Badge
                  variant={article.relevance > 0.85 ? 'success' : 'info'}
                  glow={article.relevance > 0.85}
                  size="sm"
                >
                  {Math.round(article.relevance * 100)}% Match
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className={`
            p-4 rounded-lg text-center
            ${isDark ? 'bg-black/50' : 'bg-white/50'}
            backdrop-blur-sm
            border border-ron-teal-400/20
          `}>
            <Book className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-400">No articles found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
