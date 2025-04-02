import React from 'react';
import { LayoutGrid, List, Calendar, ChevronDown } from 'lucide-react';
import { useKanban } from '../context/KanbanContext';
import type { KanbanTheme } from '../types';
import type { ViewType } from '../context/KanbanContext';
import { cn } from '../../../lib/utils';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface ViewSwitcherProps {
  theme: KanbanTheme;
}

const views = [
  { type: 'kanban' as ViewType, label: 'Board', icon: LayoutGrid },
  { type: 'list' as ViewType, label: 'List', icon: List },
  { type: 'calendar' as ViewType, label: 'Calendar', icon: Calendar },
] as const;

export function ViewSwitcher({ theme }: ViewSwitcherProps) {
  const { state, dispatch } = useKanban();
  const { activeView } = state;
  
  const handleViewChange = (view: ViewType) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };
  
  const CurrentViewIcon = views.find(v => v.type === activeView)?.icon || LayoutGrid;
  const currentLabel = views.find(v => v.type === activeView)?.label || 'Board';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            "gap-2 min-w-[140px] relative",
            theme.name === 'dark' 
              ? "bg-[#334155] hover:bg-[#334155]/90 text-white" 
              : "bg-white hover:bg-white/90 text-gray-800"
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
            onClick={() => handleViewChange(view.type)}
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