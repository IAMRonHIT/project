# Streaming Implementation

This document details the streaming implementation for Gemini models in the IntelAgents.

## Overview

The streaming implementation enables real-time response delivery from Gemini models, with support for:
- Token-by-token delivery
- Function calling during streaming
- Error handling and recovery
- Connection management

## TypeScript Implementation

### Types
```typescript
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

interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}
```

### Streaming Service
```typescript
export class GeminiStreamService {
  private client: OpenAI;
  private modelRouter: GeminiModelRouter;

  constructor(config: GeminiConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai'
    });
    this.modelRouter = new GeminiModelRouter();
  }

  async createStream(
    mode: ModeType,
    content: string,
    config: StreamConfig,
    tools?: ToolDefinition[]
  ): Promise<void> {
    const model = this.modelRouter.selectModel(mode, {
      content,
      estimatedTokens: this.estimateTokens(content),
      hasCode: this.detectCodeBlocks(content),
      hasImages: this.detectImageUrls(content)
    });

    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages: [{ role: 'user', content }],
        stream: true,
        tools,
        temperature: mode === 'deep-thinking' ? 0.9 : 0.7
      });

      for await (const chunk of stream) {
        if (chunk.choices[0]?.delta?.content) {
          config.onToken(chunk.choices[0].delta.content);
        }

        if (chunk.choices[0]?.delta?.tool_calls) {
          config.onToolCall?.(chunk.choices[0].delta.tool_calls[0]);
        }

        if (chunk.choices[0]?.finish_reason === 'stop') {
          config.onComplete?.();
        }
      }
    } catch (error) {
      config.onError?.({
        code: error.code || 'STREAM_ERROR',
        message: error.message,
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
    return /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i.test(content);
  }
}
```

### React Hook Implementation
```typescript
export function useGeminiStream(mode: ModeType) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<StreamError | null>(null);
  const streamService = useRef<GeminiStreamService>();
  const abortController = useRef<AbortController>();

  useEffect(() => {
    streamService.current = new GeminiStreamService({
      apiKey: process.env.GEMINI_API_KEY!
    });
    
    return () => {
      abortController.current?.abort();
    };
  }, []);

  const startStream = useCallback(async (
    content: string,
    onToken: (token: string) => void,
    tools?: ToolDefinition[]
  ) => {
    setIsStreaming(true);
    setError(null);
    abortController.current = new AbortController();

    try {
      await streamService.current?.createStream(mode, content, {
        onToken,
        onError: (err) => {
          setError(err);
          setIsStreaming(false);
        },
        onComplete: () => setIsStreaming(false),
        onToolCall: async (tool) => {
          // Handle tool calls based on mode
          if (mode === 'default') {
            const result = await executeToolCall(tool);
            onToken(`\nTool Result: ${JSON.stringify(result)}\n`);
          }
        }
      }, tools);
    } catch (err) {
      setError({
        code: 'STREAM_INIT_ERROR',
        message: err.message
      });
      setIsStreaming(false);
    }
  }, [mode]);

  return {
    startStream,
    isStreaming,
    error,
    stopStream: () => abortController.current?.abort()
  };
}
```

## Usage Example

```typescript
function ChatComponent() {
  const { activeMode } = useModeDropdown();
  const { startStream, isStreaming, error } = useGeminiStream(activeMode);
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = async (content: string) => {
    let currentMessage = '';
    
    await startStream(
      content,
      (token) => {
        currentMessage += token;
        setMessages(prev => [
          ...prev.slice(0, -1),
          currentMessage
        ]);
      },
      activeMode === 'default' ? [fdaToolDefinition, npiToolDefinition] : undefined
    );
  };

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg}</div>
      ))}
      {isStreaming && <LoadingIndicator />}
      {error && <ErrorMessage error={error} />}
    </div>
  );
}
```

## Error Handling

The streaming implementation includes comprehensive error handling:

1. Network Errors
   - Connection failures
   - Timeout handling
   - Automatic retry logic

2. Model Errors
   - Invalid responses
   - Token limit exceeded
   - Model-specific errors

3. Tool Call Errors
   - Failed function executions
   - Invalid tool responses
   - Timeout handling

## Best Practices

1. Always implement proper cleanup
   ```typescript
   useEffect(() => {
     return () => abortController.current?.abort();
   }, []);
   ```

2. Handle partial messages appropriately
   ```typescript
   let buffer = '';
   onToken: (token) => {
     buffer += token;
     if (isCompleteMessage(buffer)) {
       processMessage(buffer);
       buffer = '';
     }
   }
   ```

3. Implement proper error recovery
   ```typescript
   onError: (error) => {
     if (isRecoverable(error)) {
       retryStream();
     } else {
       handleFatalError(error);
     }
   }
   ```

4. Mode-specific considerations
   - Default mode: Enable tool calling
   - Deep Thinking mode: Enable code execution
   - Handle mode transitions gracefully
