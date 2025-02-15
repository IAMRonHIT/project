import React from 'react';
import { Kanban, List, Calendar, Users } from 'lucide-react';

export type ViewType = 'kanban' | 'list' | 'calendar' | 'registry';

interface ViewSwitcherProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  const views: Array<{ type: ViewType; icon: React.ElementType; label: string }> = [
    { type: 'kanban', icon: Kanban, label: 'Kanban' },
    { type: 'list', icon: List, label: 'List' },
    { type: 'calendar', icon: Calendar, label: 'Calendar' },
    { type: 'registry', icon: Users, label: 'Registry' }
  ];

  return (
    <div className="flex gap-2 bg-white/10 p-1 rounded-lg">
      {views.map(({ type, icon: Icon, label }) => (
        <button
          key={type}
          onClick={() => onViewChange(type)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md transition-all
            ${currentView === type
              ? 'bg-white/20 text-white'
              : 'text-white/60 hover:text-white hover:bg-white/10'
            }
          `}
          title={label}
        >
          <Icon size={20} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}