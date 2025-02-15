import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function MultiSelect({ options, selected, onChange, placeholder, showBack, onBack }: MultiSelectProps) {
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
    if (!showBack) {
      // When selecting a view type, just update selection and keep dropdown open
      onChange([option]);
    } else {
      // When selecting periods, update selection and close dropdown
      const newSelected = selected.includes(option)
        ? selected.filter(item => item !== option)
        : [...selected, option];
      onChange(newSelected);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className={`
          w-full px-3 py-2 text-left rounded-lg flex items-center justify-between
          transition-colors border border-white/10
          ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-sm
          hover:border-ron-teal-400/40
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={isDark ? 'text-white/60' : 'text-gray-600'}>
          {placeholder}
        </span>
        <ChevronRight className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-gray-600'} transform transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <div className={`
          absolute z-[9999] w-full mt-2 rounded-lg shadow-lg overflow-hidden left-0
          border border-white/10
          ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-xl
        `}>
          {showBack && (
            <button
              className={`
                w-full px-3 py-2 text-left flex items-center gap-2 group
                transition-colors hover:bg-ron-teal-400/10 border-b border-white/10
                font-medium
              `}
              onClick={() => {
                onBack?.();
              }}
            >
              <ChevronLeft className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-gray-600'}`} />
              <span className={isDark ? 'text-white/60' : 'text-gray-600'}>
                Back to Views
              </span>
            </button>
          )}
          {options.map(option => (
            <button
              key={option}
              className={`
                w-full px-3 py-2 text-left flex items-center justify-between group
                transition-colors hover:bg-ron-teal-400/10 first:rounded-t-lg last:rounded-b-lg
                font-medium
              `}
              onClick={() => toggleOption(option)}
            >
              <span className={isDark ? 'text-white/60' : 'text-gray-600'}>
                {option}
              </span>
              {selected.includes(option) && (
                <CheckCircle className="w-4 h-4 text-ron-teal-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
