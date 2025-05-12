import React, { useState } from 'react';
import { Book, Clock, AlertTriangle, CheckCircle, ChevronRight, Stethoscope, FileQuestion, FileText, User } from 'lucide-react';

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
  const [activeCategory, setActiveCategory] = useState('patient-details');
  const [expandedCareJourney, setExpandedCareJourney] = useState<string | null>('diabetes');

  // Section Component with consistent styling
  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-5">
      <h3 className="text-md font-semibold mb-3 text-white/90 px-4">{title}</h3>
      {children}
    </div>
  );

  // Status Badge with appropriate styling
  const StatusBadge: React.FC<{ type: 'success' | 'warning' | 'info' | 'error'; children: React.ReactNode; icon?: React.ReactNode }> =
    ({ type, children, icon }) => {
      const baseClasses = "px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1.5";
      const typeClasses = {
        success: "bg-emerald-500/20 text-emerald-400",
        warning: "bg-amber-500/20 text-amber-400",
        info: "bg-blue-500/20 text-blue-400",
        error: "bg-rose-500/20 text-rose-400"
      };

      return (
        <span className={`${baseClasses} ${typeClasses[type]}`}>
          {icon}
          {children}
        </span>
      );
    };

  // Category sections and data
  const patientDetails = {
    name: "John Doe",
    id: "#PAT-1234",
    dob: "05/12/1975",
    insurance: "Blue Shield",
    primaryCare: "Dr. Emily Parker"
  };

  const careJourneys = [
    {
      id: "diabetes",
      name: "Diabetes Management",
      status: "active",
      items: [
        { id: "insulin", name: "Insulin Authorization", status: "pending", type: "auth" },
        { id: "endo-referral", name: "Endocrinologist Referral", status: "approved", type: "referral" }
      ]
    },
    {
      id: "cardiac",
      name: "Cardiac Care",
      status: "active",
      items: [
        { id: "stress-test", name: "Stress Test Authorization", status: "in-review", type: "auth" }
      ]
    }
  ];

  // Enhanced categories with icons and counts
  const categories = [
    {
      id: 'patient-details',
      label: 'Patient Details',
      icon: <User className="w-[18px] h-[18px]" />,
    },
    {
      id: 'clinical-reviews',
      label: 'Clinical Reviews',
      icon: <Stethoscope className="w-[18px] h-[18px]" />,
      count: careJourneys.reduce((acc, journey) => acc + journey.items.length, 0),
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <FileText className="w-[18px] h-[18px]" />,
      count: tasks.length,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <AlertTriangle className="w-[18px] h-[18px]" />,
      count: notifications.length,
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: <Book className="w-[18px] h-[18px]" />,
      count: 3,
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-900/90 via-gray-800/90 to-gray-900/90 min-w-0 backdrop-blur-sm overflow-y-auto">
      {/* Patient Card */}
      <div className="p-4 border-b border-indigo-500/30 bg-gradient-to-br from-gray-800/80 to-gray-900/80">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-teal-500/20 border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
              <span className="text-indigo-300 font-medium">JD</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 bg-emerald-500 shadow-[0_0_5px_rgba(79,70,229,0.5)]"></div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">John Doe</h3>
            <p className="text-xs text-indigo-300/80">ID: #PAT-1234</p>
          </div>
        </div>
      </div>

      {/* Navigation Categories */}
      <div className="flex-1 overflow-y-auto">
        {categories.map(category => (
          <div key={category.id} className="border-b border-gray-700/50">
            <button
              onClick={() => setActiveCategory(category.id)}
              className={`w-full px-4 py-3 flex items-center justify-between transition-all duration-200 relative group ${
                activeCategory === category.id
                  ? 'bg-indigo-600/20 border-l-2 border-indigo-500'
                  : 'hover:bg-indigo-600/10 border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md transition-colors duration-200 ${
                  activeCategory === category.id
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'text-gray-400 group-hover:text-indigo-400'
                }`}>
                  {category.icon}
                </div>
                <span className={`text-sm transition-colors duration-200 ${
                  activeCategory === category.id ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}>{category.label}</span>
                {category.count !== undefined && category.count > 0 && (
                  <span className={`px-1.5 py-0.5 text-xs rounded-full transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    {category.count}
                  </span>
                )}
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${
                activeCategory === category.id ? 'rotate-90' : ''
              }`} />
            </button>

            {/* Patient Details Section Content */}
            {activeCategory === 'patient-details' && category.id === 'patient-details' && (
              <div className="p-4 space-y-4 bg-black/20">
                <div className="space-y-2">
                  {Object.entries(patientDetails).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-sm text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clinical Reviews Section Content */}
            {activeCategory === 'clinical-reviews' && category.id === 'clinical-reviews' && (
              <div className="bg-black/20">
                {careJourneys.map(journey => (
                  <div key={journey.id} className="px-2">
                    <button
                      onClick={() => setExpandedCareJourney(expandedCareJourney === journey.id ? null : journey.id)}
                      className={`w-full px-3 py-2.5 flex items-center justify-between text-sm transition-colors ${
                        expandedCareJourney === journey.id ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <span className="text-gray-100">{journey.name}</span>
                      <span className="px-1.5 py-0.5 text-xs bg-white/10 rounded-full text-gray-400">
                        {journey.items.length}
                      </span>
                    </button>

                    {/* Reviews under Care Journey */}
                    {expandedCareJourney === journey.id && (
                      <div className="p-2 space-y-2">
                        {journey.items.map(item => (
                          <div key={item.id} className="p-3 bg-white/5 rounded-lg">
                            <div className="text-sm text-gray-100 mb-1">{item.name}</div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-400">{item.type}</span>
                              <StatusBadge
                                type={
                                  item.status === 'approved' ? 'success' :
                                  item.status === 'pending' ? 'warning' :
                                  item.status === 'in-review' ? 'info' : 'error'
                                }
                              >
                                {item.status}
                              </StatusBadge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tasks Section Content */}
            {activeCategory === 'tasks' && category.id === 'tasks' && (
              <div className="p-3 space-y-2 bg-black/20">
                {tasks.map((task, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-white/5 border border-indigo-500/10 hover:border-indigo-500/30 cursor-pointer transition-all duration-200"
                  >
                    <p className="text-sm font-medium text-white mb-2">{task.task}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Due: {task.due}
                      </span>
                      <StatusBadge
                        type={
                          task.priority === 'High' ? 'error' :
                          task.priority === 'Medium' ? 'warning' : 'info'
                        }
                      >
                        {task.priority}
                      </StatusBadge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Notifications Section Content */}
            {activeCategory === 'notifications' && category.id === 'notifications' && (
              <div className="p-3 space-y-2 bg-black/20">
                {notifications.map((note, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-white/5 border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-200"
                  >
                    <span className="block text-xs text-gray-400 mb-1">{note.time}</span>
                    <p className="text-sm text-white">{note.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Resources Section Content */}
            {activeCategory === 'resources' && category.id === 'resources' && (
              <div className="p-3 space-y-1 bg-black/20">
                {[
                  'Prior Authorization Guidelines',
                  'Appeals Process Overview',
                  'InterQual Criteria Updates'
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-white/5 cursor-pointer"
                  >
                    <Book size={16} className="text-indigo-400" />
                    <span className="text-sm text-white">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSideBar;
