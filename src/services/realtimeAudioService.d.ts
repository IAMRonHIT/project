// Type definitions for realtimeAudioService
export type ConnectionState = 
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'recording'
  | 'processing'
  | 'speaking'
  | 'error';

export interface ConfigOptions {
  instructions?: string;
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' | 'ash';
  model?: string;
  onTranscriptUpdate?: (text: string) => void;
  onConnectionStateChange?: (state: ConnectionState) => void;
  onError?: (error: Error) => void;
}

declare class RealtimeAudioService {
  config(options: ConfigOptions): void;
  createSession(): Promise<boolean>;
  connect(): Promise<boolean>;
  startRecording(): Promise<boolean>;
  stopSession(): Promise<void>;
  start(): Promise<boolean>;
  stopRecording(): Promise<void>;
}

declare const realtimeAudioService: RealtimeAudioService;
export default realtimeAudioService;
