import React, { useState, useCallback } from 'react';
import { IdentifiedPatientsTable } from './IdentifiedPatientsTable';
import { FilterBar } from './FilterBar';
import { ColumnConfig } from './ColumnConfig';
import { VirtualGrid } from './VirtualGrid';
import { Column, PatientRecord, FilterConfig } from './types';
import { LayoutGrid, Map, SlidersHorizontal, Columns } from 'lucide-react';

interface PatientRegistryProps {
  data: PatientRecord[];
  initialColumns: Column[];
  className?: string;
}

const PatientRegistry: React.FC<PatientRegistryProps> = ({
  data,
  initialColumns,
  className = '',
}): JSX.Element => {
  // View state
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnConfig, setShowColumnConfig] = useState(false);

  // Data state
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeFilters, setActiveFilters] = useState<FilterConfig[]>([]);
  const [filteredData, setFilteredData] = useState(data);

  // Handlers
  const handleFilterChange = useCallback((filters: FilterConfig[]) => {
    setActiveFilters(filters);
    // Apply filters to data
    const filtered = data.filter(patient => {
      return filters.every(filter => {
        const value = filter.field.split('.').reduce((obj: any, key: string) => obj?.[key], patient);
        switch (filter.operator) {
          case 'equals':
            return value === filter.value;
          case 'contains':
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'greaterThan':
            return Number(value) > Number(filter.value);
          case 'lessThan':
            return Number(value) < Number(filter.value);
          case 'between':
            const [min, max] = filter.value as [number, number];
            return Number(value) >= min && Number(value) <= max;
          default:
            return true;
        }
      });
    });
    setFilteredData(filtered);
  }, [data]);

  const handleColumnChange = useCallback((updatedColumns: Column[]) => {
    setColumns(updatedColumns);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
              showFilters
                ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
          <button
            onClick={() => setShowColumnConfig(!showColumnConfig)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
              showColumnConfig
                ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Columns className="w-4 h-4" />
            <span className="text-sm font-medium">Columns</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <FilterBar
          columns={columns.filter(col => col.filterable)}
          onFilterChange={handleFilterChange}
          activeFilters={activeFilters}
        />
      )}

      {/* Column Configuration */}
      {showColumnConfig && (
        <ColumnConfig
          columns={columns}
          onChange={handleColumnChange}
        />
      )}

      {/* Table */}
      <VirtualGrid>
        <IdentifiedPatientsTable
          patients={filteredData}
          columns={columns}
        />
      </VirtualGrid>
    </div>
  );
};

export default PatientRegistry;