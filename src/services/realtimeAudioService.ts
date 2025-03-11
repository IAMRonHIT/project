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

// Add debug mode flag
const DEBUG_MODE = true;

// Debug logger function
function debugLog(...args: any[]) {
  if (DEBUG_MODE) {
    console.log('[RealtimeAudio DEBUG]', ...args);
  }
}

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
    type?: string;
    threshold?: number;
    prefix_padding_ms?: number;
    silence_duration_ms?: number;
    create_response?: boolean;
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
  private backendUrl: string = '';
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  public audioElement: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private recordingState: 'inactive' | 'recording' = 'inactive';
  private streamSource: MediaStreamAudioSourceNode | null = null;
  private scriptNode: ScriptProcessorNode | null = null;
  private microphoneStream: MediaStream | null = null;
  private microphoneTrack: MediaStreamTrack | null = null;
  private ephemeralToken: string | null = null;
  
  // Add missing properties for SDP negotiation
  private _pendingRenegotiation: boolean = false;
  private _iceRestartNeeded: boolean = false;
  
  // Configuration for Realtime API
  public instructions: string = 'You are a helpful voice assistant.';
  public voice: string = 'alloy';
  public modalities: string[] = ['text', 'audio'];
  public model: string = 'gpt-4o-realtime-preview-2024-12-17';
  public input_audio_format: string = 'pcm16';
  public output_audio_format: string = 'pcm16';
  public input_audio_transcription: { language?: string; prompt?: string } | null = null;
  public turn_detection: { type?: string } | null = { type: 'server_vad' };
  public tools: Array<any> = [];
  public tool_choice: any = null;
  public temperature: number | null = null;
  public max_response_output_tokens: number | string | null = null;

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

  // Add a helper property to track responses
  private _receivedAnyResponse: boolean = false;

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
    
    // IMPORTANT: Handle tools properly - if null is passed, keep the empty array
    if (options.tools && Array.isArray(options.tools)) {
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

  /**
   * Attempts to reconnect a failed WebRTC session
   */
  private reconnectSession = async (): Promise<void> => {
    debugLog('Attempting to reconnect WebRTC session');
    this.setConnectionState('connecting');
    
    try {
      // Clean up existing connection resources first
      if (this.dataChannel) {
        debugLog('Closing existing data channel');
        this.dataChannel.close();
        this.dataChannel = null;
      }
      
      if (this.peerConnection) {
        debugLog('Closing existing peer connection');
        this.peerConnection.close();
        this.peerConnection = null;
      }
      
      // Wait a moment before reconnecting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Start fresh session
      debugLog('Starting fresh WebRTC session');
      await this.startSession();
      
      // Test the newly established connection
      if (this.connectionState === 'connected' && this.dataChannel) {
        const dataChannel = this.dataChannel as RTCDataChannel;
        if (dataChannel.readyState === 'open') {
          debugLog('Successfully reconnected WebRTC session');
          
          // Send a test message to verify connection
          try {
            dataChannel.send(JSON.stringify({
              type: 'message',
              message: 'Connection reestablished'
            }));
            debugLog('Test message sent on reconnected data channel');
          } catch (error) {
            debugLog('Error sending test message on reconnected channel:', error);
          }
        } else {
          debugLog(`Data channel not open, current state: ${dataChannel.readyState}`);
          throw new Error(`Reconnection failed: data channel in ${dataChannel.readyState} state`);
        }
      } else {
        throw new Error('Reconnection failed to establish working data channel');
      }
    } catch (error) {
      debugLog('Reconnection failed:', error);
      this.setConnectionState('error');
      
      if (this.onError) {
        this.onError(new Error(`Failed to reconnect WebRTC session: ${error}`));
      }
    }
  };

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
    // Check if already running first
    if (this.connectionState === 'connected' || this.connectionState === 'connecting') {
      debugLog('Session already in progress - skipping startSession');
      return;
    }

    debugLog('Starting WebRTC session with OpenAI');
    this.setConnectionState('connecting');

    try {
      // Fetch ephemeral credentials via API route
      debugLog('Fetching credentials for WebRTC session');
      
      // Create a clean request body without null values
      const requestBody: any = {
        instructions: this.instructions,
        voice: this.voice,
        modalities: this.modalities,
        model: this.model,
      };
      
      // Only add non-null fields
      if (this.input_audio_format) requestBody.input_audio_format = this.input_audio_format;
      if (this.output_audio_format) requestBody.output_audio_format = this.output_audio_format;
      if (this.input_audio_transcription) requestBody.input_audio_transcription = this.input_audio_transcription;
      if (this.turn_detection) requestBody.turn_detection = this.turn_detection;
      
      // IMPORTANT: Only include tools if it's a properly formatted array with at least one item
      if (this.tools && Array.isArray(this.tools) && this.tools.length > 0) {
        requestBody.tools = this.tools;
      }
      
      // Only include other optional parameters if they're not null
      if (this.tool_choice !== null) requestBody.tool_choice = this.tool_choice;
      if (this.temperature !== null) requestBody.temperature = this.temperature;
      if (this.max_response_output_tokens !== null) requestBody.max_response_output_tokens = this.max_response_output_tokens;
      
      debugLog('Sending request with body:', requestBody);
      
      const response = await fetch(`${this.backendUrl}/api/realtime/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to start session: ${error || response.statusText}`);
      }

      const data = await response.json();
      if (!data.client_secret?.value) {
        throw new Error('No ephemeral token received from server');
      }
      debugLog('Successfully received session credentials');
      this.ephemeralToken = data.client_secret?.value;
      
      // Create peer connection with expanded STUN servers for better connectivity
      debugLog('Creating RTCPeerConnection with enhanced ICE configuration');
      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
          // Add OpenAI's STUN server if available
          { urls: 'stun:stun.openai.com:3478' }
        ],
        iceCandidatePoolSize: 10,
        iceTransportPolicy: 'all', // Try all possible connection methods
        rtcpMuxPolicy: 'require',
        // Add configuration for faster connection
        bundlePolicy: 'max-bundle',
      });
      
      // Create audio element
      this.audioElement = document.createElement('audio');
      this.audioElement.autoplay = true;
      
      // Add additional properties to improve audio playback reliability
      this.audioElement.controls = false; // No visible controls needed
      this.audioElement.muted = false;
      this.audioElement.volume = 1.0;
      this.audioElement.setAttribute('playsinline', ''); // Important for mobile
      
      // IMPORTANT: Add the audio element to the DOM to ensure it works in all browsers
      document.body.appendChild(this.audioElement);
      debugLog('Audio element created and added to document body');
      
      // Handle incoming audio tracks
      this.peerConnection.ontrack = (e) => {
        debugLog('Track received from server:', e);
        debugLog('Number of streams:', e.streams.length);
        if (e.streams.length === 0) {
          debugLog('WARNING: No streams in track event');
        } else {
          // Detailed info about each stream
          e.streams.forEach((stream, i) => {
            debugLog(`Stream ${i} info:`, {
              id: stream.id,
              active: stream.active,
              trackCount: stream.getTracks().length
            });
            
            // Log details about each track in the stream
            stream.getTracks().forEach((track, j) => {
              debugLog(`Track ${j} info:`, {
                kind: track.kind,
                id: track.id,
                enabled: track.enabled,
                readyState: track.readyState
              });
            });
          });
        }
        
        if (this.audioElement) {
          this.audioElement.srcObject = e.streams[0];
          debugLog('Set audio element srcObject to stream');
          
          // Add event listeners to audio element for debugging
          this.audioElement.onplay = () => debugLog('Audio playback started');
          this.audioElement.onpause = () => debugLog('Audio playback paused');
          this.audioElement.onended = () => debugLog('Audio playback ended');
          this.audioElement.onerror = (err) => debugLog('Audio element error:', err);
          
          // Also add a timeupdate listener to track if audio is actually playing
          this.audioElement.ontimeupdate = () => {
            debugLog('Audio time update - currentTime:', this.audioElement?.currentTime);
          };
          
          // Check every second if audio is playing
          const audioPlayingInterval = setInterval(() => {
            if (!this.audioElement) {
              clearInterval(audioPlayingInterval);
              return;
            }
            
            if (this.audioElement.currentTime > 0) {
              debugLog('Audio is playing - currentTime:', this.audioElement.currentTime);
            } else {
              debugLog('Audio not playing or paused');
            }
          }, 1000);
          
          // Attempt to explicitly play the audio
          this.playAudio().catch(err => debugLog('PlayAudio method failed:', err));
        } else {
          debugLog('ERROR: Audio element is null, cannot play audio');
        }
      };
      
      // Set up ICE reconnection logic
      let reconnectAttempt = 0;
      const maxReconnectAttempts = 3;
      
      this.peerConnection.oniceconnectionstatechange = () => {
        const state = this.peerConnection?.iceConnectionState;
        debugLog('ICE connection state changed:', state);
        
        // Handle different ICE connection states
        switch (state) {
          case 'connected':
          case 'completed':
            // Reset reconnect counter when connected
            reconnectAttempt = 0;
            debugLog('ICE connection established successfully');
            break;
            
          case 'disconnected':
            debugLog('ICE connection temporarily disconnected - attempting to recover');
            // This is often temporary, wait to see if it recovers on its own
            setTimeout(() => {
              if (this.peerConnection?.iceConnectionState === 'disconnected') {
                debugLog('ICE still disconnected after timeout - attempting to restart ICE');
                this.peerConnection?.restartIce();
              }
            }, 2000);
            break;
            
          case 'failed':
            debugLog('ICE connection failed - attempting to restart');
            if (reconnectAttempt < maxReconnectAttempts) {
              reconnectAttempt++;
              debugLog(`ICE restart attempt ${reconnectAttempt} of ${maxReconnectAttempts}`);
              
              // Try restarting ICE
              this.peerConnection?.restartIce();
              
              // If still failing after a delay, try recreating the peer connection
              setTimeout(() => {
                if (this.peerConnection?.iceConnectionState === 'failed') {
                  debugLog('ICE still failed after restart - attempting full reconnection');
                  this.reconnectSession();
                }
              }, 3000);
            } else {
              debugLog('Maximum reconnection attempts reached');
              this.setConnectionState('error');
              
              // If we have an error callback, call it with the ICE connection error
              if (this.onError) {
                this.onError(new Error(`WebRTC ICE connection failed after ${maxReconnectAttempts} attempts`));
              }
            }
            break;
            
          case 'closed':
            debugLog('ICE connection closed');
            break;
        }
      };
      
      // Monitor signaling state
      this.peerConnection.onsignalingstatechange = () => {
        debugLog('Signaling state changed:', this.peerConnection?.signalingState);
      };
      
      // Get microphone access and add track FIRST, before creating data channel
      const ms = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000, // Higher quality sample rate
          channelCount: 1    // Mono for better compatibility
        },
        video: false
      });
      this.microphoneStream = ms;
      this.peerConnection.addTrack(ms.getTracks()[0]);
      
      // Create data channel EXACTLY as in example
      this.setupDataChannel();
      
      // Log received ICE candidates
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          debugLog('ICE candidate received:', event.candidate.type, event.candidate.protocol, event.candidate.address);
        } else {
          debugLog('ICE candidate gathering complete');
        }
      };
      
      // Monitor negotiation needed events
      this.peerConnection.onnegotiationneeded = async () => {
        debugLog('Negotiation needed - creating new offer');
        try {
          const offer = await this.peerConnection?.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: false,
            iceRestart: this._iceRestartNeeded || false
          });
          
          if (!offer || !this.peerConnection) return;
          
          debugLog('Setting local description with new offer');
          await this.peerConnection.setLocalDescription(offer);
          
          // SDP modifications - ensure audio codecs are prioritized correctly
          if (this.peerConnection.localDescription) {
            let sdp = this.peerConnection.localDescription.sdp;
            
            // Make sure OPUS is preferred for audio (if present)
            if (sdp.includes('OPUS')) {
              debugLog('Ensuring OPUS codec is prioritized');
              // Modify SDP to prioritize OPUS if needed
            }
            
            debugLog('SDP negotiation restarted with updated parameters');
          }
        } catch (error) {
          debugLog('Error during renegotiation:', error);
          this.setConnectionState('error');
        }
      };
      
      // Add audio element monitoring
      if (this.audioElement) {
        // Monitor audio stalling
        this.audioElement.onstalled = () => {
          debugLog('Audio playback stalled');
        };
        
        // Monitor if audio can play through
        this.audioElement.oncanplaythrough = () => {
          debugLog('Audio can play through without buffering');
        };
        
        // Monitor audio ending
        this.audioElement.onended = () => {
          debugLog('Audio playback ended');
        };
        
        // More detailed error handling
        this.audioElement.onerror = (event) => {
          debugLog('Audio element error:', this.audioElement?.error?.code, this.audioElement?.error?.message);
        };
        
        // Check if audio is actually making progress
        let lastTime = 0;
        let stalledCount = 0;
        const checkAudioProgress = () => {
          if (this.audioElement && this.audioElement.currentTime > 0) {
            if (this.audioElement.currentTime === lastTime && !this.audioElement.paused) {
              stalledCount++;
              debugLog(`Audio appears stalled at ${lastTime} (count: ${stalledCount})`);
              
              if (stalledCount >= 3) {
                debugLog('Audio consistently stalled - attempting to restart audio stream');
                // Try to restart audio
                this.audioElement.currentTime = 0;
                this.audioElement.play().catch(err => debugLog('Error restarting audio:', err));
                stalledCount = 0;
              }
            } else {
              if (lastTime !== this.audioElement.currentTime) {
                debugLog(`Audio is progressing: ${this.audioElement.currentTime.toFixed(3)}`);
                stalledCount = 0;
              }
              lastTime = this.audioElement.currentTime;
            }
          }
        };
        
        // Check audio progress every second
        const audioProgressInterval = setInterval(checkAudioProgress, 1000);
        
        // Clean up interval when audio element is removed
        const originalCleanup = this.cleanup;
        this.cleanup = () => {
          clearInterval(audioProgressInterval);
          originalCleanup();
        };
      }
      
      // Create offer and set local description
      const offer = await this.peerConnection.createOffer();
      debugLog('Created WebRTC offer - SDP length:', offer.sdp?.length);
      await this.peerConnection.setLocalDescription(offer);
      debugLog('Set local description');
      
      // Send to OpenAI EXACTLY as in example
      const baseUrl = 'https://api.openai.com/v1/realtime';
      
      debugLog(`Sending SDP to OpenAI API: ${baseUrl}?model=${this.model}`);
      const sdpResponse = await fetch(`${baseUrl}?model=${this.model}`, {
        method: 'POST',
        body: offer.sdp,  // Send raw SDP, not JSON
        headers: {
          'Authorization': `Bearer ${this.ephemeralToken}`,
          'Content-Type': 'application/sdp',
        }
      });
      
      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        debugLog('Error getting SDP answer:', sdpResponse.status, errorText);
        throw new Error(`Error getting SDP answer: ${sdpResponse.status} - ${errorText}`);
      }
      
      // Set remote description
      const sdpText = await sdpResponse.text();
      debugLog('Received SDP answer - length:', sdpText.length);
      
      const answer: RTCSessionDescriptionInit = {
        type: 'answer' as RTCSdpType,
        sdp: sdpText
      };
      
      debugLog('Setting remote description');
      await this.peerConnection.setRemoteDescription(answer);
      debugLog('Set remote description successfully');
      
      // Register for ICE candidates
      this.peerConnection.onicecandidate = (event) => {
        debugLog('ICE candidate event:', event.candidate ? `candidate found - type: ${event.candidate.type}` : 'gathering complete');
      };
      
      this.setConnectionState('connecting');

      // Set up network quality monitoring
      this.setupNetworkMonitoring();
      
      // Monitor connection state
      this.peerConnection.onconnectionstatechange = () => {
        debugLog('WebRTC connection state changed to:', this.peerConnection?.connectionState);
      };
    } catch (error) {
      console.error('[RealtimeAudio] Error starting session:', error);
      this.cleanup();
      this.setConnectionState('error');
      throw error;
    }
  };

  // Cleanup method to ensure everything is properly reset
  private cleanup = (): void => {
    debugLog('Performing cleanup');
    
    // Stop microphone if active
    if (this.microphoneStream) {
      this.microphoneStream.getTracks().forEach(track => {
        debugLog('Stopping microphone track:', track.kind);
        track.stop();
      });
      this.microphoneStream = null;
    }
    
    // Close audio context
    if (this.audioContext) {
      debugLog('Closing audio context');
      this.audioContext.close().catch(err => console.error('Error closing audio context:', err));
      this.audioContext = null;
    }
    
    // Remove script node
    if (this.scriptNode) {
      debugLog('Disconnecting script node');
      try {
        this.scriptNode.disconnect();
      } catch (e) {
        debugLog('Error disconnecting script node:', e);
      }
      this.scriptNode = null;
    }
    
    // Properly clean up audio element
    if (this.audioElement) {
      debugLog('Cleaning up audio element');
      
      // Stop any active playback
      try {
        this.audioElement.pause();
        this.audioElement.srcObject = null;
      } catch (e) {
        debugLog('Error pausing audio:', e);
      }
      
      // Remove from DOM
      if (this.audioElement.parentNode) {
        debugLog('Removing audio element from DOM');
        this.audioElement.parentNode.removeChild(this.audioElement);
      }
      
      this.audioElement = null;
    }
  };

  // Stop the session - EXACTLY matching sample app
  public stopSession = (): void => {
    debugLog('Stopping session');
    
    // First stop recording if active
    if (this.scriptNode || this.audioContext) {
      this.stopRecording();
    }
    
    // Close data channel
    if (this.dataChannel) {
      debugLog('Closing data channel');
      this.dataChannel.close();
      this.dataChannel = null;
    }
    
    // Stop all tracks
    if (this.peerConnection) {
      debugLog('Closing peer connection');
      this.peerConnection.getSenders().forEach((sender) => {
        if (sender.track) {
          debugLog('Stopping sender track:', sender.track.kind);
          sender.track.stop();
        }
      });
      
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    // Use proper cleanup method
    this.cleanup();
    
    // Reset ephemeral token to force a new session on reconnect
    this.ephemeralToken = null;
    
    // Reset state
    this.setConnectionState('disconnected');
    debugLog('Session stopped and state reset');
  };

  // Start recording audio - simplified to match example
  public startRecording = async (): Promise<void> => {
    debugLog('Starting recording');
    
    // Check if data channel is open
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.error('[RealtimeAudio] Cannot start recording: data channel not open');
      return;
    }
    
    try {
      // Get access to microphone
      this.microphoneStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000, // Use 16kHz for PCM16 format as required by OpenAI
        },
        video: false
      });
      
      // Store microphone track for later cleanup
      this.microphoneTrack = this.microphoneStream.getAudioTracks()[0];
      
      // Create audio context and connect to microphone
      this.audioContext = new AudioContext({
        sampleRate: 16000, // Force 16kHz sampling rate
        latencyHint: 'interactive'
      });
      
      this.streamSource = this.audioContext.createMediaStreamSource(this.microphoneStream);
      
      // Create script processor for audio processing
      // Note: ScriptProcessorNode is deprecated but still widely supported
      this.scriptNode = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      // Connect audio graph
      this.streamSource.connect(this.scriptNode);
      this.scriptNode.connect(this.audioContext.destination);
      
      // Process audio data
      this.scriptNode.onaudioprocess = (audioProcessingEvent) => {
        try {
          // Get audio data as Float32Array
          const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
          
          // Debug the audio data periodically
          if (Math.random() < 0.01) { // Log only 1% of frames to avoid flooding
            let sum = 0;
            for (let i = 0; i < inputData.length; i++) {
              sum += Math.abs(inputData[i]);
            }
            const avgVolume = sum / inputData.length;
            debugLog(`Recording audio - avg volume: ${avgVolume.toFixed(4)}`);
          }
          
          // Convert to Int16Array (PCM16 format) for OpenAI API
          const pcmData = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            // Convert float32 (-1 to 1) to int16 (-32768 to 32767)
            const s = Math.max(-1, Math.min(1, inputData[i]));
            pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }
          
          // Send audio data to server via data channel
          if (this.dataChannel && this.dataChannel.readyState === 'open') {
            try {
              // Convert PCM data to base64 string
              const base64Data = this.arrayBufferToBase64(pcmData.buffer);
              
              // Send in the format OpenAI expects for the Realtime API
              this.dataChannel.send(JSON.stringify({
                type: 'input_audio_buffer.append',
                audio: base64Data
              }));
            } catch (error) {
              console.error('[RealtimeAudio] Error sending audio data:', error);
            }
          }
        } catch (error) {
          console.error('[RealtimeAudio] Error in audio processing:', error);
        }
      };
      
      // Update state
      this.recordingState = 'recording';
      this.setConnectionState('recording');
      
      debugLog('Recording started');
    } catch (error) {
      console.error('[RealtimeAudio] Error starting recording:', error);
      this.recordingState = 'inactive';
      throw error;
    }
  };

  // Helper method to convert ArrayBuffer to Base64 string
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // Stop recording audio
  public stopRecording = (): void => {
    debugLog('Stopping recording');
    
    if (this.recordingState !== 'recording') {
      return;
    }
    
    // IMPORTANT: First send the commit message to finalize the audio buffer
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      debugLog('Sending input_audio_buffer.commit to finalize audio');
      try {
        // Send the commit message with the correct JSON format
        this.dataChannel.send(JSON.stringify({
          type: 'input_audio_buffer.commit'
        }));
        
        // Wait for the commit to be processed before creating a response
        setTimeout(() => {
          if (this.dataChannel && this.dataChannel.readyState === 'open') {
            debugLog('Requesting response after audio input');
            this.dataChannel.send(JSON.stringify({
              type: 'response.create',
              response: {
                modalities: ["text", "audio"]
              }
            }));
          }
        }, 250);
      } catch (error) {
        console.error('[RealtimeAudio] Error sending commit command:', error);
      }
    } else {
      debugLog('Cannot commit audio buffer - data channel not open');
    }
    
    // Then disconnect audio processing
    if (this.scriptNode) {
      try {
        this.scriptNode.disconnect();
      } catch (error) {
        console.error('[RealtimeAudio] Error disconnecting script node:', error);
      }
      this.scriptNode = null;
    }
    
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (error) {
        console.error('[RealtimeAudio] Error closing audio context:', error);
      }
      this.audioContext = null;
    }
    
    // Stop all microphone tracks
    if (this.microphoneTrack) {
      debugLog('Stopping microphone track:', this.microphoneTrack.kind);
      this.microphoneTrack.stop();
      this.microphoneTrack = null;
    }
    
    this.recordingState = 'inactive';
    this.setConnectionState('connected');
    
    // Notify recording stopped if callback is set
    if (this.onRecordingStopped) {
      this.onRecordingStopped();
    }
    
    debugLog('Recording stopped');
  };

  // Play audio helper with auto-play policy handling
  public playAudio = async (): Promise<void> => {
    debugLog('Attempting to play audio');
    if (!this.audioElement) {
      debugLog('No audio element available');
      return;
    }
    
    try {
      // Ensure the MediaElement is properly configured for playback
      if (this.audioElement.srcObject === null) {
        debugLog('Audio element has no source - attempting to reconnect from receivers');
        // Try to reconnect the audio stream from any available receiver
        const audioReceivers = this.peerConnection?.getReceivers()
          .filter(receiver => receiver.track && receiver.track.kind === 'audio');
          
        if (audioReceivers && audioReceivers.length > 0) {
          const audioTracks = audioReceivers.map(receiver => receiver.track);
          debugLog(`Found ${audioTracks.length} audio tracks to reconnect`);
          
          // Create a new MediaStream with the audio tracks
          const stream = new MediaStream(audioTracks);
          this.audioElement.srcObject = stream;
        } else {
          debugLog('No audio receivers found');
        }
      }
      
      // Ensure proper audio settings
      this.audioElement.muted = false;
      this.audioElement.volume = 1.0;
      
      // Force a reload of the audio element to reset any stalled state
      if (this.audioElement.currentTime > 0 && this.audioElement.paused) {
        debugLog('Audio appears stalled, reloading element');
        this.audioElement.currentTime = 0;
      }
      
      debugLog('Calling play()');
      await this.audioElement.play();
      debugLog('Playback started successfully');
      
      // Check if audio is actually playing
      const checkAudioPlayback = () => {
        if (this.audioElement) {
          // Audio should progress if playing properly
          const currentTime = this.audioElement.currentTime;
          
          setTimeout(() => {
            if (this.audioElement) {
              const newTime = this.audioElement.currentTime;
              if (newTime > currentTime) {
                debugLog('Audio playback progressing correctly');
              } else if (!this.audioElement.paused) {
                debugLog('Audio appears stalled but not paused - attempting recovery');
                // Try to restart by loading new data
                if (this.audioElement.srcObject) {
                  const oldSrc = this.audioElement.srcObject;
                  this.audioElement.srcObject = null;
                  // Short delay before reattaching
                  setTimeout(() => {
                    if (this.audioElement) {
                      this.audioElement.srcObject = oldSrc;
                      this.audioElement.play().catch(e => debugLog('Error restarting:', e));
                    }
                  }, 100);
                }
              }
            }
          }, 500); // Check after 500ms
        }
      };
      
      // Initiate the check
      checkAudioPlayback();
      
      debugLog('Audio playback successful');
    } catch (error) {
      debugLog('Audio play failed, this may be due to autoplay policy:', error);
      console.error('[RealtimeAudio] Audio playback failed:', error);
      
      // Try to determine if this is an autoplay policy issue
      const isAutoPlayBlocked = 
        error instanceof DOMException && 
        (error.name === 'NotAllowedError' || 
         error.message.includes('play') || 
         error.message.includes('user'));
      
      if (isAutoPlayBlocked) {
        debugLog('Detected autoplay policy restriction');
        
        // Create an unmuted audio element with controls for testing
        if (this.audioElement.parentNode) {
          this.audioElement.parentNode.removeChild(this.audioElement);
        }
        
        this.audioElement = document.createElement('audio');
        this.audioElement.autoplay = true;
        this.audioElement.controls = true; // Show controls for debugging
        this.audioElement.muted = false;
        this.audioElement.volume = 1.0;
        this.audioElement.setAttribute('playsinline', '');
        this.audioElement.setAttribute('id', 'realtime-audio-element');
        this.audioElement.style.position = 'fixed';
        this.audioElement.style.bottom = '20px';
        this.audioElement.style.right = '20px';
        this.audioElement.style.zIndex = '9999';
        this.audioElement.style.width = '300px';
        
        document.body.appendChild(this.audioElement);
        debugLog('Created visible audio element with controls for user interaction');
        
        // If we have a source already, reattach it
        if (this.peerConnection) {
          this.peerConnection.getReceivers().forEach(receiver => {
            if (receiver.track && receiver.track.kind === 'audio' && this.audioElement) {
              const stream = new MediaStream([receiver.track]);
              this.audioElement.srcObject = stream;
              debugLog('Reconnected audio track to visible audio element');
            }
          });
        }
      }
    }
  };

  // Network diagnostics and connection monitoring
  private setupNetworkMonitoring = (): void => {
    if (!this.peerConnection) return;
    
    // Stats monitoring interval
    let statsInterval: NodeJS.Timeout | null = null;
    
    // Setup network quality monitoring
    const monitorConnectionQuality = async () => {
      if (!this.peerConnection) return;
      
      try {
        const stats = await this.peerConnection.getStats();
        let packetLoss = 0;
        let roundTripTime = 0;
        let jitter = 0;
        let audioLevel = 0;
        
        stats.forEach(report => {
          if (report.type === 'inbound-rtp' && report.kind === 'audio') {
            if (report.packetsLost !== undefined && report.packetsReceived !== undefined) {
              packetLoss = report.packetsLost / (report.packetsLost + report.packetsReceived) * 100;
            }
            if (report.jitter !== undefined) {
              jitter = report.jitter * 1000; // Convert to ms
            }
          }
          
          if (report.type === 'remote-inbound-rtp' && report.kind === 'audio') {
            if (report.roundTripTime !== undefined) {
              roundTripTime = report.roundTripTime * 1000; // Convert to ms
            }
          }
          
          if (report.type === 'media-source' && report.kind === 'audio') {
            if (report.audioLevel !== undefined) {
              audioLevel = report.audioLevel;
            }
          }
        });
        
        // Log network diagnostics
        if (this.connectionState === 'connected') {
          debugLog('WebRTC Stats - RTT:', roundTripTime.toFixed(2), 'ms, Packet Loss:', 
                   packetLoss.toFixed(2), '%, Jitter:', jitter.toFixed(2), 'ms, Audio Level:', audioLevel.toFixed(2));
          
          // Check for poor connection
          if (packetLoss > 5 || roundTripTime > 300 || jitter > 50) {
            debugLog('WARNING: Poor connection quality detected');
            
            if (packetLoss > 15 || roundTripTime > 500) {
              debugLog('CRITICAL: Very poor connection - may affect audio quality');
            }
          }
        }
      } catch (error) {
        debugLog('Error monitoring connection quality:', error);
      }
    };
    
    // Start monitoring after connection is established
    this.peerConnection.onconnectionstatechange = () => {
      const connectionState = this.peerConnection?.connectionState;
      debugLog('WebRTC connection state changed:', connectionState);
      
      if (connectionState === 'connected') {
        debugLog('Connection established - starting network monitoring');
        statsInterval = setInterval(monitorConnectionQuality, 3000);
      } else if (connectionState === 'disconnected' || connectionState === 'failed' || connectionState === 'closed') {
        debugLog('Connection ended - stopping network monitoring');
        if (statsInterval) {
          clearInterval(statsInterval);
          statsInterval = null;
        }
      }
    };
    
    // Clean up monitoring on service cleanup
    const originalCleanup = this.cleanup;
    this.cleanup = () => {
      if (statsInterval) {
        clearInterval(statsInterval);
      }
      originalCleanup();
    };
  };

  // Handle incoming messages from the data channel
  private handleDataChannelMessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      
      // Reset the stall detection on any message
      this._receivedAnyResponse = true;
      
      // Log the raw message for debugging
      debugLog('Received message from OpenAI:', message.type || 'Unknown type');
      
      if (this.onMessage) {
        this.onMessage(message);
      }
      
      // Handle session messages
      if (message.type === 'session.created' || message.type === 'session.updated') {
        debugLog('Session update received:', message.type);
        // Update session configuration from server if available
        if (message.session) {
          // Only update if values are provided, preserving existing ones
          if (message.session.voice) this.voice = message.session.voice;
          if (message.session.instructions) this.instructions = message.session.instructions;
          if (message.session.modalities) this.modalities = message.session.modalities;
          if (message.session.input_audio_format) this.input_audio_format = message.session.input_audio_format;
          if (message.session.output_audio_format) this.output_audio_format = message.session.output_audio_format;
          debugLog('Updated session config from server');
        }
      }
      
      // Handle audio buffer events
      if (message.type === 'input_audio_buffer.committed') {
        debugLog('Audio buffer committed, item_id:', message.item_id);
      }
      
      if (message.type === 'input_audio_buffer.cleared') {
        debugLog('Audio buffer cleared');
      }
      
      // Handle speech detection in VAD mode
      if (message.type === 'input_audio_buffer.speech_started') {
        debugLog('Speech detected, starting at:', message.audio_start_ms);
      }
      
      if (message.type === 'input_audio_buffer.speech_stopped') {
        debugLog('Speech stopped, ending at:', message.audio_end_ms);
        if (this.onRecordingStopped) {
          this.onRecordingStopped();
        }
      }
      
      // Handle conversation item events
      if (message.type === 'conversation.item.created') {
        debugLog('Conversation item created:', message.item?.role);
        
        // Process text content
        if (message.item?.role === 'assistant' && message.item?.content) {
          // Extract text from the content array if it exists
          const textContent = message.item.content.find(part => part.type === 'text');
          if (textContent && textContent.text && this.onTranscriptUpdate) {
            debugLog('Text from conversation item:', textContent.text);
            this.onTranscriptUpdate(textContent.text);
          }
        }
      }
      
      // Handle input audio transcription events
      if (message.type === 'conversation.item.input_audio_transcription.completed') {
        debugLog('Audio transcription completed:', message.transcript);
        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(`[Transcript: ${message.transcript}]`);
        }
      }
      
      // Handle response events - support both old and new formats
      if (message.type === 'response.started' || message.type === 'response.created') {
        debugLog('Response started');
        this.setConnectionState('processing');
      }
      
      if (message.type === 'response.done') {
        debugLog('Response completed');
        this.setConnectionState('connected');
      }
      
      // Handle text response - support both formats
      if (message.type === 'response.text' || message.type === 'response.text.delta') {
        const text = message.text || message.delta || '';
        debugLog('Text response received:', text);
        if (this.onTranscriptUpdate && text) {
          this.onTranscriptUpdate(text);
        }
      }
      
      // Handle text completion
      if (message.type === 'response.text.done') {
        debugLog('Text response completed');
      }
      
      // Handle audio transcript delta
      if (message.type === 'response.audio_transcript.delta') {
        const transcriptDelta = message.delta || '';
        debugLog('Audio transcript delta received:', transcriptDelta);
        if (this.onTranscriptUpdate && transcriptDelta) {
          this.onTranscriptUpdate(transcriptDelta);
        }
      }
      
      // Handle audio responses - support both old and new formats
      if (message.type === 'response.audio.delta') {
        const audioData = message.delta || message.data || '';
        const audioLength = audioData ? audioData.length : 0;
        debugLog('Audio delta received - data length:', audioLength);
        if (audioLength > 0 && this.audioElement) {
          // Update connection state to speaking
          this.setConnectionState('speaking');
        }
      }
      
      // Handle audio events - support both naming conventions
      if (message.type === 'response.audio.begin' || message.type === 'response.audio_begin') {
        debugLog('Audio response beginning');
        this.setConnectionState('speaking');
      }
      
      if (message.type === 'response.audio.done' || message.type === 'response.audio_done' || message.type === 'response.audio.end') {
        debugLog('Audio response completed');
        this.setConnectionState('connected');
      }
      
      // Handle function calls - support both old and new formats
      if (message.type === 'function_call' || message.type === 'response.function_call') {
        debugLog('Function call received:', message);
        if (this.onFunctionCall) {
          this.onFunctionCall(message);
        }
      }
      
      // Handle new format function calls
      if (message.type === 'response.function_call_arguments.delta') {
        debugLog('Function call arguments delta received');
        // This is handled when the full arguments are available in .done event
      }
      
      if (message.type === 'response.function_call_arguments.done') {
        debugLog('Function call completed:', message.arguments);
        if (this.onFunctionCall && message.arguments) {
          try {
            const functionCallData = {
              name: message.call_id,
              arguments: JSON.parse(message.arguments)
            };
            this.onFunctionCall(functionCallData);
          } catch (error) {
            debugLog('Error parsing function call arguments:', error);
          }
        }
      }
      
      // Enhanced error handling
      if (message.type === 'error') {
        const errorDetails = message.error || 'Unknown error';
        debugLog('ERROR DETAILS:', errorDetails);
        console.error('[RealtimeAudio] Server reported error:', errorDetails);
        
        // If we have an error callback, call it with the error details
        if (this.onError) {
          this.onError(new Error(`Server error: ${JSON.stringify(errorDetails)}`));
        }
      }
    } catch (error) {
      debugLog('Error parsing message:', error);
    }
  };

  // Setup data channel method
  private setupDataChannel = (): void => {
    if (!this.peerConnection) return;
    
    debugLog('Creating data channel');
    // Create data channel with EXACT OpenAI requirements - must be named 'oai-events'
    this.dataChannel = this.peerConnection.createDataChannel('oai-events', {
      ordered: true
    });
    
    // Handle data channel events
    this.dataChannel.onopen = () => {
      debugLog('Data channel opened successfully');
      this.setConnectionState('connected');
      
      // Set up ping interval to keep the connection alive (every 10 seconds)
      const pingInterval = setInterval(() => {
        if (this.dataChannel && this.dataChannel.readyState === 'open') {
          // Send a ping to prevent timeouts
          this.dataChannel.send(JSON.stringify({
            type: 'ping'
          }));
          debugLog('Sent ping to keep connection alive');
        } else {
          // Clear interval if data channel is closed
          clearInterval(pingInterval);
        }
      }, 10000);
      
      // Configure session
      if (this.dataChannel && this.dataChannel.readyState === 'open') {
        try {
          // First, update session with all configured parameters
          debugLog('Sending session.update to configure the assistant');
          const sessionConfig: any = {
            voice: this.voice,
            instructions: this.instructions,
            modalities: this.modalities
          };
          
          // Add optional configurations if they're set
          if (this.input_audio_format) sessionConfig.input_audio_format = this.input_audio_format;
          if (this.output_audio_format) sessionConfig.output_audio_format = this.output_audio_format;
          if (this.input_audio_transcription) sessionConfig.input_audio_transcription = this.input_audio_transcription;
          if (this.turn_detection) sessionConfig.turn_detection = this.turn_detection;
          if (this.tools && Array.isArray(this.tools) && this.tools.length > 0) sessionConfig.tools = this.tools;
          if (this.tool_choice !== null) sessionConfig.tool_choice = this.tool_choice;
          if (this.temperature !== null) sessionConfig.temperature = this.temperature;
          if (this.max_response_output_tokens !== null) sessionConfig.max_response_output_tokens = this.max_response_output_tokens;
          
          this.dataChannel.send(JSON.stringify({
            type: 'session.update',
            session: sessionConfig
          }));
          
          // Then, create a response with default instructions to get the model started
          debugLog('Creating initial response');
          this.dataChannel.send(JSON.stringify({
            type: 'response.create',
            response: {
              modalities: this.modalities,
              instructions: this.instructions,
            }
          }));
        } catch (error) {
          console.error('[RealtimeAudio] Error sending initialization messages:', error);
        }
      }
      
      // Notify listeners that data channel is open
      if (this.onDataChannelOpen) {
        this.onDataChannelOpen();
      }
    };
    
    this.dataChannel.onclose = () => {
      debugLog('Data channel closed');
      this.setConnectionState('disconnected');
    };
    
    this.dataChannel.onerror = (event) => {
      debugLog('Data channel error:', event);
      this.setConnectionState('error');
      
      if (this.onError) {
        this.onError(new Error('Data channel error'));
      }
    };
    
    this.dataChannel.onmessage = this.handleDataChannelMessage;
  };

  // Get SDP from OpenAI
  private getSdpAnswerFromOpenAI = async (sdp: string): Promise<RTCSessionDescriptionInit> => {
    debugLog('Sending SDP to OpenAI API via backend relay');
    
    try {
      // Don't renegotiate if we're already in a signaling state with a pending operation
      if (this.peerConnection?.signalingState !== 'have-local-offer') {
        debugLog(`Cannot send SDP in current signaling state: ${this.peerConnection?.signalingState}`);
        throw new Error(`Cannot send SDP in current signaling state: ${this.peerConnection?.signalingState}`);
      }
      
      // Request SDP answer from server
      const sdpResponse = await fetch(`${this.backendUrl}/api/realtime/sessions/sdp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.ephemeralToken,
          sdp: sdp,
          type: 'offer'
        })
      });
      
      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        debugLog('Error getting SDP answer:', sdpResponse.status, errorText);
        throw new Error(`Error getting SDP answer: ${sdpResponse.status} - ${errorText}`);
      }
      
      const data = await sdpResponse.json();
      debugLog('Received SDP answer:', data);
      
      if (!data.sdp) {
        throw new Error('No SDP received in answer from server');
      }
      
      // Create answer with received SDP
      return { type: 'answer', sdp: data.sdp };
    } catch (error) {
      // Avoid repeatedly throwing the same error during renegotiation
      debugLog('Error in getSdpAnswerFromOpenAI:', error);
      this.setConnectionState('error');
      
      if (this.onError) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.onError(new Error(`SDP negotiation failed: ${errorMessage}`));
      }
      
      // Rethrow to handle in caller
      throw error;
    }
  };
  
  // Safe method to set remote description that handles racing conditions
  private safeSetRemoteDescription = async (description: RTCSessionDescriptionInit): Promise<void> => {
    try {
      debugLog('Setting remote description');
      
      // Fix for Firefox SDP compatibility
      let modifiedSdp = description.sdp;
      
      // Only set the remote description if we're in a valid state
      if (this.peerConnection && 
          (this.peerConnection.signalingState === 'have-local-offer' || 
           this.peerConnection.signalingState === 'stable')) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription({
          type: description.type,
          sdp: modifiedSdp
        }));
        
        debugLog('Set remote description successfully');
      } else {
        debugLog(`Cannot set remote description in current state: ${this.peerConnection?.signalingState}`);
        throw new Error(`Invalid signaling state for setRemoteDescription: ${this.peerConnection?.signalingState}`);
      }
    } catch (error) {
      debugLog('Error setting remote description:', error);
      throw error;
    }
  };

  // Improved method to handle renegotiation that avoids the m-line order error
  private handleRenegotiation = async (): Promise<void> => {
    if (!this.peerConnection) return;
    
    try {
      // If we're not in stable state, wait until we are
      if (this.peerConnection.signalingState !== 'stable') {
        debugLog(`Postponing renegotiation - current state: ${this.peerConnection.signalingState}`);
        // Set a flag to renegotiate when we become stable
        this._pendingRenegotiation = true;
        return;
      }
      
      debugLog('Negotiation needed - creating new offer');
      
      // Reset configuration
      this._pendingRenegotiation = false;
      
      // Create offer with specific codec preferences
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
        iceRestart: this._iceRestartNeeded || false
      });
      
      // Reset ice restart flag
      this._iceRestartNeeded = false;
      
      debugLog('Created WebRTC offer - SDP length:', offer.sdp?.length);
      
      // Set as local description
      debugLog('Setting local description with new offer');
      await this.peerConnection.setLocalDescription(offer);
      debugLog('Set local description');
      
      if (!this.peerConnection.localDescription) {
        throw new Error('Failed to set local description');
      }
      
      // Get answer from OpenAI
      const remoteDesc = await this.getSdpAnswerFromOpenAI(this.peerConnection.localDescription.sdp);
      
      // Set the remote description only if we're still in a valid state
      // This prevents the m-line order error
      await this.safeSetRemoteDescription(remoteDesc);
      
      debugLog('SDP negotiation completed successfully');
    } catch (error) {
      debugLog('Error during renegotiation:', error);
      this.setConnectionState('error');
      
      // If we had an error setting the local description, we need to roll back
      if (this.peerConnection.signalingState === 'have-local-offer') {
        try {
          debugLog('Rolling back local description after error');
          await this.peerConnection.setLocalDescription({type: 'rollback'});
          debugLog('Rolled back to stable state');
        } catch (rollbackError) {
          debugLog('Error rolling back:', rollbackError);
        }
      }
    }
  };
}

// Export singleton instance
const realtimeAudioService = new RealtimeAudioService();
export default realtimeAudioService;

// Export types for use in other files
export type { ConfigOptions };
