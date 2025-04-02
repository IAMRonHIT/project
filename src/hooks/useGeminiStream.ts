import { useState, useRef, useCallback, useEffect } from 'react';
import { GeminiStreamService } from '../services/GeminiStreamService';
import { getGeminiConfig } from '../config/gemini';
import { ModeType } from '../services/GeminiModelRouter';

interface StreamError {
  code: string;
  message: string;
}

import { createToolHandler } from '../services/ToolHandler';
import { env } from '../config/environment';

// Initialize tool handler with environment variables
const toolHandler = createToolHandler({
  FDA_API_KEY: env.FDA_API_KEY,
  GOOGLE_MAPS_API_KEY: env.GOOGLE_MAPS_API_KEY,
  PUBMED_API_KEY: env.PUBMED_API_KEY
});

// Get tool definitions
const toolDefinitions = toolHandler.getToolDefinitions();

interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, any>;
  };
}

export function useGeminiStream(mode: ModeType) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<StreamError | null>(null);
  const streamService = useRef<GeminiStreamService>();
  const abortController = useRef<AbortController>();

  useEffect(() => {
    try {
      const config = getGeminiConfig();
      streamService.current = new GeminiStreamService(config);
    } catch (err) {
      setError({
        code: 'CONFIG_ERROR',
        message: err instanceof Error ? err.message : 'Failed to initialize Gemini service'
      });
    }
    
    return () => {
      abortController.current?.abort();
    };
  }, []);

  const startStream = useCallback(async (
    content: string,
    onToken: (token: string) => void, // For regular text
    onStructuredResult?: (result: any) => void, // For structured data like FDA
    tools?: ToolDefinition[]
  ) => {
    if (!streamService.current) {
      setError({
        code: 'SERVICE_ERROR',
        message: 'Gemini service not initialized'
      });
      return;
    }

    setIsStreaming(true);
    setError(null);
    abortController.current = new AbortController();

    try {
      await streamService.current.createStream(mode, content, {
        onToken,
        onError: (err) => {
          setError(err);
          setIsStreaming(false);
        },
        onComplete: () => setIsStreaming(false),
        onToolCall: async (toolCall) => {
          if (mode === 'default') { // Only execute tools in default mode for now
            try {
              const result = await executeToolCall(toolCall);
              
              // Check if the result is structured data (from FDA tool)
              if (toolCall.function.name === 'searchDrugLabel' && typeof result === 'object' && result !== null && onStructuredResult) {
                onStructuredResult(result); // Pass structured data to the specific callback
              } else {
                // For other tools or if no specific handler, format as text
                const resultString = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
                onToken(`\n*Tool Result (${toolCall.function.name}):*\n\`\`\`json\n${resultString}\n\`\`\`\n`);
              }
            } catch (err) {
              onToken(`\n*Tool Error (${toolCall.function.name}):* ${err instanceof Error ? err.message : 'Unknown error'}\n`);
            }
          }
        }
      }, tools as import("c:/Users/thunt/demo/project/src/types/tool").ToolDefinition[] | undefined);
    } catch (err) {
      setError({
        code: 'STREAM_INIT_ERROR',
        message: err instanceof Error ? err.message : 'Failed to start stream'
      });
      setIsStreaming(false);
    }
  }, [mode]);

  const stopStream = useCallback(() => {
    abortController.current?.abort();
    setIsStreaming(false);
  }, []);

  return {
    startStream,
    stopStream,
    isStreaming,
    error
  };
}

async function executeToolCall(tool: any): Promise<any> {
  return toolHandler.handleToolCall(tool);
}

// Export tool definitions for use in other components
export { toolDefinitions };
