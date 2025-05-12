import React from 'react';
import { Search, Bell, Settings, User, MessageSquare } from 'lucide-react';

const TopNav: React.FC = () => {
  return (
    <div className="p-4 border-b border-indigo-500/30 flex items-center justify-between bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative">
      {/* Decorative elements */}
      <div className="absolute left-0 top-0 w-1/3 h-0.5 bg-gradient-to-r from-indigo-500/80 to-transparent"></div>
      <div className="absolute right-0 bottom-0 w-1/4 h-0.5 bg-gradient-to-l from-teal-500/80 to-transparent"></div>

      {/* Title and Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-teal-500/20 border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">Communication Hub</h1>
          <p className="text-xs text-indigo-300/80">Healthcare Team Collaboration</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mx-6">
        <div className="relative">
          <div className="relative rounded-xl overflow-hidden bg-gray-900/90 border border-indigo-500/30 transition-all duration-200 focus-within:border-indigo-400/50 focus-within:shadow-[0_0_10px_rgba(79,70,229,0.4)] backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              className="block w-full pl-10 pr-3 py-2.5 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-indigo-500/20 transition-colors" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(79,70,229,0.5)] animate-pulse"></span>
        </button>

        <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-indigo-500/20 transition-colors" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </button>

        <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-indigo-500/20 transition-colors" aria-label="User profile">
          <User className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TopNav;
