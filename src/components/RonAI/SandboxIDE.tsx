// Refresh parser
import React, { useState, useRef, useEffect, CSSProperties } from 'react';
import { X, Loader2, Send, Play, Download, Monitor, Eye, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import Editor from "@monaco-editor/react";
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { useGeminiStream } from '../../hooks/useGeminiStream';
import { useTheme } from '../../hooks/useTheme';
import { ModeType as DropdownModeType } from './ModeDropdown';

const consoleInterceptorScript = `
  <script type=\"text/javascript\">
  (function() {
    const originalConsole = {};
    const methods = ['log', 'warn', 'error', 'info', 'debug'];
    const terminalLog = (method, args) => {
      try {
        const serializedArgs = args.map(arg => {
          if (arg instanceof Error) return arg.stack || arg.message;
          if (typeof arg === 'object' && arg !== null) {
            try {
              return JSON.parse(JSON.stringify(arg, (key, value) => typeof value === 'function' ? '[Function]' : value));
            } catch (e) { return '[Unserializable Object]'; }
          }
          return arg;
        });
        window.parent.postMessage({ type: 'console', method: method, args: serializedArgs }, '*');
      } catch (e) {
        window.parent.postMessage({ type: 'console', method: 'error', args: ['Error serializing console arguments for postMessage.'] }, '*');
      }
    };

    methods.forEach(method => {
      originalConsole[method] = window.console[method];
      window.console[method] = (...args) => {
        terminalLog(method, args);
        originalConsole[method](...args);
      };
    });

    window.addEventListener('error', function(event) {
      terminalLog('error', [
        'Unhandled Exception: ' + event.message,
        'File: ' + (event.filename || 'N/A'),
        'Line: ' + (event.lineno || 'N/A') + ' Col: ' + (event.colno || 'N/A')
      ]);
    });

    window.addEventListener('unhandledrejection', function(event) {
      let reason = event.reason;
      if (reason instanceof Error) {
        reason = reason.stack || reason.message;
      }
      terminalLog('error', ['Unhandled Promise Rejection: ' + String(reason)]);
    });
  })();
  </script>
`;

// UI Constants & Panel Styling (similar to CareForm)
const panelClasses = (isVisible: boolean) => clsx(
  'fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-gray-900/90 shadow-xl backdrop-blur-md',
  'transition-transform duration-300 ease-in-out transform flex flex-col h-full',
  'border-l border-indigo-700/40',
  isVisible ? 'translate-x-0' : 'translate-x-full'
);
const headerBase = 'flex items-center justify-between px-4 py-2 border-b border-indigo-700/30 bg-gray-800/40 sticky top-0 z-10'; // Adjusted background, sticky
const editorBase = 'relative bg-gray-900/80 rounded-lg mb-2 border border-indigo-700/30 shadow-[0_2px_16px_rgba(79,70,229,0.10)] h-[40vh]'; // Kept for now, may need flex grow
const terminalBase = 'bg-gray-900/95 rounded-lg border border-indigo-700/30 shadow-[0_2px_16px_rgba(79,70,229,0.10)] h-[25vh] p-1 overflow-hidden flex-grow'; // Kept, may need flex grow
const promptBarBase = 'flex items-center gap-2 px-4 py-3 border-t border-indigo-700/30 bg-gray-800/40'; // Adjusted background
const buttonPrimary = 'px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition-colors shadow-sm flex items-center gap-1.5';
const buttonSecondary = 'px-3 py-1.5 bg-gray-700 hover:bg-gray-800 text-white rounded text-sm font-medium transition-colors shadow-sm flex items-center gap-1.5';
const mainContentAreaBase = 'flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800/50';

interface SandboxIDEProps {
  isOpen: boolean; // Retained for compatibility if ModeDropdown sends it
  onClose: () => void; // Retained for compatibility
  isVisible: boolean;
  onVisibilityChange: (isVisible: boolean) => void;
  currentMode: DropdownModeType;
}

const SandboxIDEPanelContent: React.FC<SandboxIDEProps> = ({
  isOpen,
  onClose, // Main close logic is now via onVisibilityChange
  isVisible,
  onVisibilityChange,
  currentMode,
}) => {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello from Ron AI!");');
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportName, setExportName] = useState<string>('');
  const [exportStep, setExportStep] = useState<'idle' | 'naming' | 'location'>('idle');
  const [showBrowserPreview, setShowBrowserPreview] = useState(false);
  const [browserScreenshot, setBrowserScreenshot] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [previewContent, setPreviewContent] = useState<string>(''); // For iframe content
  const [isPreviewMaximized, setIsPreviewMaximized] = useState<boolean>(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('javascript');
  const [isMinimized, setIsMinimized] = useState(false);
  const [previewSrcDoc, setPreviewSrcDoc] = useState<string>('');

  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef(new FitAddon());
  const editorRef = useRef<any>(null);

  const { startStream, stopStream, isStreaming: isGenerating, error: streamError } = useGeminiStream(currentMode);

  useEffect(() => {
    if (terminalRef.current && !terminalInstance.current && !isMinimized) {
      const term = new Terminal({
        cursorBlink: true,
        theme: isDarkMode ? {
          background: '#1a1a1aDD',
          foreground: '#f0f0f0',
          selectionBackground: '#555555',
          cursor: '#f0f0f0'
        } : {
          background: '#f0f0f0DD',
          foreground: '#1a1a1a',
          selectionBackground: '#bbbbbb',
          cursor: '#1a1a1a'
        },
        fontSize: 13,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        rows: 15,
        allowProposedApi: true,
      });
      term.loadAddon(fitAddon.current);
      term.open(terminalRef.current);
      fitAddon.current.fit();
      terminalInstance.current = term;
      term.writeln('Ron AI Sandbox Terminal');
      term.writeln('Type commands or run code from the editor.');
      term.writeln('');
    }
  }, [isDarkMode, isMinimized, isOpen, isVisible]); // Added isOpen and isVisible to re-init if panel reappears

  useEffect(() => {
    const handleResize = () => {
      if (terminalInstance.current && fitAddon.current) {
        fitAddon.current.fit();
      }
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
      // Global toggle for SandboxIDE visibility
      if ((event.metaKey || event.ctrlKey) && event.key === '/') {
        event.preventDefault();
        onVisibilityChange(!isVisible);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, isVisible, onVisibilityChange]);

  useEffect(() => {
    if (streamError) {
      setError(streamError.message || 'Error during code generation.');
      terminalInstance.current?.writeln(`\n${'\x1b[31m'}Stream Error: ${streamError.message}${'\x1b[0m'}`);
    }
  }, [streamError]);

  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      // For srcDoc, event.origin can be 'null'. Consider if more specific origin checks are needed if you load external content.
      if (event.data && event.data.type === 'console' && terminalInstance.current) {
        const { method, args } = event.data;
        let color = '\x1b[37m'; // Default to white for console.log (which we remapped to green below)
        let prefix = '';

        switch (method) {
          case 'error': color = '\x1b[31m'; prefix = 'Error:'; break; // Red
          case 'warn': color = '\x1b[33m'; prefix = 'Warning:'; break; // Yellow
          case 'info': color = '\x1b[36m'; prefix = 'Info:'; break; // Cyan
          case 'debug': color = '\x1b[35m'; prefix = 'Debug:'; break; // Magenta
          case 'log': color = '\x1b[32m'; break; // Green for standard log
          default: color = '\x1b[37m'; // Default color
        }
        
        const message = args.map((arg: any) => {
          if (typeof arg === 'object' && arg !== null) {
            return JSON.stringify(arg, null, 2);
          }
          return String(arg);
        }).join(' ');

        terminalInstance.current.writeln(`${color}${prefix ? prefix + ' ' : ''}${message}${color.endsWith('m') ? '\x1b[0m' : ''}`);
      }
    };

    window.addEventListener('message', handleIframeMessage);
    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  const handlePromptSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    const currentFullPrompt = `Context:\n${code}\n\nUser prompt: ${prompt}`;
    setPromptHistory(prev => [...prev, prompt]);
    terminalInstance.current?.writeln(`\n${'\x1b[33m'}User: ${prompt}${'\x1b[0m'}`);
    setError(null);

    let accumulatedCode = '';
    let inCodeBlock = false;
    let currentLanguage = '';

    try {
      await startStream(currentFullPrompt, {
        onToken: (chunk) => {
          if (chunk.includes('```')) {
            const parts = chunk.split('```');
            if (inCodeBlock) {
              accumulatedCode += parts[0];
              setCode(accumulatedCode);
              inCodeBlock = false;
              if (parts[1]) terminalInstance.current?.write(parts[1]);
            } else {
              if (parts[0]) terminalInstance.current?.write(parts[0]);
              const langMatch = parts[1].match(/^(\w+)\n/);
              if (langMatch) {
                currentLanguage = langMatch[1];
                setDetectedLanguage(currentLanguage);
                accumulatedCode = parts[1].substring(langMatch[0].length);
              } else {
                currentLanguage = 'plaintext';
                accumulatedCode = parts[1];
              }
              setCode(accumulatedCode);
              inCodeBlock = true;
            }
          } else if (inCodeBlock) {
            accumulatedCode += chunk;
            setCode(accumulatedCode);
          } else {
             terminalInstance.current?.write(chunk);
          }
        },
        onComplete: () => {
          terminalInstance.current?.writeln(`\n${'\x1b[32m'}Ron AI: Code generation complete.${'\x1b[0m'}`);
          setPrompt('');
        },
        onError: (err) => {
          setError(err.message || 'Error during stream.');
          terminalInstance.current?.writeln(`\n${'\x1b[31m'}Error: ${err.message}${'\x1b[0m'}`);
        },
        onToolCall: async (toolCall) => {
          terminalInstance.current?.writeln(`\n${'\x1b[35m'}Tool call: ${toolCall.function.name}${'\x1b[0m'}`);
          // You might want to pass the actual toolDefinitions from useGeminiStream here if they are needed
          // For now, this example simulates execution. 
          // const geminiTools = toolDefinitions; // Get from useGeminiStream if needed
          return { result: 'Tool executed (simulated)' };
        },
        // tools: toolDefinitions // Pass the tool definitions if you intend to use them
      });
    } catch (err: any) {
      setError(err.message || 'Failed to start generation stream.');
      terminalInstance.current?.writeln(`\n${'\x1b[31m'}Error: ${err.message}${'\x1b[0m'}`);
    }
  };

  const handleSendErrorToCoder = () => {
    if (!error) return;
    const errorContext = `Error: ${error}\n\nCode:\n${code}\n\nPrompt History:\n${promptHistory.join('\n')}`;
    setPrompt(`Fix this error: ${errorContext}`);
    terminalInstance.current?.writeln(`\n${'\x1b[33m'}System: Preparing to send error to Ron AI Coder...${'\x1b[0m'}`);
    setError(null);
  };

  const handleExecuteCode = async () => {
    setIsExecuting(true);
    setError(null);
    terminalInstance.current?.writeln(`\n${'\x1b[36m'}Executing code...${'\x1b[0m'}`);
    
    if (detectedLanguage === 'html') {
      // For HTML, "Run Code" will trigger the browser preview with console interception.
      await runBrowserPreview(); // This already sets isExecuting states internally if needed, or we can adjust it.
    } else if (detectedLanguage === 'javascript' || detectedLanguage === 'typescript') {
      try {
        const oldLog = console.log;
        const oldError = console.error;
        const logs: any[] = [];
        console.log = (...args) => {
          logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
          oldLog.apply(console, args);
        };
        console.error = (...args) => {
          logs.push(`${'\x1b[31m'}${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')}${'\x1b[0m'}`);
          oldError.apply(console, args);
        };

        let execCode = code;
        if (detectedLanguage === 'typescript') {
          terminalInstance.current?.writeln(`${'\x1b[33m'}Warning: Basic TypeScript execution via direct eval. Complex features may not work.${'\x1b[0m'}`);
          execCode = code.replace(/:\s*\w+(\s*[\[\]\{\}\<\>])*/g, ''); 
        }
        eval(execCode);
        
        console.log = oldLog;
        console.error = oldError;

        logs.forEach(logMsg => terminalInstance.current?.writeln(logMsg));
        terminalInstance.current?.writeln(`\n${'\x1b[32m'}Execution finished.${'\x1b[0m'}`);
      } catch (e: any) {
        setError(e.message);
        terminalInstance.current?.writeln(`\n${'\x1b[31m'}Error: ${e.message}${'\x1b[0m'}`);
      }
    } else if (detectedLanguage === 'python') {
      terminalInstance.current?.writeln(`\n${'\u001b[36m'}Sending Python code to backend for execution...${'\u001b[0m'}`);
      try {
        // @ts-ignore - Vite injects .env properties into import.meta.env at build time
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/execute-python`, { // Ensure this endpoint matches your backend
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          // Try to parse error from backend if available, otherwise use status text
          let backendError = `Backend error: ${response.status} ${response.statusText}`;
          try {
            const errData = await response.json();
            if (errData && errData.error) {
              backendError = `Backend error: ${errData.error}`;
            }
          } catch (parseError) {
            // Ignore if response is not JSON or empty
          }
          throw new Error(backendError);
        }

        const result = await response.json();

        if (result.stdout && typeof result.stdout === 'string' && result.stdout.trim() !== '') {
          terminalInstance.current?.writeln(`[stdout]:\n${result.stdout.trimEnd()}`);
        }
        if (result.stderr && typeof result.stderr === 'string' && result.stderr.trim() !== '') {
          terminalInstance.current?.writeln(`\u001b[31m[stderr]:\n${result.stderr.trimEnd()}\u001b[0m`);
        }
        if (result.error && typeof result.error === 'string' && result.error.trim() !== '') { // This 'error' field is for backend's exec() try/catch
          terminalInstance.current?.writeln(`\u001b[31m[Python Execution Error]:\n${result.error.trimEnd()}\u001b[0m`);
        }
        // Check for HTML preview content from Python execution
        if (result.html_preview && typeof result.html_preview === 'string') {
          setPreviewContent(result.html_preview);
        }
        if (result.execution_error) { // Specific error from the Python script itself, if backend distinguishes it
            terminalInstance.current?.writeln(`\n${'\u001b[31m'}Python script error: ${result.execution_error}${ '\u001b[0m'}`);
            setError(result.execution_error);
        }
        terminalInstance.current?.writeln(`\n${'\u001b[32m'}Python execution finished.${'\u001b[0m'}`);
      } catch (e: any) {
        setError(e.message || 'Failed to execute Python code via backend.');
        terminalInstance.current?.writeln(`\n${'\u001b[31m'}Error: ${e.message}${ '\u001b[0m'}`);
      }
    } else {
      terminalInstance.current?.writeln(`\n${'\x1b[33m'}Execution for ${detectedLanguage} is not supported in this basic sandbox.${'\x1b[0m'}`);
    }
    setIsExecuting(false);
  };

  const runBrowserPreview = async () => {
    setPreviewLoading(true);
    setShowBrowserPreview(true);
    setBrowserScreenshot(null);
    terminalInstance.current?.writeln(`\n${'\x1b[36m'}Generating browser preview...${'\x1b[0m'}`);
    try {
      // await new Promise(resolve => setTimeout(resolve, 1500)); // Keep if artificial delay is desired
      if (detectedLanguage === 'html') {
        setPreviewSrcDoc(consoleInterceptorScript + code);
        terminalInstance.current?.writeln(`\n${'\x1b[32m'}HTML preview updated. Console messages will be redirected here.${'\x1b[0m'}`);
      } else {
        setBrowserScreenshot(`data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><text x="20" y="150" style="font-family:sans-serif;font-size:16px;fill:${isDarkMode ? 'white' : 'black'};">Preview is best for HTML. Current: ${detectedLanguage} (simulated)</text></svg>`);
        terminalInstance.current?.writeln(`\n${'\x1b[33m'}Browser preview is best for HTML. Current language: ${detectedLanguage}.${'\x1b[0m'}`);
      }
    } catch (e: any) {
      setError(e.message);
      terminalInstance.current?.writeln(`\n${'\x1b[31m'}Preview Error: ${e.message}${'\x1b[0m'}`);
    }
    setPreviewLoading(false);
  };

  const handleClearTerminal = () => {
    terminalInstance.current?.clear();
    terminalInstance.current?.writeln('Terminal cleared.');
    setError(null);
  };

  const handleExport = () => {
    setExportStep('naming');
  };

  const handleCancelExport = () => {
    setExportStep('idle');
    setExportName('');
  };

  const handleFinishExport = () => {
    if (!exportName.trim()) {
      alert('Please enter a file name.');
      return;
    }

    let fileName = exportName.trim();
    const languageExtensionMap: { [key: string]: string } = {
      javascript: '.jsx',
      typescript: '.tsx',
      html: '.html',
      python: '.py',
      css: '.css',
      json: '.json',
      markdown: '.md',
      text: '.txt',
    };

    // Determine the extension based on detectedLanguage, default to .txt
    const defaultExtension = languageExtensionMap[detectedLanguage.toLowerCase()] || languageExtensionMap['text'];

    // Smartly add extension: if user typed one, respect it. Otherwise, add default.
    // Check if the last part after a dot looks like a common extension already.
    const parts = fileName.split('.');
    if (parts.length > 1) {
        const userExtension = parts.pop()?.toLowerCase() || '';
        const knownExtensions = Object.values(languageExtensionMap).map(ext => ext.substring(1));
        if (!knownExtensions.includes(userExtension)) {
            // User typed something that doesn't look like one of our known extensions, append default.
            fileName += defaultExtension;
        } else {
            // User typed a known-like extension, put it back and use it.
            fileName = parts.join('.') + '.' + userExtension;
        }
    } else {
        // No extension provided by user, append default.
        fileName += defaultExtension;
    }

    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the object URL

    if (terminalInstance.current) {
      terminalInstance.current.writeln(`\n${'\x1b[32m'}Code exported as ${fileName}.${'\x1b[0m'}`);
    }
    setExportStep('idle');
    setExportName(''); // Clear the export name after successful export
  };


  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMinimized) { 
      setTimeout(() => {
        if (terminalInstance.current && fitAddon.current) fitAddon.current.fit();
        if (editorRef.current) editorRef.current.layout();
      }, 50); // Small delay to allow DOM changes
    }
  };
  
  const handleEditorDidMount = (editorInstance: any) => {
    editorRef.current = editorInstance;
  };

  const panelStyle: CSSProperties = {
    transition: isMinimized ? 'height 0.3s ease-in-out' : 'none', // Smooth minimize transition
    pointerEvents: isMinimized ? 'none' : 'auto',
    height: isMinimized ? 'auto' : '75vh',
    minHeight: isMinimized ? 'auto' : '400px',
    maxHeight: '90vh',
    display: (isOpen || isVisible) ? 'flex' : 'none',
    flexDirection: 'column',
    opacity: 1,
    position: 'fixed',
    left: '0px',
    top: '0px',
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div 
      className={clsx(panelClasses(isVisible), isMinimized && 'h-auto max-h-[60px] w-[350px] overflow-hidden')}
      onClick={(e) => e.stopPropagation()} 
    >
      <div className={clsx(headerBase, isMinimized && 'cursor-default')}>
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-indigo-100">Sandbox IDE</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleMinimize} className="p-1 text-indigo-300 hover:text-indigo-100" aria-label={isMinimized ? 'Maximize IDE' : 'Minimize IDE'}>
            {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <button onClick={() => onVisibilityChange(false)} className="p-1 text-indigo-300 hover:text-indigo-100" aria-label="Close IDE">
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && 
      <div className={clsx(mainContentAreaBase, isPreviewMaximized ? 'flex flex-col' : '')}> 
          {/* Editor Section */}
          <div className={clsx(editorBase, isPreviewMaximized ? 'hidden' : 'h-[40vh]')}>
              <Editor
                height="100%"
                language={detectedLanguage}
                theme={isDarkMode ? "vs-dark" : "light"}
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                options={{
                  readOnly: isGenerating || isExecuting || showBrowserPreview,
                  minimap: { enabled: false }, 
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true
                }}
              />
          </div>

          {/* Action Buttons Section */}
          <div className={clsx("flex items-center gap-2 mb-2 flex-wrap", isPreviewMaximized ? 'hidden' : '')}>
            <button onClick={handleExecuteCode} className={buttonPrimary} disabled={isExecuting || isGenerating}>
              {isExecuting ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />} Run Code
            </button>
            <button onClick={runBrowserPreview} className={buttonSecondary} disabled={isExecuting || isGenerating || previewLoading}>
              <Monitor size={16} /> Preview
            </button>
            <button onClick={handleClearTerminal} className={buttonSecondary}><X size={16}/> Clear Term</button>
            <button onClick={handleExport} className={buttonSecondary}><Download size={16}/> Export</button>
            {error && (
              <button onClick={handleSendErrorToCoder} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors shadow-sm flex items-center gap-1.5">
                <AlertCircle size={16}/> Get Help
              </button>
            )}
            <div className="flex-grow" /> 
            <button 
              onClick={() => setShowBrowserPreview(!showBrowserPreview)} 
              className={clsx(buttonSecondary, showBrowserPreview && 'bg-indigo-700')}
            >
              {showBrowserPreview ? 'Show Terminal' : 'Show Preview'}
            </button>
          </div>

          {/* Terminal & Preview Container - This div will take up remaining space or full height if preview maximized */}
          <div className={clsx("flex-grow flex flex-col", isPreviewMaximized && showBrowserPreview ? 'h-full' : terminalBase, isPreviewMaximized && !showBrowserPreview ? 'hidden' : '')}>
            {showBrowserPreview ? (
              // Browser Preview Section (inside the toggleable container)
              <div className={clsx(
                "bg-gray-800 p-2 rounded-lg border border-indigo-700/30 shadow-md flex flex-col",
                isPreviewMaximized ? 'flex-grow h-full' : 'h-auto' // Takes full height of its container when maximized
              )}>
                <div className="flex justify-between items-center mb-1 flex-shrink-0">
                  <span className="text-xs font-medium text-gray-400">Preview Panel</span>
                  <button 
                    onClick={() => setIsPreviewMaximized(!isPreviewMaximized)}
                    className={buttonSecondary} 
                    title={isPreviewMaximized ? 'Minimize Preview' : 'Maximize Preview'}
                  >
                    {isPreviewMaximized ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                  </button>
                </div>
                {previewLoading ? (
                  <div className={clsx("flex justify-center items-center flex-grow", isPreviewMaximized ? '' : 'h-48')}>
                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                  </div>
                ) : browserScreenshot ? (
                  <img src={browserScreenshot} alt="Preview Screenshot" className={clsx("w-full rounded", isPreviewMaximized ? 'object-contain flex-grow h-full' : 'h-auto')} />
                ) : (
                  <iframe
                    title="Live Preview"
                    srcDoc={previewContent} // Using previewContent for Python HTML output
                    className={clsx("w-full border-0 rounded bg-white flex-grow", isPreviewMaximized ? 'h-full' : 'h-64')} 
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
                  />
                )}
              </div>
            ) : (
              // Terminal Section (inside the toggleable container)
              <div className={clsx(terminalBase, "flex-grow flex flex-col")}>
                <div ref={terminalRef} className="h-full w-full flex-grow" />
              </div>
            )}
          </div>
          
          {error && !showBrowserPreview && (
            <div className="mt-2 p-2 bg-red-900/40 border border-red-700 text-red-200 rounded text-xs">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {exportStep === 'naming' && (
            <div className="absolute inset-0 backdrop-blur-sm bg-gray-900/70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-indigo-700/40 w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-4">Export Component</h3>
                <p className="text-gray-300 mb-4">Please enter a name for your component:</p>
                <input
                  type="text"
                  value={exportName}
                  onChange={(e) => setExportName(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-indigo-600 rounded p-2 mb-4 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="ComponentName"
                />
                <div className="flex justify-end gap-3">
                  <button type="button" className={buttonSecondary} onClick={handleCancelExport}>Cancel</button>
                  <button type="button" className={buttonPrimary} onClick={handleFinishExport}>Export</button>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handlePromptSubmit} className="mt-2">
            <div className={promptBarBase}>
              <input
                className="flex-1 bg-transparent outline-none text-indigo-100 placeholder:text-indigo-400/50 px-2 py-1"
                type="text"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Ask Ron AI to modify code or explain..."
                disabled={isGenerating || isExecuting}
                aria-label="Prompt"
              />
              <button
                type="submit"
                className={clsx(
                  'rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500',
                  (isGenerating || isExecuting) ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow'
                )}
                disabled={isGenerating || isExecuting}
                aria-label="Send prompt"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              </button>
            </div>
          </form>
        </div>
      } 
    </div>
  )
};

// This closes the mainContentAreaBase's inner flex-col div

// Simplified SandboxIDE component, no DndProvider
const SandboxIDE: React.FC<SandboxIDEProps> = (props) => (
  <SandboxIDEPanelContent {...props} />
);

export default SandboxIDE;
