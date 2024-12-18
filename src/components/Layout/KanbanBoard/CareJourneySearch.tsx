import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface CareJourneySearchProps {
  onSelect: (careJourney: {
    id: string;
    name: string;
    parentId?: string;
    relatedTasks?: Array<{
      id: string;
      ticketNumber: string;
      title: string;
      issueType: string;
    }>;
  } | null) => void;
  selectedPatient: {
    id: string;
    name: string;
  } | null;
}

export function CareJourneySearch({ onSelect, selectedPatient }: CareJourneySearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement care journey search
    // This would typically make an API call to search for care journeys
    // For now, we'll simulate some example data
    if (query.length > 2) {
      // Simulated data
      onSelect({
        id: 'CJ1221',
        name: 'Initial Authorization Request',
        relatedTasks: [
          {
            id: '1',
            ticketNumber: 'CJ1221PA001',
            title: 'Initial Prior Authorization',
            issueType: 'Authorization'
          },
          {
            id: '2',
            ticketNumber: 'CJ1221CP001',
            title: 'Care Plan Development',
            issueType: 'Care Plan'
          }
        ]
      });
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-600" />
      <input
        type="text"
        placeholder="Search care journeys..."
        className="w-full pl-10 pr-4 py-2 bg-[#020817] border border-cyan-900/30 rounded-lg text-cyan-400 placeholder:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        disabled={!selectedPatient}
      />
      {!selectedPatient && (
        <p className="mt-2 text-sm text-cyan-600">
          Select a patient first to search for care journeys
        </p>
      )}
    </div>
  );
}