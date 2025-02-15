import React, { useState } from 'react';
import { Column, FilterConfig, FilterOperator } from './types';
import { X, Plus } from 'lucide-react';

interface FilterBarProps {
  columns: Column[];
  onFilterChange: (filters: FilterConfig[]) => void;
  activeFilters: FilterConfig[];
}

function FilterBar({ columns, onFilterChange, activeFilters }: FilterBarProps) {
  const [field, setField] = useState<string>('');
  const [operator, setOperator] = useState<FilterOperator | ''>('');
  const [filterValue, setFilterValue] = useState<{
    min?: string;
    max?: string;
    single?: string;
  }>({});

  const handleAddFilter = () => {
    if (!field || !operator) return;

    let value: string | number | [number, number];
    if (operator === 'between' && filterValue.min && filterValue.max) {
      value = [Number(filterValue.min), Number(filterValue.max)];
    } else if (operator === 'greaterThan' || operator === 'lessThan') {
      value = Number(filterValue.single || 0);
    } else {
      value = filterValue.single || '';
    }

    const newFilter: FilterConfig = {
      field,
      operator,
      value,
    };

    onFilterChange([...activeFilters, newFilter]);
    setField('');
    setOperator('');
    setFilterValue({});
  };

  const handleRemoveFilter = (index: number) => {
    const updatedFilters = activeFilters.filter((_, i) => i !== index);
    onFilterChange(updatedFilters);
  };

  const operators: { value: FilterOperator; label: string }[] = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
    { value: 'between', label: 'Between' },
  ];

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
              >
                <span>{columns.find(col => col.accessor === filter.field)?.label}</span>
                <span className="text-indigo-400">{filter.operator}</span>
                <span>{Array.isArray(filter.value) ? filter.value.join(' - ') : filter.value}</span>
                <button
                  onClick={() => handleRemoveFilter(index)}
                  className="p-0.5 hover:bg-indigo-100 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Filter */}
      <div className="flex items-end gap-4">
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Field</label>
          <select
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="w-full border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select field</option>
            {columns.map((column) => (
              <option key={column.accessor} value={column.accessor}>
                {column.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Operator</label>
          <select
            value={operator}
            onChange={(e) => {
              setOperator(e.target.value as FilterOperator);
              setFilterValue({});
            }}
            className="w-full border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select operator</option>
            {operators.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Value</label>
          {operator === 'between' ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filterValue.min || ''}
                onChange={(e) => setFilterValue(prev => ({ ...prev, min: e.target.value }))}
                className="w-full border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filterValue.max || ''}
                onChange={(e) => setFilterValue(prev => ({ ...prev, max: e.target.value }))}
                className="w-full border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ) : (
            <input
              type={operator === 'greaterThan' || operator === 'lessThan' ? 'number' : 'text'}
              value={filterValue.single || ''}
              onChange={(e) => setFilterValue({ single: e.target.value })}
              className="w-full border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter value"
            />
          )}
        </div>

        <button
          onClick={handleAddFilter}
          disabled={!field || !operator || (!filterValue.single && !(filterValue.min && filterValue.max))}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          <span>Add Filter</span>
        </button>
      </div>
    </div>
  );
}

export default FilterBar;