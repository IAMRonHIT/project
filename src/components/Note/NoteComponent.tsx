import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNote, Highlight, Screenshot, Attachment } from '../contexts/NoteContext';
import TextHighlighter from './TextHighlighter';
import ScreenshotCapture from './ScreenshotCapture';
import NoteMacros from './NoteMacros';
import SpeechToText from './SpeechToText';
import NoteAttachment from './NoteAttachment';

interface NoteComponentProps {
  initialContent?: string;
  onSave?: (content: string, highlights: Highlight[], screenshots: Screenshot[], attachment: Attachment | null) => void;
  onClose?: () => void;
  className?: string;
}

const NoteComponent: React.FC<NoteComponentProps> = ({
  initialContent = '',
  onSave,
  onClose,
  className = ''
}) => {
  const { state, dispatch } = useNote();
  const [isHighlighterEnabled, setIsHighlighterEnabled] = useState(false);
  const [isScreenshotEnabled, setIsScreenshotEnabled] = useState(false);
  const [isSpeechToTextOpen, setIsSpeechToTextOpen] = useState(false);
  const [isMacrosOpen, setIsMacrosOpen] = useState(false);
  const noteContentRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize note content
  useEffect(() => {
    if (initialContent) {
      dispatch({ type: 'SET_CONTENT', content: initialContent });
    }
  }, [initialContent, dispatch]);

  // Handle keyboard shortcut to open note
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 'n' key to toggle note
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (!state.isOpen) {
          dispatch({ type: 'OPEN_NOTE' });
        }
      }
      
      // Escape key to close note
      if (e.key === 'Escape' && state.isOpen) {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.isOpen, dispatch]);

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'SET_CONTENT', content: e.target.value });
  };

  // Handle save
  const handleSave = () => {
    dispatch({ type: 'SAVE_NOTE' });
    
    if (onSave) {
      onSave(
        state.content,
        state.highlights,
        state.screenshots,
        state.attachedTo
      );
    }
  };

  // Handle close
  const handleClose = () => {
    if (state.isDirty) {
      if (window.confirm('You have unsaved changes. Do you want to save before closing?')) {
        handleSave();
      }
    }
    
    dispatch({ type: 'CLOSE_NOTE' });
    
    if (onClose) {
      onClose();
    }
  };

  // Handle adding a highlight
  const handleAddHighlight = (highlight: Highlight) => {
    // Add the highlight to the note content as well
    const newContent = state.content + (state.content ? '\n\n' : '') + 
      `Highlight from ${highlight.source || 'unknown source'}:\n"${highlight.text}"`;
    
    dispatch({ type: 'SET_CONTENT', content: newContent });
  };

  // Handle adding a screenshot
  const handleAddScreenshot = (screenshot: Screenshot) => {
    // In a real implementation, we would add a reference to the screenshot in the note content
    const newContent = state.content + (state.content ? '\n\n' : '') + 
      `[Screenshot added: ${new Date(screenshot.timestamp).toLocaleString()}]`;
    
    dispatch({ type: 'SET_CONTENT', content: newContent });
  };

  // Handle applying a macro
  const handleApplyMacro = (content: string) => {
    if (!noteContentRef.current) return;
    
    const textArea = noteContentRef.current;
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    
    const newContent = 
      state.content.substring(0, start) + 
      content + 
      state.content.substring(end);
    
    dispatch({ type: 'SET_CONTENT', content: newContent });
    
    // Set cursor position after the inserted content
    setTimeout(() => {
      textArea.focus();
      textArea.selectionStart = start + content.length;
      textArea.selectionEnd = start + content.length;
    }, 0);
  };

  // Handle adding transcript
  const handleAddTranscript = (text: string) => {
    const newContent = state.content + (state.content ? '\n\n' : '') + text;
    dispatch({ type: 'SET_CONTENT', content: newContent });
  };

  // Note: We no longer need to check state.isOpen here since the parent component
  // (DraggableNotePanel) controls whether this component is rendered or not

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full flex flex-col ${className}`}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700/50 bg-gray-800/30">
        <button
          onClick={() => setIsHighlighterEnabled(!isHighlighterEnabled)}
          className={`p-2 rounded-md transition-all duration-200 ${
            isHighlighterEnabled 
              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-[0_0_5px_rgba(79,70,229,0.4)]' 
              : 'text-gray-400 hover:bg-gray-700/50 hover:text-white border border-transparent'
          }`}
          title="Toggle text highlighter"
          aria-label="Toggle text highlighter"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M11.7 9.3l3-3a2.1 2.1 0 1 1 3 3l-3 3-3-3z"></path>
            <path d="M5 19l8-8"></path>
          </svg>
        </button>
        
        <button
          onClick={() => setIsScreenshotEnabled(!isScreenshotEnabled)}
          className={`p-2 rounded-md transition-all duration-200 ${
            isScreenshotEnabled 
              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-[0_0_5px_rgba(79,70,229,0.4)]' 
              : 'text-gray-400 hover:bg-gray-700/50 hover:text-white border border-transparent'
          }`}
          title="Toggle screenshot tool"
          aria-label="Toggle screenshot tool"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </button>
        
        <button
          onClick={() => setIsSpeechToTextOpen(!isSpeechToTextOpen)}
          className={`p-2 rounded-md transition-all duration-200 ${
            isSpeechToTextOpen 
              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-[0_0_5px_rgba(79,70,229,0.4)]' 
              : 'text-gray-400 hover:bg-gray-700/50 hover:text-white border border-transparent'
          }`}
          title="Toggle speech to text"
          aria-label="Toggle speech to text"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        </button>
        
        <div className="relative">
          <NoteMacros onApplyMacro={handleApplyMacro} />
        </div>
        
        <div className="flex-1"></div>
        
        <div className="text-xs text-indigo-300/80">
          {state.isDirty ? 'Unsaved changes' : state.lastSaved ? `Last saved: ${new Date(state.lastSaved).toLocaleString()}` : ''}
        </div>
      </div>
      
      {/* Text Editor */}
      <div className="flex-1 overflow-auto p-4">
        <textarea
          ref={noteContentRef}
          value={state.content}
          onChange={handleContentChange}
          className="w-full h-full p-3 bg-gray-900/60 border border-indigo-500/20 rounded-md resize-none text-white leading-relaxed focus:outline-none focus:border-indigo-500/50 focus:shadow-[0_0_5px_rgba(79,70,229,0.4)] note-content"
          placeholder="Type your note here..."
          aria-label="Note content"
        />
      </div>

      {/* Macros Panel */}
      {isMacrosOpen && (
        <div className="absolute right-4 top-20 z-10 w-80 max-h-80 overflow-auto bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl rounded-md border border-indigo-500/30 bg-opacity-95 backdrop-blur-sm">
          <NoteMacros onApplyMacro={handleApplyMacro} />
        </div>
      )}

      {/* Speech to Text Panel */}
      {isSpeechToTextOpen && (
        <div className="absolute right-4 top-20 z-10 w-80 bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl rounded-md border border-indigo-500/30 bg-opacity-95 backdrop-blur-sm">
          <SpeechToText onTranscript={handleAddTranscript} />
        </div>
      )}
      
      {/* Text Highlighter */}
      <TextHighlighter 
        containerRef={containerRef}
        enabled={isHighlighterEnabled}
        onHighlight={handleAddHighlight}
      />
      
      {/* Screenshot Capture */}
      {isScreenshotEnabled && (
        <ScreenshotCapture
          containerRef={containerRef}
          enabled={isScreenshotEnabled}
          onScreenshot={handleAddScreenshot}
        />
      )}
    </div>
  );
};

export default NoteComponent;
