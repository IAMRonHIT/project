export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskType = 'MEDICAL' | 'ADMINISTRATIVE' | 'FOLLOW_UP';

export interface TaskAction {
  type: string;
  label: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  issueType: TaskType;
  patientName?: string;
  patientDOB?: string;
  ticketNumber?: string;
  profilePicture?: string;
  actions?: TaskAction[];
}
