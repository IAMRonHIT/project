import React, { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, Maximize2, Minimize2, Smartphone, Tablet, Monitor } from 'lucide-react';

interface CarePlanPreviewProps {
  code: string;
  onClose: () => void;
  isVisible: boolean;
}

type DeviceSize = 'mobile' | 'tablet' | 'desktop';

const deviceSizes = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 }
};

const CarePlanPreview: React.FC<CarePlanPreviewProps> = ({ code, onClose, isVisible }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renderedHtml, setRenderedHtml] = useState<string>('');
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let styleElement = document.getElementById('device-size-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'device-size-styles';
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      .device-mobile {
        width: ${deviceSizes.mobile.width}px;
        height: ${deviceSizes.mobile.height}px;
        max-width: 100%;
        max-height: 100%;
      }
      .device-tablet {
        width: ${deviceSizes.tablet.width}px;
        height: ${deviceSizes.tablet.height}px;
        max-width: 100%;
        max-height: 100%;
      }
      .device-desktop {
        width: ${deviceSizes.desktop.width}px;
        height: ${deviceSizes.desktop.height}px;
        max-width: 100%;
        max-height: 100%;
      }
    `;
  }, []);

  useEffect(() => {
    if (!isVisible || !code) return;
    
    const renderCode = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/sandbox', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            options: {
              width: deviceSizes[deviceSize].width,
              height: deviceSizes[deviceSize].height,
              includeReact: true,
              includeTailwind: true
            }
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to render code');
        }
        
        const data = await response.json();
        setRenderedHtml(data.html);
        setLogs(data.logs || []);
      } catch (err) {
        console.error('Error rendering code:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    renderCode();
  }, [code, deviceSize, isVisible]);

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = getIframeContent(renderedHtml);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getIframeContent = (html: string) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Care Plan Preview</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;
  };

  if (!isVisible) return null;

  return (
    <div className={`flex flex-col h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900' : ''}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-lg font-light">Care Plan Preview</h3>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setDeviceSize('mobile')}
            className={`p-1.5 rounded-md transition-colors ${
              deviceSize === 'mobile' 
                ? 'bg-teal-500 bg-opacity-20 text-teal-400' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            title="Mobile view"
          >
            <Smartphone size={16} />
          </button>
          
          <button
            onClick={() => setDeviceSize('tablet')}
            className={`p-1.5 rounded-md transition-colors ${
              deviceSize === 'tablet' 
                ? 'bg-teal-500 bg-opacity-20 text-teal-400' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            title="Tablet view"
          >
            <Tablet size={16} />
          </button>
          
          <button
            onClick={() => setDeviceSize('desktop')}
            className={`p-1.5 rounded-md transition-colors ${
              deviceSize === 'desktop' 
                ? 'bg-teal-500 bg-opacity-20 text-teal-400' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            title="Desktop view"
          >
            <Monitor size={16} />
          </button>
          
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            title="Refresh preview"
          >
            <RefreshCw size={16} />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            title="Close preview"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden flex items-center justify-center bg-gray-800 p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400 mb-4"></div>
            <p>Rendering care plan...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded-md p-4 max-w-md">
            <h4 className="text-red-400 font-medium mb-2">Error rendering care plan</h4>
            <p className="text-red-300">{error}</p>
          </div>
        ) : (
          <div 
            className={`relative bg-white rounded-md shadow-lg overflow-hidden transition-all duration-300 ${
              isFullscreen ? 'w-full h-full max-w-none max-h-none' : `device-${deviceSize}`
            }`}
          >
            <iframe
              ref={iframeRef}
              srcDoc={getIframeContent(renderedHtml)}
              title="Care Plan Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts"
            />
          </div>
        )}
      </div>
      
      {logs.length > 0 && (
        <div className="border-t border-gray-700 p-2 bg-gray-900 max-h-32 overflow-y-auto">
          <h4 className="text-xs text-gray-400 font-medium mb-1">Console Logs</h4>
          <div className="text-xs font-mono">
            {logs.map((log, index) => (
              <div 
                key={index} 
                className={`py-0.5 px-1 ${
                  log.includes('[error]') 
                    ? 'text-red-400' 
                    : log.includes('[warn]') 
                      ? 'text-yellow-400' 
                      : 'text-gray-300'
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarePlanPreview;
