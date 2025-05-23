<<<<<<< Updated upstream
import React from 'react';
import RonAIExperience from './RonExperience';

const RonAITab: React.FC = () => {
  return (
    <div className="h-full">
      <RonAIExperience />
=======
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Bot, Send, Mic, Paperclip, X, ChevronRight, ChevronDown, Brain, Phone, MessageSquare } from 'lucide-react';
import realtimeAudioService, { ConnectionState } from '../../services/realtimeAudioService';
import './audioVisualization.css';

// Add type definitions for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
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
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const [userMessage, setUserMessage] = useState<string>('');
  const [userSpeakingTranscript, setUserSpeakingTranscript] = useState('');
  const [modelSpeakingTranscript, setModelSpeakingTranscript] = useState('');
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(10).fill(0).map((_, i) => 0.2 + (i % 10) * 0.08));
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [localIsDeepThinking, setLocalIsDeepThinking] = useState(false);
  const [localIsConversationMode, setLocalIsConversationMode] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isDeepThinking = propIsDeepThinking !== undefined ? propIsDeepThinking : localIsDeepThinking;
  const isConversationMode = propIsConversationMode !== undefined ? propIsConversationMode : localIsConversationMode;

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
    if (isSpeechToTextRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsSpeechToTextRecording(false);
    } else {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          console.error("Speech recognition not supported in this browser");
          return;
        }
        
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
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
            setCurrentMessage(currentMessage + ' ' + finalTranscript.trim());
          }
          setTranscript(interimTranscript);
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsSpeechToTextRecording(false);
        };
        
        recognition.onend = () => {
          if (isSpeechToTextRecording) {
            recognition.start();
          }
        };
        
        recognition.start();
        recognitionRef.current = recognition;
        setIsSpeechToTextRecording(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };
  
  const toggleRealtimeAudio = async () => {
    try {
      if (!isRealtimeAudioActive) {
        setIsConnecting(true);
        
        // Step 1: Create the session
        await realtimeAudioService.startSession();
        
        // Step 2: Set up event handlers
        realtimeAudioService.onConnectionStateChange = (state: ConnectionState) => {
          console.log("Connection state changed:", state);
          setAudioConnectionState(state);
          
          // Automatically set model speaking state based on connection state
          if (state === 'speaking') {
            setIsModelSpeaking(true);
          } else if (state === 'connected' || state === 'disconnected') {
            setIsModelSpeaking(false);
          }
        };

        // Message handler
        realtimeAudioService.onMessage = (message: any) => {
          console.log("Received message:", message);
        };
        
        // Transcript handlers
        realtimeAudioService.onTranscript = (transcript: string, isFinal: boolean) => {
          // Show non-final transcripts in the typing indicator
          setUserSpeakingTranscript(isFinal ? '' : transcript);
          
          // For final transcripts with content, add to the message list
          if (isFinal && transcript.trim()) {
            // Create a message that mimics exactly what's in the messages array
            const newMessage = {
              role: 'user',
              content: transcript
            };
            setLocalMessages(prev => [...prev, newMessage]);
          }
        };
        
        realtimeAudioService.onModelTranscript = (transcript: string) => {
          // Always update the typing indicator
          setModelSpeakingTranscript(transcript);
          
          // Only add messages for meaningful content
          if (transcript.trim()) {
            setLocalMessages(prev => {
              const lastMessage = prev.length > 0 ? prev[prev.length - 1] : null;
              
              // Update existing message if it's from the current model speaking turn
              if (lastMessage && lastMessage.role === 'assistant' && isModelSpeaking) {
                return [
                  ...prev.slice(0, -1),
                  { role: 'assistant', content: transcript }
                ];
              } else {
                // Add new message
                return [
                  ...prev,
                  { role: 'assistant', content: transcript }
                ];
              }
            });
          }
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
  
  const handleRecordingToggle = async () => {
    try {
      await toggleRealtimeAudio();
    } catch (error) {
      console.error('Error toggling recording:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Setup audio analyzer to detect when model is speaking
  useEffect(() => {
    // Clean up previous animation frame if it exists
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Only run analysis when connected and the model might be speaking
    if (audioConnectionState === 'connected' || audioConnectionState === 'speaking') {
      const setupAudioAnalyzer = () => {
        // Create audio context if it doesn't exist
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create analyzer node
        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 256; // Higher resolution
        analyzer.smoothingTimeConstant = 0.6; // More responsive
        
        // Connect audio element to analyzer
        try {
          // Check if there's an audio stream available from the service
          const audioStream = document.querySelector('audio')?.srcObject as MediaStream;
          if (audioStream) {
            const source = audioContext.createMediaStreamSource(audioStream);
            source.connect(analyzer);
            analyzerRef.current = analyzer;
            
            // Start analyzing audio
            const analyzeAudio = () => {
              if (!analyzerRef.current) return;
              
              const data = new Uint8Array(analyzerRef.current.frequencyBinCount);
              analyzerRef.current.getByteFrequencyData(data);
              
              // Calculate average level - focusing on speech frequencies (300-3000 Hz)
              let sum = 0;
              let count = 0;
              const speechLowBin = Math.floor(300 * analyzer.fftSize / audioContext.sampleRate);
              const speechHighBin = Math.floor(3000 * analyzer.fftSize / audioContext.sampleRate);
              
              for (let i = speechLowBin; i < speechHighBin && i < data.length; i++) {
                sum += data[i];
                count++;
              }
              
              const speechAvg = count > 0 ? sum / count : 0;
              
              // Detect if model is speaking based on speech frequency levels
              // Using hysteresis to prevent rapid on/off switching
              if (speechAvg > 15) {
                setIsModelSpeaking(true);
              } else if (speechAvg < 5) {
                // Only turn off if level drops significantly to prevent flicker
                setIsModelSpeaking(false);
              }
              
              // Generate new audio levels based on frequency data
              if (speechAvg > 5) {
                const newLevels = Array.from({ length: 10 }, (_, i) => {
                  // Use different frequency bands for each bar
                  const bandStart = Math.floor(i * data.length / 10);
                  const bandEnd = Math.floor((i + 1) * data.length / 10);
                  let bandSum = 0;
                  
                  for (let j = bandStart; j < bandEnd; j++) {
                    bandSum += data[j];
                  }
                  
                  const bandAvg = (bandEnd - bandStart) > 0 ? bandSum / (bandEnd - bandStart) : 0;
                  // Normalize to 0-1 range with a minimum value
                  return Math.min(1, Math.max(0.2, bandAvg / 255));
                });
                setAudioLevels(newLevels);
              }
              
              // Continue analyzing
              animationFrameRef.current = requestAnimationFrame(analyzeAudio);
            };
            
            analyzeAudio();
          }
        } catch (error) {
          console.error('Error setting up audio analyzer:', error);
        }
      };
      
      // Wait a moment for audio element to be ready
      const timeoutId = setTimeout(setupAudioAnalyzer, 500);
      
      return () => {
        clearTimeout(timeoutId);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    } else {
      // Reset when not connected
      setIsModelSpeaking(false);
      return () => {};
    }
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

  // Set up audio service callbacks
  useEffect(() => {
    // Setup realtime audio service callbacks
    realtimeAudioService.onConnectionStateChange = (state: ConnectionState) => {
      console.log('Connection state changed:', state);
      setAudioConnectionState(state);
    };
    
    realtimeAudioService.onMessage = (message: any) => {
      console.log('Received message:', message);
      setEvents(prev => [...prev, message]);
    };
    
    // Cleanup
    return () => {
      realtimeAudioService.onConnectionStateChange = null;
      realtimeAudioService.onMessage = null;
    };
  }, []);

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
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
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
              {audioLevels.map((level, index) => (
                <div 
                  key={index}
                  className={`w-2 rounded-full bg-gradient-to-t from-ron-teal-400 to-blue-500 transition-all duration-150 ease-in-out transform audio-bar ${
                    isModelSpeaking ? 'glow-effect active' : ''
                  } audio-bar-${index}`}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col px-8 overflow-y-auto" ref={messagesContainerRef}>
            <div className={`flex-grow overflow-auto px-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {/* Live transcript for user speaking */}
              {userSpeakingTranscript && (
                <div className="mb-6 text-right">
                  <div className="inline-block rounded-lg px-4 py-2 max-w-[80%] bg-blue-400 text-white opacity-80">
                    <div>{userSpeakingTranscript}</div>
                  </div>
                </div>
              )}
              
              {/* Live transcript for model speaking */}
              {modelSpeakingTranscript && isModelSpeaking && (
                <div className="mb-6 text-left">
                  <div className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                    darkMode ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-800'
                  } opacity-80`}>
                    <div>{modelSpeakingTranscript}</div>
                  </div>
                </div>
              )}
              
              {isDeepThinking && (
                <div className="text-center my-4">
                  <div className="inline-block rounded-full bg-gray-200 px-4 py-2 text-sm text-gray-600">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4 py-4">
              {/* First render all messages from the Assistants API */}
              {messages.map((msg, idx) => renderMessage(msg, idx))}
              
              {/* Then render only the realtime messages that don't duplicate existing ones */}
              {localMessages
                .filter(localMsg => 
                  !messages.some(msg => 
                    msg.content === localMsg.content && msg.role === localMsg.role
                  )
                )
                .map((msg, idx) => renderMessage(msg, idx + messages.length))}
              
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
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Ron AI a question..."
                  disabled={isLoading}
                  className="bg-transparent border-none focus:outline-none flex-1 px-3 py-2 text-sm"
                />
                
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
                    isSpeechToTextRecording ? 'bg-purple-700 text-purple-200' : 'text-gray-400 hover:bg-gray-800 hover:text-purple-400'
                  }`}
                  aria-label={isSpeechToTextRecording ? "Turn off speech to text" : "Turn on speech to text"}
                  title={isSpeechToTextRecording ? "Turn off speech to text" : "Turn on speech to text"}
                >
                  <MessageSquare size={16} />
                  <span className="ml-1.5 text-xs font-medium">Speech to Text</span>
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
          <div className="h-full flex flex-col p-6 overflow-hidden">
            <h3 className="text-lg font-light mb-6 flex-shrink-0">Case Context</h3>
            
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
        </div>
      </div>
>>>>>>> Stashed changes
    </div>
  );
};

export default RonAITab;
