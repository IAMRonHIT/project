export interface Task {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  issueType: string;
  careJourney: {
    id: string;
    name: string;
  };
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  patientName: string;
  profilePicture: string;
  patientId: string;
  patientDOB: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  actions: Array<{
    type: string;
    link: string;
  }>;
  orderedBy: {
    name: string;
  };
}