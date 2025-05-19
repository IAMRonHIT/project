import React, { useState, useRef, useEffect, memo } from 'react';
import { Brain, Headphones, Search, User, MapPin, Bot, ChevronDown, FileCode } from 'lucide-react';
import realtimeAudioService from '../../services/realtimeAudioService';
import SandboxIDE from './SandboxIDE';

export type ModeType = 
  | 'default' // Ron AI - Will use gemini-2.5-flash-preview-04-17
  | 'realtime-audio' 
  | 'patient-content' 
  | 'provider-search' // Will connect to NPI API / Google Maps
  | 'deep-thinking-sonar' // Formerly 'perplexity-reasoning', label "Deep Thinking", model sonar-reasoning-pro
  | 'deep-research-sonar' // Formerly 'perplexity-research', label "Deep Research", model sonar-deep-research
  | 'one-click-builds';

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
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
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
    // 'deep-thinking' option removed
    {
      id: 'realtime-audio',
      label: 'Realtime Audio',
      icon: <Headphones size={14} />,
      bgColor: 'bg-purple-600',
      hoverBgColor: 'hover:bg-purple-700',
      textColor: 'text-purple-600'
    },
    // 'deep-research' option removed
    {
      id: 'patient-content',
      label: 'Patient Content',
      icon: <User size={14} />,
      bgColor: 'bg-amber-500',
      hoverBgColor: 'hover:bg-amber-600',
      textColor: 'text-amber-500'
    },
    {
      id: 'one-click-builds',
      label: 'One Click Builds',
      icon: <FileCode size={14} />,
      bgColor: 'bg-green-500',
      hoverBgColor: 'hover:bg-green-600',
      textColor: 'text-green-500'
    },
    {
      id: 'provider-search',
      label: 'Provider Search',
      icon: <MapPin size={14} />,
      bgColor: 'bg-sky-500',
      hoverBgColor: 'hover:bg-sky-600',
      textColor: 'text-sky-500'
    },
    {
      id: 'deep-thinking-sonar', // Formerly 'perplexity-reasoning'
      label: 'Deep Thinking',
      icon: <Brain size={14} />, // Using Brain icon for reasoning
      bgColor: 'bg-cyan-600',
      hoverBgColor: 'hover:bg-cyan-700',
      textColor: 'text-cyan-600'
    },
    {
      id: 'deep-research-sonar', // Formerly 'perplexity-research'
      label: 'Deep Research',
      icon: <Search size={14} />, // Using Search icon for research
      bgColor: 'bg-indigo-600',
      hoverBgColor: 'hover:bg-indigo-700',
      textColor: 'text-indigo-600'
    },
  ];

  const handleToggleDropdown = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = async (mode: ModeType) => {
    console.log('Mode selected:', mode);

    // Stop audio if running and not the target mode
    if (mode !== 'realtime-audio' && realtimeAudioService.connectionState !== 'disconnected') {
      realtimeAudioService.stopSession();
    }

    if (mode === 'realtime-audio') {
      try {
        await realtimeAudioService.startSession();
        setIsSandboxOpen(false); // Ensure sandbox is closed for audio mode
        onChange(mode);
      } catch (error) {
        console.error('Error starting realtime audio session:', error);
        setIsSandboxOpen(false);
        onChange('default'); // Revert to default on error
      }
    } else if (mode === 'one-click-builds') {
      console.log(`Opening ${mode} mode with SandboxIDE`);
      setIsSandboxOpen(true);
      onChange(mode);
    } else if (mode === 'patient-content') {
      console.log(`Switching to ${mode} mode, ensuring SandboxIDE is closed.`);
      setIsSandboxOpen(false); // Explicitly close Sandbox for patient-content
      onChange(mode);
    } else {
      // For all other modes (default, deep-thinking-sonar, deep-research-sonar, provider-search)
      setIsSandboxOpen(false); // Ensure sandbox is closed
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
  // const ariaExpanded = isOpen ? "true" : "false"; // Removed as it's unused, aria-expanded set directly

  return (
    <>
      {/* SandboxIDE */}
      <SandboxIDE 
        isOpen={isSandboxOpen} /* Retained for potential internal SandboxIDE logic */
        onClose={() => setIsSandboxOpen(false)} /* Retained for potential internal SandboxIDE logic */
        isVisible={isSandboxOpen} 
        onVisibilityChange={(visible) => setIsSandboxOpen(visible)} 
        currentMode={activeMode} 
      />
      
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
          aria-label="Mode Selection Dropdown"
        >
          {[...modeOptions].reverse().map((option) => {
            return (
              <button
                key={option.id}
                role="option"
                className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  option.id === activeMode 
                    ? `${option.bgColor} text-white`
                    : `text-gray-300 hover:${option.textColor} hover:bg-gray-700`
                }`}
                onClick={() => handleOptionClick(option.id)}
              >
                <span className="flex items-center justify-center w-4 h-4">{option.icon}</span>
                <span>{option.label.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      )}
</div>
    </>
  );
});

export default ModeDropdown;
