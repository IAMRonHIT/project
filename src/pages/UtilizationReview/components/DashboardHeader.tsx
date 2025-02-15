import React from 'react';
import { Bell, Menu } from 'lucide-react';

export function DashboardHeader() {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  return (
    <header className={`border-b ${
      isDark ? 'border-white/10' : 'border-ron-divider'
    } px-6 py-4`}>
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-dark-gun-metal'
        }`}>Utilization Management</h1>
        <div className="flex items-center gap-4">
          <button className={`p-2 rounded-lg ${
            isDark ? 'hover:bg-white/10' : 'hover:bg-ron-primary/10'
          } transition-colors`}>
            <Bell className={`h-5 w-5 ${
              isDark ? 'text-white' : 'text-dark-gun-metal'
            }`} />
          </button>
          <div className={`h-8 w-8 rounded-full ${
            isDark ? 'bg-white/10' : 'bg-ron-primary/10'
          } flex items-center justify-center`}>
            <span className={`text-sm font-medium ${
              isDark ? 'text-white' : 'text-ron-primary'
            }`}>SC</span>
          </div>
        </div>
      </div>
    </header>
  );
}