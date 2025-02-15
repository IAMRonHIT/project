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

export const themes = {
  light: {
    name: 'Light',
    background: 'bg-white',
    cardBg: 'bg-[#F5F7F9]',
    columnBg: 'bg-white/50',
    columnText: 'text-gray-900',
    text: 'text-gray-900',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-400',
    borderHover: 'hover:border-gray-300',
    ring: 'ring-[#00425A]/20',
    buttonBg: 'bg-[#00425A]',
    buttonBorder: 'border-[#00425A]',
    buttonText: 'text-white',
    buttonHover: 'hover:bg-[#00425A]/90',
    shadow: 'shadow-lg',
    glowEffect: 'shadow-[0_0_30px_rgba(6,182,212,0.4)]',
    accent: {
      primary: 'bg-gradient-to-r from-emerald-400 to-cyan-400',
      secondary: 'bg-gradient-to-r from-violet-400 to-purple-400',
      success: 'bg-gradient-to-r from-green-400 to-emerald-400',
      warning: 'bg-gradient-to-r from-amber-400 to-orange-400',
      error: 'bg-gradient-to-r from-rose-400 to-red-400'
    },
    animation: {
      glow: 'shadow-[0_0_30px_rgba(6,182,212,0.4)]',
      pulse: 'animate-pulse-subtle',
      hover: 'transition-all duration-300 ease-in-out'
    },
    surfaces: {
      primary: 'bg-gradient-to-br from-white/80 to-white/60',
      secondary: 'bg-gradient-to-br from-gray-50/80 to-gray-100/60',
      frost: 'backdrop-blur-md border border-white/20'
    }
  },
  dark: {
    name: 'Dark',
    background: 'bg-[#001219]',
    cardBg: 'bg-[#1E293B]/95',
    columnBg: 'bg-[#1E293B]/95',
    columnText: 'text-[#B0C7D1] text-xl tracking-wide',
    text: 'text-[#B0C7D1]',
    textPrimary: 'text-[#B0C7D1]',
    textSecondary: 'text-[#8FA3AD]',
    border: 'border-[#1E3448]/50',
    borderHover: 'hover:border-[#00FFFF]',
    ring: 'ring-white/20',
    buttonBg: 'bg-[#1E293B]',
    buttonBorder: 'border-[#1E293B]',
    buttonText: 'text-white',
    buttonHover: 'hover:bg-[#1E293B]/90',
    shadow: 'shadow-[0_4px_12px_rgba(0,255,255,0.05)]',
    glowEffect: 'shadow-[0_0_30px_rgba(0,255,255,0.3)]',
    accent: {
      primary: 'bg-gradient-to-r from-cyan-500 to-blue-500',
      secondary: 'bg-gradient-to-r from-purple-500 to-pink-500',
      success: 'bg-gradient-to-r from-emerald-500 to-green-500',
      warning: 'bg-gradient-to-r from-orange-500 to-amber-500',
      error: 'bg-gradient-to-r from-red-500 to-rose-500'
    },
    animation: {
      glow: 'shadow-[0_0_30px_rgba(0,255,255,0.3)]',
      pulse: 'animate-pulse-neon',
      hover: 'transition-all duration-300 ease-in-out'
    },
    surfaces: {
      primary: 'bg-gradient-to-br from-[#1E293B]/80 to-[#1E293B]/60',
      secondary: 'bg-gradient-to-br from-[#1E293B]/90 to-[#1E293B]/70',
      frost: 'backdrop-blur-md border border-cyan-500/20'
    }
  },
} as const;

export type Theme = typeof themes[keyof typeof themes];
