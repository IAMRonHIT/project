import React, { useState } from 'react';
import { Sidebar, TopBar, MobileNav } from './index';
import { useTheme } from '../../hooks/useTheme';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-full flex flex-col bg-ron-light-surface dark:bg-ron-dark-base">
      <div className="flex flex-1">
        <Sidebar 
          open={sidebarOpen} 
          collapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          onToggleCollapse={handleToggleSidebar}
        />

        <div className={`
          flex-1 flex flex-col min-w-0
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
        `}>
          <TopBar 
            onMenuClick={() => setSidebarOpen(true)} 
            onThemeToggle={toggleTheme}
          />

          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>

      <MobileNav 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
    </div>
  );
}
