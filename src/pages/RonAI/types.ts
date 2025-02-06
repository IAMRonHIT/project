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