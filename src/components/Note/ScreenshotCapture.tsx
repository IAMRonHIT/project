import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNote, Screenshot } from '../contexts/NoteContext';
import html2canvas from 'html2canvas';

interface ScreenshotCaptureProps {
  containerRef?: React.RefObject<HTMLElement>;
  enabled: boolean;
  onScreenshot?: (screenshot: Screenshot) => void;
}

const ScreenshotCapture: React.FC<ScreenshotCaptureProps> = ({
  containerRef,
  enabled,
  onScreenshot
}) => {
  const { dispatch } = useNote();
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureArea, setCaptureArea] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Capture screenshot of the specified area
  const captureScreenshot = async () => {
    if (!captureArea) return;
    
    try {
      setIsCapturing(true);
      
      // Use html2canvas to capture the screenshot
      const canvas = await html2canvas(document.body, {
        x: captureArea.x,
        y: captureArea.y,
        width: captureArea.width,
        height: captureArea.height,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      
      const screenshot: Screenshot = {
        id: uuidv4(),
        data: dataUrl,
        timestamp: new Date()
      };
      
      // Add to context
      dispatch({ type: 'ADD_SCREENSHOT', screenshot });
      
      // Call the callback if provided
      if (onScreenshot) {
        onScreenshot(screenshot);
      }
      
      // Reset state
      setCaptureArea(null);
      setIsDragging(false);
      setStartPoint(null);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    } finally {
      setIsCapturing(false);
    }
  };
  
  // Handle mouse events for area selection
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!enabled || isCapturing) return;
    
    setIsDragging(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!enabled || !isDragging || !startPoint || isCapturing) return;
    
    const x = Math.min(startPoint.x, e.clientX);
    const y = Math.min(startPoint.y, e.clientY);
    const width = Math.abs(e.clientX - startPoint.x);
    const height = Math.abs(e.clientY - startPoint.y);
    
    setCaptureArea({ x, y, width, height });
  };
  
  const handleMouseUp = () => {
    if (!enabled || isCapturing) return;
    
    if (isDragging && captureArea && captureArea.width > 10 && captureArea.height > 10) {
      // If we have a valid selection area, capture the screenshot
      captureScreenshot();
    } else {
      // Reset if the selection was too small
      setCaptureArea(null);
      setIsDragging(false);
      setStartPoint(null);
    }
  };
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result !== 'string') return;
      
      const screenshot: Screenshot = {
        id: uuidv4(),
        data: event.target.result,
        timestamp: new Date()
      };
      
      // Add to context
      dispatch({ type: 'ADD_SCREENSHOT', screenshot });
      
      // Call the callback if provided
      if (onScreenshot) {
        onScreenshot(screenshot);
      }
    };
    
    reader.readAsDataURL(file);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Capture full page screenshot
  const captureFullPage = async () => {
    try {
      setIsCapturing(true);
      
      // Use html2canvas for full page capture
      const canvas = await html2canvas(document.body, {
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
        allowTaint: true,
        useCORS: true
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      
      const screenshot: Screenshot = {
        id: uuidv4(),
        data: dataUrl,
        timestamp: new Date()
      };
      
      // Add to context
      dispatch({ type: 'ADD_SCREENSHOT', screenshot });
      
      // Call the callback if provided
      if (onScreenshot) {
        onScreenshot(screenshot);
      }
    } catch (error) {
      console.error('Error capturing full page screenshot:', error);
    } finally {
      setIsCapturing(false);
    }
  };
  
  // Capture specific element screenshot
  const captureElement = async (element: HTMLElement) => {
    try {
      setIsCapturing(true);
      
      // Use html2canvas to capture the element
      const canvas = await html2canvas(element, {
        allowTaint: true,
        useCORS: true
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      
      const screenshot: Screenshot = {
        id: uuidv4(),
        data: dataUrl,
        timestamp: new Date()
      };
      
      // Add to context
      dispatch({ type: 'ADD_SCREENSHOT', screenshot });
      
      // Call the callback if provided
      if (onScreenshot) {
        onScreenshot(screenshot);
      }
    } catch (error) {
      console.error('Error capturing element screenshot:', error);
    } finally {
      setIsCapturing(false);
    }
  };
  
  if (!enabled) {
    return null;
  }
  
  return (
    <>
      {/* Hidden file input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        aria-label="Upload screenshot"
      />
      
      {/* Screenshot toolbar */}
      <div className="fixed bottom-4 right-4 z-50 bg-white shadow-lg rounded-lg p-2 flex items-center gap-2">
        <button
          onClick={captureFullPage}
          disabled={isCapturing}
          className="p-2 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
          title="Capture full page"
          aria-label="Capture full page screenshot"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </button>
        
        <button
          onClick={() => {
            setIsDragging(false);
            setStartPoint(null);
            setCaptureArea(null);
            // In a real implementation, we would enter selection mode
            alert('Click and drag to select an area to capture');
          }}
          disabled={isCapturing || isDragging}
          className="p-2 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
          title="Capture area"
          aria-label="Capture area screenshot"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h18v18H3z"></path>
            <path d="M9 3v18"></path>
            <path d="M15 3v18"></path>
            <path d="M3 9h18"></path>
            <path d="M3 15h18"></path>
          </svg>
        </button>
        
        <button
          onClick={triggerFileUpload}
          disabled={isCapturing}
          className="p-2 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
          title="Upload image"
          aria-label="Upload screenshot"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </button>
      </div>
      
      {/* Selection overlay */}
      {isDragging && captureArea && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            className="absolute border-2 border-indigo-500 bg-indigo-100 bg-opacity-20"
            style={{
              left: `${captureArea.x}px`,
              top: `${captureArea.y}px`,
              width: `${captureArea.width}px`,
              height: `${captureArea.height}px`,
            }}
          ></div>
        </div>
      )}
      
      {/* Loading indicator */}
      {isCapturing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <span>Capturing screenshot...</span>
          </div>
        </div>
      )}
    </>
  );
};

// Export a function to import external screenshots
export const importExternalScreenshot = (
  dataUrl: string,
  dispatch: React.Dispatch<any>,
  caption?: string
) => {
  if (!dataUrl) return;
  
  const screenshot: Screenshot = {
    id: uuidv4(),
    data: dataUrl,
    timestamp: new Date(),
    caption
  };

  dispatch({ type: 'ADD_SCREENSHOT', screenshot });
  return screenshot;
};

export default ScreenshotCapture;
