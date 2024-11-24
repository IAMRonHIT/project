import React from 'react';
import { Activity, Heart, FileText, MessageSquare, Calendar } from 'lucide-react';
import { CareJourney } from './types';

interface JourneyTimelineProps {
  journey: CareJourney;
}

export function JourneyTimeline({ journey }: JourneyTimelineProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return Calendar;
      case 'treatment':
        return Activity;
      case 'medication':
        return Heart;
      case 'communication':
        return MessageSquare;
      default:
        return FileText;
    }
  };

  const getEventStyles = (type: string) => {
    switch (type) {
      case 'appointment':
        return {
          bg: isDark ? 'bg-blue-400/10' : 'bg-blue-50',
          border: isDark ? 'border-blue-400/20' : 'border-blue-100',
          text: 'text-blue-400',
        };
      case 'treatment':
        return {
          bg: isDark ? 'bg-purple-400/10' : 'bg-purple-50',
          border: isDark ? 'border-purple-400/20' : 'border-purple-100',
          text: 'text-purple-400',
        };
      case 'medication':
        return {
          bg: isDark ? 'bg-emerald-400/10' : 'bg-emerald-50',
          border: isDark ? 'border-emerald-400/20' : 'border-emerald-100',
          text: 'text-emerald-400',
        };
      default:
        return {
          bg: isDark ? 'bg-gray-400/10' : 'bg-gray-50',
          border: isDark ? 'border-gray-400/20' : 'border-gray-100',
          text: 'text-gray-400',
        };
    }
  };

  return (
    <div className={`p-6 ${isDark ? 'bg-white/5' : 'bg-ron-primary/5'}`}>
      <div className="relative pl-6">
        <div className={`absolute left-0 top-0 bottom-0 w-px ${
          isDark ? 'bg-white/10' : 'bg-ron-divider'
        }`} />

        <div className="space-y-6">
          {journey.events.map((event, index) => {
            const Icon = getEventIcon(event.type);
            const styles = getEventStyles(event.type);

            return (
              <div key={event.id} className="relative">
                <div className={`absolute -left-6 top-4 w-3 h-3 rounded-full ${styles.bg} ${
                  styles.border
                } border-2`} />

                <div className={`ml-4 p-4 rounded-lg ${styles.bg} ${styles.border} border`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${styles.text}`} />
                    <h4 className={`font-medium ${
                      isDark ? 'text-white' : 'text-ron-dark-navy'
                    }`}>{event.title}</h4>
                  </div>
                  
                  <p className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                  }`}>{event.description}</p>

                  <div className="flex items-center gap-4 mt-2">
                    <span className={`text-xs ${
                      isDark ? 'text-white/40' : 'text-ron-dark-navy/40'
                    }`}>{event.date}</span>
                    {event.provider && (
                      <>
                        <span className={isDark ? 'text-white/20' : 'text-ron-dark-navy/20'}>•</span>
                        <span className={`text-xs ${
                          isDark ? 'text-white/40' : 'text-ron-dark-navy/40'
                        }`}>{event.provider}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}