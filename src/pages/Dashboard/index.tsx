import './Dashboard.css';
import { SystemOverview } from '../../components/SystemOverview';
import CommunicationHub from '../../components/Communication Hub/CommunicationHub';
import { useState } from 'react';
import { Badge } from '../../components/Badge';
import { useTheme } from '../../hooks/useTheme';
import { MessageSquare, Activity, ClipboardCheck } from 'lucide-react';
import { TasksView } from '../../components/TasksView/TasksView';

export function Dashboard() {
  const [activeView, setActiveView] = useState<'overview' | 'communication' | 'tasks'>('overview');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation Tabs */}
      <div className={`
        flex space-x-4 p-4
        bg-gradient-to-r from-black/50 via-transparent to-black/50
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
        <Badge
          variant={activeView === 'tasks' ? 'success' : 'default'}
          glow={activeView === 'tasks'}
          onClick={() => setActiveView('tasks')}
          className="cursor-pointer"
          icon={<ClipboardCheck size={16} />}
        >
          Tasks
        </Badge>
      </div>

      {/* Main Content */}
      <div className={`
        flex-1 p-4 overflow-hidden
        bg-gradient-to-br from-black/50 via-transparent to-black/50
      `}>
        <div className={`
          h-full rounded-xl overflow-hidden
          ${isDark 
            ? 'bg-black backdrop-blur-xl border border-white/10' 
            : 'bg-white/80 backdrop-blur-xl shadow-soft'
          }
        `}>
          {activeView === 'overview' ? (
            <SystemOverview />
          ) : activeView === 'communication' ? (
            <CommunicationHub />
          ) : (
            <TasksView />
          )}
        </div>
      </div>
    </div>
  );
}
