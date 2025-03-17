/**
 * Service for interacting with the Perplexity Sonar Pro Reasoning API
 */

/**
 * Sends a query to the Perplexity Sonar Pro Reasoning API
 * @param userQuery - The user's question or prompt
 * @param systemPrompt - The system prompt to guide the model
 * @returns Promise with the API response
 */
export async function querySonarProReasoning(
  userQuery: string,
  systemPrompt: string
): Promise<any> {
  try {
    console.log('Calling Perplexity API with:', { userQuery: userQuery.substring(0, 50) + '...', promptLength: systemPrompt.length });
    
    const response = await fetch('/api/sonar-pro-reasoning', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userQuery,
        prompt: systemPrompt,
      }),
    });

    console.log('Perplexity API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response text:', errorText);
      
      let errorData: Record<string, any> = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { rawText: errorText };
      }
      
      throw new Error(
        errorData.error || errorData.details || 
        `API returned status ${response.status}: ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    console.log('Perplexity API response:', {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      firstChoiceContent: data.choices?.[0]?.message?.content?.substring(0, 50) + '...'
    });
    
    return data;
  } catch (error) {
    console.error('Error querying Perplexity API:', error);
    throw error;
  }
}

/**
 * Stream a response from Perplexity API (for future implementation)
 */
export async function streamSonarProReasoning(
  userQuery: string,
  systemPrompt: string,
  onUpdate: (update: any) => void
): Promise<void> {
  try {
    // For now, we'll use the non-streaming version
    console.log('Starting Perplexity API request');
    const result = await querySonarProReasoning(userQuery, systemPrompt);
    console.log('Processing Perplexity API result');
    
    // Ensure we handle the response correctly - it might have different structure
    if (result && result.choices && result.choices.length > 0) {
      const content = result.choices[0].message.content;
      console.log('Found content in Perplexity response, length:', content.length);
      
      onUpdate({
        type: 'messageComplete',
        message: {
          role: 'assistant',
          content: content,
          isStreaming: false,
          id: `perplexity-${Date.now()}`
        }
      });
    } else {
      console.error('Unexpected Perplexity API response format:', result);
      onUpdate({
        type: 'error',
        error: 'Received an unexpected response format from Perplexity API'
      });
    }
  } catch (error) {
    console.error('Error streaming from Perplexity API:', error);
    onUpdate({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 