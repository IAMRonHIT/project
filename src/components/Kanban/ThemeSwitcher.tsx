import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full text-white bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors duration-200"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <Moon size={18} />
      ) : (
        <Sun size={18} />
      )}
    </button>
  );
};
