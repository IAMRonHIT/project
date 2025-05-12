import React from 'react';
import { Users, Search, Book, Brain, CheckCircle, Clock, Bot, Sparkles } from 'lucide-react';
import AIInsights from './AIInsight';
import KnowledgeBase from './KnowledgeBase';

const RightSideBar: React.FC = () => {
  const ticketContent = "Sample ticket content for AI analysis.";

  // Section component with consistent styling
  const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> =
    ({ title, icon, children }) => (
      <div className="mb-5 px-4">
        <h3 className="text-md font-semibold mb-3 flex items-center gap-2 text-white/90">
          {icon && <span className="text-indigo-400">{icon}</span>}
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

  const insights = [
    { title: "Similar Case Identified", content: "Patient with similar clinical presentation was approved for this procedure last month." },
    { title: "Medical Policy Alert", content: "Recent change to policy 4.5B may affect authorization criteria." },
    { title: "Documentation Recommendation", content: "Request operative report to support medical necessity." }
  ];

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-900/90 via-gray-800/90 to-gray-900/90 min-w-0 backdrop-blur-sm overflow-y-auto">
      {/* AI Assistant Card */}
      <div className="p-4 border-b border-indigo-500/30 bg-gradient-to-br from-gray-800/80 to-gray-900/80">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-teal-500/20 border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 bg-emerald-500 shadow-[0_0_5px_rgba(79,70,229,0.5)]"></div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
            <p className="text-xs text-indigo-300/80">Ready to help</p>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <Section title="AI Insights" icon={<Brain size={18} />}>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="p-3 rounded-lg bg-white/5 border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-200">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-indigo-300 mb-1">{insight.title}</h4>
                  <p className="text-xs text-white/80">{insight.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Stakeholders Section */}
      <Section title="Team Members" icon={<Users size={18} />}>
        <div className="space-y-2">
          {stakeholders.map((person, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {person.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{person.name}</p>
                <p className="text-xs text-gray-400">{person.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Event Timeline */}
      <Section title="Case Timeline" icon={<Clock size={18} />}>
        <div className="relative pl-4 pr-2">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-indigo-500/50 via-indigo-500/20 to-transparent" />
          <div className="space-y-4">
            {timeline.map((event, index) => (
              <div key={index} className="relative">
                <div className={`absolute -left-[13px] top-1.5 w-3 h-3 rounded-full ${event.status === 'current'
                  ? 'bg-indigo-400 shadow-[0_0_10px_rgba(79,70,229,0.5)] animate-pulse'
                  : 'bg-indigo-500/70 shadow-[0_0_5px_rgba(79,70,229,0.3)]'}`} />
                <span className="text-xs text-gray-400">{event.time}</span>
                <p className="text-sm text-white">{event.event}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Knowledge Base */}
      <Section title="Quick References" icon={<Book size={18} />}>
        <div className="relative rounded-lg overflow-hidden mb-4 bg-gray-900/90 border border-indigo-500/30 transition-all duration-200 focus-within:border-indigo-400/50 focus-within:shadow-[0_0_10px_rgba(79,70,229,0.4)] backdrop-blur-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search references..."
            className="block w-full pl-10 pr-3 py-2 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          {[
            'Prior Authorization Guidelines',
            'InterQual Criteria Updates',
            'Documentation Requirements'
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
            >
              <Book size={16} className="text-indigo-400" />
              <span className="text-sm text-white">{item}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default RightSideBar;
