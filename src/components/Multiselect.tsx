import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({ options, selected, onChange, placeholder }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className={`
          w-full px-4 py-2 text-left rounded-lg flex items-center justify-between
          transition-colors border border-white/10
          ${isDark ? 'bg-gray-900/80' : 'bg-white/80'}
          hover:border-ron-teal-400/40
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={isDark ? 'text-white/60' : 'text-gray-600'}>
          {selected.length > 0 
            ? `${selected.length} selected`
            : placeholder || 'Select options'}
        </span>
        <ChevronDown className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-gray-600'}`} />
      </button>

      {isOpen && (
        <div className={`
          absolute z-50 w-full mt-2 rounded-lg shadow-lg max-h-60 overflow-auto
          border border-white/10
          ${isDark ? 'bg-gray-900/80 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl'}
        `}>
          {options.map(option => (
            <button
              key={option}
              className={`
                w-full px-4 py-2 text-left flex items-center justify-between group
                transition-colors hover:bg-ron-teal-400/10
              `}
              onClick={() => toggleOption(option)}
            >
              <span className={isDark ? 'text-white/60' : 'text-gray-600'}>
                {option}
              </span>
              {selected.includes(option) && (
                <Check className="w-4 h-4 text-ron-teal-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
