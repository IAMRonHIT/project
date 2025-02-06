import React, { useState, useCallback } from 'react';
import { IdentifiedPatientsTable } from './IdentifiedPatientsTable';
import { ProfileDrawer } from '../PatientHub/ProfileDrawer';
import { MapView } from '../MapView';
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

// Helper function to safely get nested object value
const getNestedValue = (obj: PatientRecord, path: string): any => {
  return path.split('.').reduce((acc: any, part: string) => acc?.[part], obj);
};

export const PatientRegistry: React.FC<PatientRegistryProps> = ({
  data,
  initialColumns,
  className = '',
}) => {
  // View state
  const [view, setView] = useState<'table' | 'map'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnConfig, setShowColumnConfig] = useState(false);

  // Data state
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeFilters, setActiveFilters] = useState<FilterConfig[]>([]);
  const [filteredData, setFilteredData] = useState(data);

  // Patient state
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Handlers
  const handlePatientClick = useCallback((patient: PatientRecord) => {
    setSelectedPatient(patient);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const handleFilterChange = useCallback((filters: FilterConfig[]) => {
    setActiveFilters(filters);
    // Apply filters to data
    const filtered = data.filter(patient => {
      return filters.every(filter => {
        const value = getNestedValue(patient, filter.field);
        if (value === undefined) return false;

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
        <div className="flex space-x-2">
          <button
            onClick={() => setView('table')}
            className={`p-2 rounded-lg border transition-colors ${
              view === 'table'
                ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView('map')}
            className={`p-2 rounded-lg border transition-colors ${
              view === 'map'
                ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Map className="w-5 h-5" />
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

      {/* Views */}
      {view === 'table' ? (
        <VirtualGrid>
          <IdentifiedPatientsTable
            patients={filteredData}
            onPatientClick={handlePatientClick}
          />
        </VirtualGrid>
      ) : (
        <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
          <MapView
            apiKey={process.env.GOOGLE_MAPS_API_KEY || ''}
            patients={filteredData}
            initialConfig={{
              center: { lat: 37.7749, lng: -122.4194 },
              zoom: 12
            }}
            showClusters={true}
            showHeatmap={true}
            showTerritories={true}
            onMarkerClick={handlePatientClick}
          />
        </div>
      )}

      {/* Patient Profile Drawer */}
      <ProfileDrawer
        patient={selectedPatient}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onScheduleAppointment={(patient) => {
          console.log('Schedule appointment for:', patient);
        }}
        onSendMessage={(patient) => {
          console.log('Send message to:', patient);
        }}
        onViewDocuments={(patient) => {
          console.log('View documents for:', patient);
        }}
      />
    </div>
  );
};

export default PatientRegistry;
export * from './types';
export { IdentifiedPatientsTable } from './IdentifiedPatientsTable';