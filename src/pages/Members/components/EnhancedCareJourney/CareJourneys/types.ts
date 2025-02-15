export interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  provider?: string;
}

export interface CareJourney {
  id: string;
  title: string;
  type: 'surgery' | 'therapy' | 'medication';
  status: 'active' | 'completed' | 'pending';
  startDate: string;
  endDate?: string;
  provider: string;
  events: TimelineEvent[];
}