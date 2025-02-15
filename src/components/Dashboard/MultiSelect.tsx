import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}

export function MultiSelect({ options, selected, onChange, placeholder }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const getButtonStyles = () => {
    return `
      w-full px-3 py-1.5 text-sm rounded-md transition-all duration-200
      border flex justify-between items-center
      ${isDark 
        ? '"bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10"-800 border-gray-600 text-gray-300 hover:border-ron-teal-400/50' 
        : 'bg-white border-gray-300 text-gray-700 hover:border-ron-teal-400'}
      focus:outline-none focus:ring-1 focus:ring-ron-teal-400
    `;
  };

  const getDropdownStyles = () => {
    return `
      absolute z-50 w-full mt-1 rounded-md shadow-lg
      ${isDark ? '"bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10"-800 border border-gray-600' : 'bg-white border border-gray-200'}
    `;
  };

  const getOptionsContainerStyles = () => {
    return `
      max-h-[240px] overflow-y-auto
      scrollbar-thin scrollbar-thumb-rounded-full
      ${isDark 
        ? 'scrollbar-track-gray-800 scrollbar-thumb-gray-600' 
        : 'scrollbar-track-gray-100 scrollbar-thumb-gray-300'}
    `;
  };

  const getOptionStyles = (isSelected: boolean) => {
    return `
      flex items-center px-3 py-2 text-sm cursor-pointer
      ${isDark 
        ? `${isSelected ? 'bg-ron-teal-400/20' : 'hover:"bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10"-700'} text-gray-300` 
        : `${isSelected ? 'bg-ron-teal-50' : 'hover:"bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10"-50'} text-gray-700`}
    `;
  };

  const getCheckboxStyles = (isSelected: boolean) => {
    return `
      w-4 h-4 mr-2 rounded border flex-shrink-0
      ${isDark
        ? `${isSelected ? 'bg-ron-teal-400 border-ron-teal-400' : 'border-gray-600'}`
        : `${isSelected ? 'bg-ron-teal-500 border-ron-teal-500' : 'border-gray-300'}`}
    `;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={getButtonStyles()}
      >
        <span className="truncate">
          {selected.length > 0 
            ? `${selected.length} selected`
            : placeholder}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={getDropdownStyles()}>
          <div className={getOptionsContainerStyles()}>
            {options.map(option => (
              <div
                key={option}
                className={getOptionStyles(selected.includes(option))}
                onClick={() => toggleOption(option)}
              >
                <div className={getCheckboxStyles(selected.includes(option))}>
                  {selected.includes(option) && (
                    <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="truncate">{option}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
