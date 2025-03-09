export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  attachments?: FileAttachment[];
  isVoiceMessage?: boolean;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
}

export interface AIMacro {
  id: string;
  name: string;
  description: string;
  icon: string;
  action: () => void;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  patientId: string;
  status: 'open' | 'pending' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  contactInfo: {
    phone: string;
    email: string;
  };
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  organization: string;
}