import React, { useState, useRef, useEffect, useMemo, FC } from 'react';
import { useGeminiStream, toolDefinitions } from '../../hooks/useGeminiStream';
import { getPerplexityResponse, PerplexityResponse, Citation } from '../../services/perplexityService'; // Added Citation
import SourcesAccordion from './SourcesAccordion'; // Added SourcesAccordion
import { createToolHandler } from '../../services/ToolHandler';
import { env } from '../../config/environment';
import realtimeAudioService, { ConnectionState } from '../../services/realtimeAudioService';
import SandboxIDE from './SandboxIDE';

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
// Import Patient from CareForm to ensure type compatibility
import CareForm, { Patient } from './CareForm';

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
  reasoningMarkdown?: string; // For Perplexity reasoning
  jsonData?: any; // For Perplexity JSON output
  citations?: Citation[]; // For Perplexity sources
  isPerplexity?: boolean; // Flag for Perplexity messages
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
  const [providerSearchParams, setProviderSearchParams] = useState<ProviderSearchParams>({} as ProviderSearchParams);
  const [patientAddress, setPatientAddress] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize Gemini stream
  const {
    startStream,
    stopStream,
    isStreaming,
    error: streamError
  } = useGeminiStream(activeMode === 'deep-thinking' ? 'deep-thinking' : 'default'); // Use activeMode for Gemini stream

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
  const renderMessage = (msg: Message, idx: number): React.ReactElement => {
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
      
      // Filter out PubMed JSON from display content if needed
      let displayContent = msg.content;
      
      // If we have JSON in the message, try to clean it up
      const jsonMatch = displayContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        try {
          // Check if this is PubMed JSON
          const data = JSON.parse(jsonStr);
          if (data && (data.count !== undefined || data.articles)) {
            // This is PubMed data, remove it from displayed content
            displayContent = displayContent.replace(jsonStr, '');
            
            // Also remove any "Tool Result:" prefix
            displayContent = displayContent.replace('Tool Result:', '');
            
            // Clean up any empty lines and trim whitespace
            displayContent = displayContent.replace(/\n\s*\n/g, '\n').trim();
          }
        } catch (error) {
          // If JSON parsing fails, keep original content
        }
      }

      return (
        <React.Fragment key={idx}>
          {apiResponse}
          
          <div className={`flex justify-start ${
            idx === memoizedMessages.length - 1 && msg.isStreaming ? 'animate-fadeIn' : ''
          } message-item`}>
            <div className="max-w-[80%] rounded-lg p-4 bg-gray-900/90 border border-indigo-500/30 text-gray-100 mr-auto 
              shadow-[0_0_10px_rgba(79,70,229,0.2)] hover:shadow-[0_0_15px_rgba(79,70,229,0.3)] 
              backdrop-blur-sm transition-all duration-200">
              {(msg.isDeepThinking || msg.isPerplexity) && (
                <div className="mb-3 text-indigo-400 font-semibold flex items-center">
                  <span>
                    🤔 
                    {msg.isDeepThinking && ' Using Gemini Deep Thinking Model'}
                    {msg.isPerplexity && activeMode === 'perplexity-reasoning' && ' Using Perplexity Sonar Reasoning Pro'}
                    {msg.isPerplexity && activeMode === 'perplexity-research' && ' Using Perplexity Sonar Deep Research'}
                  </span>
                  {!msg.isStreaming && (msg.isDeepThinking || (msg.isPerplexity && msg.reasoningMarkdown)) && (
                    <button 
                      type="button"
                      onClick={toggleAccordion}
                      className="ml-2 p-1 rounded-md hover:bg-indigo-500/20 transition-colors"
                      aria-label={isExpanded ? "Collapse reasoning" : "Expand reasoning"}
                    >
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  )}
                </div>
              )}
              
              {/* Gemini Chain of Thought */}
              {msg.isDeepThinking && !msg.isStreaming && isExpanded && (
                <div className="border-l-2 border-indigo-500 pl-3 mb-4 text-indigo-300/80 italic text-sm transition-all duration-300">
                  <p className="font-semibold mb-1">Gemini Chain of Thought:</p>
                  {formatChainOfThought(msg.content)}
                </div>
              )}

              {/* Perplexity Reasoning */}
              {msg.isPerplexity && msg.reasoningMarkdown && !msg.isStreaming && isExpanded && (
                 <div className="border-l-2 border-teal-500 pl-3 mb-4 text-teal-300/80 text-sm transition-all duration-300">
                  <p className="font-semibold mb-1">Perplexity Reasoning Process:</p>
                  <ReactMarkdown className="prose prose-sm max-w-none prose-invert" remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }}>
                    {msg.reasoningMarkdown}
                  </ReactMarkdown>
                </div>
              )}
              
              {/* Main content display */}
              {displayContent && displayContent.trim() !== '' && (!msg.isPerplexity || (msg.isPerplexity && !msg.jsonData && !msg.citations)) && (
                <ReactMarkdown
                  className="prose prose-sm max-w-none prose-invert"
                  remarkPlugins={[remarkGfm]}
                  components={{ code: CodeBlock }}
                >
                  {msg.isDeepThinking && !msg.isStreaming ? extractFinalAnswer(msg.content) : displayContent}
                </ReactMarkdown>
              )}

              {/* Perplexity JSON Data (if any and not handled by ApiResponseHandler) */}
              {msg.isPerplexity && msg.jsonData && (
                <div className="mt-2 p-2 bg-gray-800 rounded">
                  <p className="font-semibold text-sm text-gray-400 mb-1">Structured Data:</p>
                  <pre className="text-xs whitespace-pre-wrap break-all">
                    {JSON.stringify(msg.jsonData, null, 2)}
                  </pre>
                </div>
              )}

              {/* Perplexity Sources Accordion */}
              {msg.isPerplexity && msg.citations && msg.citations.length > 0 && !msg.isStreaming && (
                <SourcesAccordion sources={msg.citations} />
              )}
            </div>
          </div>
        </React.Fragment>
      );
    }
    
    // Default case for user messages
    return (
      <div key={idx} className="flex justify-end message-item">
        <div className="max-w-[80%] rounded-lg p-4 bg-indigo-600/80 text-white ml-auto border border-indigo-400/30 shadow-md">
          <ReactMarkdown className="prose prose-sm max-w-none prose-invert" remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }}>
            {msg.content}
          </ReactMarkdown>
        </div>
      </div>
    );
  };
  // Add states for SandboxIDE and CareForm
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [isCareFormOpen, setIsCareFormOpen] = useState(false);
  
  // Handle realtime audio processing
  useEffect(() => {
    // Set up realtime audio service listeners
    // Monitor connection state changes
    const handleConnectionUpdate = () => {
      setAudioConnectionState(realtimeAudioService.connectionState);
    };
    
    // Set up initial state
    handleConnectionUpdate();
    
    // For demonstration purposes, when SandboxIDE opens, simulate successful transcription
    if (isSandboxOpen) {
      const demoTranscript = "The patient presents with symptoms consistent with mild hypertension. Recommended treatment includes lifestyle modifications and monitoring. Consider scheduling a follow-up appointment in 2 weeks.";
      setAudioTranscript(demoTranscript);
    }

    return () => {
      // Stop session if active
      if (realtimeAudioService.connectionState !== 'disconnected') {
        realtimeAudioService.stopSession();
      }
    };
  }, []);

  // Process the audio transcript to clean it up
  const processAudioTranscript = (transcript: string): string => {
    if (!transcript) return '';
    let cleanedText = transcript.trim();
    const removePhrases = [
      "Let me think about that",
      "Let me check that for you",
      "I'm processing your request",
      "One moment please"
    ];
    removePhrases.forEach(p => {
      if (cleanedText.startsWith(p)) {
        cleanedText = cleanedText.slice(p.length).trim();
      }
    });
    cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n');
    return cleanedText;
  };

  // Handle mode change
  const handleModeChange = (mode: ModeType, sessionData?: any) => {
    console.log('Mode changed to:', mode); // Debug log
    setActiveMode(mode);
    setIsDeepThinking(mode === 'deep-thinking'); // Sync isDeepThinking with Gemini's deep-thinking mode
  
    if (mode === 'provider-search') {
      setIsProviderSearchModalOpen(true);
    } else {
      setIsProviderSearchModalOpen(false); // Close if switching to other modes
      setIsProviderMapVisible(false); // Also hide map
    }
    
    // Open SandboxIDE and CareForm when patient-content mode is selected
    if (mode === 'patient-content') {
      console.log('Opening SandboxIDE and CareForm'); // Debug log
      setIsSandboxOpen(true);
      setIsCareFormOpen(true);
      
      // Force update after a small delay to ensure UI update
      setTimeout(() => {
        setIsSandboxOpen(state => state); // Force a re-render
      }, 100);
    } else {
      // Close SandboxIDE and CareForm for other modes
      setIsSandboxOpen(false);
      setIsCareFormOpen(false);
    }
    
    // Stop Gemini stream if switching away from a Gemini mode
    if (mode !== 'default' && mode !== 'deep-thinking' && isStreaming) {
      stopStream();
    }
  };

  // Toggle functions for conversation modes
  const toggleDeepThinking = () => {
    setIsDeepThinking(prev => !prev);
  };

  const toggleConversationMode = () => {
    setIsConversationMode(prev => !prev);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit handling code here
  };

  // Handle provider search
  const handleProviderSearch = (params: ProviderSearchParams) => {
    setProviderSearchParams(params);
    setIsProviderMapVisible(true);
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

      {/* Render SandboxIDE when open */}
      {isSandboxOpen && (
        <div className="sandbox-container fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <SandboxIDE
            isOpen={true}
            onClose={() => setIsSandboxOpen(false)}
          />
        </div>
      )}

      {/* Render CareForm when open */}
      {isCareFormOpen && (
        <CareForm
          isOpen={isCareFormOpen}
          onClose={() => setIsCareFormOpen(false)}
          patients={patients}
          initialMode="patient-content"
        />
      )}
    </div>
  );
};

export default RonExperience;
