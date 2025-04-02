import React from 'react';
import { LayoutGrid, List, Calendar } from 'lucide-react';
import type { themes } from '../../../lib/themes';

export type View = 'kanban' | 'list' | 'calendar';

interface ViewSwitcherProps {
  currentView: View;
  onViewChange: (view: View) => void;
  theme: typeof themes[keyof typeof themes];
}

export function ViewSwitcher({ currentView, onViewChange, theme }: ViewSwitcherProps) {
  const views: { value: View; label: string; icon: typeof LayoutGrid }[] = [
    { value: 'kanban', label: 'Kanban', icon: LayoutGrid },
    { value: 'calendar', label: 'Calendar', icon: Calendar },
    { value: 'list', label: 'List', icon: List },
  ];

  return (
    <div className="flex items-center gap-2">
      {views.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => onViewChange(value)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg
            ${currentView === value 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
