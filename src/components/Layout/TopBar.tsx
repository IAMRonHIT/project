import React from 'react';
import { Menu, Bell, Moon, Sun, Search, MessageSquare, Settings } from 'lucide-react';
import { UserProfile } from './UserProfile';

interface TopBarProps {
  onMenuClick: () => void;
  isDark: boolean;
  setIsDark: () => void;
}

export function TopBar({ onMenuClick, isDark, setIsDark }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex-shrink-0 h-16 bg-ron-dark-navy/95 dark:bg-ron-dark-navy/95 backdrop-blur-xl border-b border-ron-divider/30">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden -m-2.5 p-2.5 text-white/80 hover:text-white transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Left side spacer for desktop */}
        <div className="hidden lg:block lg:w-20" />

        {/* Center section - can be used for search or breadcrumbs */}
        <div className="flex-1" />

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 text-white/80 hover:text-white transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="p-2 text-white/80 hover:text-white transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="relative p-2 text-white/80 hover:text-white transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-ron-warning" />
          </button>
          <button
            type="button"
            className="p-2 text-white/80 hover:text-white transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="p-2 text-white/80 hover:text-white transition-colors"
            onClick={setIsDark}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
