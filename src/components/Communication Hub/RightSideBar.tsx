import React from 'react';
import { Users, Search, Book } from 'lucide-react';
import AIInsights from './AIInsight';
import KnowledgeBase from './KnowledgeBase';
import { useTheme } from '../../hooks/useTheme';

const RightSideBar: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const ticketContent = "Sample ticket content for AI analysis.";

  const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = 
    ({ title, icon, children }) => (
      <div className="mb-6">
        <h3 className={`
          text-lg font-semibold mb-4 flex items-center gap-2
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}>
          {icon}
          {title}
        </h3>
        {children}
      </div>
    );

  const stakeholders = [
    { name: 'Dr. Emily Smith', role: 'Orthopedic Surgeon' },
    { name: 'Sarah Johnson', role: 'Case Manager' },
    { name: 'John Doe', role: 'Patient' },
    { name: 'Mark Davis', role: 'Insurance Rep' }
  ];

  const timeline = [
    { time: '09:00 AM', event: 'Request Submitted', status: 'complete' },
    { time: '10:00 AM', event: 'Additional Info Requested', status: 'complete' },
    { time: '10:30 AM', event: 'Info Received from Dr. Smith', status: 'complete' },
    { time: '11:00 AM', event: 'Under Review', status: 'current' }
  ];

  const knowledgeBaseItems = [
    'How to initiate a Peer-to-Peer review?',
    'Understanding CMS Final Rule',
    'Submitting Clinical Documentation'
  ];

  return (
    <div className={`
      w-80 p-4 overflow-y-auto
      ${isDark ? 'bg-black' : 'bg-white/80'}
      backdrop-blur-xl
      border-l border-ron-teal-400/20
    `}>
      {/* AI Insights */}
      <AIInsights ticketContent={ticketContent} />

      {/* Knowledge Base */}
      <KnowledgeBase ticketContent={ticketContent} />

      {/* Stakeholders */}
      <Section title="Stakeholders" icon={<Users size={20} className="text-ron-teal-400" />}>
        <div className="space-y-2">
          {stakeholders.map((person, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-3 p-2 rounded-lg cursor-pointer
                ${isDark ? 'hover:bg-black/50' : 'hover:bg-white/50'}
                transition-colors
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                bg-ron-teal-400/10 text-ron-teal-400
                border border-ron-teal-400/20
              `}>
                {person.name.charAt(0)}
              </div>
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {person.name}
                </p>
                <p className="text-xs text-gray-400">{person.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Event Timeline */}
      <Section title="Event Timeline">
        <div className="relative pl-4">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-ron-teal-400/50 via-ron-teal-400/20 to-transparent" />
          <div className="space-y-4">
            {timeline.map((event, index) => (
              <div key={index} className="relative">
                <div className={`
                  absolute -left-[13px] top-1.5 w-3 h-3 rounded-full
                  ${event.status === 'current' 
                    ? 'bg-ron-coral-400 shadow-glow-coral animate-pulse' 
                    : 'bg-ron-teal-400 shadow-glow-teal'
                  }
                `} />
                <span className="text-xs text-gray-400">{event.time}</span>
                <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {event.event}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Knowledge Base Search */}
      <Section title="Knowledge Base" icon={<Book size={20} className="text-ron-teal-400" />}>
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
        <div className="space-y-2">
          {knowledgeBaseItems.map((item, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-2 p-2 rounded-lg cursor-pointer
                ${isDark ? 'hover:bg-black/50' : 'hover:bg-white/50'}
                transition-colors
              `}
            >
              <Book size={16} className="text-ron-teal-400" />
              <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default RightSideBar;
