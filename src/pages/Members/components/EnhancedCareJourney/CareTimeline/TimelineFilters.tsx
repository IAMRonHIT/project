import React from 'react';
import { Activity, Heart, FileText, MessageSquare, Calendar } from 'lucide-react';

const filterOptions = [
  { id: 'appointment', label: 'Appointments', icon: Calendar, color: 'blue' },
  { id: 'treatment', label: 'Treatments', icon: Activity, color: 'purple' },
  { id: 'medication', label: 'Medications', icon: Heart, color: 'emerald' },
  { id: 'communication', label: 'Communications', icon: MessageSquare, color: 'amber' },
  { id: 'document', label: 'Documents', icon: FileText, color: 'cyan' },
];

interface TimelineFiltersProps {
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

export function TimelineFilters({ activeFilters, onFilterChange }: TimelineFiltersProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      onFilterChange(activeFilters.filter(id => id !== filterId));
    } else {
      onFilterChange([...activeFilters, filterId]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {filterOptions.map((option) => {
        const isActive = activeFilters.includes(option.id);
        const Icon = option.icon;

        return (
          <button
            key={option.id}
            onClick={() => toggleFilter(option.id)}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors ${
              isActive
                ? isDark
                  ? `bg-${option.color}-400/20 text-${option.color}-400`
                  : `bg-${option.color}-50 text-${option.color}-600`
                : isDark
                  ? 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  : 'bg-ron-primary/5 text-ron-dark-navy/60 hover:bg-ron-primary/10 hover:text-ron-dark-navy'
            }`}
          >
            <Icon className="w-4 h-4" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}