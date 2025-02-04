export type Theme = 'light' | 'dark';

export interface ThemeConfig {
  name: string;
  background: string;
  cardBg: string;
  columnBg: string;
  columnText: string;
  text: string;
  border: string;
  accent: string;
  shadow: string;
  hover: string;
  muted: string;
  glowEffect: string;
}

export const themes: Record<Theme, ThemeConfig> = {
  light: {
    name: 'Light',
    background: 'bg-white',
    cardBg: 'bg-[#F5F7F9]',
    columnBg: 'bg-white/50',
    columnText: 'text-gray-900',
    text: 'text-gray-900',
    border: 'border-gray-200',
    accent: 'text-cyan-600',
    shadow: 'shadow-lg',
    hover: 'hover:bg-gray-50',
    muted: 'text-gray-500',
    glowEffect: 'shadow-[0_0_30px_rgba(6,182,212,0.4)]'
  },
  dark: {
    name: 'Dark',
    background: 'bg-[#001219]',
    cardBg: 'bg-[#1E293B]/95',
    columnBg: 'bg-[#1E293B]/95',
    columnText: 'text-[#B0C7D1] text-xl tracking-wide',
    text: 'text-gray-100',
    border: 'border-gray-800',
    accent: 'text-cyan-400',
    shadow: 'shadow-2xl',
    hover: 'hover:bg-gray-800',
    muted: 'text-gray-400',
    glowEffect: 'shadow-[0_0_30px_rgba(0,255,255,0.3)]'
  }
};
