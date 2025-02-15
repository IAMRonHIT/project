import React from 'react';
import { Book, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '../Badge';
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

interface LeftSideBarProps {
  notifications: Notification[];
  tasks: Task[];
}

const LeftSideBar: React.FC<LeftSideBarProps> = ({ notifications, tasks }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
      <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className={`
      w-80 p-4 overflow-y-auto
      ${isDark ? 'bg-black' : 'bg-white/80'}
      backdrop-blur-xl
      border-r border-ron-teal-400/20
    `}>
      {/* Request Details */}
      <Section title="Request Details">
        <div className={`
          p-4 rounded-lg space-y-4
          ${isDark ? 'bg-black/50' : 'bg-white/50'}
          backdrop-blur-sm
          border border-ron-teal-400/20
        `}>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-gray-400">Patient</span>
              <span className={isDark ? 'text-white' : 'text-gray-900'}>John Doe</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="text-gray-400">Status</span>
              <Badge variant="warning" glow size="sm">Pending Approval</Badge>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-400">Service</span>
              <span className={isDark ? 'text-white' : 'text-gray-900'}>ACL Surgery</span>
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-400">Timeline</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="success" icon={<CheckCircle size={12} />} size="sm">
                  Request Submitted
                </Badge>
                <span className="text-xs text-gray-400">09:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="warning" icon={<AlertTriangle size={12} />} size="sm">
                  Info Requested
                </Badge>
                <span className="text-xs text-gray-400">10:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" icon={<CheckCircle size={12} />} size="sm">
                  Info Received
                </Badge>
                <span className="text-xs text-gray-400">10:30 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="info" icon={<Clock size={12} />} size="sm">
                  Under Review
                </Badge>
                <span className="text-xs text-gray-400">11:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <div className="space-y-2">
          {notifications.map((note, index) => (
            <div
              key={index}
              className={`
                p-3 rounded-lg
                ${isDark ? 'bg-black/50' : 'bg-white/50'}
                backdrop-blur-sm
                border border-ron-teal-400/20
                transition-all duration-200
                hover:shadow-glow-teal
              `}
            >
              <span className="block text-xs text-gray-400">{note.time}</span>
              <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{note.message}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Tasks */}
      <Section title="Tasks">
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <div
              key={index}
              className={`
                p-3 rounded-lg cursor-pointer
                ${isDark ? 'bg-black/50' : 'bg-white/50'}
                backdrop-blur-sm
                border border-ron-teal-400/20
                transition-all duration-200
                hover:shadow-glow-teal
              `}
            >
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {task.task}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">Due: {task.due}</span>
                <Badge
                  variant={
                    task.priority === 'High' ? 'error' :
                    task.priority === 'Medium' ? 'warning' : 'info'
                  }
                  size="sm"
                >
                  {task.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Knowledge Base */}
      <Section title="Knowledge Base">
        <div className="space-y-2">
          {[
            'Prior Authorization Guidelines',
            'Appeals Process Overview',
            'InterQual Criteria Updates'
          ].map((item, index) => (
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

export default LeftSideBar;
