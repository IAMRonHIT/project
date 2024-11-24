import React from 'react';
import { Activity, Heart, FileText, MessageSquare, Calendar } from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  type: 'appointment' | 'medication' | 'test' | 'communication' | 'care-plan';
  title: string;
  description: string;
  status: 'completed' | 'upcoming' | 'cancelled';
}

const events: TimelineEvent[] = [
  {
    id: '1',
    date: '2024-03-10',
    time: '09:30 AM',
    type: 'appointment',
    title: 'Primary Care Follow-up',
    description: 'Regular check-up with Dr. Sarah Chen',
    status: 'upcoming',
  },
  {
    id: '2',
    date: '2024-03-08',
    time: '02:15 PM',
    type: 'test',
    title: 'Lab Work Results',
    description: 'HbA1c and Lipid Panel results received',
    status: 'completed',
  },
  {
    id: '3',
    date: '2024-03-05',
    time: '11:00 AM',
    type: 'medication',
    title: 'Medication Review',
    description: 'Adjusted insulin dosage based on blood sugar logs',
    status: 'completed',
  },
  {
    id: '4',
    date: '2024-03-03',
    time: '03:45 PM',
    type: 'communication',
    title: 'Care Team Discussion',
    description: 'Coordination meeting about care plan updates',
    status: 'completed',
  },
  {
    id: '5',
    date: '2024-03-01',
    time: '10:00 AM',
    type: 'care-plan',
    title: 'Care Plan Update',
    description: 'Quarterly review and goal adjustment',
    status: 'completed',
  },
];

const getEventIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'appointment':
      return Calendar;
    case 'medication':
      return Heart;
    case 'test':
      return Activity;
    case 'communication':
      return MessageSquare;
    case 'care-plan':
      return FileText;
    default:
      return Activity;
  }
};

const getEventStyles = (type: TimelineEvent['type'], isDark: boolean) => {
  switch (type) {
    case 'appointment':
      return {
        bg: isDark ? 'bg-blue-500/20' : 'bg-blue-50',
        border: isDark ? 'border-blue-500/20' : 'border-blue-100',
        text: 'text-blue-500',
      };
    case 'medication':
      return {
        bg: isDark ? 'bg-emerald-500/20' : 'bg-emerald-50',
        border: isDark ? 'border-emerald-500/20' : 'border-emerald-100',
        text: 'text-emerald-500',
      };
    case 'test':
      return {
        bg: isDark ? 'bg-purple-500/20' : 'bg-purple-50',
        border: isDark ? 'border-purple-500/20' : 'border-purple-100',
        text: 'text-purple-500',
      };
    case 'communication':
      return {
        bg: isDark ? 'bg-amber-500/20' : 'bg-amber-50',
        border: isDark ? 'border-amber-500/20' : 'border-amber-100',
        text: 'text-amber-500',
      };
    case 'care-plan':
      return {
        bg: isDark ? 'bg-cyan-500/20' : 'bg-cyan-50',
        border: isDark ? 'border-cyan-500/20' : 'border-cyan-100',
        text: 'text-cyan-500',
      };
    default:
      return {
        bg: isDark ? 'bg-gray-500/20' : 'bg-gray-50',
        border: isDark ? 'border-gray-500/20' : 'border-gray-100',
        text: 'text-gray-500',
      };
  }
};

export function CareTimeline() {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  return (
    <div className={`${
      isDark
        ? 'bg-white/5 backdrop-blur-lg border-white/10'
        : 'bg-white border-ron-divider'
    } rounded-xl p-6 shadow-soft h-[600px] overflow-y-auto`}>
      <h3 className={`text-lg font-medium mb-8 ${
        isDark ? 'text-white' : 'text-ron-dark-navy'
      }`}>Care Timeline</h3>

      <div className="relative">
        <div className={`absolute left-8 top-0 bottom-0 w-px ${
          isDark ? 'bg-white/10' : 'bg-ron-divider'
        }`} />

        <div className="space-y-8">
          {events.map((event) => {
            const Icon = getEventIcon(event.type);
            const styles = getEventStyles(event.type, isDark);

            return (
              <div key={event.id} className="relative flex gap-6">
                <div className={`w-16 flex-shrink-0 ${
                  isDark ? 'text-white/40' : 'text-ron-dark-navy/40'
                } text-sm`}>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>

                <div className={`relative flex-1 p-4 rounded-lg border ${styles.bg} ${styles.border}`}>
                  <div className="absolute -left-9 top-1/2 -translate-y-1/2">
                    <div className={`p-2 rounded-full ${styles.bg}`}>
                      <Icon className={`w-4 h-4 ${styles.text}`} />
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-medium ${
                        isDark ? 'text-white' : 'text-ron-dark-navy'
                      }`}>{event.title}</h4>
                      <p className={`text-sm mt-1 ${
                        isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                      }`}>{event.description}</p>
                    </div>
                    <span className={`text-sm ${
                      isDark ? 'text-white/40' : 'text-ron-dark-navy/40'
                    }`}>{event.time}</span>
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