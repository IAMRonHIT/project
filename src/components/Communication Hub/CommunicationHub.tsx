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
    <div className="h-full flex flex-col">
      <TopNav />
      <div className="flex-1 flex min-h-0"> 
        {/* Left Sidebar - Scrollable */}
        <div className="w-80 min-h-0 overflow-y-auto">
          <LeftSideBar notifications={notifications} tasks={tasks} />
        </div>
        
        {/* Center Panel - Keep message bar in view */}
        <div className="flex-1 flex flex-col min-h-0">
          <CenterPanel />
        </div>
        
        {/* Right Sidebar - Scrollable */}
        <div className="w-80 min-h-0 overflow-y-auto">
          <RightSideBar />
        </div>
      </div>
    </div>
  );
};

export default CommunicationHub;
