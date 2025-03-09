import { useEffect, useRef, useState } from 'react';

interface StreamMessage {
  type: 'textCreated' | 'textDelta' | 'toolCallCreated' | 'toolCallDelta' | 'error' | 'end';
  delta?: string;
  snapshot?: string;
  toolCall?: any;
  error?: string;
}

interface UseAssistantStreamProps {
  threadId: string;
  onMessage?: (message: StreamMessage) => void;
  onError?: (error: Error) => void;
  onEnd?: () => void;
}

export function useAssistantStream({
  threadId,
  onMessage,
  onError,
  onEnd
}: UseAssistantStreamProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!threadId) return;

    const startStreaming = () => {
      setIsStreaming(true);
      setError(null);

      // Create EventSource for SSE
      const eventSource = new EventSource(`/api/assistants/threads/${threadId}/stream`);
      eventSourceRef.current = eventSource;

      // Handle incoming messages
      eventSource.onmessage = (event) => {
        try {
          const data: StreamMessage = JSON.parse(event.data);
          onMessage?.(data);

          if (data.type === 'end') {
            eventSource.close();
            setIsStreaming(false);
            onEnd?.();
          }

          if (data.type === 'error') {
            throw new Error(data.error);
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Unknown error');
          setError(error);
          onError?.(error);
          eventSource.close();
          setIsStreaming(false);
        }
      };

      // Handle connection errors
      eventSource.onerror = (err) => {
        const error = new Error('Stream connection error');
        setError(error);
        onError?.(error);
        eventSource.close();
        setIsStreaming(false);
      };
    };

    startStreaming();

    // Cleanup on unmount or threadId change
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        setIsStreaming(false);
      }
    };
  }, [threadId, onMessage, onError, onEnd]);

  return {
    isStreaming,
    error,
    stop: () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        setIsStreaming(false);
      }
    }
  };
}
