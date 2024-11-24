import React, { useState } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { MetricsGrid } from './components/MetricsGrid';
import { SearchAndFilters } from './components/SearchAndFilters';
import { ReviewQueue } from './components/ReviewQueue';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useNotifications } from '@/hooks/useNotifications';

export function UtilizationReview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isDark] = useState(document.documentElement.classList.contains('dark'));

  useKeyboardShortcuts({
    'alt+n': () => console.log('New Case'),
    'alt+f': () => console.log('Quick Filter'),
    'alt+s': () => console.log('Quick Search'),
  });

  useNotifications();

  return (
    <div className="min-h-screen bg-white dark:bg-ron-dark-base">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        <MetricsGrid />
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFilters={selectedFilters}
          onFilterChange={setSelectedFilters}
        />
        <ReviewQueue
          searchTerm={searchTerm}
          selectedFilters={selectedFilters}
        />
      </main>
    </div>
  );
}