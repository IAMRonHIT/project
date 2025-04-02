import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import type { Task } from '../../types/task';
import { themes } from '../../lib/themes';
import { KanbanBoard } from '../Kanban/KanbanBoard';
import { ViewSwitcher } from '../Kanban/Views/ViewSwitcher';
import { CareJourneySearch } from '../Kanban/Search/CareJourneySearch';
import { CalendarView } from '../Layout/KanbanBoard/CalendarView/index';
import { ListView } from '../Kanban/Views/ListView';

// Define prop types for the components
interface CareJourneySearchProps {
  onSearch: (query: string) => void;
  theme: typeof themes[keyof typeof themes];
}

interface ViewSwitcherProps {
  currentView: 'kanban' | 'calendar' | 'list';
  onViewChange: (view: 'kanban' | 'calendar' | 'list') => void;
  theme: typeof themes[keyof typeof themes];
}

export function TasksView() {
  const { theme: currentTheme } = useTheme();
  const theme = themes[currentTheme];
  const [view, setView] = useState<'kanban' | 'calendar' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review Patient Records',
      description: 'Review and update patient medical records',
      status: 'TODO',
      priority: 'HIGH',
      assignee: 'Dr. Smith',
      dueDate: new Date().toISOString(),
      issueType: 'MEDICAL',
      patientName: 'John Doe',
      patientDOB: '1980-01-01',
      ticketNumber: 'TKT-001',
    },
    {
      id: '2',
      title: 'Schedule Follow-up',
      description: 'Schedule follow-up appointment for patient',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      assignee: 'Nurse Johnson',
      dueDate: new Date().toISOString(),
      issueType: 'FOLLOW_UP',
      patientName: 'Jane Smith',
      patientDOB: '1975-06-15',
      ticketNumber: 'TKT-002',
    },
    {
      id: '3',
      title: 'Update Treatment Plan',
      description: 'Review and update current treatment plan',
      status: 'TODO',
      priority: 'HIGH',
      assignee: 'Dr. Wilson',
      dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      issueType: 'MEDICAL',
      patientName: 'Robert Brown',
      patientDOB: '1990-03-22',
      ticketNumber: 'TKT-003',
    },
    {
      id: '4',
      title: 'Process Insurance Claim',
      description: 'Submit and process insurance claim documents',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      assignee: 'Admin Staff',
      dueDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      issueType: 'ADMINISTRATIVE',
      patientName: 'Sarah Wilson',
      patientDOB: '1988-11-30',
      ticketNumber: 'TKT-004',
    },
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTaskMove = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleTaskEdit = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower) ||
      (task.patientName?.toLowerCase().includes(searchLower) ?? false) ||
      task.assignee.toLowerCase().includes(searchLower) ||
      (task.ticketNumber?.toLowerCase().includes(searchLower) ?? false)
    );
  });

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex justify-between items-center">
        <CareJourneySearch onSearch={handleSearch} theme={theme} />
        <ViewSwitcher 
          currentView={view} 
          onViewChange={setView}
          theme={theme}
        />
      </div>
      
      <div className="flex-1 overflow-hidden">
        {view === 'kanban' && (
          <KanbanBoard 
            tasks={filteredTasks} 
            onTaskMove={handleTaskMove}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
            theme={theme}
          />
        )}
        {view === 'calendar' && (
          <CalendarView 
            tasks={filteredTasks}
            theme={theme}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
          />
        )}
        {view === 'list' && (
          <ListView 
            tasks={filteredTasks}
            theme={theme}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
          />
        )}
      </div>
    </div>
  );
}
