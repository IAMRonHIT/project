export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | string;
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskType = 'MEDICAL' | 'ADMINISTRATIVE' | 'FOLLOW_UP';

export interface Task {
  id: string;
  patientId: string;
  patientName: string;
  patientDOB: string;
  profilePicture?: string;
  ticketNumber: string;
  issueType: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  description: string;
  dueDate: string;
  careJourneyId?: string;
  parentTaskId?: string;
  stakeholders: Stakeholder[];
  actions?: TaskAction[];
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: 'Guardian' | 'Provider' | 'Facility' | 'Health Plan' | 'Additional Contact';
  email?: string;
  phone?: string;
}

export interface TaskAction {
  type: string;
  label: string;
  handler: () => void;
}

export interface Column {
  id: string;
  title: string;
  status: TaskStatus;
}

export interface CareJourney {
  id: string;
  name: string;
  description: string;
  patientId: string;
  phases: string[];
  startDate: string;
  targetEndDate?: string;
  actualEndDate?: string;
  status: 'ACTIVE' | 'COMPLETE' | 'ON_HOLD';
}