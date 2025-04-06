import React from 'react';
import { useNote } from '../contexts/NoteContext';

interface NoteButtonProps {
  onClick: () => void;
  buttonPosition: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left' | 'inline';
  buttonClassName: string;
  triggerKey: string;
  getButtonPositionClasses: () => string;
}

const NoteButton: React.FC<NoteButtonProps> = ({
  onClick,
  buttonPosition,
  buttonClassName,
  triggerKey,
  getButtonPositionClasses
}) => {
  const { dispatch } = useNote();
  
  const handleClick = () => {
    onClick();
    dispatch({ type: 'OPEN_NOTE' });
  };
  
  return (
    <button
      onClick={() => handleClick()}
      className={`
        w-10 h-10 rounded-full 
        bg-gradient-to-br from-purple-600 to-indigo-700 
        text-white 
        hover:shadow-[0_0_15px_rgba(79,70,229,0.7)] hover:brightness-110
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
        shadow-[0_0_10px_rgba(79,70,229,0.5)]
        border border-indigo-500/30
        transition-all duration-200
        flex items-center justify-center
        group
        ${buttonPosition !== 'inline' ? getButtonPositionClasses() : ''}
        ${buttonClassName}
      `}
      aria-label="Open note"
      title={`Open note (press '${triggerKey}' key)`}
    >
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </button>
  );
};

export default NoteButton;
