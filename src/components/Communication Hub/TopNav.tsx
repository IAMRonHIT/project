import React from 'react';
import { Search, Bell, Settings, User } from 'lucide-react';
import { Badge } from '../Badge';
import { useTheme } from '../../hooks/useTheme';

const TopNav: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`
      flex items-center px-6 py-3
      bg-gradient-to-r from-gray-900/50 via-transparent to-gray-900/50
      backdrop-blur-sm border-b border-ron-teal-400/20
    `}>
      <div className="flex items-center gap-4">
        <Badge variant="info" glow size="sm">Communication Hub</Badge>
      </div>

      <div className="flex items-center flex-1 mx-6">
        <div className="relative w-full max-w-2xl">
          <div className={`
            relative rounded-lg overflow-hidden
            ${isDark ? 'bg-ron-dark-navy/50' : 'bg-white/50'}
            backdrop-blur-sm
            border
            ${isDark 
              ? 'border-ron-teal-400/20 focus-within:border-ron-teal-400/40' 
              : 'border-ron-teal-200/50 focus-within:border-ron-teal-400/60'
            }
            transition-all duration-200
            focus-within:shadow-glow-teal
          `}>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              className={`
                block w-full pl-10 pr-3 py-2
                bg-transparent text-sm
                ${isDark ? 'text-white' : 'text-gray-900'}
                placeholder:text-gray-400
                focus:outline-none
              `}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className={`
          relative p-2 rounded-lg
          ${isDark 
            ? 'bg-ron-teal-400/5 hover:bg-ron-teal-400/10' 
            : 'bg-ron-teal-50/50 hover:bg-ron-teal-50'
          }
          text-white/80 hover:text-white
          transition-all duration-200
          backdrop-blur-sm
          hover:shadow-glow-teal
          border border-transparent
          ${isDark 
            ? 'hover:border-ron-teal-400/20' 
            : 'hover:border-ron-teal-200/50'
          }
        `}>
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-ron-coral-400 shadow-glow-coral animate-pulse" />
        </button>

        <button className={`
          p-2 rounded-lg
          ${isDark 
            ? 'bg-ron-teal-400/5 hover:bg-ron-teal-400/10' 
            : 'bg-ron-teal-50/50 hover:bg-ron-teal-50'
          }
          text-white/80 hover:text-white
          transition-all duration-200
          backdrop-blur-sm
          hover:shadow-glow-teal
          border border-transparent
          ${isDark 
            ? 'hover:border-ron-teal-400/20' 
            : 'hover:border-ron-teal-200/50'
          }
        `}>
          <Settings className="h-5 w-5" />
        </button>

        <button className={`
          p-2 rounded-lg
          ${isDark 
            ? 'bg-ron-teal-400/5 hover:bg-ron-teal-400/10' 
            : 'bg-ron-teal-50/50 hover:bg-ron-teal-50'
          }
          text-white/80 hover:text-white
          transition-all duration-200
          backdrop-blur-sm
          hover:shadow-glow-teal
          border border-transparent
          ${isDark 
            ? 'hover:border-ron-teal-400/20' 
            : 'hover:border-ron-teal-200/50'
          }
        `}>
          <User className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TopNav;
