import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  streamAssistantMessage, 
  getOrCreateThreadId, 
  getThreadHistory,
  sendMessageFeedback
} from '../../services/ronAIService';
import realtimeAudioService, { ConnectionState } from '../../services/realtimeAudioService';
import { Loader2, ClipboardIcon, CheckIcon, ThumbsUp, ThumbsDown, ChevronDown, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import RonAiTab from './RonAITab';
import remarkGfm from 'remark-gfm';
import './RonAITab.module.css';

// Define a simple styles object for the typing indicator
const styles = {
  typingContainer: 'flex items-center justify-center',
  typingIndicator: 'flex space-x-1'
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  toolExecution?: boolean;
  id?: string;
  feedback?: 'positive' | 'negative' | null;
  mode?: 'normal' | 'deep-thinking' | 'conversation' | 'audio';
  isDeepThinking?: boolean;
  isAudio?: boolean;
}

// Component for copying code blocks
const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button 
      className="absolute top-2 right-2 p-1 rounded-md bg-gray-700 text-white opacity-70 hover:opacity-100 transition-opacity"
      onClick={copyToClipboard}
    >
      {copied ? <CheckIcon size={16} /> : <ClipboardIcon size={16} />}
    </button>
  );
};

// Custom renderer for code blocks to add copy button and syntax highlighting
const CodeBlock = (props: any) => {
  const { node, inline, className, children, ...rest } = props;
  const match = /language-(\w+)/.exec(className || '');
  
  if (inline) {
    return <code className={className} {...rest}>{children}</code>;
  }

  const language = match ? match[1] : '';
  const code = String(children).replace(/\n$/, '');

  return (
    <div className="relative">
      <pre className={`${className || ''} p-4 rounded overflow-auto`}>
        <code className={language ? `language-${language}` : ''} {...rest}>
          {code}
        </code>
      </pre>
      {!inline && <CopyButton text={code} />}
    </div>
  );
};

const RonAIExperience: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isDeepThinking, setIsDeepThinking] = useState(false);
  const [isConversationMode, setIsConversationMode] = useState(false);
  const [audioConnectionState, setAudioConnectionState] = useState<ConnectionState>('disconnected');
  const [audioTranscript, setAudioTranscript] = useState('');
  const [expandedThoughts, setExpandedThoughts] = useState<{[key: string]: boolean}>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Initialize chat with Ron AI
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  // Add CSS variables for theme
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --bg-primary: #f9fafb;
        --bg-secondary: #f3f4f6;
        --text-primary: #111827;
        --text-secondary: #4b5563;
        --border-color: #e5e7eb;
        --accent-color: #3b82f6;
        --user-message-bg: #e2f1fd;
        --assistant-message-bg: #f3f4f6;
      }
      
      .dark-theme {
        --bg-primary: #111827;
        --bg-secondary: #1f2937;
        --text-primary: #f9fafb;
        --text-secondary: #d1d5db;
        --border-color: #374151;
        --accent-color: #60a5fa;
        --user-message-bg: #2563eb;
        --assistant-message-bg: #1f2937;
      }
      
      body {
        background-color: var(--bg-primary);
        color: var(--text-primary);
      }
      
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background-color: transparent;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 4px;
      }
      
      .dark-theme .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(75, 85, 99, 0.5);
      }
      
      /* Message visibility */
      .message-item {
        opacity: 0;
      }
      
      .message-item.message-visible {
        opacity: 1;
        transition: opacity 0.3s ease-out;
      }

      /* Enhanced text styles for readability */
      .dark-theme pre, .dark-theme code {
        background-color: #2d3748 !important;
        color: #e2e8f0 !important;
      }

      .prose-sm {
        font-size: 0.925rem;
        line-height: 1.6;
      }

      .dark-theme .prose-invert {
        color: #e2e8f0;
      }

      /* Improve code readability */
      code {
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        padding: 0.2em 0.4em;
        border-radius: 3px;
      }

      pre code {
        padding: 0;
      }

      /* Ensure proper contrast for code blocks */
      .dark-theme .hljs {
        background-color: #2d3748 !important;
      }

      /* Style enhancements for markdown content */
      .markdown-content h1 {
        font-size: 1.75rem;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 0.5rem;
      }
      
      .markdown-content h2 {
        font-size: 1.5rem;
        margin-top: 1.4rem;
        margin-bottom: 0.9rem;
        font-weight: 600;
        color: var(--text-primary);
      }
      
      .markdown-content h3 {
        font-size: 1.25rem;
        margin-top: 1.3rem;
        margin-bottom: 0.8rem;
        font-weight: 600;
        color: var(--text-primary);
      }
      
      .markdown-content h4, .markdown-content h5, .markdown-content h6 {
        margin-top: 1.2rem;
        margin-bottom: 0.7rem;
        font-weight: 600;
        color: var(--text-primary);
      }
      
      .markdown-content p {
        margin-bottom: 1rem;
        line-height: 1.6;
      }
      
      .markdown-content ul, .markdown-content ol {
        margin-bottom: 1rem;
        padding-left: 1.5rem;
      }
      
      .markdown-content li {
        margin-bottom: 0.5rem;
        line-height: 1.5;
      }
      
      .markdown-content ul li {
        list-style-type: disc;
      }
      
      .markdown-content ol li {
        list-style-type: decimal;
      }
      
      .markdown-content blockquote {
        border-left: 4px solid var(--accent-color);
        padding-left: 1rem;
        margin-left: 0;
        margin-right: 0;
        font-style: italic;
        color: var(--text-secondary);
      }
      
      .markdown-content table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1rem;
      }
      
      .markdown-content table th, .markdown-content table td {
        border: 1px solid var(--border-color);
        padding: 0.5rem;
        text-align: left;
      }
      
      .markdown-content table th {
        background-color: var(--bg-secondary);
        font-weight: 600;
      }
      
      .dark-theme .markdown-content a {
        color: #60a5fa;
        text-decoration: none;
      }
      
      .markdown-content a:hover {
        text-decoration: underline;
      }
      
      .markdown-content img {
        max-width: 100%;
        border-radius: 4px;
        margin: 1rem 0;
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup function to remove style when component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Initialize the Realtime Audio Service when component mounts
  useEffect(() => {
    // Configure the realtime audio service
    realtimeAudioService.config({
      instructions: "You are Ron AI, a helpful healthcare assistant that provides accurate and concise information.",
      voice: "ash",
      onTranscriptUpdate: (text) => {
        setAudioTranscript(text);
      },
      onConnectionStateChange: (state) => {
        setAudioConnectionState(state);
        // When speaking is done, extract the final answer
        if (state === 'connected' && audioTranscript) {
          // Add the transcript as an assistant message
          const finalAnswer = processAudioTranscript(audioTranscript);
          if (finalAnswer) {
            setMessages(prevMessages => [
              ...prevMessages,
              {
                role: 'assistant',
                content: finalAnswer,
                mode: 'audio'
              }
            ]);
            // Clear the transcript for the next interaction
            setAudioTranscript('');
          }
        }
      },
      onError: (error) => {
        console.error('Realtime audio error:', error);
        // Notify user of error
        setMessages(prevMessages => [
          ...prevMessages,
          {
            role: 'assistant',
            content: `I encountered an error with the audio service: ${error.message}. Please try again or use text input instead.`,
            mode: 'normal'
          }
        ]);
      }
    });

    // Clean up on component unmount
    return () => {
      realtimeAudioService.stopSession();
    };
  }, []);

  // Process the audio transcript to clean it up
  const processAudioTranscript = (transcript: string): string => {
    if (!transcript) return '';
    
    // Clean up the transcript to make it more presentable
    // Remove any timestamps or speaker identifiers
    let cleaned = transcript.trim();
    
    // Remove any "thinking" or "processing" phrases that might appear
    const removePhrases = [
      "Let me think about that",
      "Let me check that for you",
      "I'm processing your request",
      "One moment please"
    ];
    
    removePhrases.forEach(phrase => {
      if (cleaned.startsWith(phrase)) {
        cleaned = cleaned.slice(phrase.length).trim();
      }
    });
    
    // If there are multiple paragraphs, ensure proper formatting
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    return cleaned;
  };

  // Load thread history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const threadId = await getOrCreateThreadId();
        const history = await getThreadHistory(threadId);
        setMessages(history);
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
      console.error('Error sending feedback:', error);
      // Revert UI change if there was an error
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[index] = { ...message };
        return newMessages;
      });
    }
  };

  // Handle audio recording when the audio connection state changes
  useEffect(() => {
    if (audioConnectionState === 'recording') {
      // Add a user message for the recording
      setMessages(prev => [...prev, {
        role: 'user',
        content: 'Recording audio...',
        isAudio: true,
        id: `user-audio-${Date.now()}`
      }]);
    } else if (audioConnectionState === 'processing' && messages.length > 0) {
      // Update the last user message with "Processing audio..."
      const lastUserMessageIndex = [...messages].reverse().findIndex(m => m.role === 'user' && m.isAudio);
      if (lastUserMessageIndex >= 0) {
        const actualIndex = messages.length - 1 - lastUserMessageIndex;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[actualIndex] = {
            ...newMessages[actualIndex],
            content: 'Processing audio...'
          };
          return newMessages;
        });
      }
    }
  }, [audioConnectionState, messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentMessage.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, {
      role: 'user',
      content: currentMessage,
      id: `user-${Date.now()}`,
      mode: isDeepThinking ? 'deep-thinking' : isConversationMode ? 'conversation' : 'normal'
    }]);
    
    const message = currentMessage;
    setCurrentMessage('');

    try {
      const controller = new AbortController();
      
      await streamAssistantMessage(
        message,
        (update) => {
          // Pass isDeepThinking to use the Ron Thinking assistant when deep thinking mode is enabled
          if (update.type === 'messageStart') {
            // Add new assistant message placeholder that will be updated
            setMessages(prevMessages => [
              ...prevMessages,
              {
                ...update.message,
                id: `msg-${Date.now()}`
              }
            ]);
          } else if (update.type === 'contentUpdate') {
            // Update the streaming message with new content
            setMessages(prev => {
              const newMessages = [...prev];
              const streamingIndex = newMessages.findIndex(m => m.isStreaming);
              if (streamingIndex !== -1) {
                // Remove any "Searching database..." message when new content arrives
                let updatedContent = newMessages[streamingIndex].content;
                if (updatedContent.includes("_Searching database..._")) {
                  updatedContent = updatedContent.replace("\n\n_Searching database..._", "");
                }
                
                newMessages[streamingIndex] = {
                  ...newMessages[streamingIndex],
                  // Update with the cleaned content plus the new content
                  content: updatedContent + update.content,
                  isDeepThinking: update.isDeepThinking
                };
              }
              return newMessages;
            });
          } else if (update.type === 'messageComplete' || update.type === 'messageDone') {
            // Replace the streaming message with the complete one
            setMessages(prev => {
              const newMessages = [...prev];
              const streamingIndex = newMessages.findIndex(m => m.isStreaming);
              if (streamingIndex !== -1) {
                newMessages[streamingIndex] = {
                  ...update.message,
                  isDeepThinking: update.message.isDeepThinking
                };
              } else {
                // Fallback if no streaming message is found
                newMessages.push({
                  ...update.message,
                  isDeepThinking: update.message.isDeepThinking
                });
              }
              return newMessages;
            });
            setIsLoading(false);
          } else if (update.type === 'toolCalls') {
            // Show a visual indicator that tools are being executed
            setMessages(prev => {
              const newMessages = [...prev];
              const assistantIndex = newMessages.findIndex(m => m.role === 'assistant' && m.isStreaming);
              if (assistantIndex !== -1) {
                newMessages[assistantIndex] = {
                  ...newMessages[assistantIndex],
                  toolExecution: true,
                  content: newMessages[assistantIndex].content + "\n\n_Searching database..._"
                };
              }
              return newMessages;
            });
          } else if (update.type === 'error') {
            // Handle errors gracefully in the UI
            setMessages(prev => {
              const newMessages = [...prev];
              const streamingIndex = newMessages.findIndex(m => m.isStreaming);
              if (streamingIndex !== -1) {
                newMessages[streamingIndex] = {
                  ...newMessages[streamingIndex],
                  isStreaming: false,
                  content: `Sorry, I encountered an error while processing your request: ${update.error}. Please try again.`
                };
              }
              return newMessages;
            });
            setIsLoading(false);
          }
        },
        controller.signal,
        isDeepThinking
      );
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
      
      // Alt+N to focus on the text input
      if (e.altKey && e.key === 'n') {
        inputRef.current?.focus();
      }
      
      // Alt+K to toggle keyboard shortcuts help
      if (e.altKey && e.key === 'k') {
        setShowShortcuts(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Render message with code blocks
  const renderMessage = (msg: Message, idx: number) => {
    const messageId = msg.id || `msg-${idx}`;
    const isExpanded = expandedThoughts[messageId] || false;
    
    const toggleAccordion = () => {
      setExpandedThoughts(prev => ({
        ...prev,
        [messageId]: !prev[messageId]
      }));
    };
    
    return (
      <div
        key={idx}
        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${
          idx === memoizedMessages.length - 1 && msg.isStreaming ? 'animate-fadeIn' : ''
        } message-item`}
      >
        <div
          className={`max-w-[80%] rounded-lg p-3 ${
            msg.role === 'user'
              ? 'bg-teal-500 bg-opacity-20 text-white ml-auto'
              : 'bg-[#1E1E1E] border border-gray-700 text-gray-100 mr-auto'
          }`}
        >
          {msg.role === 'assistant' ? (
            <>
              {msg.isDeepThinking && (
                <div className="mb-3 text-amber-400 font-semibold flex items-center">
                  <span>🤔 Deep Thinking Mode</span>
                  {!msg.isStreaming && (
                    <button 
                      type="button"
                      onClick={toggleAccordion}
                      className="ml-2 p-1 rounded-md hover:bg-gray-700 transition-colors"
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? "Collapse chain of thought" : "Expand chain of thought"}
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
              )}
              <div
                className={`prose prose-sm ${
                  darkMode ? 'prose-invert' : ''
                } markdown-content`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: CodeBlock,
                    // Enhanced table styling
                    table: ({node, ...props}) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full divide-y divide-gray-700" {...props} />
                      </div>
                    ),
                    // Add styling for table headers
                    th: ({node, ...props}) => (
                      <th className="bg-gray-800 px-4 py-2 text-left font-medium text-gray-300" {...props} />
                    ),
                    // Add styling for table cells
                    td: ({node, ...props}) => (
                      <td className="border-t border-gray-700 px-4 py-2" {...props} />
                    ),
                    // Add styling for blockquotes
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-4 border-teal-500 pl-4 italic text-gray-400" {...props} />
                    ),
                    // Better list styling
                    ul: ({node, ...props}) => (
                      <ul className="list-disc pl-5 space-y-2" {...props} />
                    ),
                    ol: ({node, ...props}) => (
                      <ol className="list-decimal pl-5 space-y-2" {...props} />
                    ),
                    // Better paragraph spacing
                    p: ({node, children}) => (
                      <p className="mb-4 leading-relaxed">{children}</p>
                    ),
                    // Enhance heading styles
                    h1: ({node, ...props}) => (
                      <h1 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-700" {...props} />
                    ),
                    h2: ({node, ...props}) => (
                      <h2 className="text-xl font-semibold mb-3 mt-6" {...props} />
                    ),
                    h3: ({node, ...props}) => (
                      <h3 className="text-lg font-semibold mb-3 mt-5" {...props} />
                    ),
                    // Custom link styling
                    a: ({node, ...props}) => (
                      <a className="text-teal-400 hover:underline" {...props} />
                    ),
                  }}
                >
                  {msg.isDeepThinking && !msg.isStreaming ? 
                    extractFinalAnswer(msg.content) : 
                    msg.content}
                </ReactMarkdown>
              </div>
              {msg.isStreaming && (
                <div className="flex justify-center mt-4">
                  <div className="flex items-center justify-center">
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="whitespace-pre-wrap">
              {msg.content}
            </div>
          )}
          {msg.role === 'assistant' && !msg.isStreaming && (
            <div className="flex mt-2 justify-end">
              <button
                type="button"
                onClick={() => handleFeedback(idx, 'positive')}
                className={`mr-2 p-1 rounded-full transition-colors ${
                  msg.feedback === 'positive' 
                    ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300' 
                    : 'text-gray-400 hover:text-green-500 dark:text-gray-500 dark:hover:text-green-400'
                }`}
                aria-label="Helpful response"
                title="Mark this response as helpful"
              >
                <ThumbsUp size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleFeedback(idx, 'negative')}
                className={`p-1 rounded-full transition-colors ${
                  msg.feedback === 'negative' 
                    ? 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300' 
                    : 'text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400'
                }`}
                aria-label="Unhelpful response"
                title="Mark this response as unhelpful"
              >
                <ThumbsDown size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

  // Extract the final answer from the chain of thought
  const extractFinalAnswer = (content: string): string => {
    // Check if this is sequential thinking output 
    if (content.includes('thoughtNumber') || content.includes('nextThoughtNeeded')) {
      // For sequential thinking output, we should show the entire content
      // as it's already formatted appropriately
      return content;
    }
    
    // For traditional chain of thought
    const parts = content.split(/\n\n|(?<=\.)\s+(?=[A-Z])/);
    
    if (parts.length <= 2) {
      return content;
    }
    
    // Look for a conclusion marker
    const conclusionIndex = parts.findIndex(part => 
      part.toLowerCase().includes('conclusion') || 
      part.toLowerCase().includes('in conclusion') ||
      part.toLowerCase().includes('therefore') ||
      part.toLowerCase().includes('to summarize') ||
      part.toLowerCase().includes('in summary')
    );
    
    if (conclusionIndex !== -1) {
      // Return the conclusion and any text after it
      return parts.slice(conclusionIndex).join(' ');
    }
    
    // Fallback: return the last part as before
    return parts[parts.length - 1];
  };

  // Toggle deep thinking mode
  const toggleDeepThinking = () => {
    setIsDeepThinking(prev => !prev);
    if (isConversationMode) {
      setIsConversationMode(false);
    }
  };
  
  // Toggle conversation mode
  const toggleConversationMode = () => {
    setIsConversationMode(prev => !prev);
    if (isDeepThinking) {
      setIsDeepThinking(false);
    }
  };

  return (
    <RonAiTab
      messages={memoizedMessages}
      currentMessage={currentMessage}
      setCurrentMessage={setCurrentMessage}
      handleSubmit={(e) => handleSubmit(e as React.FormEvent<HTMLFormElement>)}
      isLoading={isLoading}
      messagesContainerRef={messagesContainerRef}
      messagesEndRef={messagesEndRef}
      renderMessage={renderMessage}
      isDeepThinking={isDeepThinking}
      isConversationMode={isConversationMode}
      toggleDeepThinking={toggleDeepThinking}
      toggleConversationMode={toggleConversationMode}
    />
  );
};

export default RonExperience;
