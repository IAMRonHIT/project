import type { LucideIcon } from 'lucide-react';

export type JourneyType = 'Chronic' | 'Acute' | 'Injury' | 'Mental Health';
export type AlertType = 'High' | 'Medium' | 'Low';
export type Priority = 'high' | 'medium' | 'low';
export type Status = 'success' | 'warning' | 'error';
export type Trend = 'up' | 'down' | 'stable';
export type EventCategory = 'clinical' | 'administrative' | 'communication' | 'alert';
export type EventStatus = 'completed' | 'upcoming' | 'pending' | 'overdue';

export interface TimelineEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly date: string;
  readonly type: EventCategory;
  readonly status: EventStatus;
  readonly metadata?: Readonly<{
    provider?: string;
    location?: string;
    outcome?: string;
  }>;
}

export interface JourneyHeader {
  readonly type: JourneyType;
  readonly diagnosis: string;
  readonly duration: string;
  readonly phase: string;
  readonly severity: number;
  readonly careTeam: ReadonlyArray<{ role: string; name: string }>;
}

export interface Prediction {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly confidence: number;
  readonly timeframe: string;
  readonly priority: Priority;
  readonly action: string;
}

export interface Metric {
  readonly id: string;
  readonly name: string;
  readonly value: string | number;
  readonly trend: Trend;
  readonly change: string;
  readonly status: Status;
  readonly icon: LucideIcon;
  readonly description?: string;
}

export interface CareJourneyData {
  readonly header: JourneyHeader;
  readonly predictions: ReadonlyArray<Prediction>;
  readonly metrics: ReadonlyArray<Metric>;
  readonly timeline: ReadonlyArray<TimelineEvent>;
}
