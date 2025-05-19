// Task status types
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

// Task issue types
export type IssueType = 
  | 'Chronic Illness (New)'
  | 'Chronic Illness (Existing)'
  | 'Acute Illness'
  | 'Injury/Accident'
  | 'Nutritional'
  | 'Mental Illness'
  | 'In Office Appointment'
  | 'Telehealth'
  | 'New Voicemail'
  | 'New Email'
  | 'New Chat'
  | 'New Document'
  | 'Authorization'
  | 'Treatment Task'
  | 'Care Plan'
  | 'Benefit/Eligibility Inquiry'
  | 'Form Request';

// Main Task interface
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

// Column interface for the Kanban board
export interface Column {
  id: string;
  title: string;
  status: Status;
  tasks: Task[];
}
