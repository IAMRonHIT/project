import { 
  GoogleGenerativeAI, 
  GenerativeModel, 
  EnhancedGenerateContentResponse,
  FunctionDeclaration,
  GenerateContentStreamResult,
  Part,
  SchemaType,
  GenerationConfig,
  ChatSession,
  GenerateContentResult,
  GoogleGenerativeAIError
} from '@google/generative-ai';
import { sleep } from '../utils/asyncUtils';

// Define mode type directly in this file
type ModeType = 'default' | 'realtime-audio';

// Rate limiting configuration - adjusted to be more lenient
const RATE_LIMIT = {
  WINDOW_MS: 60 * 1000, // 1 minute window
  MAX_REQUESTS: 15,      // Reduced max requests per window to be safe
  RETRY_DELAY_MS: 2000,  // Increased initial retry delay
  MAX_RETRIES: 5,        // Increased max retries
  JITTER_MS: 500,        // Added jitter to spread out retries
  BACKOFF_FACTOR: 2,     // Exponential backoff factor
  MAX_RETRY_DELAY: 10000  // Max delay between retries (10s)
};

// Track rate limiting state
let requestQueue: number[] = [];
let isProcessing = false;
import { ToolDefinition, ToolCall, Schema, toGeminiSchema } from '../types/tool';
import { GeminiProfileSettings, GeminiAuth } from '../config/gemini'; // Added GeminiProfileSettings and GeminiAuth

interface StreamConfig {
  onToken: (token: string) => void;
  onToolCall?: (tool: ToolCall) => void;
  onError?: (error: StreamError) => void;
  onComplete?: () => void;
}

interface StreamError {
  code: string;
  message: string;
  details?: unknown;
}



export class GeminiStreamService {
  private client: GoogleGenerativeAI;
  private models: Map<string, GenerativeModel>;
  private defaultPrompt = `You're Ron of Ron AI, you're a fun, intelligent and helpful assistant who can provide healthcare coordination and create code when requested. When asked to write code, please provide complete, functional solutions with proper syntax.`;



  private getSystemPrompt(): string { 
    return this.defaultPrompt;
  }
  constructor(config: GeminiAuth) {
    this.client = new GoogleGenerativeAI(config.apiKey);
    this.models = new Map();
  }

  private getModel(modelName: string): GenerativeModel {
    if (!this.models.has(modelName)) {
      this.models.set(modelName, this.client.getGenerativeModel({ model: modelName }));
    }
    return this.models.get(modelName)!;
  }

    private async processWithRateLimit<T>(
    fn: () => Promise<T>,
    onRateLimit: () => Promise<void>,
    attempt = 0
  ): Promise<T> {
    const now = Date.now();
    
    // Remove requests older than our window
    requestQueue = requestQueue.filter(timestamp => now - timestamp < RATE_LIMIT.WINDOW_MS);
    
    // If we've hit the rate limit, wait until the oldest request falls out of the window
    if (requestQueue.length >= RATE_LIMIT.MAX_REQUESTS) {
      const oldestRequest = requestQueue[0];
      const waitTime = RATE_LIMIT.WINDOW_MS - (now - oldestRequest);
      
      // Add jitter to spread out retries
      const jitter = Math.random() * RATE_LIMIT.JITTER_MS;
      await sleep(waitTime + jitter);
      
      return this.processWithRateLimit(fn, onRateLimit, attempt + 1);
    }
    
    // Add current request to queue
    requestQueue.push(now);
    
    try {
      return await fn();
    } catch (error) {
      if (this.isRateLimitError(error)) {
        await onRateLimit();
        
        // Calculate exponential backoff with jitter
        const backoff = Math.min(
          RATE_LIMIT.RETRY_DELAY_MS * Math.pow(RATE_LIMIT.BACKOFF_FACTOR, attempt) + 
          (Math.random() * RATE_LIMIT.JITTER_MS - RATE_LIMIT.JITTER_MS / 2),
          RATE_LIMIT.MAX_RETRY_DELAY
        );
        
        await sleep(backoff);
        return this.processWithRateLimit(fn, onRateLimit, attempt + 1);
      }
      throw error;
    }
  }

  private isRateLimitError(error: any): boolean {
    return error?.status === 429 || // HTTP 429 Too Many Requests
           error?.code === 429 ||    // Some APIs might use code
           error?.message?.includes('quota') ||
           error?.message?.includes('rate limit') ||
           error?.message?.includes('too many requests');
  }

  private async withRetry<T>(
    fn: () => Promise<T>,
    config: StreamConfig,
    retries = RATE_LIMIT.MAX_RETRIES,
    attempt = 0
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries <= 0) {
        throw error;
      }

      const isRateLimited = this.isRateLimitError(error);
      
      // Calculate exponential backoff with jitter
      const backoff = Math.min(
        RATE_LIMIT.RETRY_DELAY_MS * Math.pow(RATE_LIMIT.BACKOFF_FACTOR, attempt) + 
        (Math.random() * RATE_LIMIT.JITTER_MS - RATE_LIMIT.JITTER_MS / 2),
        RATE_LIMIT.MAX_RETRY_DELAY
      );
      
      config.onToken?.(`\n[System: ${isRateLimited ? 'Rate limit reached' : 'Error occurred'}. Retrying in ${Math.ceil(backoff/1000)}s...]\n`);
      
      await sleep(backoff);
      return this.withRetry(fn, config, retries - 1, attempt + 1);
    }
  }

  private getRetryAfterTime(error: any, attempt: number): number {
    // Check for Retry-After header first
    const retryAfter = error?.response?.headers?.['retry-after'];
    if (retryAfter) {
      return parseInt(retryAfter, 10) * 1000;
    }
    
    // Use exponential backoff with jitter
    const baseDelay = RATE_LIMIT.RETRY_DELAY_MS * Math.pow(RATE_LIMIT.BACKOFF_FACTOR, attempt);
    const jitter = Math.random() * RATE_LIMIT.JITTER_MS - (RATE_LIMIT.JITTER_MS / 2);
    
    return Math.min(baseDelay + jitter, RATE_LIMIT.MAX_RETRY_DELAY);
  }

  async createStream(
    profile: GeminiProfileSettings, // Changed from mode to profile
    content: string,
    config: StreamConfig,
    tools?: ToolDefinition[]
  ): Promise<void> {
    const model = this.getModel(profile.model); // Use profile.model

    try {
      // Basic configuration for content generation
      const generationConfig: GenerationConfig = {
        temperature: profile.temperature, // Use profile.temperature
        candidateCount: 1,
        stopSequences: [],
        maxOutputTokens: profile.maxOutputTokens // Use profile.maxOutputTokens
      };

      if (profile.features?.toolCalling && tools && tools.length > 0) { // Check profile.features.toolCalling
        // Handle tool-based requests
        const functionDeclarations: FunctionDeclaration[] = tools.map(tool => ({
          name: tool.function.name,
          description: tool.function.description,
          parameters: {
            type: SchemaType.OBJECT,
            properties: Object.entries(tool.function.parameters.properties).reduce((acc, [key, value]) => {
              acc[key] = toGeminiSchema(value);
              return acc;
            }, {} as { [key: string]: Schema }),
            required: tool.function.parameters.required || []
          }
        }));

        const chat = model.startChat({
          tools: [{ functionDeclarations }]
        });
        
        const executeChat = async () => {
          const result = await chat.sendMessage(content);
          const response = await result.response;
          const text = response.text();
          
          if (text) {
            config.onToken(text);
          }
          
          // Handle function calls if present
          const functionCalls = response.functionCalls() || [];
          for (const functionCall of functionCalls) {
            config.onToolCall?.({
              id: Math.random().toString(36).substring(7),
              type: 'function',
              function: {
                name: functionCall.name,
                arguments: JSON.stringify(functionCall.args)
              }
            });
          }
          
          return { response, text };
        };
        
        await this.processWithRateLimit(
          () => this.withRetry(executeChat, config),
          async () => {
            config.onToken?.(`\n[System: Approaching rate limit. Waiting for next available slot...]\n`);
            await sleep(2000);
          }
        );
        
        config.onComplete?.();
      } else {
        // Simple prompt for content generation
        const executePrompt = async () => {
          const prompt = this.getSystemPrompt() + '\n\n' + content; // Removed mode from getSystemPrompt call
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          
          if (text) {
            config.onToken(text);
          }
          
          return { response, text };
        };
        
        await this.processWithRateLimit(
          () => this.withRetry(executePrompt, config),
          async () => {
            config.onToken?.(`\n[System: Approaching rate limit. Waiting for next available slot...]\n`);
            await sleep(2000);
          }
        );
        
        config.onComplete?.();
      }
    } catch (error: any) {
      config.onError?.({
        code: error?.code || 'STREAM_ERROR',
        message: error?.message || 'An error occurred during streaming',
        details: error
      });
    }
  }

  private estimateTokens(content: string): number {
    // Rough estimation: ~1.3 tokens per word
    return content.split(/\s+/).length * 1.3;
  }

  private detectCodeBlocks(content: string): boolean {
    return /```[\s\S]*?```/.test(content);
  }
  
  private detectImageUrls(content: string): boolean {
    return /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)/i.test(content);
  }
}
