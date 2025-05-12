import axios from 'axios';
import { env } from '../config/environment'; // Assuming PERPLEXITY_API_KEY will be here

// API configuration
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const API_KEY = env.PERPLEXITY_API_KEY;

// API client setup
const perplexityClient = axios.create({
  baseURL: PERPLEXITY_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
});

/**
 * Extracts both reasoning (<think> tags) and JSON from Sonar Reasoning Pro responses.
 * Based on Perplexity's example utility.
 */
export function extractContentFromSonarReasoning(responseText: string): {
  reasoning: string;
  jsonData: any | null;
  hasReasoning: boolean;
  hasJsonData: boolean;
} {
  const thinkMatch = responseText.match(/<think>([\s\S]*?)<\/think>/);
  const reasoning = thinkMatch ? thinkMatch[1].trim() : '';

  let jsonText = responseText.replace(/<think>[\s\S]*?<\/think>/, '').trim();

  const findValidJson = (text: string): any | null => {
    let startIdx = text.indexOf('{');
    if (startIdx === -1) return null;

    let openBraces = 0;
    let jsonCandidate = '';

    for (let i = startIdx; i < text.length; i++) {
      const char = text[i];
      jsonCandidate += char;

      if (char === '{') openBraces++;
      else if (char === '}') openBraces--;

      if (openBraces === 0 && jsonCandidate.length > 0) {
        try {
          return JSON.parse(jsonCandidate);
        } catch (e) {
          // Not valid JSON, continue searching for the next potential start
          const nextStartIdx = text.indexOf('{', i + 1);
          if (nextStartIdx === -1) return null;
          
          // Reset for next attempt, starting from the new '{'
          i = nextStartIdx -1; // loop will increment to nextStartIdx
          jsonCandidate = '';
          openBraces = 0;
        }
      }
    }
    return null;
  };

  const jsonData = findValidJson(jsonText);

  return {
    reasoning,
    jsonData,
    hasReasoning: !!reasoning,
    hasJsonData: !!jsonData
  };
}

/**
 * Processes the reasoning text into formatted markdown.
 */
export function processReasoningMarkdown(reasoning: string): string {
  if (!reasoning) return '';

  // Basic formatting, can be expanded based on observed reasoning structure
  let markdown = reasoning
    .replace(/Assessment:/g, '## Assessment:')
    .replace(/Diagnosis:/g, '## Diagnosis:')
    .replace(/Planning:/g, '## Planning:')
    .replace(/Implementation:/g, '## Implementation:')
    .replace(/Evaluation:/g, '## Evaluation:')
    .replace(/NANDA Diagnosis: (.*)/g, '### NANDA Diagnosis: $1')
    .replace(/(Evidence|Research) (shows|indicates|suggests):/g, '> **$1 $2:**')
    .replace(/Intervention \d+:/g, '#### $&')
    .replace(/Priority:/g, '**Priority:**');
  
  // Convert clinical terminology to bold (example from prompt)
  const clinicalTerms = [
    'assessment', 'diagnosis', 'planning', 'implementation', 'evaluation',
    'NANDA', 'intervention', 'outcome', 'evidence-based'
  ];
  clinicalTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    markdown = markdown.replace(regex, `**$&**`);
  });

  // Format structured reasoning steps (example from prompt)
  markdown = markdown.replace(/Step (\d+):/g, '\n### Step $1:');
  markdown = markdown.replace(/Clinical consideration:/g, '\n> **Clinical consideration:**');
  markdown = markdown.replace(/\[(\d+)\]/g, '*[$1]*');


  return markdown;
}

interface PerplexityRequestPayload {
  model: string;
  messages: { role: 'system' | 'user'; content: string }[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  top_k?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  response_format?: {
    type: 'json_schema';
    json_schema: { schema: any };
  };
  search?: {
    search_context_size?: 'low' | 'medium' | 'high';
    country?: string; // e.g., 'US'
  };
  domains?: string[]; // e.g., ["medlineplus.gov", "mayoclinic.org"]
  search_recency?: 'day' | 'week' | 'month' | 'year' | 'any';
}

export interface Citation {
  id?: string | number;
  url: string;
  title?: string;
  text?: string;
  [key: string]: any; // For any other properties that might come with citations
}

export interface PerplexityResponse {
  reasoningMarkdown: string;
  jsonData: any | null;
  citations?: Citation[];
  rawResponse: string;
  error?: string;
}

/**
 * Sends a request to the Perplexity API.
 * @param userPrompt The user's input.
 * @param modelName The Perplexity model to use (e.g., 'sonar-reasoning-pro', 'sonar-deep-research').
 * @param systemContent Optional system message.
 * @param jsonSchema Optional JSON schema for structured output.
 * @returns {Promise<PerplexityResponse>} The processed response.
 */
export async function getPerplexityResponse(
  userPrompt: string,
  modelName: 'sonar-reasoning-pro' | 'sonar-deep-research' | string, // Allow other models too
  systemContent: string = 'You are a helpful AI assistant.',
  jsonSchema?: any 
): Promise<PerplexityResponse> {
  if (!API_KEY) {
    const errorMsg = 'PERPLEXITY_API_KEY is not configured.';
    console.error(errorMsg);
    return { reasoningMarkdown: '', jsonData: null, rawResponse: '', error: errorMsg };
  }

  const payload: PerplexityRequestPayload = {
    model: modelName,
    messages: [
      { role: 'system', content: systemContent },
      { role: 'user', content: userPrompt }
    ],
    temperature: modelName === 'sonar-reasoning-pro' ? 0.3 : 0.7, // Default, can be adjusted
    max_tokens: 8000,
    top_p: 0.95,
    // Add other parameters as needed, or make them configurable
  };

  if (jsonSchema && modelName === 'sonar-reasoning-pro') { // Typically for reasoning/structured output models
    payload.response_format = {
      type: 'json_schema',
      json_schema: { schema: jsonSchema }
    };
  }
  
  // Add search parameters if it's a research model or if specified
  if (modelName === 'sonar-deep-research' || modelName === 'sonar-reasoning-pro') {
      payload.search = {
          search_context_size: 'high', // Default, can be adjusted
          // country: 'US' // Example, make configurable if needed
      };
      // payload.domains = ["medlineplus.gov", "mayoclinic.org"]; // Example
      // payload.search_recency = 'month'; // Example
  }

  try {
    const response = await perplexityClient.post('', payload);
    const responseText = response.data.choices[0].message.content;
    
    const responseData = response.data;
    const messageContent = responseData.choices[0]?.message?.content || '';
    const apiCitations = responseData.choices[0]?.message?.citations || [];
    
    const { reasoning, jsonData } = extractContentFromSonarReasoning(messageContent);
    const processedReasoning = processReasoningMarkdown(reasoning);

    return {
      reasoningMarkdown: processedReasoning,
      jsonData: jsonData,
      citations: apiCitations.length > 0 ? apiCitations : undefined,
      rawResponse: messageContent // Store the content part of the message as rawResponse
    };
  } catch (error: any) {
    console.error(`Error calling Perplexity API (${modelName}):`, error.response?.data || error.message);
    const errorMsg = error.response?.data?.error?.message || error.message || `Failed to get response from ${modelName}`;
    return {
      reasoningMarkdown: '',
      jsonData: null,
      citations: undefined,
      rawResponse: '',
      error: errorMsg
    };
  }
}

// Example schema (can be moved or made configurable)
// This is just a placeholder; a relevant schema would be needed for specific tasks.
export const EXAMPLE_GENERAL_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string', description: 'A concise summary of the answer.' },
    details: { type: 'string', description: 'Detailed explanation or elaboration.' },
    sources: { 
      type: 'array', 
      items: { 
        type: 'object', 
        properties: {
          title: { type: 'string' },
          url: { type: 'string' }
        }
      },
      description: 'List of sources used.' 
    }
  },
  required: ['summary']
};
