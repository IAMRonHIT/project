import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNote, Highlight } from '../contexts/NoteContext';

interface TextHighlighterProps {
  containerRef?: React.RefObject<HTMLElement>;
  enabled: boolean;
  onHighlight?: (highlight: Highlight) => void;
}

const TextHighlighter: React.FC<TextHighlighterProps> = ({
  containerRef,
  enabled,
  onHighlight
}) => {
  const { dispatch } = useNote();
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Handle text selection, including embedded content where possible
  useEffect(() => {
    if (!enabled) return;

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        setIsSelecting(false);
        setSelectionPosition(null);
        return;
      }

      // Get selection position for the popover
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Process the selection regardless of where it is in the document

      setIsSelecting(true);
      setSelectionPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    };

    // Main document selection
    document.addEventListener('selectionchange', handleSelectionChange);

    // Try to handle iframes when possible
    const frames = document.querySelectorAll('iframe');
    frames.forEach(frame => {
      try {
        // This will only work for same-origin iframes
        const frameDoc = frame.contentDocument || frame.contentWindow?.document;
        if (frameDoc) {
          frameDoc.addEventListener('selectionchange', () => {
            try {
              const frameSelection = frameDoc.getSelection();
              if (frameSelection && !frameSelection.isCollapsed && frameSelection.toString().trim()) {
                const frameRange = frameSelection.getRangeAt(0);
                const frameRect = frameRange.getBoundingClientRect();
                
                // Convert iframe-relative coordinates to page coordinates
                const framePosition = frame.getBoundingClientRect();
                const globalX = frameRect.left + frameRect.width / 2 + framePosition.left;
                const globalY = frameRect.top - 10 + framePosition.top;
                
                setIsSelecting(true);
                setSelectionPosition({ x: globalX, y: globalY });
              }
            } catch (err) {
              console.error('Error handling iframe selection:', err);
            }
          });
        }
      } catch (err) {
        // This will happen for cross-origin iframes - security restriction
        console.log('Could not access iframe content - likely cross-origin:', err);
      }
    });

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      
      // Cleanup iframe listeners when possible
      frames.forEach(frame => {
        try {
          const frameDoc = frame.contentDocument || frame.contentWindow?.document;
          if (frameDoc) {
            frameDoc.removeEventListener('selectionchange', handleSelectionChange);
          }
        } catch (err) {
          // Ignore errors for cross-origin frames
        }
      });
    };
  }, [enabled, containerRef]);

  // Handle click outside to dismiss popover
  useEffect(() => {
    if (!isSelecting) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsSelecting(false);
        setSelectionPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelecting]);

  // Capture the highlighted text from anywhere including iframes when possible
  const captureHighlight = () => {
    // Check for selections in the main document first
    const mainSelection = window.getSelection();
    let text = '';
    let source = '';
    let isIframeSelection = false;
    let iframeElement: HTMLIFrameElement | null = null;

    // First check if we have a main document selection
    if (mainSelection && !mainSelection.isCollapsed && mainSelection.toString().trim()) {
      text = mainSelection.toString().trim();
      
      try {
        // Get source info from main document
        const range = mainSelection.getRangeAt(0);
        const parentElement = range.commonAncestorContainer.parentElement;
        
        if (parentElement) {
          // Check for data attributes that might contain source info
          source = parentElement.dataset.source || '';
          
          // If no data attribute, try to get from closest article, section, or div with id/class
          if (!source) {
            const container = parentElement.closest('article, section, [id], [class]');
            if (container) {
              source = container.id || 
                      Array.from(container.classList).join(' ') || 
                      container.tagName.toLowerCase();
            }
          }
        }
      } catch (error) {
        console.error('Error getting source from main document:', error);
      }
    } else {
      // Check for selections in iframes
      const frames = document.querySelectorAll('iframe');
      for (let i = 0; i < frames.length; i++) {
        try {
          const frame = frames[i];
          const frameDoc = frame.contentDocument || frame.contentWindow?.document;
          
          if (frameDoc) {
            const frameSelection = frameDoc.getSelection();
            
            if (frameSelection && !frameSelection.isCollapsed && frameSelection.toString().trim()) {
              text = frameSelection.toString().trim();
              isIframeSelection = true;
              iframeElement = frame;
              
              // Try to get source information from the iframe
              try {
                const frameRange = frameSelection.getRangeAt(0);
                const frameParent = frameRange.commonAncestorContainer.parentElement;
                
                if (frameParent) {
                  // Try to get source from data attributes first
                  source = frameParent.dataset.source || '';
                  
                  if (!source) {
                    // Try to get from closest container elements
                    const frameContainer = frameParent.closest('article, section, [id], [class]');
                    if (frameContainer) {
                      source = frameContainer.id || 
                              Array.from(frameContainer.classList).join(' ') || 
                              frameContainer.tagName.toLowerCase();
                    }
                  }
                }
                
                // If we still don't have a good source, use the iframe's attributes
                if (!source) {
                  source = frame.title || frame.name || frame.id || 'Embedded Content';
                }
                
                // Add iframe URL if available (for embedded web content)
                const frameSrc = frame.src;
                if (frameSrc && !source.includes(frameSrc)) {
                  source = source ? `${source} (${frameSrc})` : frameSrc;
                }
                
              } catch (error) {
                console.error('Error getting source from iframe:', error);
                source = 'Embedded Content';
              }
              
              break; // We found our iframe selection, no need to check others
            }
          }
        } catch (err) {
          // This will happen for cross-origin iframes - security restriction
        }
      }
    }
    
    // If no text was found in main document or iframes, exit
    if (!text) return;

    const highlight: Highlight = {
      id: uuidv4(),
      text,
      source: source || 'Application',
      timestamp: new Date()
    };

    // Add to context
    dispatch({ type: 'ADD_HIGHLIGHT', highlight });
    
    // Call the callback if provided
    if (onHighlight) {
      onHighlight(highlight);
    }

    // Clear selection based on where it was made
    if (isIframeSelection && iframeElement) {
      try {
        const frameDoc = iframeElement.contentDocument || iframeElement.contentWindow?.document;
        if (frameDoc && frameDoc.getSelection()) {
          frameDoc.getSelection()?.removeAllRanges();
        }
      } catch (err) {
        // Handle cross-origin restrictions gracefully
        console.log('Could not clear iframe selection - likely cross-origin');
      }
    } else if (mainSelection) {
      mainSelection.removeAllRanges();
    }
    
    setIsSelecting(false);
    setSelectionPosition(null);
  };

  // Import external highlighted text
  const importHighlight = (text: string, source: string = 'External') => {
    if (!text.trim()) return;
    
    const highlight: Highlight = {
      id: uuidv4(),
      text: text.trim(),
      source,
      timestamp: new Date()
    };

    dispatch({ type: 'ADD_HIGHLIGHT', highlight });
    
    if (onHighlight) {
      onHighlight(highlight);
    }
  };

  if (!enabled || !isSelecting || !selectionPosition) {
    return null;
  }

  return (
    <div 
      ref={popoverRef}
      className="selection-popover z-50 bg-white shadow-lg rounded-lg p-2 transform -translate-x-1/2 -translate-y-full"
      style={{
        '--popover-x': `${selectionPosition.x}px`,
        '--popover-y': `${selectionPosition.y}px`
      } as React.CSSProperties}
    >
      <button
        onClick={captureHighlight}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        Add to Note
      </button>
    </div>
  );
};

// Export a function to import external highlights
export const importExternalHighlight = (
  text: string, 
  source: string = 'External',
  dispatch: React.Dispatch<any>
) => {
  if (!text.trim()) return;
  
  const highlight: Highlight = {
    id: uuidv4(),
    text: text.trim(),
    source,
    timestamp: new Date()
  };

  dispatch({ type: 'ADD_HIGHLIGHT', highlight });
  return highlight;
};

export default TextHighlighter;
