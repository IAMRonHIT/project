import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Bot, Send, Mic, Paperclip, X, ChevronRight, ChevronDown, Brain, Phone, MessageSquare, Eye, FileText } from 'lucide-react';
import CarePlanPreview from './CarePlanPreview';
import realtimeAudioService, { ConnectionState } from '../../services/realtimeAudioService';
import { generatePatientContent } from '../../services/patientContentService';
import './audioVisualization.css';

// Sample care plan code for demonstration
const sampleCarePlanCode = `
const CarePlan = () => {
  return (
    <div className="font-sans max-w-full text-gray-800">
      <header className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold text-white">Diabetes Management Care Plan</h1>
        <p className="text-white opacity-90">Patient: Sarah Johnson</p>
      </header>
      
      <div className="p-6 bg-white rounded-b-lg shadow-md">
        {/* Assessment */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-teal-700 border-b border-teal-200 pb-2 mb-3">
            Assessment
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Blood glucose consistently elevated (HbA1c: 8.2%)</li>
            <li>Reports fatigue and increased thirst</li>
            <li>Currently on metformin 500mg twice daily</li>
            <li>Diet includes frequent processed foods</li>
            <li>Limited physical activity (sedentary job)</li>
            <li>Family history of type 2 diabetes (mother)</li>
          </ul>
        </section>
        
        {/* Diagnosis */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-teal-700 border-b border-teal-200 pb-2 mb-3">
            Diagnosis
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Uncontrolled Type 2 Diabetes Mellitus</li>
            <li>Risk for diabetic complications</li>
            <li>Knowledge deficit regarding diabetic self-management</li>
            <li>Nutritional imbalance related to poor dietary choices</li>
          </ul>
        </section>
        
        {/* Planning */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-teal-700 border-b border-teal-200 pb-2 mb-3">
            Planning
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-teal-600">Short-term Goals (1-2 weeks)</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Patient will monitor blood glucose levels twice daily</li>
                <li>Patient will maintain food diary for 7 days</li>
                <li>Patient will take medications as prescribed</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-teal-600">Long-term Goals (3-6 months)</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Reduce HbA1c to below 7.0%</li>
                <li>Increase physical activity to 30 minutes, 5 days per week</li>
                <li>Demonstrate proper self-management techniques</li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* Implementation */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-teal-700 border-b border-teal-200 pb-2 mb-3">
            Implementation
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-teal-600">Medication Management</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Continue metformin 500mg twice daily with meals</li>
                <li>Educate on medication purpose, timing, and side effects</li>
                <li>Provide pill organizer and medication schedule</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-teal-600">Dietary Interventions</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Referral to dietitian for personalized meal planning</li>
                <li>Education on carbohydrate counting and portion control</li>
                <li>Provide resources for diabetic-friendly recipes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-teal-600">Activity Plan</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Begin with 10-minute walks after meals</li>
                <li>Gradually increase duration and intensity</li>
                <li>Provide resources for chair exercises for office breaks</li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* Evaluation */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-teal-700 border-b border-teal-200 pb-2 mb-3">
            Evaluation
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-teal-600">Monitoring Schedule</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Weekly phone check-ins for first month</li>
                <li>Biweekly in-person visits for three months</li>
                <li>HbA1c testing at 3 months and 6 months</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-teal-600">Success Indicators</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Blood glucose readings within target range (80-130 mg/dL before meals)</li>
                <li>Consistent medication adherence</li>
                <li>Improved energy levels and reduced symptoms</li>
                <li>Demonstrated knowledge of self-management techniques</li>
              </ul>
            </div>
          </div>
        </section>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Care Plan Created: March 10, 2025 | Next Review: April 10, 2025
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Care Coordinator: Dr. Emily Chen | Contact: 555-123-4567
          </p>
        </div>
      </div>
    </div>
  );
};
`;

// Add type definitions for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
  }
}

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
  const [isSpeechToTextRecording, setIsSpeechToTextRecording] = useState(false);
  const [isRealtimeAudioActive, setIsRealtimeAudioActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [audioConnectionState, setAudioConnectionState] = useState<ConnectionState>('disconnected');
  const [transcript, setTranscript] = useState('');
  const [events, setEvents] = useState<any[]>([]);  
  const audioAnimationRef = useRef<HTMLDivElement>(null);
  const [localIsDeepThinking, setLocalIsDeepThinking] = useState(false);
  const [localIsConversationMode, setLocalIsConversationMode] = useState(false);
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [audioLevels, setAudioLevels] = useState<number[]>([0.1, 0.2, 0.5, 0.6, 0.4, 0.3, 0.5, 0.2, 0.4, 0.3]);
  const [showCarePlanPreview, setShowCarePlanPreview] = useState(false);
  const [carePlanCode, setCarePlanCode] = useState<string>('');
  const [isPatientContentMode, setIsPatientContentMode] = useState(false);
  const [isGrokResponsePending, setIsGrokResponsePending] = useState(false);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastAudioActivityRef = useRef<number | null>(null);
  const visRef = useRef<HTMLDivElement | null>(null);
  
  const isDeepThinking = propIsDeepThinking !== undefined ? propIsDeepThinking : localIsDeepThinking;
  const isConversationMode = propIsConversationMode !== undefined ? propIsConversationMode : localIsConversationMode;
  
  // State for speech-to-text functionality
  const [isSpeechToTextActive, setIsSpeechToTextActive] = useState(false);
  const recognitionRef = useRef<any>(null);

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
      if (isSpeechToTextRecording) {
        setIsSpeechToTextRecording(false);
      }
    }
  };
  
  // Toggle local speech-to-text (using Web Speech API, not OpenAI)
  const toggleSpeechToText = () => {
    if (isSpeechToTextActive) {
      // Stop recognition if it's active
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsSpeechToTextActive(false);
      setTranscript('');
    } else {
      // Start speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error('Speech recognition not supported');
        return;
      }
      
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          setIsSpeechToTextActive(true);
          setTranscript('');
        };
        
        recognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          if (finalTranscript) {
            const trimmedText = finalTranscript.trim();
            setCurrentMessage(currentMessage + ' ' + trimmedText);
          }
          setTranscript(interimTranscript);
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsSpeechToTextActive(false);
        };
        
        recognition.onend = () => {
          if (isSpeechToTextActive) {
            // If it's still active when it ends, restart it
            recognition.start();
          }
        };
        
        recognitionRef.current = recognition;
        recognition.start();
      } catch (error) {
        console.error('Error initializing speech recognition:', error);
        setIsSpeechToTextActive(false);
      }
    }
  };
  
  // Toggle real-time audio functionality
  const toggleRealtimeAudio = async () => {
    try {
      if (!isRealtimeAudioActive) {
        setIsConnecting(true);
        
        // Step 1: Create the session
        await realtimeAudioService.startSession();
        
        // Step 2: Set up event handlers
        realtimeAudioService.onConnectionStateChange = (state) => {
          setAudioConnectionState(state);
          
          // Only set active when fully connected and wait for data channel to be ready
          if (state === 'connected') {
            setIsRealtimeAudioActive(true);
            setIsConnecting(false);
          } else if (state === 'disconnected' || state === 'error') {
            setIsRealtimeAudioActive(false);
            setIsConnecting(false);
          }
        };
        
        realtimeAudioService.onMessage = (message) => {
          setEvents((prev) => [message, ...prev]);
        };
        
        realtimeAudioService.onTranscriptUpdate = (text) => {
          setTranscript(text);
        };
        
        // Step 3: Start recording only when everything is set up and ready
        // This will be triggered by the onConnectionStateChange handler
        realtimeAudioService.onDataChannelOpen = () => {
          // Wait a moment to ensure everything is ready
          setTimeout(() => {
            if (realtimeAudioService.connectionState === 'connected') {
              realtimeAudioService.startRecording();
            }
          }, 500);
        };
      } else {
        // Stop in reverse order
        realtimeAudioService.stopRecording();
        setTimeout(() => {
          realtimeAudioService.stopSession();
          setIsRealtimeAudioActive(false);
        }, 200);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsRealtimeAudioActive(false);
      setIsConnecting(false);
    }
  };
  
  // Setup audio analyzer to detect when model is speaking
  useEffect(() => {
    // Clean up previous animation frame if it exists
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Initialize lastAudioActivityRef if null
    if (lastAudioActivityRef.current === null) {
      lastAudioActivityRef.current = Date.now();
    }

    // Only run analysis when connected and the model might be speaking
    if (audioConnectionState === 'connected' || audioConnectionState === 'speaking') {
      const setupAudioAnalyzer = () => {
        if (!realtimeAudioService.audioElement) return;
        
        // Create audio context if it doesn't exist
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create analyzer node
        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 256; // Higher resolution
        analyzer.smoothingTimeConstant = 0.6; // More responsive
        
        // Connect audio element to analyzer
        try {
          if (realtimeAudioService.audioElement && realtimeAudioService.audioElement.srcObject) {
            const source = audioContext.createMediaStreamSource(
              realtimeAudioService.audioElement.srcObject as MediaStream
            );
            source.connect(analyzer);
            analyzerRef.current = analyzer;
            
            // Start analyzing audio
            const analyzeAudio = () => {
              if (!analyzerRef.current) return;
              
              const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
              analyzerRef.current.getByteFrequencyData(dataArray);
              
              // Check if there's audio activity by calculating average level
              const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
              
              // Update visualization
              if (visRef.current) {
                const bars = visRef.current.querySelectorAll('.audio-bar');
                const barCount = bars.length;
                
                // Map audio data to bar heights
                for (let i = 0; i < barCount; i++) {
                  const index = Math.floor(i * (dataArray.length / barCount));
                  const value = dataArray[index];
                  const height = Math.max(3, (value / 255) * 50); // Min 3px, max 50px
                  
                  if (bars[i]) {
                    (bars[i] as HTMLElement).style.height = `${height}px`;
                  }
                }
              }
              
              // Detect if AI is speaking based on audio levels
              const currentTime = Date.now();
              if (average > 5) { // Threshold for activity
                if (audioConnectionState !== 'speaking') {
                  setAudioConnectionState('speaking');
                }
                lastAudioActivityRef.current = currentTime;
              } else if (audioConnectionState === 'speaking' && 
                         lastAudioActivityRef.current !== null &&
                         currentTime - lastAudioActivityRef.current > 500) {
                // Wait a bit before changing state to avoid flicker
                setAudioConnectionState('connected');
              }
              
              // Continue animation loop
              animationFrameRef.current = requestAnimationFrame(analyzeAudio);
            };
            
            // Start animation loop
            animationFrameRef.current = requestAnimationFrame(analyzeAudio);
          }
        } catch (error) {
          console.error("Error setting up audio analyzer:", error);
        }
      };
      
      // Set a small delay to ensure audio element is ready
      setTimeout(setupAudioAnalyzer, 500);
    }
    
    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioConnectionState]);

  // Monitor messages to detect when model might be speaking
  useEffect(() => {
    if (events.length > 0) {
      const lastEvent = events[0]; // Events are added at the beginning
      if (lastEvent.type === 'audio_started') {
        setIsModelSpeaking(true);
      } else if (lastEvent.type === 'audio_ended') {
        setIsModelSpeaking(false);
      }
    }
  }, [events]);

  // Toggle patient content mode
  const togglePatientContentMode = () => {
    setIsPatientContentMode(!isPatientContentMode);
  };

  // Modify the handleSubmit function to handle routing to Grok
  const originalHandleSubmit = handleSubmit;
  
  // Override handleSubmit prop with our custom implementation
  const customHandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMessage.trim()) return;
    
    if (isPatientContentMode) {
      // Handle sending to Grok
      try {
        setIsGrokResponsePending(true);
        
        // Send message to Grok via patientContentService
        const response = await generatePatientContent({
          prompt: currentMessage,
          patientInfo: {
            name: "Sarah Johnson",
            age: 42,
            conditions: ["Type 2 Diabetes", "Hypertension"],
            medications: ["Metformin", "Lisinopril"]
          },
          contentType: 'care-plan'
        });
        
        // Set the response code and show the preview
        setCarePlanCode(response);
        setShowCarePlanPreview(true);
        setIsGrokResponsePending(false);
        setCurrentMessage('');
        
      } catch (error) {
        console.error('Error getting response from Grok:', error);
        setIsGrokResponsePending(false);
      }
    } else {
      // Use original OpenAI handling
      originalHandleSubmit(e);
    }
  };

  return (
    <div className={darkMode ? "container dark-mode" : "container light-mode"}>
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-3 h-full flex flex-col overflow-hidden">
          <div className={darkMode ? "sidebar dark-mode-sidebar" : "sidebar light-mode-sidebar"}>
            <div className="p-4 flex-shrink-0">
              <button 
                className="p-2 rounded-full border border-gray-700"
                aria-label="Go back"
                title="Go back"
              >
                <ArrowLeft size={18} />
              </button>
            </div>
            
            <div className="p-8 flex-shrink-0">
              <div className="text-xl font-light mb-1">Sarah Johnson</div>
              <div className="text-sm text-gray-400">SJ-78954</div>
            </div>
            
            <div className="px-6 pt-6 pb-3 flex-shrink-0">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-light">Care Journey</h3>
              </div>
            </div>
            
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
            
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4">
              <div className="pb-4">
                <div className="mb-2">
                  <div 
                    className="flex items-center justify-between py-2 px-2 cursor-pointer mb-2 border-b border-teal-400 shadow-sm"
                  >
                    <div className="flex items-center">
                      <ChevronRight size={16} className="mr-2 text-gray-400" />
                      <span className="font-light text-sm">Prior Authorization</span>
                    </div>
                    <span className="text-xs text-gray-400">2</span>
                  </div>
                  
                  <div className="pt-2 pb-1 space-y-2">
                    <div 
                      className="py-3 px-2 cursor-pointer transition-all border-l border-transparent hover:border-l-2 hover:border-l-gray-500"
                    >
                      <div className="font-light mb-1 text-sm text-teal-400">Continuous Glucose Monitor Prior Auth</div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-xs text-gray-400">CASE-7851</div>
                        <div className="text-xs text-gray-400">Feb 20, 2025</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-400">Pending Review</div>
                      </div>
                    </div>
                    
                    <div 
                      className="py-3 px-2 cursor-pointer transition-all border-l border-transparent hover:border-l-2 hover:border-l-gray-500"
                    >
                      <div className="font-light mb-1 text-sm text-teal-400">Medication Prior Auth - Metformin</div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-xs text-gray-400">CASE-7688</div>
                        <div className="text-xs text-gray-400">Jan 18, 2025</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-400">Approved</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div 
                    className="flex items-center justify-between py-2 px-2 cursor-pointer mb-2 border-b border-teal-400 shadow-sm"
                  >
                    <div className="flex items-center">
                      <ChevronRight size={16} className="mr-2 text-gray-400" />
                      <span className="font-light text-sm">Referral</span>
                    </div>
                    <span className="text-xs text-gray-400">2</span>
                  </div>
                  
                  <div className="pt-2 pb-1 space-y-2">
                    <div 
                      className="py-3 px-2 cursor-pointer transition-all border-l border-transparent hover:border-l-2 hover:border-l-gray-500"
                    >
                      <div className="font-light mb-1 text-sm text-teal-400">Endocrinologist Referral</div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-xs text-gray-400">CASE-7838</div>
                        <div className="text-xs text-gray-400">Feb 15, 2025</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-400">Approved</div>
                      </div>
                    </div>
                    
                    <div 
                      className="py-3 px-2 cursor-pointer transition-all border-l border-transparent hover:border-l-2 hover:border-l-gray-500"
                    >
                      <div className="font-light mb-1 text-sm text-teal-400">Lab Tests - Quarterly</div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-xs text-gray-400">CASE-7598</div>
                        <div className="text-xs text-gray-400">Feb 05, 2025</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-400">Approved</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-span-6 h-full flex flex-col overflow-hidden">
          <div className="flex flex-col items-center pt-8 pb-4 flex-shrink-0">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-blue-500 to-teal-400 shadow-lg shadow-teal-400/30">
              <Bot size={32} className="text-gray-900" />
            </div>
            <div className="flex items-center justify-center mb-8">
              <h1 className="text-4xl font-extralight tracking-wider bg-gradient-to-r from-ron-teal-400 to-blue-500 bg-clip-text text-transparent">
                RON AI
              </h1>
            </div>
            
            {/* Audio Visualizer - Fixed position relative to RON AI text */}
            <div 
              ref={audioAnimationRef} 
              className={`flex justify-center space-x-3 mb-5 -mt-4 relative z-10 transition-opacity duration-300 ${
                isModelSpeaking ? 'visualizer-container-active' : ''
              }`}
            >
              {audioLevels.map((level, index) => {
                // Calculate height value dynamically
                const heightValue = isModelSpeaking ? 
                  Math.max(8, Math.min(36, level * 36)) : 
                  (8 + index % 9);
                
                // Calculate opacity class
                const opacityValue = isModelSpeaking ? 
                  Math.min(1, 0.5 + level * 0.5) : 
                  (0.5 + (index % 10) * 0.05);
                
                // Convert opacity to Tailwind opacity classes (0-100 in steps of 5)
                const opacityClass = `opacity-${Math.round(opacityValue * 100 / 5) * 5}`;
                
                // Calculate scale effect
                const scaleClass = isModelSpeaking ? 
                  `scale-y-${Math.round(10 + level * 7)}0` : 
                  'scale-y-100';
                
                return (
                  <div 
                    key={index}
                    className={`w-2 rounded-full bg-gradient-to-t from-ron-teal-400 to-blue-500 
                      transition-all duration-150 ease-in-out transform audio-bar 
                      h-[${heightValue}px]
                      ${isModelSpeaking ? 'glow-effect active' : ''}
                      ${opacityClass} ${scaleClass}`}
                  ></div>
                );
              })}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col px-8 overflow-y-auto" ref={messagesContainerRef}>
            <div className="flex justify-center my-8">
              <div className={darkMode ? "card dark-mode-card" : "card light-mode-card"}>
                <p className="text-gray-400 text-sm font-light">
                  I'm ready to assist you with any questions or tasks.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 py-4">
              {messages.map((msg, idx) => renderMessage(msg, idx))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="p-6 flex-shrink-0 border-t border-gray-800 bg-gray-900">
            <div className={darkMode ? "card dark-mode-card" : "card light-mode-card"}>
              <div className="flex items-center">
                <button 
                  className="p-3 rounded-full hover:bg-gray-700"
                  aria-label="Attach file"
                  title="Attach file"
                >
                  <Paperclip size={20} className="text-gray-400" />
                </button>
                
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      customHandleSubmit(e);
                    }
                  }}
                  placeholder="Ask Ron AI a question..."
                  disabled={isLoading}
                  className="bg-transparent border-none focus:outline-none flex-1 px-3 py-2 text-sm"
                />
                
                <button 
                  className="p-3 rounded-full bg-teal-500 ml-1 opacity-90 hover:opacity-100 transition-opacity"
                  onClick={(e) => customHandleSubmit(e)}
                  disabled={isLoading || !currentMessage.trim()}
                  aria-label="Send message"
                  title="Send message"
                >
                  <Send size={20} className="text-gray-900" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex space-x-2">
                <button
                  onClick={toggleDeepThinking}
                  className={`px-3 py-1.5 rounded-md flex items-center transition-colors ${
                    isDeepThinking ? 'bg-amber-700 text-amber-200' : 'text-gray-400 hover:bg-gray-800 hover:text-amber-400'
                  }`}
                  aria-label={isDeepThinking ? "Turn off deep thinking mode" : "Turn on deep thinking mode"}
                  title={isDeepThinking ? "Turn off deep thinking mode" : "Turn on deep thinking mode"}
                >
                  <Brain size={16} />
                  <span className="ml-1.5 text-xs font-medium">Deep Thinking</span>
                </button>
                
                <button
                  onClick={toggleRealtimeAudio}
                  className={`px-3 py-1.5 rounded-md flex items-center transition-colors ${
                    isRealtimeAudioActive ? 'bg-green-700 text-green-200' : (isConnecting ? 'bg-yellow-700 text-yellow-200' : 'text-gray-400 hover:bg-gray-800 hover:text-green-400')
                  }`}
                  disabled={isLoading}
                  aria-label={isRealtimeAudioActive ? "Turn off real time audio" : "Turn on real time audio"}
                  title={isRealtimeAudioActive ? "Turn off real time audio" : "Turn on real time audio"}
                >
                  <Mic size={16} />
                  <span className="ml-1.5 text-xs font-medium">Real Time</span>
                  {isConnecting && 
                    <div className="flex space-x-1 ml-1.5">
                      <span className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></span>
                      <span className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-75"></span>
                      <span className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-150"></span>
                    </div>
                  }
                </button>
                
                <button
                  onClick={toggleSpeechToText}
                  className={`px-3 py-1.5 rounded-md flex items-center transition-colors ${
                    isSpeechToTextActive ? 'bg-purple-700 text-purple-200' : 'text-gray-400 hover:bg-gray-800 hover:text-purple-400'
                  }`}
                  aria-label={isSpeechToTextActive ? "Turn off speech to text" : "Turn on speech to text"}
                  title={isSpeechToTextActive ? "Turn off speech to text" : "Turn on speech to text"}
                >
                  <MessageSquare size={16} />
                  <span className="ml-1.5 text-xs font-medium">Speech to Text</span>
                </button>
                
                <button
                  onClick={togglePatientContentMode}
                  className={`px-3 py-1.5 rounded-md flex items-center transition-colors ${
                    isPatientContentMode ? 'bg-blue-700 text-blue-200' : 'text-gray-400 hover:bg-gray-800 hover:text-blue-400'
                  }`}
                  aria-label={isPatientContentMode ? "Turn off patient content mode" : "Turn on patient content mode"}
                  title={isPatientContentMode ? "Turn off patient content mode" : "Turn on patient content mode"}
                >
                  <FileText size={16} />
                  <span className="ml-1.5 text-xs font-medium">Patient Content</span>
                  {isGrokResponsePending && 
                    <div className="flex space-x-1 ml-1.5">
                      <span className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></span>
                      <span className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-75"></span>
                      <span className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-150"></span>
                    </div>
                  }
                </button>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-2 bg-teal-400 shadow-glow-teal"></div>
                <span className="text-xs text-gray-400">AI System Operational</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-span-3 h-full border-l border-gray-700 flex flex-col overflow-hidden">
          {showCarePlanPreview ? (
            <CarePlanPreview 
              code={carePlanCode} 
              onClose={() => setShowCarePlanPreview(false)} 
              isVisible={showCarePlanPreview}
            />
          ) : (
            <div className="h-full flex flex-col p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h3 className="text-lg font-light">Case Context</h3>
                
                <button
                  onClick={() => {
                    // Set a sample care plan code for demonstration
                    setCarePlanCode(sampleCarePlanCode);
                    setShowCarePlanPreview(true);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-teal-500 bg-opacity-20 text-teal-400 hover:bg-opacity-30 transition-colors"
                  title="Preview Care Plan"
                >
                  <Eye size={16} />
                  <span className="text-xs font-medium">Preview Care Plan</span>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-sm font-light">
                    Select a case to view context
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-gray-700 flex-shrink-0">
                <div className="text-xs text-gray-400 flex items-center">
                  <div className="w-2 h-2 rounded-full mr-2 bg-ron-teal-400 shadow-glow-hover"></div>
                  <span>AI System Operational</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RonAiTab;
