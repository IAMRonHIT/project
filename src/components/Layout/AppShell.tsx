import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { useTheme } from '../../hooks/useTheme.tsx';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative min-h-screen">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-white dark:bg-ron-dark-base">
        <div className="absolute inset-0 bg-gradient-radial from-ron-primary/5 via-transparent to-transparent dark:from-ron-primary/10 pointer-events-none" />
      </div>

      {/* Layout structure */}
      <div className="relative flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar */}
          <TopBar 
            onMenuClick={() => setSidebarOpen(true)} 
            isDark={isDark} 
            setIsDark={toggleTheme}
          />

          {/* Main content */}
          <main className="flex-1 relative overflow-y-auto focus:outline-none lg:pl-72">
            <div className="py-6">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}
