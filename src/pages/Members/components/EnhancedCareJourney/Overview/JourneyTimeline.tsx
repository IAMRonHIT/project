import React from 'react';
import { 
  Activity, MessageSquare, Clock, Brain,
  User, Bell, ArrowUpRight
} from 'lucide-react';
import { Badge } from '../../../../../components/Badge';

interface TimelineEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly date: string;
  readonly type: 'clinical' | 'administrative' | 'communication' | 'alert';
  readonly status: 'completed' | 'upcoming' | 'pending' | 'overdue';
  readonly metadata?: Readonly<{
    provider?: string;
    location?: string;
    outcome?: string;
  }>;
}

interface JourneyTimelineProps extends Readonly<{
  events: ReadonlyArray<TimelineEvent>;
  currentDate: string;
}> {}

const getEventIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'clinical':
      return Activity;
    case 'administrative':
      return Bell;
    case 'communication':
      return MessageSquare;
    case 'alert':
      return Brain;
  }
};

const getEventColor = (type: TimelineEvent['type'], isDark: boolean) => {
  switch (type) {
    case 'clinical':
      return isDark ? 'text-ron-mint-200' : 'text-ron-mint-600';
    case 'administrative':
      return isDark ? 'text-ron-teal-200' : 'text-ron-teal-600';
    case 'communication':
      return isDark ? 'text-ron-lime-200' : 'text-ron-lime-600';
    case 'alert':
      return isDark ? 'text-ron-coral-200' : 'text-ron-coral-600';
  }
};

const getStatusColor = (status: TimelineEvent['status'], isDark: boolean) => {
  switch (status) {
    case 'completed':
      return isDark ? 'text-[#CCFF00]' : 'text-ron-primary';
    case 'upcoming':
      return isDark ? 'text-ron-lime-200' : 'text-ron-lime-600';
    case 'pending':
      return isDark ? 'text-ron-teal-200' : 'text-ron-teal-600';
    case 'overdue':
      return isDark ? 'text-ron-coral-200' : 'text-ron-coral-600';
  }
};

export function JourneyTimeline({ events, currentDate }: JourneyTimelineProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  return (
    <div className="space-y-6 p-6">
      {events.map((event, index) => {
        const EventIcon = getEventIcon(event.type);
        
        return (
          <div
            key={event.id}
            className={`relative flex gap-4 ${
              index !== events.length - 1 ? 'pb-6' : ''
            }`}
          >
            {index !== events.length - 1 && (
              <div className={`absolute left-4 top-8 bottom-0 w-px ${
                isDark ? 'bg-white/10' : 'bg-ron-divider'
              }`} />
            )}

            <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              isDark ? 'bg-white/5' : 'bg-dark-gun-metal/5'
            }`}>
              <EventIcon className={`w-4 h-4 ${getEventColor(event.type, isDark)}`} aria-hidden="true" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="info"
                  size="sm"
                  className={getEventColor(event.type, isDark)}
                >
                  {event.type.toUpperCase()}
                </Badge>
                <span className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                }`}>
                  {event.date}
                </span>
                <Badge
                  variant={event.status === 'overdue' ? 'error' : 'info'}
                  size="sm"
                  className={getStatusColor(event.status, isDark)}
                >
                  {event.status.toUpperCase()}
                </Badge>
              </div>

              <h4 className={`font-medium mb-1 ${
                isDark ? 'text-white' : 'text-dark-gun-metal'
              }`}>
                {event.title}
              </h4>
              <p className={`text-sm ${
                isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
              }`}>
                {event.description}
              </p>

              {event.metadata && (
                <div className="mt-2 flex flex-wrap gap-4">
                  {event.metadata.provider && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm">{event.metadata.provider}</span>
                    </div>
                  )}
                  {event.metadata.location && (
                    <div className="flex items-center gap-1">
                      <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm">{event.metadata.location}</span>
                    </div>
                  )}
                  {event.metadata.outcome && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm">{event.metadata.outcome}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
