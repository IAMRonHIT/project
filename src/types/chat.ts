export type Sender = 'Ron AI' | 'You';

export interface ChatMessage {
  sender: Sender;
  time: string;
  message: string;
  isStreaming: boolean;
}

export interface DrugAnalysis {
  name: string;
  details: string;
}
