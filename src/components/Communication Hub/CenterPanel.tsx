import React, { useState } from 'react';
import ChatTab from './ChatTab';
import EmailTab from './EmailTab';
import PhoneTab from './PhoneTab';
import VideoTab from './VideoTab';
import DocumentsTab from './Documents';
import { MessageSquare, Mail, Phone, Video, FileText } from 'lucide-react';

type Tab = 'chat' | 'email' | 'phone' | 'video' | 'documents';

interface TabConfig {
  id: Tab;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const CenterPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  const tabs: TabConfig[] = React.useMemo(() => [
    {
      id: 'chat',
      label: 'Chat',
      icon: <MessageSquare size={16} />,
      component: <ChatTab />
    },
    {
      id: 'email',
      label: 'Email',
      icon: <Mail size={16} />,
      component: <EmailTab />
    },
    {
      id: 'phone',
      label: 'Phone',
      icon: <Phone size={16} />,
      component: <PhoneTab />
    },
    {
      id: 'video',
      label: 'Video',
      icon: <Video size={16} />,
      component: <VideoTab />
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText size={16} />,
      component: <DocumentsTab />
    }
  ], []); // Memoize tabs configuration

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Tabs Navigation */}
      <div className="flex p-3 border-b border-indigo-500/30 bg-gray-900/70">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${activeTab === tab.id
                ? 'bg-indigo-600/20 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.15)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <div className={activeTab === tab.id ? 'text-indigo-400' : ''}>
                {tab.icon}
              </div>
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden bg-gradient-to-b from-gray-900/30 to-gray-800/30">
        {/* Keep all components mounted to prevent unnecessary reinitializations, but only show active */}
        {tabs.map(tab => (
          <div key={tab.id} className={`h-full ${activeTab === tab.id ? 'block' : 'hidden'}`}>
            {tab.component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CenterPanel;
