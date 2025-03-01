import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  streamAssistantMessage, 
  getOrCreateThreadId, 
  getThreadHistory,
  sendMessageFeedback
} from '../../services/ronAIService';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ClipboardIcon, CheckIcon, Sun, Moon, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  toolExecution?: boolean;
  id?: string;
  feedback?: 'positive' | 'negative' | null;
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

const RonExperience: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Memoize messages to prevent unnecessary re-renders
  const memoizedMessages = useMemo(() => messages, [messages]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Apply dark mode class to body
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
        transform: translateY(10px);
      }
      
      .message-item.message-visible {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.3s ease-out, transform 0.3s ease-out;
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
    `;
    document.head.appendChild(style);
    
    // Cleanup function to remove style when component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Load thread history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const threadId = await getOrCreateThreadId();
        const history = await getThreadHistory(threadId);
        setMessages(history);
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    };
    loadHistory();
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Performance optimization: Use IntersectionObserver for message visibility
  useEffect(() => {
    if (!messagesContainerRef.current) return;
    
    const options = {
      root: messagesContainerRef.current,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Add a class to fade in messages as they become visible
        if (entry.isIntersecting) {
          entry.target.classList.add('message-visible');
        }
      });
    }, options);
    
    // Observe all message elements
    const messageElements = messagesContainerRef.current.querySelectorAll('.message-item');
    messageElements.forEach(element => {
      observer.observe(element);
    });
    
    return () => {
      if (messageElements) {
        messageElements.forEach(element => {
          observer.unobserve(element);
        });
      }
    };
  }, [memoizedMessages]);

  // Handle message feedback
  const handleFeedback = async (index: number, type: 'positive' | 'negative') => {
    const message = messages[index];
    const messageId = message.id || `message-${index}`;
    let newFeedbackValue: 'positive' | 'negative' | null;
    
    // Toggle feedback if clicking the same button
    if (message.feedback === type) {
      newFeedbackValue = null;
    } else {
      newFeedbackValue = type;
    }
    
    // Update UI immediately for better user experience
    setMessages(prev => {
      const newMessages = [...prev];
      newMessages[index] = { ...message, feedback: newFeedbackValue };
      return newMessages;
    });
    
    // Send feedback to backend
    try {
      const success = await sendMessageFeedback(messageId, newFeedbackValue);
      if (!success) {
        console.error(`Failed to send feedback for message ${messageId}`);
        // Revert UI change if the API call failed
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[index] = { ...message };
          return newMessages;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, {
      role: 'user',
      content: currentMessage,
      id: `user-${Date.now()}`
    }]);
    
    const message = currentMessage;
    setCurrentMessage('');

    try {
      const controller = new AbortController();
      await streamAssistantMessage(
        message,
        (update) => {
          if (update.type === 'messageStart') {
            // Add new assistant message placeholder that will be updated
            setMessages(prev => [...prev, {
              ...update.message,
              id: `msg-${Date.now()}`
            }]);
          } else if (update.type === 'contentUpdate') {
            // Update the streaming message with new content
            setMessages(prev => {
              const newMessages = [...prev];
              const streamingIndex = newMessages.findIndex(m => m.isStreaming);
              if (streamingIndex !== -1) {
                newMessages[streamingIndex] = {
                  ...newMessages[streamingIndex],
                  // Append the new content instead of replacing it
                  content: newMessages[streamingIndex].content + update.content
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
                newMessages[streamingIndex] = update.message;
              } else {
                // Fallback if no streaming message is found
                newMessages.push(update.message);
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
                  content: newMessages[assistantIndex].content + "\n\n_Searching drug database..._"
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
        controller.signal
      );
    } catch (error) {
      console.error('Error in stream:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }]);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setCurrentMessage(textarea.value);
    
    // Auto-resize textarea
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+D to toggle dark mode
      if (e.altKey && e.key === 'd') {
        toggleDarkMode();
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

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Messages container */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {memoizedMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${
              idx === memoizedMessages.length - 1 && msg.isStreaming ? 'animate-fadeIn' : ''
            } message-item`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white dark:bg-blue-700 ml-auto'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mr-auto'
              } ${msg.isStreaming ? 'animate-pulse' : ''}`}
            >
              {msg.role === 'assistant' ? (
                <>
                  <ReactMarkdown
                    className="prose prose-sm max-w-none dark:prose-invert"
                    remarkPlugins={[remarkGfm]}
                    components={{ code: CodeBlock }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                  {msg.isStreaming && (
                    <div className="flex mt-2">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <pre className="whitespace-pre-wrap font-sans">
                  {msg.content}
                </pre>
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
        ))}
        {isLoading && !messages.some(m => m.isStreaming) && (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-t p-4 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex space-x-2">
          <textarea
            ref={inputRef}
            className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 outline-none min-h-[40px] max-h-[200px] placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Type a message..."
            rows={1}
            value={currentMessage}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            disabled={isLoading || !currentMessage.trim()}
            className={`px-4 py-2 rounded-lg text-white ${
              isLoading || !currentMessage.trim()
                ? 'bg-blue-300 dark:bg-blue-800 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send'}
          </button>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-blue-600" />
            )}
          </button>
        </div>
      </form>
      {showShortcuts && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-lg z-50">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Keyboard Shortcuts</h2>
              <button 
                onClick={() => setShowShortcuts(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close shortcuts panel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <ul className="space-y-2 text-gray-800 dark:text-gray-200">
              <li className="flex items-center">
                <kbd className="px-2 py-1 mr-2 text-xs font-semibold text-gray-800 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-300">Alt + D</kbd>
                <span>Toggle dark mode</span>
              </li>
              <li className="flex items-center">
                <kbd className="px-2 py-1 mr-2 text-xs font-semibold text-gray-800 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-300">Alt + N</kbd>
                <span>Focus on text input</span>
              </li>
              <li className="flex items-center">
                <kbd className="px-2 py-1 mr-2 text-xs font-semibold text-gray-800 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-300">Alt + K</kbd>
                <span>Toggle keyboard shortcuts help</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RonExperience;
