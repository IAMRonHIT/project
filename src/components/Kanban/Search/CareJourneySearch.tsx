import { Search } from 'lucide-react';
import type { themes } from '../../../lib/themes';

interface CareJourneySearchProps {
  onSearch: (query: string) => void;
  theme: typeof themes[keyof typeof themes];
}

export function CareJourneySearch({ onSearch, theme }: CareJourneySearchProps) {
  return (
    <div className={`
      relative flex items-center
      ${theme.cardBg} rounded-lg border ${theme.border}
      focus-within:ring-2 focus-within:ring-cyan-400
    `}>
      <Search className="w-5 h-5 text-cyan-400 absolute left-3" />
      <input
        type="text"
        placeholder="Search tasks..."
        className={`
          w-[300px] py-2 pl-10 pr-4 bg-transparent
          ${theme.text} placeholder:${theme.textSecondary}
          focus:outline-none
        `}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
