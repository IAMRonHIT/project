import React, { useEffect } from 'react';
import { DndContext, DragEndEvent, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { KanbanColumn } from './KanbanColumn';
import { useKanban, useFilteredTasks } from '../context/KanbanContext';
import type { KanbanTheme } from '../types';

interface KanbanBoardProps {
  theme: KanbanTheme;
}

export function KanbanBoard({ theme }: KanbanBoardProps) {
  const { state, dispatch } = useKanban();
  const { columns } = state;
  const filteredTasks = useFilteredTasks();

  // Configure sensors for drag operations
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle the drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const taskId = active.id.toString();
    const newStatus = over.id.toString();
    
    // Only process if taskId and newStatus are valid and different
    if (taskId && newStatus && taskId !== newStatus) {
      dispatch({
        type: 'MOVE_TASK',
        payload: { id: taskId, newStatus }
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)] px-4">
        {columns.map(column => {
          const columnTasks = filteredTasks.filter(task => task.status === column.status);
          
          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={columnTasks}
              status={column.status}
              theme={theme}
            />
          );
        })}
      </div>
    </DndContext>
  );
}