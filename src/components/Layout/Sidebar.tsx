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
  { icon: Home, label: 'Home', to: '/' },
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
    <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-ron-dark-navy dark:bg-ron-dark-navy transform transition-transform duration-200 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="h-full flex flex-col border-r border-ron-divider">
        {/* Logo Section */}
        <div className="p-6 flex justify-center">
          <Logo className="w-[400px] h-[100px]" />
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-12 mt-3">
            <nav className="space-y-4">
              {mainNavItems.map((item) => (
                <NavItem key={item.label} {...item} />
              ))}
            </nav>

            <div>
              <div className="mb-6">
                <h2 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  System
                </h2>
              </div>
              <nav className="space-y-4">
                {secondaryNavItems.map((item) => (
                  <NavItem key={item.label} {...item} />
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}