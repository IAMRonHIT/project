export const luxuryEffects = {
  glassmorphism: {
    light: 'bg-white/80 backdrop-blur-md border border-white/20',
    dark: 'bg-[#1E293B]/80 backdrop-blur-md border border-cyan-500/20'
  },
  frost: {
    primary: 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg',
    accent: 'bg-gradient-to-br from-cyan-500/10 to-blue-500/5 backdrop-blur-lg'
  },
  neonGlow: {
    cyan: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]',
    purple: 'shadow-[0_0_30px_rgba(147,51,234,0.3)]'
  },
  interaction: {
    hover: 'transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl',
    active: 'transform scale-[0.98] transition-transform',
    focus: 'ring-2 ring-cyan-500/50 ring-offset-2 ring-offset-transparent'
  }
};

export interface ThemeConfig {
  name: string;
  background: string;
  cardBg: string;
  text: string;
  border: string;
  accent: string;
  shadow: string;
  hover: string;
  muted: string;
  glowEffect: string;
  buttonBg?: string;
  buttonText?: string;
  buttonBorder?: string;
  textSecondary?: string;
}

export const themes = {
  light: {
    name: 'Light',
    background: 'bg-ron-light-surface',
    cardBg: 'bg-ron-light-hover',
    text: 'text-ron-primary',
    border: 'border-ron-light-muted',
    accent: 'text-ron-accent',
    shadow: 'shadow-lg',
    hover: 'hover:bg-ron-light-hover',
    muted: 'text-ron-light-muted',
    glowEffect: 'shadow-[0_0_30px_rgba(0,240,255,0.3)]',
    textSecondary: 'text-ron-light-muted',
    buttonBg: 'bg-ron-light-muted/50',
    buttonText: 'text-ron-primary',
    buttonBorder: 'border-ron-light-muted/50'
  },
  dark: {
    name: 'Dark', 
    background: 'bg-ron-dark-base',
    cardBg: 'bg-ron-dark-surface',
    text: 'text-white',
    border: 'border-ron-dark-surface',
    accent: 'text-ron-accent',
    shadow: 'shadow-2xl',
    hover: 'hover:bg-ron-dark-surface/50',
    muted: 'text-ron-light-muted',
    glowEffect: 'shadow-[0_0_30px_rgba(0,240,255,0.2)]',
    textSecondary: 'text-gray-400',
    buttonBg: 'bg-gray-800',
    buttonText: 'text-gray-200',
    buttonBorder: 'border-gray-700'
  }
} as const;

export type Theme = keyof typeof themes;
