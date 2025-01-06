import React from 'react';
import { Search, Filter, Plus, ArrowUpRight } from 'lucide-react';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  selectedFilters,
  onFilterChange
}: SearchAndFiltersProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="relative flex-1">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
          isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
        }`} />
        <input
          className={`w-full pl-10 pr-4 py-2 rounded-lg ${
            isDark
              ? 'bg-white/5 text-white placeholder-white/40 border-white/10'
              : 'bg-white text-dark-gun-metal placeholder-dark-gun-metal/40 border-ron-divider'
          } border focus:outline-none focus:ring-2 focus:ring-ron-primary/20`}
          placeholder="Search by patient name, ID, or CPT code"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
        isDark
          ? 'bg-white/10 text-white hover:bg-white/20'
          : 'bg-ron-primary/10 text-ron-primary hover:bg-ron-primary/20'
      } transition-colors`}>
        <Filter className="h-4 w-4" />
        <span>Filters</span>
      </button>

      <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
        isDark
          ? 'bg-[#CCFF00] text-dark-gun-metal hover:bg-[#CCFF00]/90'
          : 'bg-ron-primary text-white hover:bg-ron-primary/90'
      } transition-colors`}>
        <Plus className="h-4 w-4" />
        <span>New Case</span>
      </button>
    </div>
  );
}