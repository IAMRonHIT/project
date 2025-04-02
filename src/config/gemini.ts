export interface GeminiConfig {
  apiKey: string;
  baseURL: string;
}

export const geminiConfig = {
  default: {
    temperature: 0.7,
    features: {
      toolCalling: true,
      streaming: true
    }
  },
  deepThinking: {
    model: 'gemini-2.5-pro-exp-03-25',
    temperature: 0.9,
    features: {
      codeExecution: true,
      streaming: true,
      functionCalling: false
    }
  }
};

import { env } from './environment';

export function getGeminiConfig(): GeminiConfig {
  return {
    apiKey: env.GEMINI_API_KEY,
    baseURL: env.GEMINI_API_BASE_URL
  };
}
