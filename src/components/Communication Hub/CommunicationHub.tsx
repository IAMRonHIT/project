import React from 'react';
import TopNav from './TopNav';
import LeftSideBar from './LeftSideBar';
import CenterPanel from './CenterPanel';
import RightSideBar from './RightSideBar';
import { useTheme } from '../../hooks/useTheme';

interface Notification {
  time: string;
  message: string;
}

interface Task {
  task: string;
  due: string;
  priority: string;
}

const CommunicationHub: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const notifications: Notification[] = [
    {
      time: '11:00 AM',
      message: 'You have 3 Level 1 appeals nearing their deadline tomorrow.',
    },
    {
      time: '11:15 AM',
      message: 'New documents received from Dr. Lee.',
    },
    {
      time: 'Yesterday',
      message: 'System update completed successfully.',
    },
  ];

  const tasks: Task[] = [
    {
      task: 'Review Appeal for Patient Jane Doe',
      due: 'Today',
      priority: 'High',
    },
    {
      task: 'Schedule Peer-to-Peer with Dr. Brown',
      due: 'Tomorrow',
      priority: 'Medium',
    },
    {
      task: 'Update Clinical Guidelines',
      due: 'Next Week',
      priority: 'Low',
    },
  ];

  return (
    <div className={`
      h-full flex flex-col
      ${isDark ? 'bg-gray-900/50' : 'bg-white/80'}
      backdrop-blur-xl
    `}>
      <TopNav />
      <div className="flex-1 flex overflow-hidden">
        <LeftSideBar notifications={notifications} tasks={tasks} />
        <CenterPanel />
        <RightSideBar />
      </div>
    </div>
  );
};

export default CommunicationHub;
