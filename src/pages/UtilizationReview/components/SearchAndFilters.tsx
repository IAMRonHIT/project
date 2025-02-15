import React from 'react';
import { Search } from 'lucide-react';

export interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedFilters: {
    status?: string[];
    priority?: string[];
    type?: string[];
  };
  onFilterChange: (filters: SearchAndFiltersProps['selectedFilters']) => void;
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  selectedFilters,
  onFilterChange
}: SearchAndFiltersProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* Filter buttons would go here */}
    </div>
  );
}