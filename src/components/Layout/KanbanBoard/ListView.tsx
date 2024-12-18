import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown, MoreVertical, User, Pencil, Users, UserCircle, Trash2 } from 'lucide-react';
import type { Task } from '../../../src/types/task';
import type { themes } from '../../../src/lib/themes';
import { taskTypeConfig } from '../../../src/utils/taskTypeConfig';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ListViewProps {
  tasks: Task[];
  theme: typeof themes[keyof typeof themes];
}

export function ListView({ tasks, theme }: ListViewProps) {
  const [sortField, setSortField] = useState<'patientName' | 'issueType' | 'priority' | 'dueDate' | 'status'>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: typeof sortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'patientName':
        return a.patientName.localeCompare(b.patientName) * direction;
      case 'issueType':
        return a.issueType.localeCompare(b.issueType) * direction;
      case 'priority': {
        const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        return (priorityOrder[a.priority] - priorityOrder[b.priority]) * direction;
      }
      case 'dueDate':
        return a.dueDate.localeCompare(b.dueDate) * direction;
      case 'status': {
        const statusOrder = { TODO: 0, IN_PROGRESS: 1, DONE: 2 };
        return (statusOrder[a.status] - statusOrder[b.status]) * direction;
      }
      default:
        return 0;
    }
  });

  return (
    <div className={`${theme.cardBg} border ${theme.border} rounded-xl overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${theme.columnBg} border-b ${theme.border}`}>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('patientName')}
                  className={`flex items-center gap-2 ${theme.columnText} hover:text-cyan-400 transition-colors`}
                >
                  Patient
                  {getSortIcon('patientName')}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('issueType')}
                  className={`flex items-center gap-2 ${theme.columnText} hover:text-cyan-400 transition-colors`}
                >
                  Issue Type
                  {getSortIcon('issueType')}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('priority')}
                  className={`flex items-center gap-2 ${theme.columnText} hover:text-cyan-400 transition-colors`}
                >
                  Priority
                  {getSortIcon('priority')}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('dueDate')}
                  className={`flex items-center gap-2 ${theme.columnText} hover:text-cyan-400 transition-colors`}
                >
                  Due Date
                  {getSortIcon('dueDate')}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className={`flex items-center gap-2 ${theme.columnText} hover:text-cyan-400 transition-colors`}
                >
                  Status
                  {getSortIcon('status')}
                </button>
              </th>
              <th className="px-6 py-4 text-left">Care Journey</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sortedTasks.map(task => {
              const Icon = taskTypeConfig[task.issueType]?.icon || User;
              return (
                <tr 
                  key={task.id}
                  className={`${theme.buttonHover} transition-colors cursor-pointer h-20`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        {task.profilePicture ? (
                          <img
                            src={task.profilePicture}
                            alt={task.patientName}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className={`font-medium ${theme.text}`}>{task.patientName}</p>
                        <p className={`text-xs ${theme.textSecondary}`}>{task.patientDOB}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${theme.text}`} />
                      <span className={theme.text}>{task.issueType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-[#1a1f2c] ${
                      task.priority === 'HIGH' ? 'text-red-400' :
                      task.priority === 'MEDIUM' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={theme.text}>{task.dueDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-[#1a1f2c] ${
                      task.status === 'TODO' ? 'text-blue-400' :
                      task.status === 'IN_PROGRESS' ? 'text-purple-400' :
                      'text-green-400'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={theme.text}>{task.careJourney.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-2 hover:bg-cyan-500/10 rounded-full transition-colors">
                        <MoreVertical className="w-5 h-5 text-cyan-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="gap-2">
                          <Pencil className="w-4 h-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Users className="w-4 h-4" />
                          <span>Reassign</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                          <UserCircle className="w-4 h-4" />
                          <span>Patient Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Users className="w-4 h-4" />
                          <span>View Stakeholders</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="gap-2 text-red-400 focus:text-red-300 focus:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete Issue</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}