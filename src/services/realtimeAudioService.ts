// Define connection state types
export type ConnectionState = 
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'speaking'
  | 'recording'
  | 'processing'
  | 'error';

// Define event callback types
type ConnectionStateChangeCallback = (state: ConnectionState) => void;
type MessageCallback = (message: any) => void;
type RecordingStoppedCallback = () => void;
type TranscriptUpdateCallback = (text: string) => void;
type FunctionCallCallback = (functionCall: any) => void;
type ErrorCallback = (error: Error) => void;
type DataChannelOpenCallback = () => void;

// Configuration options
interface ConfigOptions {
  voice?: string;
  instructions?: string;
  modalities?: string[];
  model?: string; 
  input_audio_format?: string;
  output_audio_format?: string;
  input_audio_transcription?: {
    language?: string;
    prompt?: string;
  } | null;
  turn_detection?: {
    mode?: string;
  } | null;
  tools?: Array<{
    type: string;
    function: {
      name: string;
      description?: string;
      parameters?: any;
    };
  }>;
  tool_choice?: string | { type: string; function: { name: string } };
  temperature?: number;
  max_response_output_tokens?: number | string;
  onConnectionStateChange?: ConnectionStateChangeCallback;
  onMessage?: MessageCallback;
  onRecordingStopped?: RecordingStoppedCallback;
  onTranscriptUpdate?: TranscriptUpdateCallback;
  onFunctionCall?: FunctionCallCallback;
  onError?: ErrorCallback;
  onDataChannelOpen?: DataChannelOpenCallback;
}

class RealtimeAudioService {
  // Private state
  private _connectionState: ConnectionState = 'disconnected';
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private microphoneStream: MediaStream | null = null;
  // Changed from private to public to allow access in RonAITab component
  public audioElement: HTMLAudioElement | null = null;
  private recordingState: 'inactive' | 'requested' | 'recording' = 'inactive';
  private ephemeralToken: string | null = null;
  private voice: string = 'ash';
  private instructions: string = '';
  private backendUrl: string;
  private audioContext: AudioContext | null = null;
  private scriptNode: ScriptProcessorNode | null = null;
  
  // OpenAI Realtime API session configuration 
  private modalities?: string[];
  private model: string = 'gpt-4o-realtime-preview-2024-12-17';
  private input_audio_format?: string;
  private output_audio_format?: string;
  private input_audio_transcription?: { language?: string; prompt?: string; } | null;
  private turn_detection?: { mode?: string; } | null;
  private tools?: Array<{ type: string; function: { name: string; description?: string; parameters?: any; }; }>;
  private tool_choice?: string | { type: string; function: { name: string } };
  private temperature?: number;
  private max_response_output_tokens?: number | string;

  // Event callbacks
  public onConnectionStateChange: ConnectionStateChangeCallback | null = null;
  public onMessage: MessageCallback | null = null;
  public onRecordingStopped: RecordingStoppedCallback | null = null;
  public onTranscriptUpdate: TranscriptUpdateCallback | null = null;
  public onFunctionCall: FunctionCallCallback | null = null;
  public onError: ErrorCallback | null = null;
  public onDataChannelOpen: DataChannelOpenCallback | null = null;

  // Store previous state for reconnection
  private previousState: ConnectionState = 'disconnected';

  // State change listeners
  private stateChangeListeners: ((state: ConnectionState) => void)[] = [];

  // Add state change listener
  public addStateChangeListener = (listener: (state: ConnectionState) => void): void => {
    this.stateChangeListeners.push(listener);
  }

  constructor() {
    // Get backend URL from environment
    // @ts-ignore - Suppress the TypeScript error as Vite does support this at runtime
    this.backendUrl = import.meta.env?.VITE_BACKEND_URL || '';
    
    if (!this.backendUrl) {
      console.warn('[RealtimeAudio] Backend URL not set, defaulting to localhost');
      this.backendUrl = 'http://localhost:3001';
    }
    
    console.log('[RealtimeAudio] Service initialized');
  }

  // Configuration method
  public config = (options: ConfigOptions): void => {
    console.log('[RealtimeAudio] Configuring service with options:', options);
    
    // Set voice
    if (options.voice) {
      this.voice = options.voice;
    }
    
    // Set instructions
    if (options.instructions) {
      this.instructions = options.instructions;
    }
    
    // Set OpenAI Realtime API session configuration
    if (options.modalities) {
      this.modalities = options.modalities;
    }
    
    if (options.model) {
      this.model = options.model;
    }
    
    if (options.input_audio_format) {
      this.input_audio_format = options.input_audio_format;
    }
    
    if (options.output_audio_format) {
      this.output_audio_format = options.output_audio_format;
    }
    
    if (options.input_audio_transcription) {
      this.input_audio_transcription = options.input_audio_transcription;
    }
    
    if (options.turn_detection) {
      this.turn_detection = options.turn_detection;
    }
    
    if (options.tools) {
      this.tools = options.tools;
    }
    
    if (options.tool_choice) {
      this.tool_choice = options.tool_choice;
    }
    
    if (options.temperature) {
      this.temperature = options.temperature;
    }
    
    if (options.max_response_output_tokens) {
      this.max_response_output_tokens = options.max_response_output_tokens;
    }
    
    // Set callbacks
    if (options.onConnectionStateChange) {
      this.onConnectionStateChange = options.onConnectionStateChange;
    }
    
    if (options.onMessage) {
      this.onMessage = options.onMessage;
    }
    
    if (options.onRecordingStopped) {
      this.onRecordingStopped = options.onRecordingStopped;
    }
    
    if (options.onTranscriptUpdate) {
      this.onTranscriptUpdate = options.onTranscriptUpdate;
    }
    
    if (options.onFunctionCall) {
      this.onFunctionCall = options.onFunctionCall;
    }
    
    if (options.onError) {
      this.onError = options.onError;
    }
    
    if (options.onDataChannelOpen) {
      this.onDataChannelOpen = options.onDataChannelOpen;
    }

    // Force reconnection if the service is already connected
    if (this.connectionState === 'connected' || this.connectionState === 'recording') {
      console.log('[RealtimeAudio] Configurations changed, reconnecting session with new settings');
      this.reconnectSession();
    }
  }

  // Add reconnection method
  private reconnectSession = async (): Promise<void> => {
    try {
      // First stop any existing session
      this.stopSession();
      
      // Wait a moment for cleanup
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Start a new session with the updated configuration
      await this.startSession();
      
      // Restore recording if it was active
      if (this.previousState === 'recording') {
        await this.startRecording();
      }
    } catch (error) {
      console.error('[RealtimeAudio] Error during reconnection:', error);
      this.setConnectionState('error');
    }
  }

  // Public getter for connection state
  get connectionState(): ConnectionState {
    return this._connectionState;
  }

  // Set connection state and notify listeners
  private setConnectionState = (state: ConnectionState): void => {
    // Store previous state before changing
    this.previousState = this._connectionState;
    
    if (this._connectionState !== state) {
      console.log(`[RealtimeAudio] Connection state change: ${this._connectionState} -> ${state}`);
      this._connectionState = state;
      
      // Notify listeners
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange(state);
      }
      
      // Notify all state change listeners
      this.stateChangeListeners.forEach(listener => {
        listener(state);
      });
    }
  }

  // Start a new session - EXACTLY matching sample app
  public startSession = async (): Promise<void> => {
    try {
      // Get ephemeral token from backend
      const response = await fetch(`${this.backendUrl}/api/realtime/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instructions: this.instructions,
          voice: this.voice,
          modalities: this.modalities,
          model: this.model,
          input_audio_format: this.input_audio_format,
          output_audio_format: this.output_audio_format,
          input_audio_transcription: this.input_audio_transcription,
          turn_detection: this.turn_detection,
          tools: this.tools,
          tool_choice: this.tool_choice,
          temperature: this.temperature,
          max_response_output_tokens: this.max_response_output_tokens,
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error getting ephemeral token: ${response.status}`);
      }
      
      const data = await response.json();
      this.ephemeralToken = data.client_secret?.value;
      
      // Create peer connection with STUN servers exactly as in example
      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });
      
      // Create audio element
      this.audioElement = document.createElement('audio');
      this.audioElement.autoplay = true;
      
      // Handle incoming audio tracks
      this.peerConnection.ontrack = (e) => {
        if (this.audioElement) {
          this.audioElement.srcObject = e.streams[0];
        }
      };
      
      // Get microphone access and add track FIRST, before creating data channel
      const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.microphoneStream = ms;
      this.peerConnection.addTrack(ms.getTracks()[0]);
      
      // Create data channel EXACTLY as in example
      this.dataChannel = this.peerConnection.createDataChannel('oai-events', { ordered: true });
      
      // Setup data channel events
      this.dataChannel.onopen = () => {
        this.setConnectionState('connected');
        console.log('[RealtimeAudio] Data channel opened');
        
        // Notify listener of data channel open
        if (this.onDataChannelOpen) {
          this.onDataChannelOpen();
        }
      };
      
      this.dataChannel.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (this.onMessage) {
            this.onMessage(message);
          }
          
          // Handle special message types
          if (message.type === 'transcript' && this.onTranscriptUpdate) {
            this.onTranscriptUpdate(message.text);
          }
          
          if (message.type === 'function_call' && this.onFunctionCall) {
            this.onFunctionCall(message);
          }
        } catch (error) {
          console.error('[RealtimeAudio] Error parsing message:', error);
        }
      };
      
      // Create offer and set local description
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      // Send to OpenAI EXACTLY as in example
      const baseUrl = 'https://api.openai.com/v1/realtime';
      
      const sdpResponse = await fetch(`${baseUrl}?model=${this.model}`, {
        method: 'POST',
        body: offer.sdp,  // Send raw SDP, not JSON
        headers: {
          'Authorization': `Bearer ${this.ephemeralToken}`,
          'Content-Type': 'application/sdp',
        }
      });
      
      if (!sdpResponse.ok) {
        throw new Error(`Error getting SDP answer: ${sdpResponse.status}`);
      }
      
      // Set remote description
      const answer: RTCSessionDescriptionInit = {
        type: 'answer' as RTCSdpType,
        sdp: await sdpResponse.text()
      };
      await this.peerConnection.setRemoteDescription(answer);
      
      this.setConnectionState('connecting');
    } catch (error) {
      console.error('[RealtimeAudio] Error starting session:', error);
      this.cleanup();
      this.setConnectionState('error');
      throw error;
    }
  };

  // Stop the session - EXACTLY matching sample app
  public stopSession = (): void => {
    // First stop recording if active
    if (this.scriptNode || this.audioContext) {
      this.stopRecording();
    }
    
    // Close data channel
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }
    
    // Stop all tracks
    if (this.peerConnection) {
      this.peerConnection.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });
      
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    // Reset ephemeral token to force a new session on reconnect
    this.ephemeralToken = null;
    
    // Reset state
    this.setConnectionState('disconnected');
  };

  // Start recording audio - simplified to match example
  public startRecording = async (): Promise<void> => {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.error('[RealtimeAudio] Cannot start recording: data channel not open');
      return;
    }
    
    try {
      // Make sure we have microphone access
      if (!this.microphoneStream) {
        this.microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(this.microphoneStream);
      
      // Create script processor - EXACTLY as in example
      const bufferSize = 4096;
      const scriptNode = audioContext.createScriptProcessor(bufferSize, 1, 1);
      
      // Connect nodes
      source.connect(scriptNode);
      scriptNode.connect(audioContext.destination);
      
      // Process audio
      scriptNode.onaudioprocess = (audioEvent) => {
        if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
          return;
        }
        
        // Get the raw audio data - EXACTLY as in example
        const inputData = audioEvent.inputBuffer.getChannelData(0);
        
        // Send as-is without conversion, matching example
        this.dataChannel.send(JSON.stringify({
          type: 'audio',
          audio: Array.from(inputData)
        }));
      };
      
      this.audioContext = audioContext;
      this.scriptNode = scriptNode;
      this.setConnectionState('recording');
      
    } catch (error) {
      console.error('[RealtimeAudio] Error in audio processing:', error);
    }
  }

  // Stop recording - simplified to match example
  public stopRecording = (): void => {
    if (this.scriptNode) {
      this.scriptNode.disconnect();
      this.scriptNode = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.setConnectionState('connected');
  }

  // Helper to clean up resources
  private cleanup = (): void => {
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }
    
    if (this.microphoneStream) {
      this.microphoneStream.getTracks().forEach(track => {
        track.stop();
      });
      this.microphoneStream = null;
    }
    
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    if (this.audioElement) {
      this.audioElement.srcObject = null;
      this.audioElement = null;
    }
  }
}

// Export singleton instance
const realtimeAudioService = new RealtimeAudioService();
export default realtimeAudioService;

// Export types for use in other files
export type { ConfigOptions };
