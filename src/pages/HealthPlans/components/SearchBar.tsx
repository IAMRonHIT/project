import React, { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter: () => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, onFilter, placeholder = 'Search Health Plans by Name, Payer ID, or Keyword...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Handle clicks outside of search bar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div 
      ref={searchRef}
      className={`
        relative flex items-center space-x-4 p-4 rounded-xl
        transition-all duration-300
        ${isDark 
          ? 'bg-black/50 backdrop-blur-xl border border-ron-teal-400/20' 
          : 'bg-white/50 backdrop-blur-xl border border-gray-200'
        }
        ${isFocused ? 'shadow-glow-teal' : 'shadow-lg'}
      `}
    >
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className={`
            w-full py-2 pl-10 pr-4 rounded-lg
            transition-all duration-300
            ${isDark 
              ? 'bg-ron-teal-400/5 text-white placeholder-gray-400 border-ron-teal-400/20' 
              : 'bg-white text-gray-900 placeholder-gray-500 border-gray-200'
            }
            border
            focus:outline-none focus:ring-2 focus:ring-ron-teal-400/50
          `}
          placeholder={placeholder}
        />
        
        {query && (
          <button
            onClick={() => setQuery('')}
            className={`
              absolute inset-y-0 right-0 pr-3 flex items-center
              ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}
              transition-colors duration-200
            `}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <button
        onClick={onFilter}
        className={`
          p-2 rounded-lg
          transition-all duration-200
          ${isDark 
            ? 'bg-ron-teal-400/5 hover:bg-ron-teal-400/10 text-gray-400 hover:text-white' 
            : 'bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700'
          }
          border
          ${isDark ? 'border-ron-teal-400/20' : 'border-gray-200'}
          hover:shadow-glow-teal
        `}
      >
        <SlidersHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
}