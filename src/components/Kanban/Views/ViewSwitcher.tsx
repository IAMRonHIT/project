import { LayoutGrid, Calendar, List } from 'lucide-react';
import { Button } from '../../ui/button';
import type { themes } from '../../../lib/themes';

type View = 'kanban' | 'calendar' | 'list';

interface ViewSwitcherProps {
  currentView: View;
  onViewChange: (view: View) => void;
  theme: typeof themes[keyof typeof themes];
}

export function ViewSwitcher({ currentView, onViewChange, theme }: ViewSwitcherProps) {
  const views: { value: View; label: string; icon: typeof LayoutGrid }[] = [
    { value: 'kanban', label: 'Kanban', icon: LayoutGrid },
    { value: 'calendar', label: 'Calendar', icon: Calendar },
    { value: 'list', label: 'List', icon: List },
  ];

  return (
    <div className="flex items-center gap-2">
      {views.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant={currentView === value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewChange(value)}
          className="flex items-center gap-2"
        >
          <Icon className="w-4 h-4" />
          {label}
        </Button>
      ))}
    </div>
  );
}
