import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NoteProvider, useNote, Highlight, Screenshot, Attachment } from '../contexts/NoteContext';
import NoteComponent from './NoteComponent';

// Internal NoteButton component
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

interface NoteIntegrationProps {
  entityType?: 'Ticket' | 'CareJourney' | 'Auth' | 'Appeal' | 'Claim' | 'CarePlan' | 'Task';
  entityId?: string;
  entityName?: string;
  initialContent?: string;
  onSave?: (content: string, highlights: Highlight[], screenshots: Screenshot[], attachment: Attachment | null) => void;
  className?: string;
  buttonClassName?: string;
  buttonPosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left' | 'inline';
  autoOpen?: boolean;
  triggerKey?: string;
}

// Inner component that uses the NoteContext
const NoteIntegrationInner: React.FC<NoteIntegrationProps & { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }> = ({
  entityType,
  entityId,
  entityName,
  initialContent = '',
  onSave,
  className = '',
  buttonClassName = '',
  buttonPosition = 'bottom-right',
  autoOpen = false,
  triggerKey = 'n',
  isOpen,
  setIsOpen
}) => {
  // Get the dispatch function from the note context
  const { dispatch } = useNote();
  
  // Make sure component state and context state are in sync
  useEffect(() => {
    if (isOpen) {
      dispatch({ type: 'OPEN_NOTE' });
    } else {
      dispatch({ type: 'CLOSE_NOTE' });
    }
  }, [isOpen, dispatch]);
  // Handle save
  const handleSave = (
    content: string, 
    highlights: Highlight[], 
    screenshots: Screenshot[], 
    attachment: Attachment | null
  ) => {
    if (onSave) {
      onSave(content, highlights, screenshots, attachment);
    }
    
    // In a real implementation, we would save the note to a database
    console.log('Saving note:', { content, highlights, screenshots, attachment });
  };
  
  // Get button position classes
  const getButtonPositionClasses = () => {
    switch (buttonPosition) {
      case 'top-right':
        return 'absolute top-2 right-2';
      case 'bottom-right':
        return 'absolute bottom-2 right-2';
      case 'top-left':
        return 'absolute top-2 left-2';
      case 'bottom-left':
        return 'absolute bottom-2 left-2';
      case 'inline':
        return '';
      default:
        return 'absolute bottom-2 right-2';
    }
  };
  
  return (
    <>
      {/* Note Button */}
      <NoteButton 
        onClick={() => setIsOpen(true)}
        buttonPosition={buttonPosition}
        buttonClassName={buttonClassName}
        triggerKey={triggerKey}
        getButtonPositionClasses={getButtonPositionClasses}
      />
      
      {/* Note Component */}
      {isOpen && (
        <NoteComponent
          initialContent={initialContent}
          onSave={handleSave}
          onClose={() => setIsOpen(false)}
          className={className}
        />
      )}
    </>
  );
};

// Main component that provides the NoteContext
const NoteIntegration: React.FC<NoteIntegrationProps> = (props) => {
  const [isOpen, setIsOpen] = useState(props.autoOpen || false);
  const [noteId] = useState(uuidv4());
  
  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === props.triggerKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setIsOpen(prevIsOpen => !prevIsOpen);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [props.triggerKey]);
  
  // Update isOpen when autoOpen prop changes
  useEffect(() => {
    setIsOpen(props.autoOpen || false);
  }, [props.autoOpen]);
  
  return (
    <NoteProvider>
      <NoteIntegrationInner 
        {...props} 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
      />
    </NoteProvider>
  );
};

export default NoteIntegration;
