import React from 'react';
import { LayoutGrid, List, Calendar, ChevronDown } from 'lucide-react';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { cn } from '../../../src/lib/utils';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export type ViewType = 'kanban' | 'list' | 'calendar';

interface ViewSwitcherProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const views = [
  { type: 'kanban', label: 'Board', icon: LayoutGrid },
  { type: 'list', label: 'List', icon: List },
  { type: 'calendar', label: 'Calendar', icon: Calendar },
] as const;

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  const { theme } = useTheme();
  const CurrentViewIcon = views.find(v => v.type === currentView)?.icon || LayoutGrid;
  const currentLabel = views.find(v => v.type === currentView)?.label || 'Board';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            "gap-2 min-w-[140px] relative bg-white hover:bg-white/90",
            theme === 'dark' && "bg-[#334155] hover:bg-[#334155]/90 text-white"
          )}
        >
          <CurrentViewIcon className="w-4 h-4" />
          <span>{currentLabel}</span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[140px]">
        {views.map(view => (
          <DropdownMenuItem
            key={view.type}
            onClick={() => onViewChange(view.type)}
            className="gap-2"
          >
            <view.icon className="w-4 h-4" />
            <span>{view.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}