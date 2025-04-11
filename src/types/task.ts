export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string;
  patientId: string;
  patientName: string;
  ticketNumber: string;
  issueType: string;
  assignee?: string;
  profilePicture?: string;
  careJourney?: {
    id: string;
    name: string;
  };
  patientDOB?: string;
  actions?: Array<{
    type: string;
    link: string;
  }>;
  orderedBy?: {
    name: string;
  };
}

export interface Column {
  id: string;
  title: string;
  status: Status;
  tasks: Task[];
}
