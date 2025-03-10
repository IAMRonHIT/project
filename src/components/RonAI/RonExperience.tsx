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

const RonExperience: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
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
      voice: "alloy",
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
                newMessages[streamingIndex] = {
                  ...newMessages[streamingIndex],
                  // Append the new content instead of replacing it
                  content: newMessages[streamingIndex].content + update.content,
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
        controller.signal,
        isDeepThinking
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
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
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
                      aria-expanded={isExpanded ? "true" : "false"}
                      aria-label={isExpanded ? "Collapse chain of thought" : "Expand chain of thought"}
                    >
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  )}
                </div>
              )}
              {msg.isDeepThinking && !msg.isStreaming && isExpanded && (
                <div className="border-l-2 border-amber-400 pl-3 mb-4 text-amber-200 italic text-sm transition-all duration-300">
                  <p className="font-semibold mb-1">Chain of Thought:</p>
                  {formatChainOfThought(msg.content)}
                </div>
              )}
              <ReactMarkdown
                className="prose prose-sm max-w-none prose-invert"
                remarkPlugins={[remarkGfm]}
                components={{ code: CodeBlock }}
              >
                {msg.isDeepThinking && !msg.isStreaming ? 
                  extractFinalAnswer(msg.content) : 
                  msg.content}
              </ReactMarkdown>
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
    );
  };

  // Helper function to format the chain of thought
  const formatChainOfThought = (content: string): JSX.Element => {
    // Look for patterns like "Let me think..." or step-by-step reasoning
    const parts = content.split(/\n\n|(?<=\.)\s+(?=[A-Z])/);
    
    if (parts.length <= 2) {
      // If there aren't many parts, just return the whole thing
      return <p>{content}</p>;
    }
    
    // Take all but the last part as the chain of thought
    const thoughts = parts.slice(0, -1);
    
    return (
      <div className="chain-of-thought">
        {thoughts.map((thought, i) => (
          <p key={i} className="mb-2">{thought}</p>
        ))}
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
