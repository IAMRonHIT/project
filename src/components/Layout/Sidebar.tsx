import React from 'react';
import { 
  Users, Building2, Shield, ClipboardCheck, Heart, Activity,
  FileText, MessageSquareMore, BarChart3, Settings, GraduationCap,
  HelpCircle, ShieldCheck, Home
} from 'lucide-react';
import { NavItem } from './NavItem';
import Logo from '../Logo';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const mainNavItems = [
  { icon: Home, label: 'Dashboard', to: '/dashboard' },
  { icon: Users, label: 'Members', to: '/members' },
  { icon: Building2, label: 'Providers', to: '/providers' },
  { icon: Shield, label: 'Health Plans', to: '/health-plans' },
  { icon: ClipboardCheck, label: 'Utilization Review', to: '/utilization' },
  { icon: Heart, label: 'Care Management', to: '/care' },
  { icon: Activity, label: 'Population Health', to: '/population' },
  { icon: FileText, label: 'Claims', to: '/claims' },
  { icon: MessageSquareMore, label: 'Communication Hub', to: '/communication' },
  { icon: BarChart3, label: 'Reports', to: '/reports' },
];

const secondaryNavItems = [
  { icon: ShieldCheck, label: 'Admin', to: '/admin' },
  { icon: Settings, label: 'Settings', to: '/settings' },
  { icon: GraduationCap, label: 'Ron University', to: '/university' },
  { icon: HelpCircle, label: 'Support', to: '/support' },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Backdrop for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 w-72 
          bg-gray-100 dark:bg-gray-900 
          backdrop-blur-xl shadow-lg
          transform transition-transform duration-200 ease-in-out 
          ${open ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0
          border-r border-gray-200 dark:border-gray-700
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section with Subtle Gradient */}
          <div className="p-4 flex items-center justify-center 
            bg-gradient-to-r from-gray-100 to-gray-200 
            dark:from-gray-800 dark:to-gray-900
            border-b border-gray-200 dark:border-gray-700
          ">
            <Logo className="w-32 h-8 opacity-90 hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="space-y-8">
              {/* Main Navigation with Hover and Active States */}
              <nav className="space-y-2">
                <h2 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Main Menu
                </h2>
                {mainNavItems.map((item) => (
                  <NavItem 
                    key={item.label} 
                    {...item} 
                    className="
                      group transition-all duration-200 
                      hover:bg-gray-200 dark:hover:bg-gray-800 
                      hover:shadow-sm rounded-lg
                      active:scale-95
                    "
                  />
                ))}
              </nav>

              {/* System Navigation with Notification Indicators */}
              <div>
                <h2 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  System
                </h2>
                <nav className="space-y-2">
                  {secondaryNavItems.map((item, index) => (
                    <NavItem 
                      key={item.label} 
                      {...item} 
                      className="
                        group transition-all duration-200 
                        hover:bg-gray-200 dark:hover:bg-gray-800 
                        hover:shadow-sm rounded-lg
                        relative
                      "
                      // Add notification badge to specific items
                      badge={
                        index === 0 ? 3 : // Admin
                        index === 1 ? 1 : // Settings
                        undefined
                      }
                    />
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Footer Section with Subtle Separator */}
          <div className="
            p-4 border-t border-gray-200 dark:border-gray-700
            bg-gradient-to-r from-gray-100 to-gray-200 
            dark:from-gray-800 dark:to-gray-900
          ">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {new Date().getFullYear()} Ron Care
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
