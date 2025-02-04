import React from 'react';
import type { Task } from '../types/task';
import type { ThemeConfig } from '../lib/themes';

interface ListViewProps {
  tasks: Task[];
  theme: ThemeConfig;
}

export function ListView({ tasks, theme }: ListViewProps) {
  return (
    <div className="p-6">
      <div className={`
        rounded-xl overflow-hidden
        ${theme.cardBg}
        border ${theme.border}
      `}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${theme.columnBg} border-b ${theme.border}`}>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${theme.text}`}>Ticket</th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${theme.text}`}>Patient</th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${theme.text}`}>Description</th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${theme.text}`}>Priority</th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${theme.text}`}>Due Date</th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${theme.text}`}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr 
                  key={task.id}
                  className={`
                    border-b ${theme.border}
                    ${theme.hover}
                    transition-colors duration-200
                  `}
                >
                  <td className={`px-6 py-4 ${theme.text}`}>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{task.ticketNumber}</span>
                      <span className={theme.muted}>{task.title}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 ${theme.text}`}>
                    <div className="flex items-center gap-2">
                      <img
                        src={task.profilePicture}
                        alt={task.patientName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{task.patientName}</div>
                        <div className={`text-sm ${theme.muted}`}>ID: {task.patientId}</div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 ${theme.muted}`}>
                    <div className="max-w-md truncate">
                      {task.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      px-2 py-1 text-xs rounded
                      ${task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                        task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'}
                    `}>
                      {task.priority}
                    </span>
                  </td>
                  <td className={`px-6 py-4 ${theme.text}`}>
                    {task.dueDate}
                  </td>
                  <td className={`px-6 py-4 ${theme.text}`}>
                    <span className={`
                      px-2 py-1 text-xs rounded
                      ${task.status === 'TODO' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'}
                    `}>
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}