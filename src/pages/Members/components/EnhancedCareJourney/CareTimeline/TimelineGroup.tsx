import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TimelineEvent } from './TimelineEvent';
import { TimelineGroupData } from './types';

interface TimelineGroupProps {
  group: TimelineGroupData;
}

export function TimelineGroup({ group }: TimelineGroupProps) {
  const [isDark] = useState(document.documentElement.classList.contains('dark'));
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-6 py-3 flex items-center justify-between ${
          isDark ? 'hover:bg-white/5' : 'hover:bg-ron-primary/5'
        } transition-colors`}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className={`w-4 h-4 ${
              isDark ? 'text-white/40' : 'text-ron-dark-navy/40'
            }`} />
          ) : (
            <ChevronRight className={`w-4 h-4 ${
              isDark ? 'text-white/40' : 'text-ron-dark-navy/40'
            }`} />
          )}
          <span className={`text-sm font-medium ${
            isDark ? 'text-white' : 'text-ron-dark-navy'
          }`}>{group.month}</span>
          <span className={`text-sm ${
            isDark ? 'text-white/40' : 'text-ron-dark-navy/40'
          }`}>{group.events.length} events</span>
        </div>
      </button>

      {isExpanded && (
        <div className="pl-6 pr-4">
          {group.events.map((event, index) => (
            <TimelineEvent
              key={event.id}
              event={event}
              isLast={index === group.events.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}