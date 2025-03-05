import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Bot, Send, Mic, Paperclip, X, ChevronRight, ChevronDown, Brain, Phone } from 'lucide-react';

interface RonAiTabProps {
  messages: any[];
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  handleSubmit: (e: any) => void;
  isLoading: boolean;
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  renderMessage: (msg: any, idx: number) => React.ReactNode;
  isDeepThinking?: boolean;
  isConversationMode?: boolean;
  toggleDeepThinking?: () => void;
  toggleConversationMode?: () => void;
}

const RonAiTab: React.FC<RonAiTabProps> = ({
  messages,
  currentMessage,
  setCurrentMessage,
  handleSubmit,
  isLoading,
  messagesContainerRef,
  messagesEndRef,
  renderMessage,
  isDeepThinking: propIsDeepThinking,
  isConversationMode: propIsConversationMode,
  toggleDeepThinking: propToggleDeepThinking,
  toggleConversationMode: propToggleConversationMode
}) => {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  // Use props if provided, otherwise use local state
  const [localIsDeepThinking, setLocalIsDeepThinking] = useState(false);
  const [localIsConversationMode, setLocalIsConversationMode] = useState(false);
  
  // Use props if provided, otherwise use local state
  const isDeepThinking = propIsDeepThinking !== undefined ? propIsDeepThinking : localIsDeepThinking;
  const isConversationMode = propIsConversationMode !== undefined ? propIsConversationMode : localIsConversationMode;
  const [groupBy, setGroupBy] = useState('category'); // 'category' or 'status'
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  
  // Status colors exactly matching the screenshot
  const statusColors = {
    "Pending Review": "#00E5C7", // Bright teal/mint
    "Approved": "#00FF00",      // Bright green
    "Completed": "#00FF00",     // Bright green (same as approved)
    "Denied": "#FF007A",        // Bright pink
    "Scheduled": "#00A3FF",     // Bright blue
    "Pending Info": "#FFBB00"   // Bright amber
  };
  
  // Sample cases/reviews data - for a single patient (Sarah Johnson)
  const casesData = [
    { 
      id: "CASE-7851", 
      title: "Continuous Glucose Monitor Prior Auth",
      category: "Prior Authorization", 
      status: "Pending Review",
      date: "Feb 20, 2025"
    },
    { 
      id: "CASE-7838", 
      title: "Endocrinologist Referral",
      category: "Referral", 
      status: "Approved",
      date: "Feb 15, 2025"
    },
    { 
      id: "CASE-7742", 
      title: "Diabetes Education Program",
      category: "Care Planning", 
      status: "Completed",
      date: "Jan 30, 2025"
    },
    { 
      id: "CASE-7705", 
      title: "Medical Supplies Claim",
      category: "Claim", 
      status: "Denied",
      date: "Jan 22, 2025"
    },
    { 
      id: "CASE-7688", 
      title: "Medication Prior Auth - Metformin",
      category: "Prior Authorization", 
      status: "Approved",
      date: "Jan 18, 2025"
    },
    { 
      id: "CASE-7650", 
      title: "Annual Eye Exam Referral",
      category: "Referral", 
      status: "Scheduled",
      date: "Mar 10, 2025"
    },
    { 
      id: "CASE-7630", 
      title: "Nutrition Consultation",
      category: "Care Planning", 
      status: "Completed",
      date: "Jan 12, 2025"
    },
    { 
      id: "CASE-7612", 
      title: "Insulin Pump Coverage",
      category: "Prior Authorization", 
      status: "Pending Info",
      date: "Feb 28, 2025"
    },
    { 
      id: "CASE-7598", 
      title: "Lab Tests - Quarterly",
      category: "Referral", 
      status: "Approved",
      date: "Feb 05, 2025"
    }
  ];
  
  // Patient info
  const patientInfo = {
    name: "Sarah Johnson",
    id: "SJ-78954",
    primaryDiagnosis: "Type 2 Diabetes (E11.9)",
    insurance: "BlueCross Health Plan (PPO)"
  };
  
  // Container and theme classes
  const containerClass = darkMode 
    ? "container dark-mode" 
    : "container light-mode";
  
  const cardClass = darkMode
    ? "card dark-mode-card"
    : "card light-mode-card";
  
  const sidebarClass = darkMode
    ? "sidebar dark-mode-sidebar"
    : "sidebar light-mode-sidebar";
    
  const accentColor = darkMode ? "dark-mode-accent" : "light-mode-accent";
  
  // Group cases by category or status
  const getGroupedCases = () => {
    const groupedCases: Record<string, typeof casesData> = {};
    
    casesData.forEach(caseItem => {
      const groupKey = groupBy === 'category' ? caseItem.category : caseItem.status;
      
      if (!groupedCases[groupKey]) {
        groupedCases[groupKey] = [];
      }
      
      groupedCases[groupKey].push(caseItem);
    });
    
    return groupedCases;
  };
  
  // Toggle a group's expanded state
  const toggleGroup = (groupName: string) => {
    if (expandedGroups.includes(groupName)) {
      setExpandedGroups(expandedGroups.filter(g => g !== groupName));
    } else {
      setExpandedGroups([...expandedGroups, groupName]);
    }
  };
  
  // Toggle recording state
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (isConversationMode) {
      if (propToggleConversationMode) {
        propToggleConversationMode(); // This will toggle it, so we need to ensure it's currently true
      } else {
        setLocalIsConversationMode(false);
      }
    }
  };
  
  // Toggle deep thinking mode - use prop function if provided
  const toggleDeepThinking = () => {
    if (propToggleDeepThinking) {
      propToggleDeepThinking();
    } else {
      setLocalIsDeepThinking(!localIsDeepThinking);
    }
  };
  
  // Toggle conversation mode - use prop function if provided
  const toggleConversationMode = () => {
    if (propToggleConversationMode) {
      propToggleConversationMode();
    } else {
      setLocalIsConversationMode(!localIsConversationMode);
      if (isRecording) {
        setIsRecording(false);
      }
    }
  };
  
  // Initialize with all groups collapsed
  useEffect(() => {
    setExpandedGroups([]); // Start with all accordions closed
  }, [groupBy]);
  
  // Add custom scrollbar styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: ${darkMode ? 'rgba(31, 41, 55, 0.3)' : 'rgba(243, 244, 246, 0.3)'};
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: ${darkMode ? 'rgba(75, 85, 99, 0.6)' : 'rgba(209, 213, 219, 0.6)'};
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: ${darkMode ? 'rgba(107, 114, 128, 0.6)' : 'rgba(156, 163, 175, 0.6)'};
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [darkMode]);
  
  // Function to render status badges exactly matching the screenshot
  const renderStatusIndicator = (status: string) => {
    // Map status to Tailwind color classes based on status
    let colorClass = '';
    switch(status) {
      case 'Completed':
        colorClass = 'text-ron-success border-ron-success';
        break;
      case 'In Progress':
        colorClass = 'text-ron-teal-400 border-ron-teal-400';
        break;
      case 'Pending':
        colorClass = 'text-ron-warning border-ron-warning';
        break;
      case 'Canceled':
        colorClass = 'text-ron-error border-ron-error';
        break;
      default:
        colorClass = 'text-gray-400 border-gray-400';
    }
    
    return (
      <div className="inline-flex items-center mt-1">
        <div className={`bg-black bg-opacity-20 px-3 py-1 rounded-md inline-block min-w-[120px] text-center shadow border ${colorClass}`}>
          <span className="text-xs">{status}</span>
        </div>
      </div>
    );
  };
  
  // AudioWave animation for title - with teal accents to match UI
  const AudioWaveTitle = () => {
    // Using predefined heights for audio wave bars with Tailwind classes
    const heightClasses = [
      'h-2', 'h-3', 'h-5', 'h-6', 'h-4', 'h-3', 'h-5', 'h-2', 'h-4', 'h-3'
    ];
    
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="relative">
          <h1 className="text-4xl font-extralight tracking-wider bg-gradient-to-r from-ron-teal-400 to-blue-500 bg-clip-text text-transparent">
            RON AI
          </h1>
          <div className="absolute -bottom-6 left-0 right-0 flex justify-center space-x-1">
            {heightClasses.map((heightClass, i) => (
              <div 
                key={i}
                className={`w-0.5 rounded-full bg-gradient-to-t from-ron-teal-400 to-blue-500 ${heightClass} opacity-${Math.floor((i % 5) + 3) * 10}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value);
  };

  // Handle key press in input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={containerClass}>
      {/* Main three-column layout with strict height containment */}
      <div className="grid grid-cols-12 h-full">
        {/* Left column - Cases list with proper containment */}
        <div className="col-span-3 h-full flex flex-col overflow-hidden">
          <div className={sidebarClass}>
            {/* Back button */}
            <div className="p-4 flex-shrink-0">
              <button 
                className="p-2 rounded-full border border-gray-700"
                aria-label="Go back"
                title="Go back"
              >
                <ArrowLeft size={18} />
              </button>
            </div>
            
            {/* Patient header */}
            <div className="p-8 flex-shrink-0">
              <div className="text-xl font-light mb-1">{patientInfo.name}</div>
              <div className="text-sm text-gray-400">{patientInfo.id}</div>
            </div>
            
            {/* Cases header & grouping controls */}
            <div className="px-6 pt-6 pb-3 flex-shrink-0">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-light">Care Journey</h3>
                <div className="flex text-xs">
                  <button 
                    className={`px-3 py-1 rounded-l-full border border-r-0 border-gray-600 ${groupBy === 'category' ? 'bg-gray-700 text-white' : ''}`}
                    onClick={() => setGroupBy('category')}
                  >
                    By Type
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-r-full border border-l-0 border-gray-600 ${groupBy === 'status' ? 'bg-gray-700 text-white' : ''}`}
                    onClick={() => setGroupBy('status')}
                  >
                    By Status
                  </button>
                </div>
              </div>
            </div>
            
            {/* Search - minimal */}
            <div className="px-6 mb-4 flex-shrink-0">
              <div className={`flex items-center rounded-full px-4 py-2 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <Search size={16} className="mr-2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search cases"
                  className="bg-transparent border-none focus:outline-none flex-1 text-sm"
                />
              </div>
            </div>
            
            {/* List content - grouped into accordions */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4">
              <div className="pb-4">
                {Object.entries(getGroupedCases()).map(([groupName, groupCases]) => (
                  <div key={groupName} className="mb-2">
                    {/* Accordion header with glow */}
                    <div 
                      className="flex items-center justify-between py-2 px-2 cursor-pointer mb-2 border-b border-teal-400 shadow-sm"
                      onClick={() => toggleGroup(groupName)}
                    >
                      <div className="flex items-center">
                        {expandedGroups.includes(groupName) ? 
                          <ChevronDown size={16} className="mr-2 text-gray-400" /> : 
                          <ChevronRight size={16} className="mr-2 text-gray-400" />
                        }
                        <span className="font-light text-sm">{groupName}</span>
                      </div>
                      <span className="text-xs text-gray-400">{groupCases.length}</span>
                    </div>
                    
                    {/* Accordion content */}
                    {expandedGroups.includes(groupName) && (
                      <div className="pt-2 pb-1 space-y-2">
                        {groupCases.map((item, index) => {
                          const caseIndex = casesData.findIndex(c => c.id === item.id);
                          return (
                            <div 
                              key={item.id} 
                              className={`py-3 px-2 cursor-pointer transition-all ${
                                selectedCase === caseIndex 
                                  ? 'bg-gray-700 text-white' 
                                  : 'border-l border-transparent hover:border-l-2 hover:border-l-gray-500'
                              }`}
                              onClick={() => setSelectedCase(caseIndex)}
                            >
                              <div className="font-light mb-1 text-sm text-teal-400">{item.title}</div>
                              <div className="flex justify-between items-center mb-1">
                                <div className="text-xs text-gray-400">{item.id}</div>
                                <div className="text-xs text-gray-400">{item.date}</div>
                              </div>
                              <div className="flex justify-between items-center">
                                {groupBy === 'category' ? 
                                  renderStatusIndicator(item.status) : 
                                  <div className="text-xs text-gray-400">{item.category}</div>
                                }
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Middle column - Ron AI interface with strict containment */}
        <div className="col-span-6 h-full flex flex-col overflow-hidden">
          {/* Bot icon and audiowave title at top center */}
          <div className="flex flex-col items-center pt-8 pb-4 flex-shrink-0">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-blue-500 to-teal-400 shadow-lg shadow-teal-400/30">
              <Bot size={32} className="text-gray-900" />
            </div>
            <AudioWaveTitle />
          </div>
          
          {/* Conversation area - with flex-1 to fill available space */}
          <div className="flex-1 flex flex-col px-8 overflow-y-auto" ref={messagesContainerRef}>
            {/* Initial welcome message */}
            {messages.length === 0 && !isLoading && (
              <div className="flex justify-center my-8">
                <div className={cardClass}>
                  <p className="text-gray-400 text-sm font-light">
                    {selectedCase !== null ? (
                      <>I'm ready to help with <span className="font-normal text-white">{casesData[selectedCase].title}</span>.</>
                    ) : (
                      <>I'm ready to assist you with any questions or tasks.</>
                    )}
                    {' '}You can ask me to analyze documentation, suggest next steps, or draft communications.
                  </p>
                </div>
              </div>
            )}
            
            {/* Messages */}
            <div className="space-y-4 py-4">
              {messages.map((msg, idx) => renderMessage(msg, idx))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Enhanced input area with voice and attachment at bottom - fixed height */}
          <div className="p-6 flex-shrink-0">
            <div className={`${cardClass} ${isDeepThinking ? 'border border-purple-500' : isConversationMode ? 'border border-blue-500' : ''}`}>
              <div className="flex items-center">
                {/* Attachment button */}
                <button 
                  className="p-3 rounded-full hover:bg-gray-700"
                  aria-label="Attach file"
                  title="Attach file"
                >
                  <Paperclip size={20} className="text-gray-400" />
                </button>
                
                {/* Main input */}
                <input
                  type="text"
                  value={currentMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedCase === null ? "Ask Ron AI a question..." : "Ask Ron AI about this patient's care journey..."}
                  disabled={isLoading}
                  className="bg-transparent border-none focus:outline-none flex-1 px-3 py-2 text-sm"
                />
                
                {/* Deep Thinking button */}
                <button 
                  className={`p-3 rounded-full hover:bg-gray-700 ${isDeepThinking ? 'bg-purple-700 text-white' : ''}`}
                  onClick={toggleDeepThinking}
                  aria-label={isDeepThinking ? "Disable deep thinking" : "Enable deep thinking"}
                  title={isDeepThinking ? "Disable deep thinking" : "Enable deep thinking"}
                >
                  <Brain size={20} className={isDeepThinking ? "text-white" : "text-gray-400"} />
                </button>
                
                {/* Conversation button */}
                <button 
                  className={`p-3 rounded-full hover:bg-gray-700 ${isConversationMode ? 'bg-blue-600 text-white' : ''}`}
                  onClick={toggleConversationMode}
                  aria-label={isConversationMode ? "End conversation" : "Start conversation"}
                  title={isConversationMode ? "End conversation" : "Start conversation"}
                >
                  <Phone size={20} className={isConversationMode ? "text-white" : "text-gray-400"} />
                </button>
                
                {/* Voice recording button with recording state */}
                <button 
                  className={`p-3 rounded-full ${isRecording ? 'bg-red-500 text-white' : ''}`}
                  onClick={toggleRecording}
                  aria-label={isRecording ? "Stop recording" : "Start voice recording"}
                  title={isRecording ? "Stop recording" : "Start voice recording"}
                >
                  {isRecording ? (
                    <X size={20} className="text-white" />
                  ) : (
                    <Mic size={20} className="text-gray-400" />
                  )}
                </button>
                
                {/* Send button */}
                <button 
                  className="p-3 rounded-full bg-teal-500 ml-1 opacity-90 hover:opacity-100 transition-opacity"
                  onClick={(e) => handleSubmit(e)}
                  disabled={isLoading || !currentMessage.trim()}
                  aria-label="Send message"
                  title="Send message"
                >
                  <Send size={20} className="text-gray-900" />
                </button>
              </div>
            </div>
            
            {/* Mode indicators */}
            <div className="flex items-center justify-center mt-3 space-x-4">
              {isRecording && (
                <div className="flex items-center">
                  <span className="text-sm text-ron-error">Recording...</span>
                </div>
              )}
              {isDeepThinking && (
                <div className="flex items-center">
                  <span className="text-sm text-purple-400">Deep Thinking Mode</span>
                </div>
              )}
              {isConversationMode && (
                <div className="flex items-center">
                  <span className="text-sm text-blue-400">Conversation Mode</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right column - Context panel with strict containment */}
        <div className="col-span-3 h-full border-l border-gray-700 flex flex-col overflow-hidden">
          <div className="h-full flex flex-col p-6 overflow-hidden">
            <h3 className="text-lg font-light mb-6 flex-shrink-0">Case Context</h3>
            
            {/* Context content - scrollable if needed */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {selectedCase === null ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-sm font-light">
                    Select a case to view context
                  </p>
                </div>
              ) : (
                <div className="space-y-6 pb-4">
                  <div>
                    <h4 className="text-sm text-gray-400 mb-2">Case Type</h4>
                    <p className="font-light">{casesData[selectedCase].category}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-400 mb-2">Status</h4>
                    {renderStatusIndicator(casesData[selectedCase].status)}
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-400 mb-2">Patient Information</h4>
                    <div className={cardClass}>
                      <div>
                        <div className="text-xs text-gray-400">Primary Diagnosis</div>
                        <div className="text-sm">{patientInfo.primaryDiagnosis}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Insurance</div>
                        <div className="text-sm">{patientInfo.insurance}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-400 mb-2">AI Assistance</h4>
                    <div className={cardClass}>
                      <div className="text-gray-300">
                        Ready to assist with {casesData[selectedCase].title}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Status indicator - fixed at bottom */}
            <div className="mt-auto pt-4 border-t border-gray-700 flex-shrink-0">
              <div className="text-xs text-gray-400 flex items-center">
                <div className="w-2 h-2 rounded-full mr-2 bg-ron-teal-400 shadow-glow-hover"></div>
                <span>AI System Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RonAiTab;
