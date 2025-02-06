import React, { useState } from "react";
import { SearchAndFilters, SearchAndFiltersProps } from "./components/SearchAndFilters";
import { ReviewQueue, ReviewQueueProps } from "./components/ReviewQueue";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useNotifications } from "@/hooks/useNotifications";

type Filters = {
  status: string[];
  priority: string[];
  type: string[];
};

export function UtilizationReview() {
  const { notifications, addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    status: [],
    priority: [],
    type: []
  });
  
  useKeyboardShortcuts([
    {
      key: 'f',
      ctrlKey: true,
      action: () => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          addNotification({
            message: 'Search focused',
            type: 'info',
            duration: 2000
          });
        }
      }
    }
  ]);

  const handleFilterChange = (filters: SearchAndFiltersProps['selectedFilters']) => {
    setSelectedFilters({
      status: filters.status || [],
      priority: filters.priority || [],
      type: filters.type || []
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Utilization Review</h1>
      <SearchAndFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
      />
      <ReviewQueue 
        searchTerm={searchTerm}
        selectedFilters={selectedFilters}
      />
    </div>
  );
}