import { 
  Users, Building2, Bot, ClipboardCheck, Heart, Activity,
  FileText, MessageSquareMore, BarChart3, Settings, GraduationCap,
  HelpCircle, ShieldCheck, Home, ChevronLeft, ChevronRight
} from 'lucide-react';
import { NavItem } from './NavItem';
import Logo from '../Logo';
import { useTheme } from '../../hooks/useTheme';

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

const mainNavItems = [
  { icon: Home, label: 'Dashboard', to: '/dashboard' },
  { icon: Users, label: 'Members', to: '/members' },
  { icon: Building2, label: 'Providers', to: '/providers' },
  { icon: Bot, label: 'Ron AI', to: '/ron-ai' },
  { icon: Activity, label: 'Population Health', to: '/population-health' },
  { icon: MessageSquareMore, label: 'Communication Hub', to: '/communication' },
  { icon: BarChart3, label: 'Reports', to: '/reports' },
];

const secondaryNavItems = [
  { icon: ShieldCheck, label: 'Admin', to: '/admin' },
  { icon: Settings, label: 'Settings', to: '/settings' },
  { icon: GraduationCap, label: 'Ron University', to: '/university' },
  { icon: HelpCircle, label: 'Support', to: '/support' },
];

export function Sidebar({ open, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
          fixed inset-y-0 left-0 z-50
          ${collapsed ? 'w-20' : 'w-72'}
          bg-black shadow-lg
          transform transition-transform duration-300 ease-in-out 
          ${open ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0
          border-r border-ron-teal-400/20
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section with Collapse Button */}
          <div className="p-4 flex items-center justify-between 
            bg-black
            border-b border-ron-teal-400/20
          ">
            <Logo className={`
              transition-[width,height] duration-300
              ${collapsed ? 'w-8 h-8' : 'w-32 h-8'}
              opacity-90 hover:opacity-100
            `} />
            
            {/* Collapse Toggle Button */}
            <button
              onClick={onToggleCollapse}
              className={`
                p-2 rounded-lg
                ${isDark ? 'bg-ron-teal-400/5 hover:bg-ron-teal-400/10' : 'bg-ron-teal-50/50 hover:bg-ron-teal-50'}
                text-white/80 hover:text-white
                transition-[background-color,border-color,box-shadow] duration-200
                backdrop-blur-sm
                hover:shadow-glow-teal
                border border-transparent
                hover:border-ron-teal-400/20
                lg:block hidden
              `}
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="space-y-8">
              {/* Main Navigation */}
              <nav className="space-y-2">
                <h2 className={`
                  px-3 text-xs font-semibold text-gray-400 
                  uppercase tracking-wider mb-2
                  transition-opacity duration-200
                  ${collapsed ? 'opacity-0' : 'opacity-100'}
                `}>
                  Main Menu
                </h2>
                {mainNavItems.map((item) => (
                  <NavItem 
                    key={item.label} 
                    {...item}
                    collapsed={collapsed}
                    className={`
                      group transition-[background-color,border-color,box-shadow] duration-200 
                      hover:bg-ron-teal-400/10
                      hover:shadow-glow-teal
                      rounded-lg
                      border border-transparent
                      hover:border-ron-teal-400/20
                    `}
                  />
                ))}
              </nav>

              {/* System Navigation */}
              <div>
                <h2 className={`
                  px-3 text-xs font-semibold text-gray-400 
                  uppercase tracking-wider mb-2
                  transition-opacity duration-200
                  ${collapsed ? 'opacity-0' : 'opacity-100'}
                `}>
                  System
                </h2>
                <nav className="space-y-2">
                  {secondaryNavItems.map((item, index) => (
                    <NavItem 
                      key={item.label} 
                      {...item}
                      collapsed={collapsed}
                      className={`
                        group transition-[background-color,border-color,box-shadow] duration-200 
                        hover:bg-ron-teal-400/10
                        hover:shadow-glow-teal
                        rounded-lg
                        border border-transparent
                        hover:border-ron-teal-400/20
                        relative
                      `}
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

          {/* Footer Section */}
          <div className={`
            p-4 border-t border-ron-teal-400/20
            bg-black
            transition-opacity duration-200
            ${collapsed ? 'opacity-0' : 'opacity-100'}
          `}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {new Date().getFullYear()} Ron Care
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
