export interface GeminiAuth { // Renamed from GeminiConfig to avoid confusion
  apiKey: string;
  baseURL: string;
}

export interface GeminiProfileSettings {
  model: string;
  temperature: number;
  features: {
    toolCalling?: boolean;
    codeExecution?: boolean;
    streaming?: boolean;
  };
  maxOutputTokens?: number;
}

export type GeminiProfileName = 'default' | 'codingPro' | 'realtimeAudio';

export const geminiConfig: Record<GeminiProfileName, GeminiProfileSettings> = {
  default: {
    model: 'gemini-2.5-flash-preview-04-17',
    temperature: 0.7,
    features: {
      toolCalling: true,
      streaming: true
    },
    maxOutputTokens: 8192
  },
  codingPro: {
    model: 'gemini-2.5-pro-preview-05-06',
    temperature: 0.9,
    features: {
      toolCalling: true,
      codeExecution: true,
      streaming: true
    },
    maxOutputTokens: 8192
  },
  realtimeAudio: {
    model: 'gemini-2.0-flash',
    temperature: 0.7,
    features: {
      toolCalling: true,
      streaming: true
    },
    maxOutputTokens: 8192
  }
};

import { env } from './environment';

export function getGeminiAuth(): GeminiAuth {
  return {
    apiKey: env.GEMINI_API_KEY,
    baseURL: env.GEMINI_API_BASE_URL
  };
}
