import React from 'react';
import { Activity, FileText, Heart, MessageSquare, Brain } from 'lucide-react';

interface NavigationItem {
  readonly id: string;
  readonly label: string;
  readonly icon: typeof Activity;
}

interface NavigationRibbonProps extends Readonly<{
  activeTab: string;
  onTabChange: (tabId: string) => void;
}> {}

const navigationItems: readonly NavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'clinical-reviews', label: 'Clinical Reviews', icon: FileText },
  { id: 'care-planning', label: 'Care Planning', icon: Heart },
  { id: 'claims', label: 'Claims', icon: FileText },
  { id: 'ron-ai', label: 'Ron AI', icon: Brain },
  { id: 'communication', label: 'Communication Hub', icon: MessageSquare },
] as const;

export function NavigationRibbon({ activeTab, onTabChange }: NavigationRibbonProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const getBackgroundColor = () => 
    isDark ? 'bg-black/90' : 'bg-dark-gun-metal/90';

  const getBorderColor = () =>
    isDark ? 'border-white/10' : 'border-ron-divider';

  const getTextColor = (isActive: boolean) => {
    if (isActive) {
      return isDark ? 'text-[#CCFF00]' : 'text-ron-primary';
    }
    return isDark
      ? 'text-white/60 hover:text-white/90'
      : 'text-dark-gun-metal/60 hover:text-dark-gun-metal/90';
  };

  const getIndicatorColor = () =>
    isDark ? 'bg-[#CCFF00]' : 'bg-ron-primary';

  return (
    <div className={`sticky top-0 z-50 w-full ${getBackgroundColor()} backdrop-blur-xl border-b ${getBorderColor()}`}>
      <div className="max-w-screen-2xl mx-auto">
        <nav className="flex items-center overflow-x-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative ${getTextColor(isActive)}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {item.label}
                {isActive && (
                  <div className={`absolute bottom-0 left-0 w-full h-0.5 ${getIndicatorColor()}`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
