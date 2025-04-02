import React from 'react';
import type { Task } from '../../../types/task';
import type { themes } from '../../../lib/themes';

interface ListViewProps {
  tasks: Task[];
  theme: typeof themes[keyof typeof themes];
  onTaskEdit: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
}

export function ListView({ tasks, theme, onTaskEdit, onTaskDelete }: ListViewProps) {
  return (
    <div className="space-y-4">
      {/* Your list view implementation */}
    </div>
  );
}
