import React, { useState } from 'react';
import ChatTab from './ChatTab';
import EmailTab from './EmailTab';
import PhoneTab from './PhoneTab';
import VideoTab from './VideoTab';
import DocumentsTab from './Documents';
import { Badge } from '../Badge';
import { MessageSquare, Mail, Phone, Video, FileText } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

type Tab = 'chat' | 'email' | 'phone' | 'video' | 'documents';

interface TabConfig {
  id: Tab;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const CenterPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
    <div className={`
      flex-1 flex flex-col
      ${isDark ? 'bg-black' : 'bg-white/80'}
      backdrop-blur-xl
    `}>
      <div className={`
        flex space-x-4 p-4
        bg-gradient-to-r from-black/50 via-transparent to-black/50
        backdrop-blur-sm border-b border-ron-teal-400/20
      `}>
        {tabs.map((tab) => (
          <Badge
            key={tab.id}
            variant={activeTab === tab.id ? 'success' : 'default'}
            glow={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="cursor-pointer"
            icon={tab.icon}
            size="sm"
          >
            {tab.label}
          </Badge>
        ))}
      </div>
      <div className="flex-1 p-4 bg-gradient-to-b from-black/50 to-transparent">
        {/* Keep video component mounted to prevent unnecessary reinitializations */}
        {tabs.map(tab => (
          <div key={tab.id} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
            {tab.component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CenterPanel;
