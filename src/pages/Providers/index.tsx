import React, { useState } from 'react';
import { Search, Settings, PlusCircle, ArrowRight, LayoutGrid, Activity, Users, Building2 } from 'lucide-react';
import { ProvidersChartGrid } from './components/ProvidersChartGrid';
import { ProvidersTable } from './components/ProvidersTable';
import { ProviderMap } from './components/ProviderMap';

export function ProvidersPage() {
  const [isDark] = useState(document.documentElement.classList.contains('dark'));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className={`text-2xl font-semibold ${
          isDark ? 'text-white' : 'text-dark-gun-metal'
        }`}>Provider Network</h1>
        <p className={`mt-1 ${
          isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
        }`}>
          Comprehensive view of network providers and performance metrics
        </p>
      </div>

      <ProvidersChartGrid />

      <div className="mt-8 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
            isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
          }`} />
          <input
            type="text"
            placeholder="Search by name, NPI, specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              isDark
                ? 'bg-white/5 text-white placeholder-white/40 border-white/10'
                : 'bg-white text-dark-gun-metal placeholder-dark-gun-metal/40 border-ron-divider'
            } border focus:outline-none focus:ring-2 focus:ring-ron-primary/20`}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'table'
                ? isDark
                  ? 'bg-[#CCFF00] text-dark-gun-metal'
                  : 'bg-ron-primary text-white'
                : isDark
                  ? 'text-white hover:bg-white/10'
                  : 'text-dark-gun-metal hover:bg-ron-primary/10'
            }`}
          >
            <Users className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'map'
                ? isDark
                  ? 'bg-[#CCFF00] text-dark-gun-metal'
                  : 'bg-ron-primary text-white'
                : isDark
                  ? 'text-white hover:bg-white/10'
                  : 'text-dark-gun-metal hover:bg-ron-primary/10'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>

        <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
          isDark
            ? 'bg-white/10 text-white hover:bg-white/20'
            : 'bg-ron-primary/10 text-ron-primary hover:bg-ron-primary/20'
        } transition-colors`}>
          <Settings className="h-4 w-4" />
          <span>Filters</span>
        </button>

        <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
          isDark
            ? 'bg-[#CCFF00] text-dark-gun-metal hover:bg-[#CCFF00]/90'
            : 'bg-ron-primary text-white hover:bg-ron-primary/90'
        } transition-colors`}>
          <PlusCircle className="h-4 w-4" />
          <span>Add Provider</span>
        </button>
      </div>

      <div className="mt-6">
        {viewMode === 'table' ? (
          <ProvidersTable searchTerm={searchTerm} selectedFilters={selectedFilters} />
        ) : (
          <ProviderMap searchTerm={searchTerm} selectedFilters={selectedFilters} />
        )}
      </div>
    </div>
  );
}
