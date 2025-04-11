import React from 'react';
import { Task } from '../../types/task';
import { ArrowRight, Calendar, MessageCircle, ExternalLink } from 'lucide-react';

interface ListViewProps {
  tasks: Task[];
  theme: any;
}

export const ListView: React.FC<ListViewProps> = ({ tasks, theme }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-500';
      case 'MEDIUM':
        return 'text-yellow-500';
      case 'LOW':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'DONE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className={`rounded-lg border ${theme.border} ${theme.card} overflow-hidden shadow-md`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${theme.border} text-left`}>
              <th className={`px-4 py-3 font-medium ${theme.text}`}>Patient</th>
              <th className={`px-4 py-3 font-medium ${theme.text}`}>Task</th>
              <th className={`px-4 py-3 font-medium ${theme.text}`}>Due Date</th>
              <th className={`px-4 py-3 font-medium ${theme.text}`}>Priority</th>
              <th className={`px-4 py-3 font-medium ${theme.text}`}>Status</th>
              <th className={`px-4 py-3 font-medium ${theme.text}`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.map((task) => (
              <tr 
                key={task.id} 
                className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    {task.profilePicture ? (
                      <img 
                        src={task.profilePicture} 
                        alt={task.patientName} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className={`w-8 h-8 rounded-full ${theme.accent} flex items-center justify-center`}>
                        <span className="text-white text-sm">
                          {task.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className={`font-medium ${theme.text}`}>{task.patientName}</p>
                      <p className={`text-xs ${theme.text} opacity-60`}>ID: {task.patientId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className={`font-medium ${theme.text}`}>{task.title}</p>
                  <p className={`text-xs ${theme.text} opacity-60 line-clamp-1`}>{task.description}</p>
                </td>
                <td className={`px-4 py-3 ${theme.text}`}>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1 opacity-70" />
                    <span>{task.dueDate}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button 
                      className={`p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${theme.text}`}
                      title="Contact patient"
                    >
                      <MessageCircle size={16} />
                    </button>
                    <button 
                      className={`p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${theme.text}`}
                      title="View details"
                    >
                      <ExternalLink size={16} />
                    </button>
                    <button 
                      className={`p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${theme.text}`}
                      title="Move to next status"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
