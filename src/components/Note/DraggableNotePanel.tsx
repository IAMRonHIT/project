import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNote } from '../contexts/NoteContext';
import NoteComponent from './NoteComponent';
import NoteButton from './NoteButton';

interface DraggableNotePanelProps {
  initialContent?: string;
  className?: string;
  autoOpen?: boolean;
  onSave?: (content: string) => void;
  sidebarPosition?: 'left' | 'right';
  initialWidth?: number;
}

const DraggableNotePanel: React.FC<DraggableNotePanelProps> = ({
  initialContent = '',
  className = '',
  autoOpen = false,
  onSave,
  sidebarPosition = 'right',
  initialWidth = 400,
}) => {
  const { state, dispatch } = useNote();
  const [isVisible, setIsVisible] = useState(autoOpen);
  const [isDetached, setIsDetached] = useState(false);
  const [panelWidth, setPanelWidth] = useState(initialWidth);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Toggle note visibility
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    if (!isVisible) {
      dispatch({ type: 'OPEN_NOTE' });
    } else {
      dispatch({ type: 'CLOSE_NOTE' });
    }
  };

  // Toggle detached state
  const toggleDetached = () => {
    setIsDetached(!isDetached);
    // Reset position when attaching back to sidebar
    if (isDetached) {
      setPosition({ x: 0, y: 0 });
    }
  };

  // Handle save and pass to parent if needed
  const handleSave = (content: string) => {
    dispatch({ type: 'SAVE_NOTE' });
    if (onSave) {
      onSave(content);
    }
  };

  // Handle resize
  useEffect(() => {
    const resizeHandle = resizeHandleRef.current;
    if (!resizeHandle) return;

    let startX = 0;
    let startWidth = 0;

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      startX = e.pageX;
      startWidth = panelWidth;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.pageX - startX;
      const newWidth = sidebarPosition === 'right'
        ? startWidth - deltaX
        : startWidth + deltaX;
      
      if (newWidth >= 300 && newWidth <= 800) {
        setPanelWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    resizeHandle.addEventListener('mousedown', onMouseDown);

    return () => {
      resizeHandle.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [panelWidth, sidebarPosition]);

  // Keyboard shortcut to toggle note
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        toggleVisibility();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  // Update isVisible when autoOpen prop changes
  useEffect(() => {
    setIsVisible(autoOpen);
  }, [autoOpen]);

  // Ensure we clean up when component unmounts
  useEffect(() => {
    return () => {
      dispatch({ type: 'CLOSE_NOTE' });
    };
  }, [dispatch]);

  return (
    <>
      {/* Note Button */}
      {!isVisible && (
        <NoteButton 
          onClick={toggleVisibility}
          buttonPosition="bottom-right"
          buttonClassName=""
          triggerKey="n"
          getButtonPositionClasses={() => "absolute bottom-2 right-2"}
        />
      )}

      {/* Note Panel */}
      {isVisible && !isDetached && (
        <div 
          ref={panelRef}
          className={`
            fixed ${sidebarPosition === 'right' ? 'right-0' : 'left-0'} top-0 h-full
            bg-gradient-to-b from-gray-900/95 to-gray-800/95
            backdrop-blur-md
            border-${sidebarPosition === 'right' ? 'l' : 'r'} border-indigo-500/30
            shadow-xl
            z-40
            flex flex-col
            transition-all duration-300 ease-in-out
            ${className}
          `}
          style={{ width: `${panelWidth}px` }}
        >
          {/* Resize Handle */}
          <div 
            ref={resizeHandleRef}
            className={`
              absolute ${sidebarPosition === 'right' ? 'left-0' : 'right-0'} top-0 bottom-0
              w-1 cursor-col-resize hover:bg-indigo-500/50
              z-50
            `}
          />

          {/* Panel Header */}
          <div className="p-4 border-b border-indigo-500/30 bg-gray-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
              <h2 className="text-sm font-medium text-white">Notes</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDetached}
                className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                aria-label="Pop out note"
                title="Pop out note"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </button>
              <button
                onClick={toggleVisibility}
                className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                aria-label="Close note"
                title="Close note"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Note Component */}
          <div className="flex-1 overflow-hidden">
            <NoteComponent
              initialContent={initialContent}
              onSave={(content) => handleSave(content)}
              onClose={toggleVisibility}
              className="h-full"
            />
          </div>
        </div>
      )}

      {/* Detached Floating Note */}
      {isVisible && isDetached && (
        <motion.div
          drag
          dragMomentum={false}
          initial={{ x: window.innerWidth - panelWidth - 20, y: 20 }}
          animate={position}
          onDragEnd={(_, info) => {
            setPosition({ x: position.x + info.offset.x, y: position.y + info.offset.y });
          }}
          className={`
            fixed 
            bg-gradient-to-b from-gray-900/95 to-gray-800/95
            backdrop-blur-md
            border border-indigo-500/30
            rounded-lg
            shadow-xl
            z-50
            flex flex-col
            ${className}
          `}
          style={{ 
            width: `${panelWidth}px`,
            height: '80vh',
            maxHeight: '800px'
          }}
        >
          {/* Floating Panel Header - with drag handle */}
          <div 
            className="p-4 border-b border-indigo-500/30 bg-gray-800/50 flex items-center justify-between cursor-move"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
              <h2 className="text-sm font-medium text-white">Notes</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDetached}
                className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                aria-label="Dock note"
                title="Dock note"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                </svg>
              </button>
              <button
                onClick={toggleVisibility}
                className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                aria-label="Close note"
                title="Close note"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Note Component */}
          <div className="flex-1 overflow-hidden">
            <NoteComponent
              initialContent={initialContent}
              onSave={(content) => handleSave(content)}
              onClose={toggleVisibility}
              className="h-full"
            />
          </div>

          {/* Resize Handle - for all corners */}
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 hover:opacity-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 22L12 12M22 12L12 22" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default DraggableNotePanel; 