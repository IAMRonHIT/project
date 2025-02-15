import React from 'react';
import { Brain, MessageSquare, TrendingUp, AlertTriangle, Book, ArrowRight } from 'lucide-react';
import { Badge } from '../Badge';
import { useTheme } from '../../hooks/useTheme';

interface AIInsightsProps {
  ticketContent: string;
}

const AIInsights: React.FC<AIInsightsProps> = ({ ticketContent }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = 
    ({ title, icon, children }) => (
      <section className="mb-6">
        <h2 className={`
          text-lg font-semibold mb-3 flex items-center gap-2
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}>
          {icon}
          {title}
        </h2>
        {children}
      </section>
    );

  const suggestedResponses = [
    'Thank you for reaching out. I understand your concern, and I am here to help.',
    'I apologize for the inconvenience. Let me assist you with that.',
  ];

  const sentimentAnalysis = {
    sentiment: 'Negative',
    urgency: 'High',
    description: 'The patient seems frustrated and requires immediate attention.',
  };

  const knowledgeBaseArticles = [
    { title: 'Managing Your Prescription', link: '#' },
    { title: 'Understanding Side Effects', link: '#' },
  ];

  const nextBestActions = [
    'Schedule a follow-up appointment',
    'Notify the prescribing physician',
    'Send educational resources',
  ];

  const complianceAlerts = [
    'PHI detected: Ensure secure handling of patient information.',
  ];

  return (
    <div className={`mb-6 ${isDark ? 'text-white/90' : 'text-gray-900'}`}>
      {/* AI Analysis Overview */}
      <Section title="AI Analysis" icon={<Brain className="text-ron-teal-400" />}>
        <div className={`
          p-4 rounded-lg space-y-3
          ${isDark ? 'bg-black/50' : 'bg-white/50'}
          backdrop-blur-sm
          border border-ron-teal-400/20
        `}>
          <div className="flex gap-2">
            <Badge variant="error" glow size="sm">High Priority</Badge>
            <Badge variant="warning" size="sm">Urgent Response Needed</Badge>
          </div>
          <p className="text-sm text-gray-400">{ticketContent}</p>
        </div>
      </Section>

      {/* Sentiment Analysis */}
      <Section title="Patient Sentiment" icon={<TrendingUp className="text-ron-coral-400" />}>
        <div className={`
          p-4 rounded-lg space-y-3
          ${isDark ? 'bg-black/50' : 'bg-white/50'}
          backdrop-blur-sm
          border border-ron-coral-400/20
        `}>
          <div className="flex gap-2">
            <Badge variant="error" glow>{sentimentAnalysis.sentiment}</Badge>
            <Badge variant="warning">{sentimentAnalysis.urgency}</Badge>
          </div>
          <p className="text-sm text-gray-400">{sentimentAnalysis.description}</p>
        </div>
      </Section>

      {/* Suggested Responses */}
      <Section title="AI Suggestions" icon={<MessageSquare className="text-ron-teal-400" />}>
        <div className="space-y-2">
          {suggestedResponses.map((response, index) => (
            <div
              key={index}
              className={`
                p-3 rounded-lg
                ${isDark ? 'bg-black/50' : 'bg-white/50'}
                backdrop-blur-sm
                border border-ron-teal-400/20
                transition-all duration-200
                group cursor-pointer
                hover:shadow-glow-teal
              `}
            >
              <p className="text-sm mb-2">{response}</p>
              <button className={`
                text-xs flex items-center gap-1
                ${isDark ? 'text-ron-teal-400' : 'text-ron-teal-600'}
                group-hover:text-ron-teal-400
                transition-colors
              `}>
                Use Response
                <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Knowledge Base Articles */}
      <Section title="Related Resources" icon={<Book className="text-ron-teal-400" />}>
        <div className="space-y-2">
          {knowledgeBaseArticles.map((article, index) => (
            <a
              key={index}
              href={article.link}
              className={`
                flex items-center gap-2 p-2 rounded-lg
                ${isDark ? 'hover:bg-black/50' : 'hover:bg-white/50'}
                transition-colors
                cursor-pointer
              `}
            >
              <Book size={16} className="text-ron-teal-400" />
              <span className="text-sm">{article.title}</span>
            </a>
          ))}
        </div>
      </Section>

      {/* Next Best Actions */}
      <Section title="Recommended Actions" icon={<ArrowRight className="text-ron-teal-400" />}>
        <div className="space-y-2">
          {nextBestActions.map((action, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-2 p-2 rounded-lg
                ${isDark ? 'hover:bg-black/50' : 'hover:bg-white/50'}
                transition-colors
                cursor-pointer
              `}
            >
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs
                ${isDark ? 'bg-black/50' : 'bg-white/50'}
                border border-ron-teal-400/20
              `}>
                {index + 1}
              </div>
              <span className="text-sm">{action}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Compliance Alerts */}
      {complianceAlerts.length > 0 && (
        <Section title="Compliance Alerts" icon={<AlertTriangle className="text-ron-coral-400" />}>
          <div className={`
            p-4 rounded-lg space-y-2
            ${isDark ? 'bg-ron-coral-400/10' : 'bg-ron-coral-50/50'}
            backdrop-blur-sm
            border border-ron-coral-400/20
          `}>
            {complianceAlerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-ron-coral-400 mt-0.5" />
                <span className="text-sm">{alert}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default AIInsights;
