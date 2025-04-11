# FDA API Integration

This document details the integration of FDA APIs into the IntelAgents through Gemini's function calling capabilities.

## Supported APIs

1. Drug Label API
2. Device Label API
3. NDC (National Drug Code) API
4. Recall API

## TypeScript Implementation

### Tool Definitions

```typescript
export const fdaToolDefinitions = {
  drugLabel: {
    type: 'function',
    function: {
      name: 'searchDrugLabel',
      description: 'Search FDA drug label database',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Drug name or active ingredient'
          },
          limit: {
            type: 'number',
            description: 'Maximum number of results (default: 10)'
          },
          fields: {
            type: 'array',
            items: {
              type: 'string',
              enum: [
                'id',
                'set_id',
                'indications_and_usage',
                'dosage_and_administration',
                'warnings',
                'contraindications'
              ]
            },
            description: 'Specific fields to retrieve'
          }
        },
        required: ['query']
      }
    }
  },

  deviceLabel: {
    type: 'function',
    function: {
      name: 'searchDeviceLabel',
      description: 'Search FDA device label database',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Device name or identifier'
          },
          manufacturer: {
            type: 'string',
            description: 'Device manufacturer name'
          },
          deviceClass: {
            type: 'string',
            enum: ['1', '2', '3'],
            description: 'Device classification'
          }
        },
        required: ['query']
      }
    }
  },

  ndc: {
    type: 'function',
    function: {
      name: 'searchNDC',
      description: 'Search National Drug Code directory',
      parameters: {
        type: 'object',
        properties: {
          productNdc: {
            type: 'string',
            description: 'NDC product code'
          },
          manufacturerName: {
            type: 'string',
            description: 'Drug manufacturer name'
          },
          brandName: {
            type: 'string',
            description: 'Drug brand name'
          },
          genericName: {
            type: 'string',
            description: 'Drug generic name'
          }
        },
        required: ['productNdc']
      }
    }
  },

  recall: {
    type: 'function',
    function: {
      name: 'searchRecalls',
      description: 'Search FDA recall database',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search term'
          },
          type: {
            type: 'string',
            enum: ['drug', 'device', 'food'],
            description: 'Type of recall'
          },
          status: {
            type: 'string',
            enum: ['ongoing', 'completed', 'terminated'],
            description: 'Status of recall'
          },
          classification: {
            type: 'string',
            enum: ['Class I', 'Class II', 'Class III'],
            description: 'FDA recall classification'
          }
        },
        required: ['query']
      }
    }
  }
};
```

### FDA Service Implementation

```typescript
export class FDAService {
  private baseUrl = 'https://api.fda.gov';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchDrugLabel(params: {
    query: string;
    limit?: number;
    fields?: string[];
  }): Promise<any> {
    const searchQuery = encodeURIComponent(params.query);
    const fields = params.fields?.join(',') || '';
    const limit = params.limit || 10;

    const url = `${this.baseUrl}/drug/label.json?search=${searchQuery}&limit=${limit}${
      fields ? `&fields=${fields}` : ''
    }&api_key=${this.apiKey}`;

    return this.makeRequest(url);
  }

  async searchDeviceLabel(params: {
    query: string;
    manufacturer?: string;
    deviceClass?: string;
  }): Promise<any> {
    let searchQuery = encodeURIComponent(params.query);
    if (params.manufacturer) {
      searchQuery += `+AND+manufacturer:${encodeURIComponent(params.manufacturer)}`;
    }
    if (params.deviceClass) {
      searchQuery += `+AND+device_class:${params.deviceClass}`;
    }

    const url = `${this.baseUrl}/device/510k.json?search=${searchQuery}&api_key=${this.apiKey}`;
    return this.makeRequest(url);
  }

  async searchNDC(params: {
    productNdc: string;
    manufacturerName?: string;
    brandName?: string;
    genericName?: string;
  }): Promise<any> {
    let searchQuery = `product_ndc:${encodeURIComponent(params.productNdc)}`;
    if (params.manufacturerName) {
      searchQuery += `+AND+labeler_name:${encodeURIComponent(params.manufacturerName)}`;
    }
    if (params.brandName) {
      searchQuery += `+AND+brand_name:${encodeURIComponent(params.brandName)}`;
    }
    if (params.genericName) {
      searchQuery += `+AND+generic_name:${encodeURIComponent(params.genericName)}`;
    }

    const url = `${this.baseUrl}/drug/ndc.json?search=${searchQuery}&api_key=${this.apiKey}`;
    return this.makeRequest(url);
  }

  async searchRecalls(params: {
    query: string;
    type?: string;
    status?: string;
    classification?: string;
  }): Promise<any> {
    let searchQuery = encodeURIComponent(params.query);
    if (params.status) {
      searchQuery += `+AND+status:${params.status}`;
    }
    if (params.classification) {
      searchQuery += `+AND+classification:${encodeURIComponent(params.classification)}`;
    }

    const endpoint = params.type ? `${params.type}/enforcement` : 'drug/enforcement';
    const url = `${this.baseUrl}/${endpoint}.json?search=${searchQuery}&api_key=${this.apiKey}`;
    return this.makeRequest(url);
  }

  private async makeRequest(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`FDA API Error: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      throw new Error(`FDA API Request Failed: ${error.message}`);
    }
  }
}
```

### Integration with Gemini

```typescript
export class FDAToolHandler {
  private fdaService: FDAService;

  constructor(apiKey: string) {
    this.fdaService = new FDAService(apiKey);
  }

  async handleToolCall(toolCall: ToolCall): Promise<any> {
    const { name, arguments: args } = toolCall.function;
    const parsedArgs = JSON.parse(args);

    switch (name) {
      case 'searchDrugLabel':
        return this.fdaService.searchDrugLabel(parsedArgs);
      case 'searchDeviceLabel':
        return this.fdaService.searchDeviceLabel(parsedArgs);
      case 'searchNDC':
        return this.fdaService.searchNDC(parsedArgs);
      case 'searchRecalls':
        return this.fdaService.searchRecalls(parsedArgs);
      default:
        throw new Error(`Unknown FDA tool: ${name}`);
    }
  }
}
```

## Usage Example

```typescript
// Initialize the FDA tool handler
const fdaHandler = new FDAToolHandler(process.env.FDA_API_KEY!);

// In your Gemini service
const response = await this.client.chat.completions.create({
  model: 'gemini-2.0-flash',
  messages: [{ role: 'user', content: 'What are the side effects of ibuprofen?' }],
  tools: Object.values(fdaToolDefinitions),
  tool_choice: 'auto'
});

if (response.choices[0].message.tool_calls) {
  for (const toolCall of response.choices[0].message.tool_calls) {
    const result = await fdaHandler.handleToolCall(toolCall);
    // Process and format the FDA data
  }
}
```

## Error Handling

1. API Rate Limits
   - Implement exponential backoff
   - Cache frequently requested data
   - Monitor usage quotas

2. Data Validation
   - Validate API responses
   - Handle missing or null fields
   - Format data consistently

3. Error Recovery
   - Retry failed requests
   - Fallback to cached data
   - Graceful degradation

## Best Practices

1. Cache Management
```typescript
const cache = new Map<string, { data: any; timestamp: number }>();

function getCachedData(key: string, maxAge: number): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < maxAge) {
    return cached.data;
  }
  return null;
}
```

2. Rate Limiting
```typescript
const rateLimiter = new RateLimiter({
  maxRequests: 240,
  perMinute: 1
});

async function makeRequest(url: string): Promise<any> {
  await rateLimiter.waitForToken();
  return fetch(url);
}
```

3. Error Formatting
```typescript
function formatFDAError(error: any): string {
  if (error.error?.message) {
    return `FDA API Error: ${error.error.message}`;
  }
  return `FDA API Error: ${error.message || 'Unknown error'}`;
}
```

## Security Considerations

1. API Key Management
   - Store keys in environment variables
   - Rotate keys regularly
   - Monitor for unauthorized usage

2. Data Privacy
   - Sanitize personal information
   - Implement data retention policies
   - Follow HIPAA guidelines

3. Request Validation
   - Validate input parameters
   - Sanitize search queries
   - Implement request timeouts
