import React, { useState, useRef, useEffect, useMemo, FC } from 'react';
import { useGeminiStream, toolDefinitions } from '../../hooks/useGeminiStream';
import { createToolHandler } from '../../services/ToolHandler';
import { env } from '../../config/environment';
import realtimeAudioService, { ConnectionState } from '../../services/realtimeAudioService';
import { 
  Loader2, 
  ClipboardIcon, 
  CheckIcon, 
  ThumbsUp, 
  ThumbsDown, 
  ChevronDown, 
  ChevronRight,
  MessageSquare,
  Bot,
  Send,
  Mic,
  Paperclip,
  FileText,
  Search,
  User,
  Headphones,
  AlertCircle,
  Clock,
  FileQuestion,
  Stethoscope,
  MapPin,
  X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import RonAiTab from './RonAITab';
import remarkGfm from 'remark-gfm';
import ApiResponseHandler from '../ApiResponseHandler';
import { fetchAndFormatFDADrugData } from '../../services/FDAService';
import ResearchAccordion from './ResearchAccordion';
import { ModeType } from './ModeDropdown';
import ProviderSearchModal from './ProviderSearchModal';
import ProviderMapPreview from './ProviderMapPreview';
import ErrorBoundary from '../ErrorBoundary';
import type { ProviderSearchParams } from './ProviderSearchModal';
import type { Patient } from '../../types/Patient'; // Correct path

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  toolExecution?: boolean;
  id?: string;
  feedback?: 'positive' | 'negative' | null;
  mode?: ModeType;
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
  const [activeMode, setActiveMode] = useState<ModeType>('default');
  const [fdaAccordionData, setFdaAccordionData] = useState<any>(null);
  const [isProviderSearchModalOpen, setIsProviderSearchModalOpen] = useState(false);
  const [isProviderMapVisible, setIsProviderMapVisible] = useState(false);
  const [providerSearchParams, setProviderSearchParams] = useState<ProviderSearchParams>({
    searchType: 'specialty',
    specialty: 'primary-care',
    postalCode: '84101',
    enumerationType: 'ind',
    limit: 20
  });
  const [patientAddress, setPatientAddress] = useState<string>(''); // State for patient address
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini stream
  const {
    startStream,
    stopStream,
    isStreaming,
    error: streamError
  } = useGeminiStream(isDeepThinking ? 'deep-thinking' : 'default');

  // Initialize tool handler
  const toolHandler = useMemo(() => createToolHandler({
    FDA_API_KEY: env.FDA_API_KEY,
    GOOGLE_MAPS_API_KEY: env.GOOGLE_MAPS_API_KEY,
    PUBMED_API_KEY: env.PUBMED_API_KEY
  }), []);

  // Memoize messages to prevent unnecessary re-renders
  const memoizedMessages = useMemo(() => messages, [messages]);

  // Helper function to format the chain of thought
  const formatChainOfThought = (content: string): JSX.Element => {
    const startIndex = content.indexOf('<thought>');
    if (startIndex === -1) return <p>{content}</p>;

    const endIndex = content.lastIndexOf('</thought>');
    if (endIndex === -1) return <p>{content}</p>;

    const thoughtSection = content.substring(startIndex, endIndex + 10);

    return (
      <div className="chain-of-thought whitespace-pre-wrap">
        <p className="mb-2">{thoughtSection}</p>
      </div>
    );
  };

  // Extract the final answer from the chain of thought
  const extractFinalAnswer = (content: string): string => {
    let lastThoughtEnd = -1;
    let currentIndex = 0;

    while (true) {
      const endIndex = content.indexOf('</thought>', currentIndex);
      if (endIndex === -1) break;
      lastThoughtEnd = endIndex;
      currentIndex = endIndex + 9;
    }

    if (lastThoughtEnd === -1) return content;

    const afterThought = content.substring(lastThoughtEnd + 9).trim();
    if (afterThought.startsWith('Ron:')) {
      return afterThought.substring(4).trim();
    }

    return afterThought;
  };

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

    // Check if this is an assistant message that might contain API responses
    if (msg.role === 'assistant') {
      // Try to use ApiResponseHandler first
      const apiResponse = <ApiResponseHandler content={msg.content} />;

      return (
        <React.Fragment key={idx}>
          {apiResponse}
          
          <div className={`flex justify-start ${
            idx === memoizedMessages.length - 1 && msg.isStreaming ? 'animate-fadeIn' : ''
          } message-item`}>
            <div className="max-w-[80%] rounded-lg p-4 bg-gray-900/90 border border-indigo-500/30 text-gray-100 mr-auto 
              shadow-[0_0_10px_rgba(79,70,229,0.2)] hover:shadow-[0_0_15px_rgba(79,70,229,0.3)] 
              backdrop-blur-sm transition-all duration-200">
              {msg.isDeepThinking && (
                <div className="mb-3 text-indigo-400 font-semibold flex items-center">
                  <span>🤔 Using Gemini Deep Thinking Model</span>
                  {!msg.isStreaming && (
                    <button 
                      type="button"
                      onClick={toggleAccordion}
                      className="ml-2 p-1 rounded-md hover:bg-indigo-500/20 transition-colors"
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? "Collapse chain of thought" : "Expand chain of thought"}
                    >
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  )}
                </div>
              )}
              
              {msg.isDeepThinking && !msg.isStreaming && isExpanded && (
                <div className="border-l-2 border-indigo-500 pl-3 mb-4 text-indigo-300/80 italic text-sm transition-all duration-300">
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
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce shadow-[0_0_5px_rgba(79,70,229,0.5)]"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s] shadow-[0_0_5px_rgba(79,70,229,0.5)]"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s] shadow-[0_0_5px_rgba(79,70,229,0.5)]"></div>
                    </div>
                    <span className="text-xs text-indigo-300">Processing...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </React.Fragment>
      );
    }
    
    // User message
    return (
      <div
        key={idx}
        className={`flex justify-end ${
          idx === memoizedMessages.length - 1 && msg.isStreaming ? 'animate-fadeIn' : ''
        } message-item`}
      >
        <div className="max-w-[80%] rounded-lg p-4 bg-gradient-to-br from-indigo-600/20 to-teal-600/20 text-white ml-auto 
          border border-indigo-500/30 shadow-[0_0_10px_rgba(79,70,229,0.2)] hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]
          backdrop-blur-sm transition-all duration-200">
          <div className="whitespace-pre-wrap">
            {msg.content}
          </div>
        </div>
      </div>
    );
  };

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentMessage.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = {
      role: 'user',
      content: currentMessage,
      id: `user-${Date.now()}`,
      mode: activeMode
    };
    setMessages(prev => [...prev, userMessage]);
    
    const message = currentMessage;
    setCurrentMessage('');

    try {
      let currentResponse = '';
      
      await startStream(
        message,
        (token) => {
          currentResponse += token;
          setMessages(prev => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            if (lastIndex >= 0 && newMessages[lastIndex].role === 'assistant') {
              newMessages[lastIndex] = {
                ...newMessages[lastIndex],
                content: currentResponse,
                isStreaming: true
              };
            } else {
              newMessages.push({
                role: 'assistant',
                content: currentResponse,
                isStreaming: true,
                id: `assistant-${Date.now()}`,
                mode: activeMode,
                isDeepThinking: activeMode === 'deep-thinking'
              });
            }
            return newMessages;
          });
        },
        (structuredResult) => {
          setFdaAccordionData(structuredResult);
        },
        activeMode === 'deep-thinking' ? undefined : Object.values(toolDefinitions)
      );

      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (lastIndex >= 0 && newMessages[lastIndex].role === 'assistant') {
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            isStreaming: false
          };
        }
        return newMessages;
      });
    } catch (error) {
      console.error('Error in stream:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        mode: activeMode
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle deep thinking mode
  const toggleDeepThinking = () => {
    setIsDeepThinking(prev => {
      const newValue = !prev;
      if (newValue) {
        stopStream();
      }
      return newValue;
    });
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

  // Handle mode change
  const handleModeChange = (mode: ModeType) => {
    setActiveMode(mode);
    
    // Handle provider search mode specifically
    if (mode === 'provider-search') {
      setIsProviderSearchModalOpen(true);
    }
  };

  // Handle provider search form submission
  const handleProviderSearch = (searchParams: ProviderSearchParams) => {
    console.log('Provider search params:', searchParams);
    
    // Store search parameters
    setProviderSearchParams(searchParams);
    
    // Close modal first, then show map after a short delay
    setIsProviderSearchModalOpen(false);
    
    // Create a search message to display in the chat
    let searchMessage = '';
    switch (searchParams.searchType) {
      case 'npi':
        searchMessage = `Looking up provider with NPI number: ${searchParams.npiNumber || 'unknown'}`;
        break;
      case 'name':
        searchMessage = `Find healthcare provider ${searchParams.firstName || ''} ${searchParams.lastName || ''} ${searchParams.postalCode ? `in zip code ${searchParams.postalCode}` : ''}`;
        break;
      case 'specialty':
        searchMessage = `Find me a ${searchParams.specialty || 'healthcare'} provider ${searchParams.postalCode ? `in zip code ${searchParams.postalCode}` : ''}`;
        break;
    }
    
    // Add user message to chat
    setMessages(prevMessages => [
      ...prevMessages,
      {
        role: 'user',
        content: searchMessage,
        mode: 'provider-search'
      }
    ]);
    
    // Show the map after a slight delay to ensure smooth transition
    setTimeout(() => {
      setIsProviderMapVisible(true);
    }, 150);
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch patient data on mount
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch('/data/Patients/Patients.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const patients: Patient[] = await response.json();
        if (patients && patients.length > 0) {
          // Use the first patient's address as default/placeholder
          const firstPatient = patients[0];
          const address = `${firstPatient.member_street_address}, ${firstPatient.member_city}, ${firstPatient.member_state} ${firstPatient.member_zip}`;
          setPatientAddress(address);
          console.log("Patient address loaded:", address);
        } else {
          console.warn("No patient data found or empty array.");
        }
      } catch (error) {
        console.error("Failed to fetch patient data:", error);
        // Handle error appropriately, maybe set a default address or show an error message
      }
    };

    fetchPatientData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Initialize the Realtime Audio Service when component mounts
  useEffect(() => {
    realtimeAudioService.config({
      instructions: "You are Ron AI, a helpful healthcare assistant that provides accurate and concise information.",
      voice: "ash",
      modalities: ["text", "audio"],
      onTranscriptUpdate: (text) => {
        setAudioTranscript(text);
      },
      onConnectionStateChange: (state) => {
        setAudioConnectionState(state);
        if (state === 'connected' && audioTranscript) {
          const finalAnswer = processAudioTranscript(audioTranscript);
          if (finalAnswer) {
            setMessages(prevMessages => [
              ...prevMessages,
              {
                role: 'assistant',
                content: finalAnswer,
                mode: 'realtime-audio'
              }
            ]);
            setAudioTranscript('');
          }
        }
      },
      onError: (error) => {
        console.error('Realtime audio error:', error);
        setMessages(prevMessages => [
          ...prevMessages,
          {
            role: 'assistant',
            content: `I encountered an error with the audio service: ${error.message}. Please try again or use text input instead.`,
            mode: 'default'
          }
        ]);
      }
    });

    return () => {
      if (realtimeAudioService.connectionState !== 'disconnected') {
        realtimeAudioService.stopSession();
      }
    };
  }, []);

  // Process the audio transcript to clean it up
  const processAudioTranscript = (transcript: string): string => {
    if (!transcript) return '';
    let cleaned = transcript.trim();
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
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    return cleaned;
  };

  return (
    <div className="flex flex-col h-full">
      <RonAiTab
        messages={memoizedMessages}
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        messagesContainerRef={messagesContainerRef}
        messagesEndRef={messagesEndRef}
        renderMessage={renderMessage}
        isDeepThinking={isDeepThinking}
        isConversationMode={isConversationMode}
        toggleDeepThinking={toggleDeepThinking}
        toggleConversationMode={toggleConversationMode}
        activeMode={activeMode}
        onModeChange={handleModeChange}
        fdaAccordionData={fdaAccordionData}
        setFdaAccordionData={setFdaAccordionData}
        isProviderSearchModalOpen={isProviderSearchModalOpen}
        setIsProviderSearchModalOpen={setIsProviderSearchModalOpen}
        isProviderMapVisible={isProviderMapVisible}
        setIsProviderMapVisible={setIsProviderMapVisible}
        providerSearchParams={providerSearchParams}
        handleProviderSearch={handleProviderSearch}
      />
      
      {/* Provider Search Modal */}
      <ProviderSearchModal
        isOpen={isProviderSearchModalOpen}
        onClose={() => setIsProviderSearchModalOpen(false)}
        onSearch={handleProviderSearch}
      />
      
      {/* Provider Map Preview */}
      <ProviderMapPreview
        searchParams={providerSearchParams}
        isVisible={isProviderMapVisible}
        onClose={() => setIsProviderMapVisible(false)}
        patientAddress={patientAddress} // Pass patient address down
      />
    </div>
  );
};

export default RonExperience;
