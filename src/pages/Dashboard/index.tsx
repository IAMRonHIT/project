import './Dashboard.css';
import { SystemOverview } from '../../components/SystemOverview';
import CommunicationHub from '../../components/Communication Hub/CommunicationHub';
import { useState } from 'react';
import { Badge } from '../../components/Badge';
import { useTheme } from '../../hooks/useTheme';
import { MessageSquare, Activity } from 'lucide-react';

export function Dashboard() {
  const [activeView, setActiveView] = useState<'overview' | 'communication'>('overview');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation Tabs */}
      <div className={`
        flex space-x-4 p-4
        bg-gradient-to-r from-gray-900/50 via-transparent to-gray-900/50
        backdrop-blur-sm border-b border-ron-teal-400/20
      `}>
        <Badge
          variant={activeView === 'overview' ? 'success' : 'default'}
          glow={activeView === 'overview'}
          onClick={() => setActiveView('overview')}
          className="cursor-pointer"
          icon={<Activity size={16} />}
        >
          System Overview
        </Badge>
        <Badge
          variant={activeView === 'communication' ? 'success' : 'default'}
          glow={activeView === 'communication'}
          onClick={() => setActiveView('communication')}
          className="cursor-pointer"
          icon={<MessageSquare size={16} />}
        >
          Communication Hub
        </Badge>
      </div>

      {/* Main Content */}
      <div className={`
        flex-1 p-4 overflow-hidden
        bg-gradient-to-br from-gray-900/50 via-transparent to-gray-900/50
      `}>
        <div className={`
          h-full rounded-xl overflow-hidden
          ${isDark 
            ? 'bg-gray-900/50 backdrop-blur-xl border border-white/5' 
            : 'bg-white/80 backdrop-blur-xl shadow-soft'
          }
        `}>
          {activeView === 'overview' ? (
            <SystemOverview />
          ) : (
            <CommunicationHub />
          )}
        </div>
      </div>
    </div>
  );
}
