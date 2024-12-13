import {
  Stethoscope,
  Heart,
  Activity,
  Syringe,
  Bandage,
  Apple,
  Brain,
  MessagesSquare,
  CalendarCheck,
  Video,
  MessageCircle,
  Mail,
  MessageSquare,
  FileText,
  FormInput,
  type LucideIcon
} from 'lucide-react';

interface TaskTypeConfig {
  icon: LucideIcon;
  color: {
    light: string;
    base: string;
    dark: string;
  };
}

export const taskTypeConfig: Record<string, TaskTypeConfig> = {
  'Chronic Illness (New)': {
    icon: Heart,
    color: { light: 'from-red-500/5', base: 'red-500', dark: 'red-900' }
  },
  'Chronic Illness (Existing)': {
    icon: Activity,
    color: { light: 'from-orange-500/5', base: 'orange-500', dark: 'orange-900' }
  },
  'Acute Illness': {
    icon: Stethoscope,
    color: { light: 'from-blue-500/5', base: 'blue-500', dark: 'blue-900' }
  },
  'Injury/Accident': {
    icon: Syringe,
    color: { light: 'from-yellow-500/5', base: 'yellow-500', dark: 'yellow-900' }
  },
  'Nutritional': {
    icon: Apple,
    color: { light: 'from-green-500/5', base: 'green-500', dark: 'green-900' }
  },
  'Mental Illness': {
    icon: Brain,
    color: { light: 'from-purple-500/5', base: 'purple-500', dark: 'purple-900' }
  },
  'In Office Appointment': {
    icon: CalendarCheck,
    color: { light: 'from-emerald-500/5', base: 'emerald-500', dark: 'emerald-900' }
  },
  'Telehealth': {
    icon: Video,
    color: { light: 'from-blue-500/5', base: 'blue-500', dark: 'blue-900' }
  },
  'New Voicemail': {
    icon: MessageCircle,
    color: { light: 'from-purple-500/5', base: 'purple-500', dark: 'purple-900' }
  },
  'New Email': {
    icon: Mail,
    color: { light: 'from-pink-500/5', base: 'pink-500', dark: 'pink-900' }
  },
  'New Chat': {
    icon: MessageSquare,
    color: { light: 'from-amber-500/5', base: 'amber-500', dark: 'amber-900' }
  },
  'New Document': {
    icon: FileText,
    color: { light: 'from-orange-500/5', base: 'orange-500', dark: 'orange-900' }
  }
};