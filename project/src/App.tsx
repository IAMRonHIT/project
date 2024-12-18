import React, { useState } from 'react';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { CalendarView } from './components/CalendarView';
import { ViewSwitcher, type ViewType } from './components/ViewSwitcher';
import { NewTaskDialog } from './components/NewTaskDialog';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { useTheme } from './contexts/ThemeContext';
import { themes } from './lib/themes';
import type { Task } from './types/task';
import { format } from 'date-fns';

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    ticketNumber: 'TKT-2024-001',
    title: 'Post-appointment Follow-up',
    description: 'Post appointment follow-up assigned; prior authorization and scheduling assistance.',
    issueType: 'Authorization',
    careJourney: {
      id: 'CJ-001',
      name: 'Initial Authorization Request'
    },
    priority: 'LOW',
    dueDate: 'Today',
    patientName: 'JANE DOE',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12345',
    patientDOB: '11/10/2000',
    status: 'TODO',
    actions: [
      { type: 'Contact Hub', link: '#' },
      { type: 'Enter Ticket', link: '#' }
    ],
    orderedBy: { name: 'Jane 360' }
  },
  {
    id: '2',
    ticketNumber: 'TKT-2024-002',
    title: 'Lab Results Review',
    description: 'Review and document recent laboratory results for diabetes screening.',
    issueType: 'Treatment Task',
    careJourney: {
      id: 'CJ-002',
      name: 'Diabetes Management'
    },
    priority: 'HIGH',
    dueDate: 'Tomorrow',
    patientName: 'JOHN SMITH',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12346',
    patientDOB: '05/15/1985',
    status: 'TODO',
    actions: [
      { type: 'Contact Hub', link: '#' },
      { type: 'Enter Ticket', link: '#' }
    ],
    orderedBy: { name: 'Dr. Wilson' }
  },
  {
    id: '3',
    ticketNumber: 'TKT-2024-003',
    title: 'Medication Reconciliation',
    description: 'Perform medication reconciliation for post-discharge patient.',
    issueType: 'Care Plan',
    careJourney: {
      id: 'CJ-003',
      name: 'Post-Discharge Care'
    },
    priority: 'MEDIUM',
    dueDate: 'Today',
    patientName: 'ROBERT JOHNSON',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12347',
    patientDOB: '03/22/1992',
    status: 'TODO',
    actions: [
      { type: 'Contact Hub', link: '#' },
      { type: 'Enter Ticket', link: '#' }
    ],
    orderedBy: { name: 'Dr. Martinez' }
  },
  {
    id: '4',
    ticketNumber: 'TKT-2024-004',
    title: 'Insurance Verification',
    description: 'Verify insurance coverage for upcoming procedure.',
    issueType: 'Benefit/Eligibility Inquiry',
    careJourney: {
      id: 'CJ-004',
      name: 'Pre-procedure Verification'
    },
    priority: 'LOW',
    dueDate: 'Next Week',
    patientName: 'SARAH WILLIAMS',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12348',
    patientDOB: '07/30/1988',
    status: 'TODO',
    actions: [
      { type: 'Contact Hub', link: '#' },
      { type: 'Enter Ticket', link: '#' }
    ],
    orderedBy: { name: 'Insurance Team' }
  },
  {
    id: '5',
    ticketNumber: 'TKT-2024-005',
    title: 'Specialist Referral',
    description: 'Process referral to cardiology specialist for consultation.',
    issueType: 'Authorization',
    careJourney: {
      id: 'CJ-005',
      name: 'Specialty Care Coordination'
    },
    priority: 'HIGH',
    dueDate: 'Today',
    patientName: 'MICHAEL BROWN',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12349',
    patientDOB: '09/12/1975',
    status: 'TODO',
    actions: [
      { type: 'Contact Hub', link: '#' },
      { type: 'Enter Ticket', link: '#' }
    ],
    orderedBy: { name: 'Dr. Thompson' }
  },
  {
    id: '6',
    ticketNumber: 'TKT-2024-006',
    title: 'Prescription Renewal',
    description: 'Process prescription renewal request for maintenance medications.',
    issueType: 'Treatment Task',
    careJourney: {
      id: 'CJ-006',
      name: 'Medication Management'
    },
    priority: 'MEDIUM',
    dueDate: 'Tomorrow',
    patientName: 'EMILY DAVIS',
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12350',
    patientDOB: '12/05/1990',
    status: 'TODO',
    actions: [
      { type: 'Contact Hub', link: '#' },
      { type: 'Enter Ticket', link: '#' }
    ],
    orderedBy: { name: 'Pharmacy Team' }
  },
  {
    id: '7',
    ticketNumber: 'TKT-2024-007',
    title: 'Test Results Follow-up',
    description: 'Follow up on pending diagnostic test results.',
    issueType: 'Treatment Task',
    careJourney: {
      id: 'CJ-007',
      name: 'Diagnostic Monitoring'
    },
    priority: 'HIGH',
    dueDate: 'Today',
    patientName: 'DAVID MILLER',
    profilePicture: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12351',
    patientDOB: '02/18/1982',
    status: 'TODO',
    actions: [
      { type: 'Contact Hub', link: '#' },
      { type: 'Enter Ticket', link: '#' }
    ],
    orderedBy: { name: 'Lab Coordinator' }
  },
  {
    id: '8',
    ticketNumber: 'TKT-2024-008',
    title: 'In-Person Follow-up',
    description: 'Schedule in-office follow-up appointment for annual wellness check.',
    issueType: 'In Office Appointment',
    careJourney: {
      id: 'CJ-008',
      name: 'Annual Wellness Visit'
    },
    priority: 'LOW',
    dueDate: 'Next Week',
    patientName: 'LISA ANDERSON',
    profilePicture: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12352',
    patientDOB: '06/25/1995',
    status: 'TODO',
    actions: [
      { type: 'Contact Hub', link: '#' },
      { type: 'Enter Ticket', link: '#' }
    ],
    orderedBy: { name: 'Scheduling Team' }
  },
  {
    id: '9',
    ticketNumber: 'TKT-2024-009',
    title: 'Virtual Consultation',
    description: 'Schedule telehealth appointment for medication review.',
    issueType: 'Telehealth',
    careJourney: {
      id: 'CJ-009',
      name: 'Remote Care Management'
    },
    priority: 'MEDIUM',
    dueDate: 'Tomorrow',
    patientName: 'JAMES WILSON',
    profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12353',
    patientDOB: '04/14/1978',
    status: 'TODO',
    actions: [
      { type: 'Contact Hub', link: '#' },
      { type: 'Enter Ticket', link: '#' }
    ],
    orderedBy: { name: 'Care Coordinator' }
  },
  {
    id: '10',
    ticketNumber: 'TKT-2024-010',
    title: 'Documentation Update',
    description: 'Update patient documentation with recent consultation notes.',
    issueType: 'Form Request',
    careJourney: {
      id: 'CJ-010',
      name: 'Documentation Management'
    },
    priority: 'LOW',
    dueDate: 'Today',
    patientName: 'AMANDA TAYLOR',
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12354',
    patientDOB: '08/09/1987',
    status: 'TODO',
    actions: [
      { type: 'Contact Hub', link: '#' },
      { type: 'Enter Ticket', link: '#' }
    ],
    orderedBy: { name: 'Records Team' }
  },
  {
    id: '11',
    ticketNumber: 'TKT-2024-011',
    title: 'Urgent Voicemail',
    description: 'New voicemail from patient regarding medication side effects.',
    issueType: 'New Voicemail',
    careJourney: {
      id: 'CJ-011',
      name: 'Patient Communication'
    },
    priority: 'HIGH',
    dueDate: 'Today',
    patientName: 'RICHARD CLARK',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12355',
    patientDOB: '03/15/1979',
    status: 'TODO',
    actions: [
      { type: 'Contact Hub', link: '#' },
      { type: 'Enter Ticket', link: '#' }
    ],
    orderedBy: { name: 'Phone System' }
  },
  {
    id: '12',
    ticketNumber: 'TKT-2024-012',
    title: 'Patient Portal Message',
    description: 'New email regarding upcoming procedure questions.',
    issueType: 'New Email',
    careJourney: {
      id: 'CJ-012',
      name: 'Pre-procedure Communication'
    },
    priority: 'MEDIUM',
    dueDate: 'Today',
    patientName: 'SUSAN MARTINEZ',
    profilePicture: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12356',
    patientDOB: '06/22/1983',
    status: 'TODO',
    actions: [
      { type: 'Contact Hub', link: '#' },
      { type: 'Enter Ticket', link: '#' }
    ],
    orderedBy: { name: 'Patient Portal' }
  },
  {
    id: '13',
    ticketNumber: 'TKT-2024-013',
    title: 'Secure Chat Request',
    description: 'New chat message requesting prescription clarification.',
    issueType: 'New Chat',
    careJourney: {
      id: 'CJ-013',
      name: 'Medication Management'
    },
    priority: 'LOW',
    dueDate: 'Tomorrow',
    patientName: 'THOMAS WRIGHT',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12357',
    patientDOB: '09/30/1995',
    status: 'TODO',
    actions: [
      { type: 'Contact Hub', link: '#' },
      { type: 'Enter Ticket', link: '#' }
    ],
    orderedBy: { name: 'Chat System' }
  },
  {
    id: '14',
    ticketNumber: 'TKT-2024-014',
    title: 'New Medical Records',
    description: 'New documents received from specialist consultation.',
    issueType: 'New Document',
    careJourney: {
      id: 'CJ-014',
      name: 'Specialist Coordination'
    },
    priority: 'MEDIUM',
    dueDate: 'Today',
    patientName: 'PATRICIA LEWIS',
    profilePicture: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12358',
    patientDOB: '11/25/1970',
    status: 'TODO',
    actions: [
      { type: 'Contact Hub', link: '#' },
      { type: 'Enter Ticket', link: '#' }
    ],
    orderedBy: { name: 'Document Management' }
  }
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS.map(task => ({
    ...task,
    dueDate: format(new Date(), 'yyyy-MM-dd'), // Convert string dates to proper format
  })));
  const [currentView, setCurrentView] = useState<ViewType>('kanban');
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  const handleTaskMove = (taskId: string, newStatus: Task['status']) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} p-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className={`mb-8 ${theme === 'light' ? 'bg-[#00425A]' : 'bg-cyan-600'} rounded-xl p-6 shadow-lg transition-colors duration-300`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
                Healthcare Tasks
              </h1>
              <p className="text-white/70">
                Manage patient care workflows efficiently
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
              <ThemeSwitcher />
              <NewTaskDialog />
            </div>
          </div>
        </header>

        {/* Views */}
        {currentView === 'kanban' && (
          <KanbanBoard tasks={tasks} onTaskMove={handleTaskMove} theme={currentTheme} />
        )}
        {currentView === 'list' && (
          <ListView tasks={tasks} theme={currentTheme} />
        )}
        {currentView === 'calendar' && (
          <CalendarView tasks={tasks} theme={currentTheme} />
        )}
      </div>
    </div>
  );
}
export default App;