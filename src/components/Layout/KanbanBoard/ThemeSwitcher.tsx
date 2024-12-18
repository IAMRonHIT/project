import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { cn } from '../../../src/lib/utils';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={cn(
        "relative bg-white hover:bg-white/90",
        isDark && "bg-[#334155] hover:bg-[#334155]/90"
      )}
    >
      <Sun className={cn(
        "h-4 w-4 text-[#00425A] transition-all",
        isDark && "hidden"
      )} />
      <Moon className={cn(
        "h-4 w-4 text-white transition-all",
        !isDark && "hidden"
      )} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}