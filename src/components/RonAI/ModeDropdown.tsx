import React, { useState, useRef, useEffect, memo } from 'react';
import { Brain, Headphones, Search, User, MapPin, Bot, ChevronDown, Pill } from 'lucide-react';
import realtimeAudioService from '../../services/realtimeAudioService';

export type ModeType = 'default' | 'deep-thinking' | 'realtime-audio' | 'medication-reconciliation' | 'patient-content' | 'provider-search';

interface ModeOption {
  id: ModeType;
  label: string;
  icon: React.ReactNode;
  bgColor: string;
  hoverBgColor: string;
  textColor: string;
}

interface ModeDropdownProps extends Readonly<{
  activeMode: ModeType;
  onChange: (mode: ModeType, sessionData?: any) => void;
  isDisabled?: boolean;
  className?: string;
}> {}

const ModeDropdown = memo(function ModeDropdown({ 
  activeMode = 'default', 
  onChange,
  isDisabled = false,
  className = ''
}: ModeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const modeOptions: ModeOption[] = [
    {
      id: 'default',
      label: 'Ron AI',
      icon: <Bot size={14} />,
      bgColor: 'bg-pink-500',
      hoverBgColor: 'hover:bg-pink-600',
      textColor: 'text-pink-500'
    },
    {
      id: 'deep-thinking',
      label: 'Deep Thinking',
      icon: <Brain size={14} />,
      bgColor: 'bg-teal-500',
      hoverBgColor: 'hover:bg-teal-600',
      textColor: 'text-teal-500'
    },
    {
      id: 'realtime-audio',
      label: 'Realtime Audio',
      icon: <Headphones size={14} />,
      bgColor: 'bg-purple-600',
      hoverBgColor: 'hover:bg-purple-700',
      textColor: 'text-purple-600'
    },
    {
      id: 'medication-reconciliation',
      label: 'Medication Reconciliation',
      icon: <Pill size={14} />,
      bgColor: 'bg-blue-600',
      hoverBgColor: 'hover:bg-blue-700',
      textColor: 'text-blue-600'
    },
    {
      id: 'patient-content',
      label: 'Patient Content',
      icon: <User size={14} />,
      bgColor: 'bg-amber-500',
      hoverBgColor: 'hover:bg-amber-600',
      textColor: 'text-amber-500'
    },
    {
      id: 'provider-search',
      label: 'Provider Search',
      icon: <MapPin size={14} />,
      bgColor: 'bg-sky-500',
      hoverBgColor: 'hover:bg-sky-600',
      textColor: 'text-sky-500'
    },
  ];

  const handleToggleDropdown = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = async (mode: ModeType) => {
    console.log('Mode selected:', mode);
    if (mode === 'realtime-audio') {
      try {
        await realtimeAudioService.startSession();
        onChange(mode);
      } catch (error) {
        console.error('Error starting realtime audio session:', error);
        onChange('default');
      }
    } else {
      if (realtimeAudioService.connectionState !== 'disconnected') {
        realtimeAudioService.stopSession();
      }
      console.log('Calling onChange with mode:', mode);
      onChange(mode);
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const activeOption = modeOptions.find(option => option.id === activeMode) || modeOptions[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${activeOption.bgColor} ${activeOption.hoverBgColor} text-white ${className}`}
        onClick={handleToggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={isDisabled}
      >
        <span className="flex items-center justify-center w-4 h-4">{activeOption.icon}</span>
        <span>{activeOption.label.toUpperCase()}</span>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div 
          className="absolute z-50 min-w-full whitespace-nowrap bottom-full mb-1 bg-gray-800 border border-gray-700 rounded-lg shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)] overflow-hidden origin-bottom animate-slide-up"
          role="listbox"
        >
          {[...modeOptions].reverse().map((option) => (
            <button
              key={option.id}
              role="option"
              aria-selected={activeMode === option.id}
              className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                activeMode === option.id 
                  ? `${option.bgColor} text-white`
                  : `text-gray-300 hover:${option.textColor} hover:bg-gray-700`
              }`}
              onClick={() => handleOptionClick(option.id)}
            >
              <span className="flex items-center justify-center w-4 h-4">{option.icon}</span>
              <span>{option.label.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

export default ModeDropdown;
