import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import TopBar from './TopBar';
import { MobileNav } from './MobileNav';
import { useTheme } from '../../hooks/useTheme.tsx';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toggleTheme } = useTheme();

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar 
          open={sidebarOpen} 
          collapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          onToggleCollapse={handleToggleSidebar}
        />

        {/* Main content area */}
        <div className={`
          flex-1 flex flex-col min-w-0
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
        `}>
          {/* Top bar */}
          <TopBar 
            onMenuClick={() => setSidebarOpen(true)} 
            onThemeToggle={toggleTheme}
          />

          {/* Main content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}
