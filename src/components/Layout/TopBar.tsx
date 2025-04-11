import React from 'react';
import { Menu, Bell, Moon, Sun, Search, MessageSquare, Settings } from 'lucide-react';
import { UserProfile } from './UserProfile';
import { useTheme } from '../../hooks/useTheme';
import { Badge } from '../Badge';
import { LucideIcon } from 'lucide-react';

interface TopBarProps {
  onMenuClick: () => void;
  onThemeToggle: () => void;
}

interface ActionButtonProps {
  icon: LucideIcon;
  hasNotification?: boolean;
  onClick?: () => void;
}

const ActionButton = ({ icon: Icon, hasNotification = false, onClick = () => {} }: ActionButtonProps) => (
  <button
    onClick={onClick}
    className="relative p-2 rounded-lg bg-ron-teal-400/5 hover:bg-ron-teal-400/10 text-white/80 hover:text-white transition-all duration-200 backdrop-blur-sm hover:shadow-glow-teal border border-transparent hover:border-ron-teal-400/20"
  >
    <Icon className="h-5 w-5" />
    {hasNotification && (
      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-ron-coral-400 shadow-glow-coral animate-pulse" />
    )}
  </button>
);

const TopBar: React.FC<TopBarProps> = ({ onMenuClick, onThemeToggle }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-40 flex-shrink-0 h-16 bg-black border-b border-ron-teal-400/20 shadow-glow-bottom">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden -m-2.5 p-2.5 text-white/80 hover:text-white transition-colors"
          onClick={onMenuClick}
          title="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Left side spacer for desktop */}
        <div className="hidden lg:block lg:w-20">
          <Badge variant="info" size="sm">IntelAgents</Badge>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-2xl mx-auto">
          <div className={`relative rounded-lg overflow-hidden ${isDark ? 'bg-[#1F252A]' : 'bg-white/50'} backdrop-blur-sm border ${isDark ? 'border-ron-teal-400/20 focus-within:border-ron-teal-400/40' : 'border-ron-teal-200/50 focus-within:border-ron-teal-400/60'} transition-all duration-200 focus-within:shadow-glow-teal`}>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className={`block w-full pl-10 pr-3 py-2 bg-transparent text-sm ${isDark ? 'text-white' : 'text-gray-900'} placeholder:text-gray-400 focus:outline-none`}
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <ActionButton icon={MessageSquare} />
          <ActionButton icon={Bell} hasNotification />
          <ActionButton icon={Settings} />
          <ActionButton 
            icon={isDark ? Sun : Moon} 
            onClick={onThemeToggle}
          />
          <div className="ml-2">
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
