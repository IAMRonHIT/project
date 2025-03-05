let currentThreadId: string | null = null;

export async function getOrCreateThreadId(): Promise<string> {
  if (!currentThreadId) {
    const response = await fetch('/api/assistants/threads', {
      method: 'POST'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create thread');
    }
    
    const data = await response.json();
    if (!data.threadId) {
      throw new Error('No threadId returned from server');
    }
    currentThreadId = data.threadId;
  }
  
  return currentThreadId!;
}

export async function getThreadHistory(threadId: string) {
  try {
    const response = await fetch(`/api/assistants/threads/${threadId}/messages`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch thread history');
    }
    
    const data = await response.json();
    return data.messages.map((message: any) => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.content[0]?.text?.value || ''
    }));
  } catch (error) {
    console.error('Failed to get thread history:', error);
    throw error;
  }
}

export async function streamAssistantMessage(
  content: string,
  onUpdate: (update: any) => void,
  signal?: AbortSignal,
  isDeepThinking?: boolean
): Promise<void> {
  try {
    const threadId = await getOrCreateThreadId();
    
    // Set up EventSource for streaming
    const url = new URL(`/api/assistants/threads/${threadId}/messages/stream`, window.location.origin);
    url.searchParams.set('message', content);
    
    // Add deep thinking parameter if true
    if (isDeepThinking) {
      url.searchParams.set('deepThinking', 'true');
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      },
      signal
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to start stream');
    }

    // Notify that we're connected and create a placeholder for the streaming message
    onUpdate({ type: 'connected' });
    onUpdate({ 
      type: 'messageStart', 
      message: {
        role: 'assistant',
        content: '',
        isStreaming: true
      }
    });

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No stream available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        // Decode the chunk and add it to our buffer
        buffer += decoder.decode(value, { stream: true });
        
        // Process any complete messages in the buffer
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep the last incomplete chunk in the buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              switch (data.type) {
                case 'status':
                  onUpdate({ type: 'status', status: data.status });
                  break;
                
                case 'contentUpdate':
                  // Handle incremental content updates
                  onUpdate({ 
                    type: 'contentUpdate', 
                    content: data.content,
                    isDeepThinking: data.isDeepThinking
                  });
                  break;
                
                case 'messageDone':
                  // The message is now the complete OpenAI message object
                  const messageContent = data.message.content[0]?.text?.value;
                  if (messageContent) {
                    onUpdate({ 
                      type: 'messageComplete', 
                      message: {
                        role: 'assistant',
                        content: messageContent,
                        isStreaming: false,
                        isDeepThinking: data.isDeepThinking
                      }
                    });
                  }
                  break;
                
                case 'error':
                  console.error('Stream error:', data.error);
                  onUpdate({ type: 'error', error: data.error });
                  break;
                
                case 'tool_execution':
                  onUpdate({ type: 'toolOutputsSubmitted' });
                  break;
                
                case 'toolCalls':
                  onUpdate({ type: 'toolCalls' });
                  break;
              }
            } catch (error) {
              if (error instanceof Error) {
                onUpdate({ type: 'error', error: error.message });
              }
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        onUpdate({ type: 'error', error: error.message });
      }
      throw error;
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      onUpdate({ type: 'error', error: error.message });
      throw error;
    }
  }
}

/**
 * Send feedback for a specific message
 */
export async function sendMessageFeedback(
  messageId: string,
  feedbackType: 'positive' | 'negative' | null
): Promise<boolean> {
  try {
    const response = await fetch('/api/assistants/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messageId,
        feedbackType
      })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Error sending feedback:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to send feedback:', error);
    return false;
  }
}
