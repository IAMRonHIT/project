import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaPaperPlane, FaFileUpload, FaHistory } from 'react-icons/fa';
import { ronAIService, formatMessage, streamRun } from '../../services/ronAIService';
import { fileUploadService, type UploadProgress } from '../../services/fileUploadService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';
import FileViewer from './FileViewer';

interface ChatMessage {
  sender: 'You' | 'Ron AI';
  time: string;
  message: string;
  referencesContext?: boolean;
  analysis?: boolean;
}

interface StreamedMessage {
    content: string;
}

interface ThreadContext {
  threadId: string;
  files: string[];
  lastActivity: Date;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

const formatAIResponse = (text: string | undefined): string => {
  if (!text) return 'No response received';
  
  try {
    let formatted = text;

    // Preserve code block indentation
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const trimmedCode = code.split('\n').map(line => line.trimEnd()).join('\n');
      return `\n\`\`\`${lang || ''}\n${trimmedCode}\n\`\`\`\n`;
    });

    // Format inline code
    formatted = formatted.replace(/`([^`]+)`/g, (match, code) => {
      return `\`${code.trim()}\``;
    });

    // Format tables
    formatted = formatted.replace(/\|.*\|/g, match => `\n${match.trim()}\n`);

    // Add line breaks before bullet points
    formatted = formatted.replace(/•/g, '\n•');
    
    // Add line breaks before numbered lists
    formatted = formatted.replace(/(\d+\.\s)/g, '\n$1');
    
    // Add line breaks before sections with all caps (like "NOTE:", "IMPORTANT:")
    formatted = formatted.replace(/([A-Z]{2,}:)/g, '\n\n$1');
    
    // Format math equations
    formatted = formatted.replace(/\$\$(.*?)\$\$/g, (match, equation) => `\n$$${equation.trim()}$$\n`);
    formatted = formatted.replace(/\$(.*?)\$/g, (match, equation) => `$${equation.trim()}$`);
    
    // Remove extra line breaks but preserve code block formatting
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    return formatted.trim();
  } catch (error) {
    console.error('Error formatting AI response:', error);
    return text; // Return original text if formatting fails
  }
};

// Check if message references previous context
const checkForContextReference = (message: string): boolean => {
  const contextPhrases = [
    'as we discussed',
    'as mentioned',
    'earlier',
    'previously',
    'going back to',
    'you asked about',
    'referring to',
    'as I noted',
    'from the file',
    'in the document',
    'based on our conversation'
  ];
  
  return contextPhrases.some(phrase => 
    message.toLowerCase().includes(phrase.toLowerCase())
  );
};

const RonAIExperience: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [threadContext, setThreadContext] = useState<ThreadContext | null>(null);
  const [streamingResponse, setStreamingResponse] = useState(''); // Add state for accumulating streamed response
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize chat with Ron AI
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        console.log('Initializing chat with Ron AI...');
        // Send initial message to Ron AI
        const response = await ronAIService.sendMessage('Hi Ron! Let\'s get to work, if you\'re ready simply reply with "Ron AI wil see you now"');
        console.log('Received initialization response:', response);

        if (!response || !response.response) {
          throw new Error('Invalid initialization response from Ron AI');
        }

        // Set initial message and thread context
        const initialMessage = formatMessage('Ron AI', response.response);
        setMessages([initialMessage]);
        
        // Initialize thread context
        setThreadContext({
          threadId: response.threadId,
          files: [],
          lastActivity: new Date()
        });

        console.log('Chat initialized successfully:', {
          threadId: response.threadId,
          initialMessage: response.response
        });
      } catch (error) {
        console.error('Error initializing chat:', {
          error,
          details: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });

        // Show a more informative error message to the user
        const errorMessage = formatMessage(
          'Ron AI',
          `I apologize, but I encountered an error during initialization. ${
            error instanceof Error
              ? error.message.includes('API key')
                ? 'Please ensure the OpenAI API key is properly configured.'
                : error.message.includes('Assistant ID')
                ? 'Please ensure the OpenAI Assistant ID is properly configured.'
                : error.message
              : 'Please try again or contact support if the issue persists.'
          }`
        );
        setMessages([errorMessage]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, []);

  const handleSend = async (message?: string) => {
    const content = message || input;
    if (content.trim() === '' || isLoading) return;

    try {
      setIsLoading(true);
      console.log('Sending message to Ron AI:', content);

      // Add user message
      const userMessage = formatMessage('You', content);
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Get response from Ron AI
      const response = await ronAIService.sendMessage(content, threadContext?.threadId);
      console.log('Received response from Ron AI:', response);

      if (!response || !response.response) {
        throw new Error('Invalid response received from Ron AI');
      }

      // Add Ron's response
      const formattedResponse = formatAIResponse(response.response);
      if (formattedResponse) {
        const ronMessage = {
          ...formatMessage('Ron AI', formattedResponse),
          referencesContext: checkForContextReference(formattedResponse)
        };
        setMessages(prev => [...prev, ronMessage]);
      } else {
        throw new Error('Failed to format Ron AI response');
      }

      // Update thread context
      if (threadContext) {
        setThreadContext({
          ...threadContext,
          lastActivity: new Date()
        });
      }
    } catch (error) {
      console.error('Error communicating with Ron:', {
        error,
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        threadId: threadContext?.threadId,
        content
      });
      
      let errorText = 'I apologize, but I encountered an error processing your request.';
      
      if (error instanceof Error) {
        if (error.message.includes('Action required')) {
          errorText = 'I apologize, but I need additional capabilities to process this request. This feature is not yet supported.';
        } else if (error.message.includes('Invalid response')) {
          errorText = 'I apologize, but I received an invalid response. Please try your request again.';
        } else if (error.message.includes('Failed to format')) {
          errorText = 'I apologize, but I had trouble formatting the response. Please try again.';
        } else {
          errorText = `I apologize, but an error occurred: ${error.message}`;
        }
      }
      
      const errorMessage = formatMessage('Ron AI', errorText);
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      const userMessage = formatMessage('You', `Uploading file: ${file.name} (${formatFileSize(file.size)})`);
      setMessages(prev => [...prev, userMessage]);

      // Upload file with progress tracking
      const response = await ronAIService.uploadFile(file);

      if (!response || !response.threadId) {
        throw new Error('Invalid upload response received');
      }

      // Update thread context
      setThreadContext({
        threadId: response.threadId,
        files: [response.fileName || file.name],
        lastActivity: new Date()
      });

      // Add analysis message
      const analysisText = response.analysis || 'File uploaded successfully. You can now ask questions about the file.';
      const analysisMessage = {
        ...formatMessage('Ron AI', formatAIResponse(analysisText)),
        analysis: true
      };
      setMessages(prev => [...prev, analysisMessage]);

    } catch (error) {
      console.error('Error uploading file:', error);
      let errorMsg = 'I apologize, but I encountered an error uploading the file.';
      
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        
        if (error.message.includes('Action required')) {
          errorMsg = 'I apologize, but I need additional capabilities to process this file. This feature is not yet supported.';
        } else if (error.message.includes('Invalid upload response')) {
          errorMsg = 'I apologize, but I received an invalid response while processing your file. Please try again.';
        } else if (error.message.includes('size')) {
          errorMsg = `I apologize, but the file is too large. Maximum file size is ${formatFileSize(512 * 1024 * 1024)}.`;
        } else if (error.message.includes('type')) {
          errorMsg = 'I apologize, but this file type is not supported. Please upload one of the following file types: TXT, LOG, MD, PY, JS, JSX, TS, TSX, CSV, JSON, PDF, or IPYNB.';
        } else {
          errorMsg = error.message;
        }
      }
      
      const errorMessage = formatMessage('Ron AI', errorMsg);
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setUploadProgress(null);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const error = fileUploadService.validateFile(file);
      if (error) {
        const errorMessage = formatMessage('Ron AI', error);
        setMessages(prev => [...prev, errorMessage]);
        return;
      }
      await handleFileUpload(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const error = fileUploadService.validateFile(file);
      if (error) {
        const errorMessage = formatMessage('Ron AI', error);
        setMessages(prev => [...prev, errorMessage]);
        return;
      }
      handleFileUpload(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Calculate upload progress percentage
  const calculateUploadProgress = (): number => {
    if (!uploadProgress) return 0;
    return Math.round((uploadProgress.uploadedBytes / uploadProgress.totalBytes) * 100);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-dark-navy to-black text-white dark:text-white light:text-gray-900">
      {/* Thread Context and File Viewer */}
      {threadContext && (
        <div className="bg-dark-navy border-b border-gray-800">
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FaHistory className="text-ron-teal-400" />
              <span>Thread: {threadContext.threadId}</span>
              {threadContext.files.length > 0 && (
                <>
                  <span>•</span>
                  <span>Files: {threadContext.files.join(', ')}</span>
                </>
              )}
            </div>
          </div>
          {/* File Viewer Component */}
          <div className="p-4 border-t border-gray-800">
            <FileViewer />
          </div>
        </div>
      )}

      <div 
        className={`flex-1 p-6 overflow-y-auto relative ${dragActive ? 'bg-ron-teal-400/10' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-6 animate-fade-in ${
              msg.sender === 'You' ? 'text-right' : ''
            }`}
          >
            <div className="inline-block max-w-xl">
              <div
                className={`px-6 py-4 rounded-2xl ${
                  msg.sender === 'You'
                    ? 'bg-gradient-to-r from-neon-pink to-neon-purple shadow-neon-pink'
                    : msg.analysis
                    ? 'bg-gradient-to-r from-ron-teal-400 to-ron-teal-600 shadow-ron-teal'
                    : 'dark:bg-glass-white dark:backdrop-blur-xs dark:border-white dark:border-opacity-20 light:bg-white light:border-gray-200 border shadow-lg'
                }`}
              >
                {msg.referencesContext && (
                  <div className="flex items-center gap-2 mb-2 text-xs text-ron-teal-400">
                    <FaHistory />
                    <span>Referencing previous context</span>
                  </div>
                )}
                <div className="text-sm prose prose-invert max-w-none">
                  {msg.sender === 'You' ? (
                    <p>{msg.message}</p>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex, rehypeHighlight]}
                    >
                      {msg.message}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {msg.sender} • {msg.time}
              </div>
            </div>
          </div>
        ))}

        {/* File Upload Overlay */}
        {dragActive && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <FaFileUpload className="w-16 h-16 mx-auto text-ron-teal-400 animate-bounce" />
              <p className="mt-4 text-xl font-semibold">Drop your file here</p>
              <p className="mt-2 text-gray-400">
                Supported files: TXT, LOG, MD, PY, JS, JSX, TS, TSX, CSV, JSON, PDF, IPYNB
              </p>
              <p className="mt-1 text-gray-400">
                Max size: {formatFileSize(512 * 1024 * 1024)}
              </p>
            </div>
          </div>

        )}

        {/* File Upload Overlay - End */}

        {/* Upload Progress Overlay */}
        {uploadProgress && uploadProgress.status !== 'error' && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 relative">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-700"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-ron-teal-400"
                    strokeWidth="8"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * calculateUploadProgress()) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{calculateUploadProgress()}%</span>
                </div>
              </div>
              <p className="text-xl font-semibold">
                {uploadProgress.status === 'uploading' && 'Uploading file...'}
                {uploadProgress.status === 'complete' && 'Upload complete!'}
              </p>
              <p className="mt-2 text-gray-400">
                {formatFileSize(uploadProgress.uploadedBytes)} of {formatFileSize(uploadProgress.totalBytes)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <div className="sr-only">
        <label htmlFor="file-upload">Upload a file for analysis</label>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept=".txt,.log,.md,.py,.js,.jsx,.ts,.tsx,.csv,.json,.pdf,.ipynb"
          aria-label="Upload a file for analysis"
          title="Upload a file for analysis"
        />
      </div>

      {/* Input Field */}
      <div className="p-4 bg-dark-navy border-t border-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={triggerFileInput}
            disabled={isLoading || !!uploadProgress}
            className={`p-4 bg-gradient-to-r from-neon-blue to-neon-green rounded-full shadow-neon-blue hover:scale-105 transform transition focus:outline-none focus:ring-2 focus:ring-neon-blue ${
              isLoading || uploadProgress ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Upload file"
            title={`Upload file (TXT, LOG, MD, PY, JS, JSX, TS, TSX, CSV, JSON, PDF, IPYNB • Max ${formatFileSize(512 * 1024 * 1024)})`}
          >
            <FaFileUpload className="text-white text-xl" aria-hidden="true" />
          </button>

          <input
            type="text"
            placeholder={
              uploadProgress
                ? `Uploading file... ${calculateUploadProgress()}%`
                : isLoading
                ? 'Ron is thinking...'
                : 'Type your message or drag & drop a file...'
            }
            className="flex-1 p-4 bg-glass-white backdrop-blur-xs rounded-full text-black font-raleway font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading && !uploadProgress) handleSend();
            }}
            disabled={isLoading || !!uploadProgress}
            aria-label="Message input"
          />

          <button
            onClick={() => handleSend()}
            disabled={isLoading || !!uploadProgress}
            className={`p-4 bg-gradient-to-r from-neon-pink to-neon-purple rounded-full shadow-neon-pink hover:scale-105 transform transition focus:outline-none focus:ring-2 focus:ring-neon-pink ${
              isLoading || uploadProgress ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Send message"
            title="Send message"
          >
            <FaPaperPlane className="text-white text-xl" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RonAIExperience;
