import './Dashboard.css';
import React, { useState } from 'react';
import { SystemOverview } from '../../components/SystemOverview';
import CommunicationHub from '../../components/Communication Hub/CommunicationHub';
import { Badge } from '../../components/Badge';
import { useTheme } from '../../hooks/useTheme';
import { MessageSquare, Activity, ClipboardCheck } from 'lucide-react';
import { TasksView } from '../../components/TasksView/TasksView';

export function Dashboard() {
  const [activeView, setActiveView] = useState<'overview' | 'communication' | 'tasks'>('overview');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-full flex flex-col p-4 bg-gradient-to-br from-black/50 via-transparent to-black/50">
      <div className="flex-1 rounded-xl bg-black/5 backdrop-blur-xl border border-white/10">
        {activeView === 'overview' ? (
          <SystemOverview />
        ) : activeView === 'communication' ? (
          <CommunicationHub />
        ) : (
          <TasksView />
        )}
      </div>
    </div>
  );
}
