import { Stethoscope, ClipboardList, CalendarClock } from 'lucide-react';
import type { TaskType } from '../types';

interface TaskTypeConfig {
  icon: any; // Using any for Lucide icons since they're components
  label: string;
  color: string;
  bgColor: string;
}

export const taskTypeConfig: Record<TaskType, TaskTypeConfig> = {
  MEDICAL: {
    icon: Stethoscope,
    label: 'Medical',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  ADMINISTRATIVE: {
    icon: ClipboardList,
    label: 'Administrative',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  FOLLOW_UP: {
    icon: CalendarClock,
    label: 'Follow Up',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
};