import { Stethoscope, ClipboardList, CalendarClock } from 'lucide-react';
import type { TaskType } from '../types/task';

interface TaskTypeConfig {
  icon: any; // Using any for Lucide icons since they're components
  label: string;
  color: string;
}

export const taskTypeConfig: Record<TaskType, TaskTypeConfig> = {
  MEDICAL: {
    icon: Stethoscope,
    label: 'Medical',
    color: 'text-blue-500',
  },
  ADMINISTRATIVE: {
    icon: ClipboardList,
    label: 'Administrative',
    color: 'text-purple-500',
  },
  FOLLOW_UP: {
    icon: CalendarClock,
    label: 'Follow Up',
    color: 'text-green-500',
  },
};
