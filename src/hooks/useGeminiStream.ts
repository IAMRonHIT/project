import { useState, useRef, useCallback, useEffect } from 'react';
import { GeminiStreamService } from '../services/GeminiStreamService';
import { getGeminiAuth, geminiConfig, GeminiProfileName, GeminiProfileSettings } from '../config/gemini';
// Import ModeType from ModeDropdown but alias it to DropdownModeType
import { ModeType as DropdownModeType } from '../components/RonAI/ModeDropdown';



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

export function useGeminiStream(mode: DropdownModeType) {
  // Refs for callbacks to keep startStream stable
  const onTokenRef = useRef<((token: string) => void) | null>(null);
  const onStructuredResultRef = useRef<((result: any) => void) | null>(null);
  const onCompleteRef = useRef<((() => void)) | null>(null);
  const onErrorRef = useRef<((error: StreamError) => void) | null>(null);
  const onToolCallRef = useRef<((toolCall: any) => Promise<any>) | null>(null);
  const toolsRef = useRef<ToolDefinition[] | undefined>(undefined);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<StreamError | null>(null);
  const streamService = useRef<GeminiStreamService>();
  const abortController = useRef<AbortController>();

  useEffect(() => {
    try {
      const config = getGeminiAuth();
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
    optionsProp: {
      onToken: (token: string) => void;
      onStructuredResult?: (result: any) => void;
      onComplete?: () => void;
      onError?: (error: StreamError) => void;
      onToolCall?: (toolCall: any) => Promise<any>;
      tools?: ToolDefinition[];
    }
  ) => {
    // Update refs with the latest callbacks from optionsProp
    // This ensures the stream uses the most current handlers even if startStream itself isn't re-memoized
    onTokenRef.current = optionsProp.onToken;
    onStructuredResultRef.current = optionsProp.onStructuredResult || null;
    onCompleteRef.current = optionsProp.onComplete || null;
    onErrorRef.current = optionsProp.onError || null;
    onToolCallRef.current = optionsProp.onToolCall || null;
    toolsRef.current = optionsProp.tools;

    let profileName: GeminiProfileName = 'default';
    if (mode === 'patient-content' || mode === 'one-click-builds') {
      profileName = 'codingPro';
    } else if (mode === 'realtime-audio') {
      // Special handling for 'realtime-audio' if it doesn't map to 'default' or 'codingPro'
      // For now, let's assume it uses 'default' settings, or we might need a specific profile for it.
      // This might require adding a 'realtimeAudio' profile to geminiConfig if its settings differ significantly.
      profileName = 'realtimeAudio';
    }

    const selectedProfile = geminiConfig[profileName];

    if (!selectedProfile) {
      const err = { code: 'CONFIG_ERROR', message: `Profile '${profileName}' not found in geminiConfig.` };
      setError(err);
      if (onErrorRef.current) onErrorRef.current(err);
      return;
    }

    if (!streamService.current) {
      const err = { code: 'SERVICE_ERROR', message: 'Gemini service not initialized' };
      setError(err);
      if (onErrorRef.current) onErrorRef.current(err);
      return;
    }

    setIsStreaming(true);
    setError(null);
    abortController.current = new AbortController();

    try {
      await streamService.current.createStream(
        selectedProfile, // Pass the full profile settings
        content,
        {
          onToken: (token) => onTokenRef.current && onTokenRef.current(token),
          onError: (err) => {
            setError(err);
            setIsStreaming(false);
            if (onErrorRef.current) onErrorRef.current(err);
          },
          onComplete: () => {
            setIsStreaming(false);
            if (onCompleteRef.current) onCompleteRef.current();
          },
          onToolCall: async (toolCallData) => {
            if (onToolCallRef.current) {
              await onToolCallRef.current(toolCallData);
            } else if (profileName === 'codingPro') { // Only execute tools locally for codingPro, other profiles might have onToolCallRef or different handling
              try {
                const result = await executeToolCall(toolCallData);
                if (toolCallData.function.name === 'searchDrugLabel' && typeof result === 'object' && result !== null && onStructuredResultRef.current) {
                  onStructuredResultRef.current(result);
                } else {
                  const resultString = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
                  if (onTokenRef.current) onTokenRef.current(`\n*Tool Result (${toolCallData.function.name}):*\n\`\`\`json\n${resultString}\n\`\`\`\n`);
                }
              } catch (err) {
                const errorMsg = err instanceof Error ? err.message : 'Unknown error';
                if (onTokenRef.current) onTokenRef.current(`\n*Tool Error (${toolCallData.function.name}):* ${errorMsg}\n`);
              }
            }
          },
        },
        toolsRef.current as import('../types/tool').ToolDefinition[] | undefined
      );
    } catch (err) {
      const errorResponse = {
        code: 'STREAM_INIT_ERROR',
        message: err instanceof Error ? err.message : 'Failed to start stream'
      };
      setError(errorResponse);
      setIsStreaming(false);
      if (onErrorRef.current) onErrorRef.current(errorResponse);
    }
  }, [mode]); // Dependency array now only includes 'mode'

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
