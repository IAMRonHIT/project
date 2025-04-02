export interface KanbanTheme {
  name: 'light' | 'dark';
  text: string;
  textSecondary: string;
  muted: string;
  cardBg: string;
  columnBg: string;
  border: string;
  badge: string;
  buttonBg: string;
  buttonText: string;
  buttonHover: string;
}

export const themes = {
  light: {
    name: 'light',
    text: 'text-gray-800',
    textSecondary: 'text-gray-600',
    muted: 'text-gray-400',
    cardBg: 'bg-white/90',
    columnBg: 'bg-white/50',
    border: 'border-gray-200',
    badge: 'text-gray-600',
    buttonBg: 'bg-blue-500 hover:bg-blue-600',
    buttonText: 'text-white',
    buttonHover: 'hover:bg-blue-600'
  },
  dark: {
    name: 'dark',
    text: 'text-cyan-100',
    textSecondary: 'text-cyan-400',
    muted: 'text-cyan-600',
    cardBg: 'bg-[#0F172A]/80',
    columnBg: 'bg-[#0F172A]/60',
    border: 'border-[#1E3448]',
    badge: 'text-cyan-400',
    buttonBg: 'bg-cyan-600',
    buttonText: 'text-white',
    buttonHover: 'hover:bg-cyan-700'
  }
} as const;