import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    document.documentElement.classList.toggle('dark', isDark);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isDark]);

  return (
    <div className="min-h-screen bg-white dark:bg-ron-dark-base">
      <div className="absolute inset-0 bg-gradient-radial from-ron-primary/5 via-transparent to-transparent dark:from-ron-primary/10 pointer-events-none" />
      <TopBar onMenuClick={() => setSidebarOpen(true)} isDark={isDark} setIsDark={setIsDark} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MobileNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="lg:pl-72 pt-16">
        {children}
      </main>
    </div>
  );
}