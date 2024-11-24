import React from 'react';

interface ProviderMapProps {
  searchTerm: string;
  selectedFilters: string[];
}

export function ProviderMap({ searchTerm, selectedFilters }: ProviderMapProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  return (
    <div className={`${
      isDark ? 'bg-white/5' : 'bg-white'
    } rounded-xl shadow-soft border border-ron-divider h-[600px] flex items-center justify-center`}>
      <p className={isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}>
        Provider Map View - Coming Soon
      </p>
    </div>
  );
}