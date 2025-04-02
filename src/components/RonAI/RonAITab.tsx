import React, { useState, useRef, useEffect } from 'react';
import banner from './banner.png';
import { 
  Bot, Send, Mic, Paperclip,
  ChevronRight, Brain, MessageSquare, 
  FileText, Search, User,
  Headphones, AlertCircle, Clock,
  FileQuestion, Stethoscope, MapPin,
  X
} from 'lucide-react';
import ModeDropdown, { ModeType } from './ModeDropdown';
import ProviderSearchModal, { ProviderSearchParams } from './ProviderSearchModal';
import ProviderMapPreview from './ProviderMapPreview';
import ErrorBoundary from '../ErrorBoundary';
import FDAAccordion from './FDAAccordion';
import CareFormWrapper from './CareFormWrapper';

// Import the Message type to use it in RonAITabProps
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

interface RonAITabProps {
  onClose?: () => void;
  patientId?: string;
  className?: string;
  // Props passed from RonExperience
  messages?: Message[];
  currentMessage?: string;
  setCurrentMessage?: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  messagesContainerRef?: React.RefObject<HTMLDivElement>;
  messagesEndRef?: React.RefObject<HTMLDivElement>;
  renderMessage?: (msg: Message, idx: number) => JSX.Element;
  isDeepThinking?: boolean;
  isConversationMode?: boolean;
  toggleDeepThinking?: () => void;
  toggleConversationMode?: () => void;
  activeMode?: ModeType;
  onModeChange?: (mode: ModeType) => void;
  fdaAccordionData?: any; 
  setFdaAccordionData?: React.Dispatch<React.SetStateAction<any>>;
  // Provider search related props
  isProviderSearchModalOpen?: boolean;
  setIsProviderSearchModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isProviderMapVisible?: boolean;
  setIsProviderMapVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  providerSearchParams?: ProviderSearchParams;
  handleProviderSearch?: (params: ProviderSearchParams) => void;
}

interface CareJourney {
  id: string;
  name: string;
  type: string;
  status: string;
  reviews: Array<{
    id: string;
    type: string;
    title: string;
    status: string;
    date: string;
  }>;
}

const RonAITab: React.FC<RonAITabProps> = ({ 
  onClose,
  patientId, 
  className,
  // RonExperience props
  messages: externalMessages,
  currentMessage: externalCurrentMessage,
  setCurrentMessage: externalSetCurrentMessage,
  handleSubmit: externalHandleSubmit,
  isLoading: externalIsLoading,
  messagesContainerRef: externalMessagesContainerRef,
  messagesEndRef: externalMessagesEndRef,
  renderMessage: externalRenderMessage,
  isDeepThinking: externalIsDeepThinking,
  isConversationMode: externalIsConversationMode,
  toggleDeepThinking: externalToggleDeepThinking,
  toggleConversationMode: externalToggleConversationMode,
  activeMode: externalActiveMode,
  onModeChange,
  fdaAccordionData: externalFdaAccordionData, // Receive FDA data
  setFdaAccordionData: externalSetFdaAccordionData, // Receive setter
  // Provider search related props
  isProviderSearchModalOpen: externalIsProviderSearchModalOpen,
  setIsProviderSearchModalOpen: externalSetIsProviderSearchModalOpen,
  isProviderMapVisible: externalIsProviderMapVisible,
  setIsProviderMapVisible: externalSetIsProviderMapVisible,
  providerSearchParams: externalProviderSearchParams,
  handleProviderSearch: externalHandleProviderSearch,
}) => {
  // State management
  const [isDeepThinking, setIsDeepThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState('clinical-reviews');
  const [activeCareJourney, setActiveCareJourney] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sarahStatus, setSarahStatus] = useState<'online' | 'busy' | 'offline'>('online');
  const [activeMode, setActiveMode] = useState<ModeType>('default');
  const [isProviderSearchModalOpen, setIsProviderSearchModalOpen] = useState(false);
  const [isProviderMapVisible, setIsProviderMapVisible] = useState(false);
  const [isCarePlanFormVisible, setIsCarePlanFormVisible] = useState(false);
  const [providerSearchParams, setProviderSearchParams] = useState<ProviderSearchParams>({
    searchType: 'specialty',
    specialty: 'primary-care',
    postalCode: '84101',
    enumerationType: 'ind',
    limit: 20
  });
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  
  // Mock care journeys data
  const careJourneys: CareJourney[] = [
    {
      id: 'diabetes-management',
      name: 'Diabetes Management',
      type: 'chronic',
      status: 'active',
      reviews: [
        {
          id: 'insulin-auth',
          type: 'prior-auth',
          title: 'Insulin Pump Authorization',
          status: 'pending',
          date: '2025-03-19'
        },
        {
          id: 'endocrinologist-ref',
          type: 'referral',
          title: 'Endocrinologist Referral',
          status: 'approved',
          date: '2025-03-15'
        }
      ]
    },
    {
      id: 'cardiac-care',
      name: 'Cardiac Care',
      type: 'acute',
      status: 'active',
      reviews: [
        {
          id: 'stress-test',
          type: 'prior-auth',
          title: 'Stress Test Authorization',
          status: 'in-review',
          date: '2025-03-18'
        }
      ]
    }
  ];

  // Scroll to bottom of messages when needed
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  // Sync external mode state with our dropdown
  useEffect(() => {
    // Only run if we're connected to RonExperience
    if (externalIsDeepThinking !== undefined || externalIsConversationMode !== undefined) {
      if (externalIsDeepThinking) {
        setActiveMode('deep-thinking');
      } else if (externalIsConversationMode) {
        setActiveMode('realtime-audio');
      } else {
        // Reset to default if no special modes are active
        setActiveMode('default');
      }
    }
  }, [externalIsDeepThinking, externalIsConversationMode]);

  // Enhanced categories with icons and counts
  const categories = [
    {
      id: 'clinical-reviews',
      label: 'Clinical Reviews',
      icon: <Stethoscope className="w-[18px] h-[18px]" />,
      count: careJourneys.reduce((acc, journey) => acc + journey.reviews.length, 0),
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: <Clock className="w-[18px] h-[18px]" />,
      count: 3,
    },
    {
      id: 'claims',
      label: 'Claims',
      icon: <FileQuestion className="w-[18px] h-[18px]" />,
      count: 2,
    },
    {
      id: 'care-plans',
      label: 'Care Plans',
      icon: <FileText className="w-[18px] h-[18px]" />,
      count: 1,
    },
    {
      id: 'tickets',
      label: 'Tickets',
      icon: <AlertCircle className="w-[18px] h-[18px]" />,
      count: 4,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <FileText className="w-[18px] h-[18px]" />,
      count: 5,
    }
  ];

  // Handle mode selection from dropdown
  const handleModeChange = (mode: ModeType) => {
    console.log('RonAITab handleModeChange called with mode:', mode);
    
    // Process mode change based on selection
    switch (mode) {
      case 'patient-content':
        setIsCarePlanFormVisible(true);
        setActiveMode('patient-content');
        break;
        
      case 'deep-thinking':
        if (externalToggleDeepThinking) {
          externalToggleDeepThinking();
        } else {
          setIsDeepThinking(!isDeepThinking);
        }
        setActiveMode('deep-thinking');
        break;
        
      case 'realtime-audio':
        if (externalToggleConversationMode) {
          externalToggleConversationMode();
        } else {
          handleSpecialMode('realtime-audio');
        }
        setActiveMode('realtime-audio');
        break;
        
      case 'medication-reconciliation':
        setIsCarePlanFormVisible(true); // Show the care plan form
        setActiveMode('medication-reconciliation');
        break;
        
      case 'provider-search':
        if (externalSetIsProviderSearchModalOpen) {
          externalSetIsProviderSearchModalOpen(true);
        } else {
          setProviderSearchParams({
            searchType: 'specialty',
            specialty: 'primary-care',
            postalCode: '84101',
            enumerationType: 'ind',
            limit: 20
          });
          setIsProviderSearchModalOpen(true);
        }
        setActiveMode('provider-search');
        break;
        
      default:
        setActiveMode('default');
        break;
    }

    // If external mode handler exists, call it after our internal state is updated
    if (onModeChange) {
      onModeChange(mode);
    }
  };
  
  // Enhanced message handling
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;
    
    setIsProcessing(true);
    try {
      // Message handling logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setCurrentMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle special modes that need processing
  const handleSpecialMode = (mode: string) => {
    console.log(`Processing special mode: ${mode}`);
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      
      // Additional mode-specific logic if needed
    }, 1000);
  };
  
  // Handle provider search submission
  const handleProviderSearch = (searchParams: ProviderSearchParams) => {
    console.log('Provider search params:', searchParams);
    
    // Use external handler if available
    if (externalHandleProviderSearch) {
      externalHandleProviderSearch(searchParams);
      return;
    }
    
    // Create search message based on search type
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
    
    // CRITICAL: Store search parameters first
    setProviderSearchParams(searchParams);
    
    // CRITICAL: Make map visible immediately
    setIsProviderMapVisible(true);
    
    // Close the modal immediately
    setIsProviderSearchModalOpen(false);
    
    // Then handle the conversation message if needed
    if (externalSetCurrentMessage) {
      externalSetCurrentMessage(searchMessage);
      
      if (externalHandleSubmit) {
        setTimeout(() => {
          try {
            const formEvent = new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent<HTMLFormElement>;
            externalHandleSubmit(formEvent);
          } catch (err) {
            console.error('Error submitting form:', err);
          }
        }, 500);
      }
    } else {
      // Use internal state when not connected to RonExperience
      setCurrentMessage(searchMessage);
      
      // Local handling is already done by showing the map
    }
    
    // Debug log to confirm the process completed
    console.log('Provider search initiated with params:', searchParams);
    console.log('Provider map should now be visible');
  };
  
  // Handle closing the provider map
  const handleCloseProviderMap = () => {
    setIsProviderMapVisible(false);
  };

  const handleCareJourneySelect = (journeyId: string) => {
    setActiveCareJourney(journeyId === activeCareJourney ? null : journeyId);
  };

  return (
    <div className={`flex w-full h-[calc(100vh-65px)] overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 relative ${className}`}>
      {/* Left Panel */}
      <div className="w-[280px] flex-shrink-0 border-r border-indigo-500/30 flex flex-col bg-gradient-to-b from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-sm">
        {/* Sarah AI Contact Section */}
        <div className="p-4 border-b border-indigo-500/30 bg-gray-800/50 relative">
          {/* Decorative elements */}
          <div className="absolute left-0 top-0 w-1/3 h-0.5 bg-gradient-to-r from-indigo-500/80 to-transparent"></div>
          <div className="absolute right-0 bottom-0 w-1/4 h-0.5 bg-gradient-to-l from-teal-500/80 to-transparent"></div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-teal-500/20 border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 shadow-[0_0_5px_rgba(79,70,229,0.5)] ${
                sarahStatus === 'online' ? 'bg-emerald-500' :
                sarahStatus === 'busy' ? 'bg-amber-500' :
                'bg-gray-500'
              }`} />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">Sarah AI</h3>
              <p className="text-xs text-indigo-300/80">Healthcare Assistant</p>
            </div>
            <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-indigo-500/20 transition-colors relative group">
              <MessageSquare className="w-4 h-4" />
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>
        </div>

        {/* Enhanced Categories */}
        <div className="flex-1 overflow-y-auto">
          {categories.map(category => (
            <div key={category.id} className="border-b border-gray-700">
              <button
                onClick={() => setActiveCategory(category.id)}
                className={`w-full px-4 py-3 flex items-center justify-between transition-all duration-200 relative group ${
                  activeCategory === category.id 
                    ? 'bg-indigo-600/20 border-l-2 border-indigo-500' 
                    : 'hover:bg-indigo-600/10 border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md transition-colors duration-200 ${
                    activeCategory === category.id 
                      ? 'bg-indigo-500/20 text-indigo-400' 
                      : 'text-gray-400 group-hover:text-indigo-400'
                  }`}>
                    {category.icon}
                  </div>
                  <span className={`text-sm transition-colors duration-200 ${
                    activeCategory === category.id ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  }`}>{category.label}</span>
                  {category.count > 0 && (
                    <span className={`px-1.5 py-0.5 text-xs rounded-full transition-colors duration-200 ${
                      activeCategory === category.id 
                        ? 'bg-indigo-500/20 text-indigo-400' 
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {category.count}
                    </span>
                  )}
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${
                  activeCategory === category.id ? 'rotate-90' : ''
                }`} />
              </button>
              
              {/* Care Journey Submenu for Clinical Reviews */}
              {activeCategory === 'clinical-reviews' && category.id === 'clinical-reviews' && (
                <div className="bg-black/20">
                  {careJourneys.map(journey => (
                    <div key={journey.id} className="px-2">
                      <button
                        onClick={() => handleCareJourneySelect(journey.id)}
                        className={`w-full px-3 py-2.5 flex items-center justify-between text-sm transition-colors ${
                          activeCareJourney === journey.id ? 'bg-white/10' : 'hover:bg-white/5'
                        }`}
                      >
                        <span className="text-gray-100">{journey.name}</span>
                        <span className="px-1.5 py-0.5 text-xs bg-white/10 rounded-full text-gray-400">
                          {journey.reviews.length}
                        </span>
                      </button>
                      
                      {/* Reviews under Care Journey */}
                      {activeCareJourney === journey.id && (
                        <div className="p-2 space-y-2">
                          {journey.reviews.map(review => (
                            <div key={review.id} className="p-3 bg-white/5 rounded-lg">
                              <div className="text-sm text-gray-100 mb-1">
                                {review.title}
                              </div>
                              <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                review.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                                review.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {review.status}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-900/90 via-gray-800/90 to-gray-900/90 min-w-0 backdrop-blur-sm">
        {/* Debug output for CareFormWrapper visibility */}
        {isCarePlanFormVisible !== undefined && null}
        
        {/* Enhanced Header with Logo */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={banner} alt="RonAI Banner" className="h-8 object-contain" />
          </div>
          <div className="flex items-center gap-3">
            {isProcessing && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Message List */}
        <div 
          className="flex-1 overflow-y-auto p-6 min-h-0"
          ref={externalMessagesContainerRef || undefined}
        >
          {/* Render messages from RonExperience if available */}
          {externalMessages && externalRenderMessage ? (
            externalMessages.map((msg, idx) => externalRenderMessage(msg, idx))
          ) : (
            // Placeholder for standalone mode
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-400">No messages yet</p>
            </div>
          )}
          <div ref={externalMessagesEndRef || messagesEndRef} />
        </div>

        {/* Enhanced Input Area */}
        <div className="p-4 border-t border-indigo-500/30 bg-gray-800/30">
          {/* Mode Dropdown replacing action buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <ModeDropdown
              activeMode={externalActiveMode || activeMode}
              onChange={handleModeChange}
              isDisabled={externalIsLoading || isProcessing}
            />
          </div>

          {/* Enhanced Input Form */}
          <form 
            onSubmit={externalHandleSubmit || handleSendMessage} 
            className="relative"
          >
            <div className="bg-gray-900/90 border border-indigo-500/30 rounded-xl transition-all duration-200
              focus-within:border-indigo-400/50 focus-within:shadow-[0_0_10px_rgba(79,70,229,0.4)]
              backdrop-blur-sm">
              <div className="flex items-center gap-2 p-2">
                <button
                  type="button"
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-indigo-500/20 transition-colors 
                    disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                  disabled={externalIsLoading || isProcessing}
                >
                  <Paperclip className="w-[18px] h-[18px]" />
                </button>
                
                <input
                  ref={messageInputRef}
                  type="text"
                  value={externalCurrentMessage !== undefined ? externalCurrentMessage : currentMessage}
                  onChange={(e) => {
                    if (externalSetCurrentMessage) {
                      externalSetCurrentMessage(e.target.value);
                    } else {
                      setCurrentMessage(e.target.value);
                    }
                  }}
                  className="flex-1 bg-transparent border-none p-2 text-sm text-white placeholder-gray-500 focus:outline-none"
                  placeholder="Message Ron AI..."
                  disabled={externalIsLoading || isProcessing}
                />

                <button
                  type="button"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-2 rounded-lg transition-all duration-200 disabled:opacity-50 ${
                    isRecording 
                      ? 'text-indigo-400 bg-indigo-500/20 shadow-[0_0_10px_rgba(79,70,229,0.4)]' 
                      : 'text-gray-400 hover:text-white hover:bg-indigo-500/20'
                  }`}
                  disabled={externalIsLoading || isProcessing}
                >
                  <Mic className="w-[18px] h-[18px]" />
                </button>

                <button
                  type="submit"
                  disabled={
                    (externalCurrentMessage !== undefined ? !externalCurrentMessage.trim() : !currentMessage.trim()) || 
                    externalIsLoading || 
                    isProcessing
                  }
                  className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white 
                    hover:shadow-[0_0_15px_rgba(79,70,229,0.5)] hover:brightness-110 
                    transition-all duration-200 disabled:opacity-50 disabled:hover:brightness-100 disabled:hover:shadow-none"
                >
                  <Send className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Patient Content Form (Care Plan) */}
      {isCarePlanFormVisible && (
        <ErrorBoundary>
          <CareFormWrapper 
            isOpen={isCarePlanFormVisible} 
            onClose={() => setIsCarePlanFormVisible(false)}
            initialMode={activeMode === 'medication-reconciliation' ? 'medication-reconciliation' : 'patient-content'}
          />
        </ErrorBoundary>
      )}
      
      {/* Provider Search Modal - conditionally render when state is true */}
      {!externalIsProviderSearchModalOpen && isProviderSearchModalOpen && (
        <ProviderSearchModal
          isOpen={isProviderSearchModalOpen}
          onClose={() => setIsProviderSearchModalOpen(false)}
          onSearch={handleProviderSearch}
        />
      )}
      
      {/* Provider Map Preview - conditionally render when state is true */}
      {!externalIsProviderMapVisible && isProviderMapVisible && (
        <ProviderMapPreview 
          searchParams={providerSearchParams}
          isVisible={isProviderMapVisible}
          onClose={() => setIsProviderMapVisible(false)}
        />
      )}

      {/* Conditionally render FDA Accordion Panel */}
      {externalFdaAccordionData && (
        <FDAAccordion 
          data={externalFdaAccordionData} 
          onClose={() => externalSetFdaAccordionData && externalSetFdaAccordionData(null)} 
        />
      )}
    </div>
  );
};

export default RonAITab;
