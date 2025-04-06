export class FDAToolHandler {
  async handleToolCall(toolCall: { function: { name: string; arguments: string } }): Promise<any> {
    const { name, arguments: args } = toolCall.function;
    const parsedArgs = JSON.parse(args);

    if (name === 'searchDrugLabel') {
      return this.searchDrugLabel(parsedArgs);
    }

    throw new Error(`Unknown FDA tool: ${name}`);
  }

  async searchDrugLabel(params: { query: string }): Promise<any> {
    if (!params.query?.trim()) {
      throw new Error('Invalid query parameter');
    }

    try {
      const response = await fetch(`/api/fda/drug/label?search=${encodeURIComponent(params.query.trim())}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `FDA API Request Failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('FDA Drug Label Search Error:', error);
      throw new Error(`FDA API Request Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const fdaToolDefinitions = {
  drugLabel: {
    type: 'function' as const,
    function: {
      name: 'searchDrugLabel',
      description: 'Search FDA drug label database',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Drug name or active ingredient'
          }
        },
        required: ['query']
      }
    }
  }
};
