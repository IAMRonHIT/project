// ronAIService.ts
export async function streamAssistantMessage(
  conversation: any[],  // The array of messages (with roles and content) to send
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<void> {
  // Prepare the request payload
  const payload = { messages: conversation };
  let response: Response;
  try {
    response = await fetch('/api/assistant/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: signal  // allows the caller to abort if needed
    });
  } catch (err: any) {
    // Network error or fetch aborted
    throw new Error(err?.message || 'Network error');
  }

  if (!response.ok) {
    // If backend returns an HTTP error, attempt to parse error message
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (_) {
      // response might not be JSON
      try {
        const text = await response.text();
        if (text) errorMessage = text;
      } catch {
        /* swallow further errors */
      }
    }
    throw new Error(errorMessage);
  }

  // At this point, response is OK and we expect a stream
  const reader = response.body!.getReader();
  const decoder = new TextDecoder('utf-8');
  let partialData = '';
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      // Decode the received chunk and accumulate
      const chunkText = decoder.decode(value, { stream: true });
      if (!chunkText) continue;

      // If the server is sending SSE data events, they might include "data: " prefixes
      // and possibly multiple events in one chunk. We handle that here.
      partialData += chunkText;
      // Split by SSE event terminator "\n\n"
      let eventEndIndex: number;
      while ((eventEndIndex = partialData.indexOf('\n\n')) !== -1) {
        const event = partialData.slice(0, eventEndIndex);
        partialData = partialData.slice(eventEndIndex + 2);
        if (event.startsWith('data:')) {
          const data = event.slice(5).trim(); // remove "data:" prefix
          if (data === '[DONE]') {
            // End of stream signal (if used)
            await reader.cancel();
            break;
          }
          // Call the callback with the parsed data chunk
          onChunk(data);
        } else {
          // If the chunk is not prefixed with "data:", treat it as plain text
          onChunk(event);
        }
      }
      // If no "\n\n" found, partialData holds the buffer for the next loop
    }
  } finally {
    // Ensure reader is released in any case
    reader.releaseLock();
  }
}
