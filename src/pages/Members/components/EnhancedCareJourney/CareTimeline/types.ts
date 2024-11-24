export interface TimelineEventData {
  id: string;
  type: 'appointment' | 'treatment' | 'medication' | 'communication' | 'document';
  title: string;
  description: string;
  time: string;
  provider?: string;
  status?: 'completed' | 'scheduled' | 'pending';
}

export interface TimelineGroupData {
  month: string;
  events: TimelineEventData[];
}