import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronRight } from 'lucide-react';
import { TimelineGroup } from './TimelineGroup';
import { TimelineFilters } from './TimelineFilters';
import { mockTimelineData } from './mockData';

export function CareTimeline() {
  const [isDark] = useState(document.documentElement.classList.contains('dark'));
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filteredData = mockTimelineData.filter(group => {
    const matchesSearch = searchQuery === '' || 
      group.events.some(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesFilters = activeFilters.length === 0 ||
      group.events.some(event => activeFilters.includes(event.type));

    return matchesSearch && matchesFilters;
  });

  return (
    <div className={`${
      isDark
        ? 'bg-white/5 backdrop-blur-lg border-white/10'
        : 'bg-white border-ron-divider'
    } rounded-xl shadow-soft`}>
      {/* Header */}
      <div className="p-6 border-b border-ron-divider">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-medium ${
            isDark ? 'text-white' : 'text-dark-gun-metal'
          }`}>Care Journey Timeline</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm ${
              isDark
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-ron-primary/10 text-ron-primary hover:bg-ron-primary/20'
            } transition-colors`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {showFilters ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
          }`} />
          <input
            type="text"
            placeholder="Search care journeys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              isDark
                ? 'bg-white/5 text-white placeholder-white/40 border-white/10'
                : 'bg-ron-primary/5 text-dark-gun-metal placeholder-dark-gun-metal/40 border-ron-divider'
            } border focus:outline-none focus:ring-2 focus:ring-ron-primary/20`}
          />
        </div>

        {showFilters && (
          <TimelineFilters
            activeFilters={activeFilters}
            onFilterChange={setActiveFilters}
          />
        )}
      </div>

      {/* Timeline Content */}
      <div className="divide-y divide-ron-divider">
        {filteredData.map((group) => (
          <TimelineGroup
            key={group.month}
            group={group}
          />
        ))}
      </div>
    </div>
  );
}