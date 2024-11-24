import React from 'react';
import { Activity, Heart, FileText, MessageSquare, Calendar, ArrowUpRight } from 'lucide-react';
import { TimelineEventData } from './types';

const eventIcons = {
  appointment: Calendar,
  treatment: Activity,
  medication: Heart,
  communication: MessageSquare,
  document: FileText,
};

const eventStyles = {
  appointment: {
    icon: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
  },
  treatment: {
    icon: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
  },
  medication: {
    icon: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
  },
  communication: {
    icon: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
  },
  document: {
    icon: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
  },
};

interface TimelineEventProps {
  event: TimelineEventData;
  isLast: boolean;
}

export function TimelineEvent({ event, isLast }: TimelineEventProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));
  const Icon = eventIcons[event.type as keyof typeof eventIcons];
  const styles = eventStyles[event.type as keyof typeof eventStyles];

  return (
    <div className={`relative pl-8 py-4 ${!isLast && 'border-l border-ron-divider ml-3'}`}>
      <div className={`absolute left-0 top-5 w-6 h-6 rounded-full ${styles.bg} flex items-center justify-center`}>
        <Icon className={`w-3 h-3 ${styles.icon}`} />
      </div>

      <div className={`p-4 rounded-lg border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-ron-divider'
      }`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className={`font-medium ${
              isDark ? 'text-white' : 'text-ron-dark-navy'
            }`}>{event.title}</h4>
            <p className={`text-sm ${
              isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
            }`}>{event.description}</p>
          </div>
          <button className={`p-1 rounded-lg ${
            isDark ? 'hover:bg-white/10' : 'hover:bg-ron-primary/10'
          } transition-colors`}>
            <ArrowUpRight className={`w-4 h-4 ${styles.icon}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className={`text-xs ${
              isDark ? 'text-white/40' : 'text-ron-dark-navy/40'
            }`}>{event.time}</span>
            {event.provider && (
              <>
                <span className={isDark ? 'text-white/20' : 'text-ron-dark-navy/20'}>•</span>
                <span className={`text-xs ${
                  isDark ? 'text-white/40' : 'text-ron-dark-navy/40'
                }`}>{event.provider}</span>
              </>
            )}
          </div>
          {event.status && (
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              event.status === 'completed'
                ? 'bg-emerald-400/10 text-emerald-400'
                : event.status === 'scheduled'
                  ? 'bg-blue-400/10 text-blue-400'
                  : 'bg-amber-400/10 text-amber-400'
            }`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}