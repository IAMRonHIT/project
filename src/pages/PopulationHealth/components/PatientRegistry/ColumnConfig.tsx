import React from 'react';
import { Column } from './types';
import { GripVertical, Eye, EyeOff } from 'lucide-react';

interface ColumnConfigProps {
  columns: Column[];
  onChange: (columns: Column[]) => void;
}

function ColumnConfig({ columns, onChange }: ColumnConfigProps) {
  const handleToggleVisibility = (columnId: string) => {
    const updatedColumns = columns.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible } : col
    );
    onChange(updatedColumns);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const updatedColumns = [...columns];
    const [movedColumn] = updatedColumns.splice(fromIndex, 1);
    updatedColumns.splice(toIndex, 0, movedColumn);
    onChange(updatedColumns);
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Column Configuration</h3>
      <div className="space-y-2">
        {columns.map((column, index) => (
          <div
            key={column.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', String(index));
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const fromIndex = Number(e.dataTransfer.getData('text/plain'));
              handleReorder(fromIndex, index);
            }}
          >
            <div className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
              <span className="text-sm font-medium text-gray-700">{column.label}</span>
            </div>
            <button
              onClick={() => handleToggleVisibility(column.id)}
              className={`p-1.5 rounded-full transition-colors ${
                column.visible
                  ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {column.visible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ColumnConfig;