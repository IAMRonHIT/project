import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Bot, Send, Mic, Paperclip, X, ChevronRight, ChevronDown, Brain, Phone, MessageSquare, Eye, FileText, RefreshCw } from 'lucide-react';
import CarePlanPreview from './CarePlanPreview';
import CarePlanForm, { CarePlanFormData } from './CarePlanForm';
import realtimeAudioService, { ConnectionState } from '../../services/realtimeAudioService';
import { generatePatientContent, clearRonAIConversation } from '../../services/patientContentService';
import './audioVisualization.css';

// Sample care plan code for demonstration
const sampleCarePlanCode = `
const CarePlan = () => {
  return (
    <div className="font-sans w-full text-gray-800">
      <header className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold text-white">Condition Management Care Plan</h1>
        <p className="text-white opacity-90">Patient: {patientName}</p>
      </header>
      
      <div className="p-6 bg-white rounded-b-lg shadow-md">
        {/* Assessment */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-teal-700 border-b border-teal-200 pb-2 mb-3">
            Assessment
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Current symptoms...</li>
            <li>Vital signs...</li>
            <li>Relevant test results...</li>
          </ul>
        </section>
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
  const [isRonAIResponsePending, setIsRonAIResponsePending] = useState(false);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastAudioActivityRef = useRef<number | null>(null);
  const visRef = useRef<HTMLDivElement | null>(null);
  const [showCarePlanForm, setShowCarePlanForm] = useState(false);
  
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
        
        // First check for microphone permissions
        try {
          console.log("Requesting microphone access...");
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // We got access, stop the tracks - realtimeAudioService will request them again
          stream.getTracks().forEach(track => track.stop());
          console.log("Microphone access granted");
        } catch (micError) {
          console.error("Microphone access denied:", micError);
          alert("Microphone access is required for the audio feature to work. Please allow microphone access.");
          setIsConnecting(false);
          return;
        }
        
        // Step 1: Create the session
        await realtimeAudioService.startSession();
        
        // Step 2: Set up event handlers
        realtimeAudioService.onConnectionStateChange = (state) => {
          setAudioConnectionState(state);
          
          // Only set active when fully connected and wait for data channel to be ready
          if (state === 'connected') {
            setIsRealtimeAudioActive(true);
            setIsConnecting(false);
            
            // Check for audio output devices
            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
              navigator.mediaDevices.enumerateDevices()
                .then(devices => {
                  const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
                  console.log("Available audio output devices:", audioOutputs);
                  
                  if (audioOutputs.length === 0) {
                    console.warn("No audio output devices found");
                    alert("No audio output devices detected. Please connect speakers or headphones.");
                  }
                })
                .catch(err => console.error("Error enumerating devices:", err));
            }
          } else if (state === 'disconnected' || state === 'error') {
            setIsRealtimeAudioActive(false);
            setIsConnecting(false);
          }
        };
        
        realtimeAudioService.onMessage = (message) => {
          setEvents((prev) => [message, ...prev]);
          
          // Check if this is a "start speaking" event using the correct message type
          if (message.type === 'response.audio_begin') {
            console.log("Ron AI started speaking");
          }
        };
        
        realtimeAudioService.onTranscriptUpdate = (text) => {
          setTranscript(text);
        };
        
        // Handle potential errors
        realtimeAudioService.onError = (error) => {
          console.error("Realtime audio error:", error);
          
          // Check if the error is related to audio playback
          if (error.message && (
              error.message.includes('audio') || 
              error.message.includes('playback') ||
              error.message.includes('voice'))) {
            // Attempt recovery
            console.log("Attempting to recover from audio error...");
            
            // Force stop and restart if needed
            if (isRealtimeAudioActive) {
              setTimeout(() => {
                realtimeAudioService.stopSession();
                
                // Wait a moment then try reconnecting
                setTimeout(() => {
                  toggleRealtimeAudio();
                }, 1000);
              }, 500);
            }
          }
        };
        
        // Step 3: Start recording only when everything is set up and ready
        // This will be triggered by the onConnectionStateChange handler
        realtimeAudioService.onDataChannelOpen = () => {
          // Wait a moment to ensure everything is ready
          setTimeout(() => {
            if (realtimeAudioService.connectionState === 'connected') {
              console.log("Data channel is open, starting recording");
              realtimeAudioService.startRecording();
              
              // Also try to ensure audio playback is working
              if (realtimeAudioService.audioElement) {
                // Ensure the audio context is resumed (may be needed for Chrome)
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                if (audioContext.state === 'suspended') {
                  console.log("Resuming suspended audio context");
                  audioContext.resume().then(() => {
                    console.log("Audio context resumed");
                  });
                }
                
                // Try to force audio element to play
                console.log("Attempting to ensure audio playback");
                realtimeAudioService.playAudio()
                  .catch(err => console.warn("Initial playAudio attempt failed:", err));
              }
            }
          }, 500);
        };
      } else {
        // Stop in reverse order
        console.log("Stopping realtime audio session");
        realtimeAudioService.stopRecording();
        setTimeout(() => {
          realtimeAudioService.stopSession();
          setIsRealtimeAudioActive(false);
          // Set transcript to empty when stopping
          setTranscript('');
        }, 200);
      }
    } catch (error) {
      console.error('Error in toggleRealtimeAudio:', error);
      setIsRealtimeAudioActive(false);
      setIsConnecting(false);
      
      // Show user-friendly error
      alert(`Error with audio: ${error.message || 'Unknown error'}`);
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
    const newMode = !isPatientContentMode;
    setIsPatientContentMode(newMode);
    
    if (newMode) {
      // Switching TO Ron AI mode
      // Clear any previous Ron AI conversation
      clearRonAIConversation();
      
      // Adding to messages array when switching to Ron AI mode
      const systemMessage = {
        role: "system",
        content: `# Ron AI Patient Content Mode

You're now using Ron AI, which can create interactive care plans and discuss healthcare topics.

### How to use:

1. **Ask for a care plan** - Examples:
   - "Create a care plan for hypertension"
   - "Make a care plan for asthma management"
   - "I need a care plan for a stroke patient" 
   
   When you request a care plan, you'll be prompted to fill out a detailed form with patient information for more personalized results.

2. **Answer Ron AI's questions** if you have additional details
3. **View the generated care plan** in the preview pane

You can toggle between the rendered view and source code in the preview pane.

---

💬 *You can also ask general healthcare questions!*`
      };
      messages.push(systemMessage);
    } else {
      // Switching FROM Ron AI mode
      // Close the preview if it's open
      setShowCarePlanPreview(false);
      // Add a message indicating we're back to normal mode
      const systemMessage = {
        role: "system",
        content: "Returning to standard Ron AI mode."
      };
      messages.push(systemMessage);
    }
  };

  // Function to clear Ron AI conversation
  const handleClearRonAIConversation = async () => {
    // Clear backend conversation history
    await clearRonAIConversation();
    
    // Clear UI messages except for the initial system message
    const initialMessages = messages.filter(msg => 
      msg.role !== "user" && 
      msg.role !== "assistant" && 
      !msg.content.includes("Ron AI Patient Content Mode")
    );
    
    // Add the system message back
    const systemMessage = {
      role: "system",
      content: `# Ron AI Patient Content Mode

You're now using Ron AI, which can create interactive care plans and discuss healthcare topics.

### How to use:

1. **Ask for a care plan** - Examples:
   - "Create a care plan for hypertension"
   - "Make a care plan for asthma management"
   - "I need a care plan for a stroke patient" 
   
   When you request a care plan, you'll be prompted to fill out a detailed form with patient information for more personalized results.

2. **Answer Ron AI's questions** if you have additional details
3. **View the generated care plan** in the preview pane

You can toggle between the rendered view and source code in the preview pane.

---

💬 *You can also ask general healthcare questions!*`
    };
    
    // Update messages with only system messages and the new activation message
    messages.splice(0, messages.length, ...initialMessages, systemMessage);
    
    // Close the preview if it's open
    setShowCarePlanPreview(false);
  };

  // Override the renderMessage function to customize display for Ron AI mode
  const originalRenderMessage = renderMessage;

  const customRenderMessage = (msg: any, idx: number) => {
    // If we're not in patient content mode, use the original renderer
    if (!isPatientContentMode) {
      return originalRenderMessage(msg, idx);
    }
    
    // For system messages in Ron AI mode
    if (msg.role === "system" && msg.content && msg.content.includes("Ron AI Patient Content Mode")) {
      return (
        <div key={idx} className="system-message mb-2 px-3 py-2 rounded-md bg-teal-900 bg-opacity-20 border border-teal-800 text-gray-300">
          <div className="flex items-start space-x-2">
            <div className="rounded-full bg-teal-700 p-1 mt-0.5 flex-shrink-0">
              <Bot size={12} className="text-teal-200" />
            </div>
            <div className="flex-1 text-sm" dangerouslySetInnerHTML={{ __html: formatMessageContent(msg.content) }}></div>
          </div>
        </div>
      );
    }
    
    // For user messages in Ron AI mode
    if (msg.role === "user") {
      return (
        <div key={idx} className="user-message mb-2 px-3 py-2 text-white">
          <div className="flex items-start space-x-2">
            <div className="rounded-full bg-blue-600 p-1 mt-0.5 flex-shrink-0">
              <MessageSquare size={12} className="text-white" />
            </div>
            <div className="flex-1 text-sm" dangerouslySetInnerHTML={{ __html: formatMessageContent(msg.content) }}></div>
          </div>
        </div>
      );
    }
    
    // For assistant messages in Ron AI mode
    if (msg.role === "assistant") {
      return (
        <div key={idx} className="assistant-message mb-2 px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200">
          <div className="flex items-start space-x-2">
            <div className="rounded-full bg-teal-600 p-1 mt-0.5 flex-shrink-0">
              <Bot size={12} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-teal-400 mb-0.5">Ron AI</div>
              <div className="text-sm" dangerouslySetInnerHTML={{ __html: formatMessageContent(msg.content) }}></div>
            </div>
          </div>
        </div>
      );
    }
    
    // Fallback to original renderer for any other message types
    return originalRenderMessage(msg, idx);
  };

  // Helper function to format message content with Markdown-like syntax
  const formatMessageContent = (content: string) => {
    let formatted = content;
    
    // Format headings
    formatted = formatted.replace(/^#\s+(.*)$/gm, '<h3 class="text-lg font-bold text-white mb-1">$1</h3>');
    formatted = formatted.replace(/^##\s+(.*)$/gm, '<h4 class="text-md font-semibold text-white mb-1">$1</h4>');
    formatted = formatted.replace(/^###\s+(.*)$/gm, '<h5 class="text-sm font-semibold text-teal-300 mb-1">$1</h5>');
    
    // Format lists
    formatted = formatted.replace(/^\d\.\s+(.*)$/gm, '<div class="ml-4 flex"><span class="mr-2 text-teal-400">•</span><span>$1</span></div>');
    formatted = formatted.replace(/^-\s+(.*)$/gm, '<div class="ml-4 flex"><span class="mr-2 text-gray-400">•</span><span>$1</span></div>');
    
    // Format inline styles
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-teal-300">$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em class="text-gray-300">$1</em>');
    
    // Format horizontal rule
    formatted = formatted.replace(/^---$/gm, '<hr class="my-2 border-gray-700" />');
    
    // Format emojis with larger size
    formatted = formatted.replace(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g, '<span class="text-xl">$1</span>');
    
    // Replace newlines with <br />
    formatted = formatted.replace(/\n/g, '<br />');
    
    return formatted;
  };

  // Modify the handleSubmit function to handle routing to Ron AI
  const originalHandleSubmit = handleSubmit;
  
  // Override handleSubmit prop with our custom implementation
  const customHandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMessage.trim()) return;
    
    if (isPatientContentMode) {
      // Handle sending to Ron AI
      try {
        // Add user message to chat
        const userMessage = {
          role: "user",
          content: currentMessage
        };
        messages.push(userMessage);
        
        // Clear input field
        setCurrentMessage('');
        
        // Show thinking indicator
        setIsRonAIResponsePending(true);
        
        // Check if this is explicitly requesting a care plan
        const isExplicitCareplanRequest = 
          currentMessage.toLowerCase().includes('care plan') ||
          currentMessage.toLowerCase().includes('treatment plan') ||
          currentMessage.toLowerCase().includes('health plan') ||
          currentMessage.toLowerCase().includes('management plan') ||
          currentMessage.toLowerCase().includes('plan for') ||
          currentMessage.toLowerCase().includes('plan to manage');
        
        // If this is a care plan request, show the form instead of sending directly
        if (isExplicitCareplanRequest && !currentMessage.includes('Patient Name:')) {
          // This is a simple request for a care plan, show the form
          setShowCarePlanForm(true);
          setIsRonAIResponsePending(false);
          return;
        }
        
        // Call the generatePatientContent API
        const response = await generatePatientContent({
          prompt: currentMessage,
          patientInfo: {
            fullName: "Sarah Johnson",
            age: 58,
            gender: "Female",
            height: "5'6\"",
            weight: "165 lbs",
            bloodPressure: "138/88",
            conditions: ["Type 2 Diabetes", "Hypertension"],
            medications: ["Metformin", "Lisinopril"]
          },
          contentType: isExplicitCareplanRequest ? 'care-plan' : 'conversation'
        });
        
        console.log("Raw response from Ron AI:", response.substring(0, 100) + "...");
        
        // If it's a care plan request, handle the code rendering
        if ((isExplicitCareplanRequest && 
            (response.includes('export default') || 
             response.includes('const CarePlan') || 
             response.includes('function CarePlan')))) {
          // Add Ron AI's response to the chat
          const assistantMessage = {
            role: "assistant",
            content: `### Care Plan Created ✓ 

I've created the requested care plan based on the information provided.

**View Options:**
- **Preview Mode**: See the rendered care plan
- **Code Mode**: View or copy the source code

You can switch between views using the toggle button in the preview pane.`
          };
          messages.push(assistantMessage);
          
          // Set the care plan code and show preview
          console.log("Setting care plan code for preview");
          setCarePlanCode(response);
          setShowCarePlanPreview(true);
        } else {
          // For regular conversation, just show the response directly
          const assistantMessage = {
            role: "assistant",
            content: response
          };
          messages.push(assistantMessage);
        }
        
        setIsRonAIResponsePending(false);
        
      } catch (error) {
        console.error('Error getting response from Ron AI:', error);
        setIsRonAIResponsePending(false);
        
        // Add error message to chat
        const errorMessage = {
          role: "system",
          content: "Sorry, there was an error processing your request. Please try again."
        };
        messages.push(errorMessage);
      }
    } else {
      // Use original OpenAI handling
      originalHandleSubmit(e);
    }
  };

  // Handle care plan form submission
  const handleCarePlanFormSubmit = (formData: CarePlanFormData) => {
    // Close the form
    setShowCarePlanForm(false);
    
    // Create a structured prompt from the form data
    const structuredPrompt = `
Please create a care plan for the following patient:

Patient Name: ${formData.patientName}
Age: ${formData.patientAge}
Gender: ${formData.patientGender}
Medical Condition: ${formData.condition}

Current Symptoms: 
${formData.symptoms}

${formData.currentMedications ? `Current Medications:
${formData.currentMedications}` : ''}

${formData.relevantHistory ? `Relevant Medical History:
${formData.relevantHistory}` : ''}

${formData.goals ? `Treatment Goals:
${formData.goals}` : ''}

IMPORTANT INSTRUCTIONS:
1. Create a comprehensive care plan for this patient focusing SPECIFICALLY on their ${formData.condition} condition.
2. Include appropriate assessments, diagnoses, short and long-term goals.
3. Make sure to include Interventions (NOT Implementation) and Evaluation sections.
4. DO NOT ask any follow-up questions - the form has already collected all necessary information.
5. Generate the complete care plan immediately.
6. Use the full width of the display for your response.
7. DO NOT include any general information about diabetes unless that is specifically the condition requested.
`;

    // Set the message and submit
    setCurrentMessage(structuredPrompt);
    // Submit after a short delay to ensure state is updated
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      customHandleSubmit(fakeEvent);
    }, 100);
  };

  // Audio diagnostics for debugging
  const renderAudioDiagnostics = () => {
    if (!isRealtimeAudioActive) return null;
    
    return (
      <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
        <div className="flex items-center justify-between">
          <span>Audio diagnostics:</span>
          <button 
            onClick={() => {
              // Force play the audio element
              if (realtimeAudioService.audioElement) {
                console.log("Attempting to play audio element directly");
                realtimeAudioService.audioElement.play()
                  .then(() => console.log("Play successful"))
                  .catch(err => console.error("Play failed:", err));
              }
            }}
            className="px-1 py-0.5 bg-blue-500 text-white rounded text-xs"
          >
            Test Audio
          </button>
        </div>
        <div>Status: {audioConnectionState}</div>
        <div>Audio element: {realtimeAudioService.audioElement ? 'Created' : 'Not created'}</div>
        {realtimeAudioService.audioElement && (
          <div>
            <div>Audio stream: {realtimeAudioService.audioElement.srcObject ? 'Active' : 'Not set'}</div>
            <div>Muted: {realtimeAudioService.audioElement.muted ? 'Yes' : 'No'}</div>
            <div>Volume: {realtimeAudioService.audioElement.volume}</div>
          </div>
        )}
        
        <div className="mt-2">
          <div className="font-semibold">Recent API Messages:</div>
          <div className="max-h-20 overflow-y-auto bg-gray-900 text-gray-200 p-1 rounded text-xs font-mono">
            {events.slice(0, 5).map((event, idx) => (
              <div key={idx} className="whitespace-nowrap overflow-hidden text-ellipsis">
                {event.type}: {JSON.stringify(event).substring(0, 40)}...
              </div>
            ))}
          </div>
        </div>
      </div>
    );
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
          <div className="flex flex-col items-center pt-4 pb-2 flex-shrink-0">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 bg-gradient-to-br from-blue-500 to-teal-400 shadow-lg shadow-teal-400/30">
              <Bot size={24} className="text-gray-900" />
            </div>
            <div className="flex items-center justify-center mb-4">
              <h1 className="text-3xl font-extralight tracking-wider bg-gradient-to-r from-ron-teal-400 to-blue-500 bg-clip-text text-transparent">
                RON AI
              </h1>
            </div>
            
            {/* Audio Visualizer - Fixed position relative to RON AI text */}
            <div 
              ref={audioAnimationRef} 
              className={`flex justify-center space-x-3 mb-3 -mt-2 relative z-10 transition-opacity duration-300 ${
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
          
          <div className="flex-1 flex flex-col px-4 overflow-hidden">
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent pr-2" ref={messagesContainerRef}>
              <div className="space-y-3 pt-1 pb-2">
                {messages.map((msg, idx) => customRenderMessage(msg, idx))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
          
          <div className="p-6 flex-shrink-0 border-t border-gray-800 bg-gray-900">
            <div className={darkMode ? "card dark-mode-card" : "card light-mode-card"}>
              <div className="flex items-center">
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
                  autoFocus
                />
                
                <button 
                  className="p-2 rounded-full bg-teal-500 ml-1 opacity-90 hover:opacity-100 transition-opacity"
                  onClick={(e) => customHandleSubmit(e)}
                  disabled={isLoading || !currentMessage.trim()}
                  aria-label="Send message"
                  title="Send message"
                >
                  <Send size={18} className="text-gray-900" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex space-x-1">
                <button
                  onClick={toggleDeepThinking}
                  className={`px-2 py-1 rounded-md flex items-center transition-colors ${
                    isDeepThinking ? 'bg-amber-700 text-amber-200' : 'text-gray-400 hover:bg-gray-800 hover:text-amber-400'
                  }`}
                  aria-label={isDeepThinking ? "Turn off deep thinking mode" : "Turn on deep thinking mode"}
                  title={isDeepThinking ? "Turn off deep thinking mode" : "Turn on deep thinking mode"}
                >
                  <Brain size={14} />
                  <span className="ml-1 text-xs font-medium">Deep</span>
                </button>
                
                <button
                  onClick={toggleRealtimeAudio}
                  className={`px-2 py-1 rounded-md flex items-center transition-colors ${
                    isRealtimeAudioActive ? 'bg-green-700 text-green-200' : (isConnecting ? 'bg-yellow-700 text-yellow-200' : 'text-gray-400 hover:bg-gray-800 hover:text-green-400')
                  }`}
                  disabled={isLoading}
                  aria-label={isRealtimeAudioActive ? "Turn off real time audio" : "Turn on real time audio"}
                  title={isRealtimeAudioActive ? "Turn off real time audio" : "Turn on real time audio"}
                >
                  <Mic size={14} />
                  <span className="ml-1 text-xs font-medium">Audio</span>
                  {isConnecting && 
                    <div className="flex space-x-1 ml-1">
                      <span className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></span>
                      <span className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-75"></span>
                      <span className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-150"></span>
                    </div>
                  }
                </button>
                
                <button
                  onClick={toggleSpeechToText}
                  className={`px-2 py-1 rounded-md flex items-center transition-colors ${
                    isSpeechToTextActive ? 'bg-purple-700 text-purple-200' : 'text-gray-400 hover:bg-gray-800 hover:text-purple-400'
                  }`}
                  aria-label={isSpeechToTextActive ? "Turn off speech to text" : "Turn on speech to text"}
                  title={isSpeechToTextActive ? "Turn off speech to text" : "Turn on speech to text"}
                >
                  <MessageSquare size={14} />
                  <span className="ml-1 text-xs font-medium">Speech</span>
                </button>
                
                <button
                  onClick={togglePatientContentMode}
                  className={`px-2 py-1 rounded-md flex items-center transition-colors ${
                    isPatientContentMode ? 'bg-blue-700 text-blue-200' : 'text-gray-400 hover:bg-gray-800 hover:text-blue-400'
                  }`}
                  aria-label={isPatientContentMode ? "Turn off patient content mode" : "Turn on patient content mode"}
                  title={isPatientContentMode ? "Turn off patient content mode" : "Turn on patient content mode"}
                >
                  <FileText size={14} />
                  <span className="ml-1 text-xs font-medium">Care Plans</span>
                  {isRonAIResponsePending && 
                    <div className="flex space-x-1 ml-1">
                      <span className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></span>
                      <span className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-75"></span>
                      <span className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-150"></span>
                    </div>
                  }
                </button>
                
                {isPatientContentMode && (
                  <button
                    onClick={handleClearRonAIConversation}
                    title="Clear Ron AI conversation"
                    className="p-1 rounded-lg hover:bg-gray-700 transition-colors text-gray-400"
                  >
                    <RefreshCw size={14} />
                    <span className="sr-only">Clear conversation</span>
                  </button>
                )}
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
      {isRonAIResponsePending &&
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
          <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center max-w-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-400 mb-4"></div>
            <p className="text-gray-300 text-center">Ron AI is thinking...</p>
          </div>
        </div>
      }
      
      {showCarePlanPreview && (
        <CarePlanPreview
          code={carePlanCode}
          onClose={() => setShowCarePlanPreview(false)}
          isVisible={showCarePlanPreview}
        />
      )}
      
      {showCarePlanForm && (
        <CarePlanForm
          onSubmit={handleCarePlanFormSubmit}
          onClose={() => setShowCarePlanForm(false)}
        />
      )}

      {/* Audio debug information - only show when audio is active */}
      {isRealtimeAudioActive && renderAudioDiagnostics()}
    </div>
  );
};

export default RonAiTab;
