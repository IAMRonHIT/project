import React, { useState } from 'react';
import { format } from 'date-fns';
import { useTheme } from '../../hooks/useTheme';
import { KanbanProvider } from '../../components/KanbanSystem/context/KanbanContext';
import { TaskHierarchyProvider } from '../../components/KanbanSystem/context/TaskHierarchyContext';
import { EnhancedTaskCard } from '../../components/KanbanSystem/Cards/EnhancedTaskCard';
import { TaskDetailsPanel } from '../../components/KanbanSystem/TaskDetails/TaskDetailsPanel';
import { EnhancedCalendarView } from '../../components/KanbanSystem/Views/CalendarView/EnhancedCalendarView';
import { EnhancedListView } from '../../components/KanbanSystem/Views/ListView/EnhancedListView';
import { TaskAIChat } from '../../components/KanbanSystem/AI/TaskAIChat';
import { TaskTemplates } from '../../components/KanbanSystem/Features/TaskTemplates';
import { TaskAutomation } from '../../components/KanbanSystem/Features/TaskAutomation';
import { DashboardAnalytics } from '../../components/KanbanSystem/Features/DashboardAnalytics';
import { Calendar, List, LayoutGrid, BarChart2, FileText, Zap, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { DndContext, DragEndEvent, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Badge } from '../../components/Badge';
import type { Task } from '../../components/KanbanSystem/types/task';

// Initial tasks converted to the enhanced KanbanSystem format
const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    ticketNumber: 'TKT-2024-001',
    description: 'Post appointment follow-up assigned; prior authorization and scheduling assistance.',
    issueType: 'ADMINISTRATIVE',
    priority: 'LOW',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    patientName: 'JANE DOE',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12345',
    patientDOB: '11/10/2000',
    status: 'TODO',
    stakeholders: [
      { id: 's1', name: 'Dr. Smith', role: 'Provider', email: 'drsmith@example.com' },
      { id: 's2', name: 'Jane Family', role: 'Guardian', phone: '555-123-4567' }
    ],
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    updatedAt: format(new Date(), 'yyyy-MM-dd')
  },
  {
    id: '2',
    ticketNumber: 'TKT-2024-002',
    description: 'Review and document recent laboratory results for diabetes screening.',
    issueType: 'MEDICAL',
    priority: 'HIGH',
    dueDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'), // Tomorrow
    patientName: 'JOHN SMITH',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12346',
    patientDOB: '05/15/1985',
    status: 'TODO',
    stakeholders: [
      { id: 's3', name: 'Dr. Wilson', role: 'Provider', email: 'drwilson@example.com' },
      { id: 's4', name: 'Lab Coordinator', role: 'Facility', email: 'lab@example.com' }
    ],
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    updatedAt: format(new Date(), 'yyyy-MM-dd')
  },
  {
    id: '3',
    ticketNumber: 'TKT-2024-003',
    description: 'Perform medication reconciliation for post-discharge patient.',
    issueType: 'MEDICAL',
    priority: 'MEDIUM',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    patientName: 'ROBERT JOHNSON',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12347',
    patientDOB: '03/22/1992',
    status: 'IN_PROGRESS',
    stakeholders: [
      { id: 's5', name: 'Dr. Martinez', role: 'Provider', email: 'drmartinez@example.com' },
      { id: 's6', name: 'Hospital Liaison', role: 'Facility', phone: '555-987-6543' }
    ],
    createdAt: format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'), // Yesterday
    updatedAt: format(new Date(), 'yyyy-MM-dd')
  },
  {
    id: '4',
    ticketNumber: 'TKT-2024-004',
    description: 'Verify insurance coverage for upcoming procedure.',
    issueType: 'ADMINISTRATIVE',
    priority: 'LOW',
    dueDate: format(new Date(Date.now() + 86400000 * 7), 'yyyy-MM-dd'), // Next week
    patientName: 'SARAH WILLIAMS',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12348',
    patientDOB: '07/30/1988',
    status: 'TODO',
    stakeholders: [
      { id: 's7', name: 'Insurance Team', role: 'Health Plan', email: 'insurance@example.com' }
    ],
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    updatedAt: format(new Date(), 'yyyy-MM-dd')
  },
  {
    id: '5',
    ticketNumber: 'TKT-2024-005',
    description: 'Process referral to cardiology specialist for consultation.',
    issueType: 'ADMINISTRATIVE',
    priority: 'HIGH',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    patientName: 'MICHAEL BROWN',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12349',
    patientDOB: '09/12/1975',
    status: 'IN_PROGRESS',
    stakeholders: [
      { id: 's8', name: 'Dr. Thompson', role: 'Provider', email: 'drthompson@example.com' },
      { id: 's9', name: 'Cardiology Office', role: 'Facility', phone: '555-111-2222' }
    ],
    createdAt: format(new Date(Date.now() - 86400000 * 2), 'yyyy-MM-dd'), // 2 days ago
    updatedAt: format(new Date(), 'yyyy-MM-dd')
  },
  {
    id: '6',
    ticketNumber: 'TKT-2024-006',
    description: 'Process prescription renewal request for maintenance medications.',
    issueType: 'MEDICAL',
    priority: 'MEDIUM',
    dueDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'), // Tomorrow
    patientName: 'EMILY DAVIS',
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12350',
    patientDOB: '12/05/1990',
    status: 'TODO',
    stakeholders: [
      { id: 's10', name: 'Pharmacy Team', role: 'Facility', email: 'pharmacy@example.com' }
    ],
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    updatedAt: format(new Date(), 'yyyy-MM-dd')
  },
  {
    id: '7',
    ticketNumber: 'TKT-2024-007',
    description: 'Follow up on pending diagnostic test results.',
    issueType: 'MEDICAL',
    priority: 'HIGH',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    patientName: 'DAVID MILLER',
    profilePicture: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12351',
    patientDOB: '02/18/1982',
    status: 'DONE',
    stakeholders: [
      { id: 's11', name: 'Lab Coordinator', role: 'Facility', email: 'lab@example.com' }
    ],
    createdAt: format(new Date(Date.now() - 86400000 * 3), 'yyyy-MM-dd'), // 3 days ago
    updatedAt: format(new Date(), 'yyyy-MM-dd')
  },
  {
    id: '8',
    ticketNumber: 'TKT-2024-008',
    description: 'Schedule in-office follow-up appointment for annual wellness check.',
    issueType: 'FOLLOW_UP',
    priority: 'LOW',
    dueDate: format(new Date(Date.now() + 86400000 * 7), 'yyyy-MM-dd'), // Next week
    patientName: 'LISA ANDERSON',
    profilePicture: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=faces&q=80',
    patientId: '12352',
    patientDOB: '06/25/1995',
    status: 'TODO',
    stakeholders: [
      { id: 's12', name: 'Scheduling Team', role: 'Facility', email: 'scheduling@example.com' }
    ],
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    updatedAt: format(new Date(), 'yyyy-MM-dd')
  }
];

// Create some predefined relationships for the demo
const initialHierarchy = {
  parentMap: {
    // Task 3 is a child of Task 2
    '3': '2',
    // Task 6 is a child of Task 5
    '6': '5'
  },
  childrenMap: {
    // Task 2 has Task 3 as a child
    '2': ['3'],
    // Task 5 has Task 6 as a child
    '5': ['6']
  }
};

const initialRelationships = {
  linkedTasksMap: {
    // Task 1 is linked to Task 4
    '1': ['4'],
    '4': ['1'],
    // Task 2 is linked to Task 7
    '2': ['7'],
    '7': ['2']
  }
};

type ViewType = 'kanban' | 'calendar' | 'list' | 'analytics' | 'templates' | 'automation';

export default function EnhancedKanbanPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [currentView, setCurrentView] = useState<ViewType>('kanban');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const { theme } = useTheme();
  
  const isDarkTheme = theme === 'dark';
  
  const kanbanTheme = {
    name: isDarkTheme ? 'dark' : 'light',
    text: isDarkTheme ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDarkTheme ? 'text-gray-400' : 'text-gray-600',
    background: isDarkTheme ? 'bg-gray-900' : 'bg-white',
    cardBg: isDarkTheme ? 'bg-gray-800' : 'bg-white',
    border: isDarkTheme ? 'border-gray-700' : 'border-gray-200',
    buttonBg: isDarkTheme ? 'bg-indigo-600/70' : 'bg-indigo-600',
    buttonText: isDarkTheme ? 'text-white' : 'text-white',
    buttonHover: isDarkTheme ? 'hover:bg-indigo-500/70' : 'hover:bg-indigo-500',
    badge: isDarkTheme ? 'text-indigo-300' : 'text-indigo-700'
  };
  
  const handleTaskMove = (taskId: string, newStatus: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id.toString();
    const overId = over.id.toString();

    // Check if dropped in a column
    if (['TODO', 'IN_PROGRESS', 'DONE'].includes(overId)) {
      // Update the task status to match the column
      handleTaskMove(taskId, overId);
    }
  };
  
  const handleViewTaskDetails = (taskId: string) => {
    setSelectedTaskId(taskId);
  };
  
  const handleCreateTaskFromTemplate = (template: any) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ticketNumber: `TKT-${Date.now().toString().substr(-4)}`,
      description: template.description,
      issueType: template.taskType,
      priority: template.priority,
      dueDate: format(new Date(Date.now() + 86400000 * 2), 'yyyy-MM-dd'), // 2 days from now
      patientName: 'NEW PATIENT',
      patientId: `PAT-${Date.now().toString().substr(-4)}`,
      patientDOB: '01/01/1990',
      status: 'TODO',
      stakeholders: template.stakeholders.map((s: any, idx: number) => ({
        id: `s-${Date.now()}-${idx}`,
        name: '',
        role: s.role
      })),
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      updatedAt: format(new Date(), 'yyyy-MM-dd')
    };
    
    setTasks(prev => [...prev, newTask]);
  };
  
  const handleRunAutomation = (automation: any, taskIds: string[]) => {
    if (automation.action.type === 'status_update') {
      const newStatus = automation.action.details;
      setTasks(prevTasks => 
        prevTasks.map(task => 
          taskIds.includes(task.id) ? { ...task, status: newStatus } : task
        )
      );
    }
    
    // Other automation types would go here
  };
  
  // Find the selected task
  const selectedTask = selectedTaskId 
    ? tasks.find(task => task.id === selectedTaskId) || null
    : null;
    
  return (
    <KanbanProvider initialTasks={tasks}>
      <TaskHierarchyProvider 
        initialHierarchy={initialHierarchy}
        initialRelationships={initialRelationships}
      >
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 p-6">
          {/* Header */}
          <header className="mb-8 bg-gradient-to-r from-indigo-600/80 to-cyan-600/80 rounded-xl p-6 shadow-lg border border-indigo-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">
                  Healthcare Tasks Hub
                </h1>
                <p className="text-indigo-100/70">
                  Manage patient care workflows with AI-powered efficiency
                </p>
              </div>
              
              {/* View selector */}
              <div className="flex space-x-1 bg-indigo-700/30 p-1 rounded-lg border border-indigo-500/30">
                <button 
                  className={`p-2 ${currentView === 'kanban' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-indigo-200 hover:bg-indigo-600/50'} 
                    rounded-md transition-colors flex items-center gap-1`}
                  onClick={() => setCurrentView('kanban')}
                >
                  <LayoutGrid className="w-5 h-5" />
                  <span className="hidden lg:inline">Board</span>
                </button>
                <button 
                  className={`p-2 ${currentView === 'list' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-indigo-200 hover:bg-indigo-600/50'} 
                    rounded-md transition-colors flex items-center gap-1`}
                  onClick={() => setCurrentView('list')}
                >
                  <List className="w-5 h-5" />
                  <span className="hidden lg:inline">List</span>
                </button>
                <button 
                  className={`p-2 ${currentView === 'calendar' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-indigo-200 hover:bg-indigo-600/50'} 
                    rounded-md transition-colors flex items-center gap-1`}
                  onClick={() => setCurrentView('calendar')}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="hidden lg:inline">Calendar</span>
                </button>
                <button 
                  className={`p-2 ${currentView === 'analytics' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-indigo-200 hover:bg-indigo-600/50'} 
                    rounded-md transition-colors flex items-center gap-1`}
                  onClick={() => setCurrentView('analytics')}
                >
                  <BarChart2 className="w-5 h-5" />
                  <span className="hidden lg:inline">Analytics</span>
                </button>
                <button 
                  className={`p-2 ${currentView === 'templates' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-indigo-200 hover:bg-indigo-600/50'} 
                    rounded-md transition-colors flex items-center gap-1`}
                  onClick={() => setCurrentView('templates')}
                >
                  <FileText className="w-5 h-5" />
                  <span className="hidden lg:inline">Templates</span>
                </button>
                <button 
                  className={`p-2 ${currentView === 'automation' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-indigo-200 hover:bg-indigo-600/50'} 
                    rounded-md transition-colors flex items-center gap-1`}
                  onClick={() => setCurrentView('automation')}
                >
                  <Zap className="w-5 h-5" />
                  <span className="hidden lg:inline">Automation</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="grid grid-cols-1 gap-6">
            {/* Views */}
            {currentView === 'kanban' && (
              <DndContext
                sensors={useSensors(
                  useSensor(PointerSensor, {
                    activationConstraint: { distance: 8 }
                  }),
                  useSensor(KeyboardSensor, {
                    coordinateGetter: (e) => {
                      // Return coordinates for keyboard controls
                      return { x: 0, y: 0 };
                    }
                  })
                )}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToWindowEdges]}
              >
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-[#1A2333]/70 rounded-xl p-4 border border-indigo-500/30">
                    <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
                      <div className="w-2 h-6 bg-blue-500 rounded-full mr-2"></div>
                      <span>To Do</span>
                      <Badge variant="info" className="ml-2" size="sm" icon={<Clock className="w-3 h-3" />}>
                        {tasks.filter(t => t.status === 'TODO').length}
                      </Badge>
                    </h2>
                    <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2" id="TODO">
                      {tasks
                        .filter(task => task.status === 'TODO')
                        .map(task => (
                          <EnhancedTaskCard
                            key={task.id}
                            task={task}
                            theme={kanbanTheme}
                            onEdit={() => {}}
                            onDelete={() => {}}
                            onViewTaskDetails={handleViewTaskDetails}
                            childTasks={tasks.filter(t => t.parentTaskId === task.id)}
                            parentTask={tasks.find(t => t.id === task.parentTaskId) || null}
                            linkedTasks={tasks.filter(t =>
                              initialRelationships.linkedTasksMap[task.id]?.includes(t.id)
                            )}
                          />
                        ))}
                    </div>
                  </div>
                  <div className="bg-[#1A2333]/70 rounded-xl p-4 border border-indigo-500/30">
                    <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
                      <div className="w-2 h-6 bg-amber-500 rounded-full mr-2"></div>
                      <span>In Progress</span>
                      <Badge variant="warning" className="ml-2" size="sm" icon={<AlertCircle className="w-3 h-3" />}>
                        {tasks.filter(t => t.status === 'IN_PROGRESS').length}
                      </Badge>
                    </h2>
                    <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2" id="IN_PROGRESS">
                      {tasks
                        .filter(task => task.status === 'IN_PROGRESS')
                        .map(task => (
                          <EnhancedTaskCard
                            key={task.id}
                            task={task}
                            theme={kanbanTheme}
                            onEdit={() => {}}
                            onDelete={() => {}}
                            onViewTaskDetails={handleViewTaskDetails}
                            childTasks={tasks.filter(t => t.parentTaskId === task.id)}
                            parentTask={tasks.find(t => t.id === task.parentTaskId) || null}
                            linkedTasks={tasks.filter(t =>
                              initialRelationships.linkedTasksMap[task.id]?.includes(t.id)
                            )}
                          />
                        ))}
                    </div>
                  </div>
                  <div className="bg-[#1A2333]/70 rounded-xl p-4 border border-indigo-500/30">
                    <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
                      <div className="w-2 h-6 bg-green-500 rounded-full mr-2"></div>
                      <span>Complete</span>
                      <Badge variant="success" className="ml-2" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                        {tasks.filter(t => t.status === 'DONE').length}
                      </Badge>
                    </h2>
                    <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2" id="DONE">
                      {tasks
                        .filter(task => task.status === 'DONE')
                        .map(task => (
                          <EnhancedTaskCard
                            key={task.id}
                            task={task}
                            theme={kanbanTheme}
                            onEdit={() => {}}
                            onDelete={() => {}}
                            onViewTaskDetails={handleViewTaskDetails}
                            childTasks={tasks.filter(t => t.parentTaskId === task.id)}
                            parentTask={tasks.find(t => t.id === task.parentTaskId) || null}
                            linkedTasks={tasks.filter(t =>
                              initialRelationships.linkedTasksMap[task.id]?.includes(t.id)
                            )}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </DndContext>
            )}
            
            {currentView === 'list' && (
              <EnhancedListView 
                theme={kanbanTheme} 
                onViewTaskDetails={handleViewTaskDetails} 
              />
            )}
            
            {currentView === 'calendar' && (
              <EnhancedCalendarView 
                theme={kanbanTheme} 
                onViewTaskDetails={handleViewTaskDetails} 
              />
            )}
            
            {currentView === 'analytics' && (
              <DashboardAnalytics 
                tasks={tasks} 
                theme={isDarkTheme ? 'dark' : 'light'} 
              />
            )}
            
            {currentView === 'templates' && (
              <TaskTemplates 
                onCreateTaskFromTemplate={handleCreateTaskFromTemplate} 
              />
            )}
            
            {currentView === 'automation' && (
              <TaskAutomation 
                tasks={tasks} 
                onRunAutomation={handleRunAutomation} 
              />
            )}
          </div>
          
          {/* Task Details Panel (modal) */}
          {selectedTask && (
            <TaskDetailsPanel
              task={selectedTask}
              onClose={() => setSelectedTaskId(null)}
              onEdit={() => {}}
              linkedTasks={tasks.filter(t => 
                initialRelationships.linkedTasksMap[selectedTask.id]?.includes(t.id)
              )}
              childTasks={tasks.filter(t => 
                initialHierarchy.childrenMap[selectedTask.id]?.includes(t.id)
              )}
              parentTask={tasks.find(t => 
                initialHierarchy.parentMap[selectedTask.id] === t.id
              ) || null}
              comments={[
                {
                  id: 'c1',
                  author: 'Dr. Wilson',
                  authorAvatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=faces&q=80',
                  content: 'Patient reported improvement after medication change.',
                  timestamp: new Date(Date.now() - 86400000 * 2) // 2 days ago
                },
                {
                  id: 'c2',
                  author: 'Nurse Jackson',
                  content: 'Vitals checked during home visit - all within normal range.',
                  timestamp: new Date(Date.now() - 86400000) // Yesterday
                }
              ]}
              attachments={[
                {
                  id: 'a1',
                  name: 'Lab_Results.pdf',
                  size: 1456000,
                  type: 'application/pdf',
                  url: '#',
                  uploadedAt: new Date(Date.now() - 86400000 * 3),
                  uploadedBy: 'Lab System'
                },
                {
                  id: 'a2',
                  name: 'Patient_Consent.pdf',
                  size: 980000,
                  type: 'application/pdf',
                  url: '#',
                  uploadedAt: new Date(Date.now() - 86400000 * 1),
                  uploadedBy: 'Front Desk'
                }
              ]}
            />
          )}
        </div>
      </TaskHierarchyProvider>
    </KanbanProvider>
  );
}