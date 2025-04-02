import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import type { Task, Column, TaskStatus, CareJourney } from '../types';

export type ViewType = 'kanban' | 'list' | 'calendar';
export type CalendarViewMode = 'day' | 'week' | 'month';

interface KanbanState {
  tasks: Task[];
  columns: Column[];
  careJourneys: CareJourney[];
  activeView: ViewType;
  calendarViewMode: CalendarViewMode;
  currentDate: Date;
  filters: {
    search: string;
    priority: string[];
    issueType: string[];
    dateRange: [Date | null, Date | null];
    status: string[];
    careJourneyId: string | null;
  };
}

export type KanbanAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'MOVE_TASK'; payload: { id: string; newStatus: TaskStatus } }
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'SET_CALENDAR_MODE'; payload: CalendarViewMode }
  | { type: 'SET_CURRENT_DATE'; payload: Date }
  | { type: 'SET_FILTER'; payload: Partial<KanbanState['filters']> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_COLUMNS'; payload: Column[] }
  | { type: 'ADD_CARE_JOURNEY'; payload: CareJourney }
  | { type: 'UPDATE_CARE_JOURNEY'; payload: { id: string; updates: Partial<CareJourney> } };

const initialColumns: Column[] = [
  { id: 'todo', title: 'To Do', status: 'TODO' },
  { id: 'inProgress', title: 'In Progress', status: 'IN_PROGRESS' },
  { id: 'done', title: 'Done', status: 'DONE' }
];

const initialState: KanbanState = {
  tasks: [],
  columns: initialColumns,
  careJourneys: [],
  activeView: 'kanban',
  calendarViewMode: 'month',
  currentDate: new Date(),
  filters: {
    search: '',
    priority: [],
    issueType: [],
    dateRange: [null, null],
    status: [],
    careJourneyId: null
  }
};

function kanbanReducer(state: KanbanState, action: KanbanAction): KanbanState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    case 'MOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, status: action.payload.newStatus } : task
        )
      };
    case 'SET_VIEW':
      return { ...state, activeView: action.payload };
    case 'SET_CALENDAR_MODE':
      return { ...state, calendarViewMode: action.payload };
    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: action.payload };
    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: initialState.filters
      };
    case 'SET_COLUMNS':
      return { ...state, columns: action.payload };
    case 'ADD_CARE_JOURNEY':
      return {
        ...state,
        careJourneys: [...state.careJourneys, action.payload]
      };
    case 'UPDATE_CARE_JOURNEY':
      return {
        ...state,
        careJourneys: state.careJourneys.map(journey =>
          journey.id === action.payload.id ? { ...journey, ...action.payload.updates } : journey
        )
      };
    default:
      return state;
  }
}

interface KanbanContextProps {
  state: KanbanState;
  dispatch: Dispatch<KanbanAction>;
}

const KanbanContext = createContext<KanbanContextProps | undefined>(undefined);

interface KanbanProviderProps {
  children: ReactNode;
  initialTasks?: Task[];
}

export function KanbanProvider({ children, initialTasks = [] }: KanbanProviderProps) {
  const [state, dispatch] = useReducer(kanbanReducer, {
    ...initialState,
    tasks: initialTasks
  });

  return (
    <KanbanContext.Provider value={{ state, dispatch }}>
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
}

// Helper hooks for common operations
export function useFilteredTasks() {
  const { state } = useKanban();
  const { tasks, filters } = state;

  return tasks.filter(task => {
    // Search filter
    if (filters.search && !task.patientName.toLowerCase().includes(filters.search.toLowerCase()) &&
        !task.description.toLowerCase().includes(filters.search.toLowerCase()) &&
        !task.ticketNumber.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Priority filter
    if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
      return false;
    }

    // Issue type filter
    if (filters.issueType.length > 0 && !filters.issueType.includes(task.issueType)) {
      return false;
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(task.status)) {
      return false;
    }

    // Date range filter
    if (filters.dateRange[0] && filters.dateRange[1]) {
      const taskDate = new Date(task.dueDate);
      const startDate = filters.dateRange[0];
      const endDate = filters.dateRange[1];

      if (taskDate < startDate || taskDate > endDate) {
        return false;
      }
    }

    // Care journey filter
    if (filters.careJourneyId && task.careJourneyId !== filters.careJourneyId) {
      return false;
    }

    return true;
  });
}