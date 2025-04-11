import React from 'react';
import { Kanban, List, Calendar } from 'lucide-react';

export type ViewType = 'kanban' | 'list' | 'calendar';

interface ViewOption {
  value: ViewType;
  label: string;
  icon: React.ReactNode;
}

interface ViewSwitcherProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  const viewOptions: ViewOption[] = [
    {
      value: 'kanban',
      label: 'Kanban Board',
      icon: <Kanban size={16} />,
    },
    {
      value: 'list',
      label: 'List View',
      icon: <List size={16} />,
    },
    {
      value: 'calendar',
      label: 'Calendar',
      icon: <Calendar size={16} />,
    },
  ];

  return (
    <div className="flex bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden">
      {viewOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onViewChange(option.value)}
          className={`
            flex items-center gap-1.5 px-3 py-2 text-sm
            transition-colors duration-200
            ${currentView === option.value 
              ? 'bg-white/20 text-white' 
              : 'text-white/70 hover:text-white hover:bg-white/10'}
          `}
          title={option.label}
        >
          {option.icon}
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
};
