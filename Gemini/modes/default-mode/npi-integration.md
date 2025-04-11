# NPI Registry Integration

This document details the integration of the National Provider Identifier (NPI) Registry into the IntelAgents through Gemini's function calling capabilities.

## Features

1. Provider Search
   - Individual healthcare providers
   - Healthcare organizations
   - Specialty-based search
   - Location-based search

2. Facility Search
   - Hospitals
   - Clinics
   - Laboratories
   - Pharmacies

## TypeScript Implementation

### Tool Definitions

```typescript
export const npiToolDefinitions = {
  providerSearch: {
    type: 'function',
    function: {
      name: 'searchProviders',
      description: 'Search NPI registry for healthcare providers',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Provider name (first and/or last)'
          },
          npiNumber: {
            type: 'string',
            description: 'NPI number'
          },
          taxonomy: {
            type: 'string',
            description: 'Provider taxonomy/specialty code'
          },
          location: {
            type: 'object',
            properties: {
              city: { type: 'string' },
              state: { type: 'string' },
              postalCode: { type: 'string' },
              country: { 
                type: 'string',
                default: 'US'
              }
            }
          },
          limit: {
            type: 'number',
            description: 'Maximum number of results',
            default: 10
          }
        },
        required: ['name']
      }
    }
  },

  facilitySearch: {
    type: 'function',
    function: {
      name: 'searchFacilities',
      description: 'Search NPI registry for healthcare facilities',
      parameters: {
        type: 'object',
        properties: {
          organizationName: {
            type: 'string',
            description: 'Facility/organization name'
          },
          npiNumber: {
            type: 'string',
            description: 'Organization NPI number'
          },
          facilityType: {
            type: 'string',
            enum: [
              'HOSPITAL',
              'CLINIC',
              'LABORATORY',
              'PHARMACY',
              'NURSING_FACILITY',
              'HOME_HEALTH'
            ],
            description: 'Type of healthcare facility'
          },
          location: {
            type: 'object',
            properties: {
              city: { type: 'string' },
              state: { type: 'string' },
              postalCode: { type: 'string' },
              country: { 
                type: 'string',
                default: 'US'
              }
            }
          },
          limit: {
            type: 'number',
            description: 'Maximum number of results',
            default: 10
          }
        },
        required: ['organizationName']
      }
    }
  }
};
```

### NPI Registry Service Implementation

```typescript
export class NPIRegistryService {
  private baseUrl = 'https://npiregistry.cms.hhs.gov/api';
  private version = '2.1';

  async searchProviders(params: {
    name?: string;
    npiNumber?: string;
    taxonomy?: string;
    location?: {
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
    limit?: number;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    searchParams.append('version', this.version);
    searchParams.append('limit', String(params.limit || 10));

    if (params.name) {
      searchParams.append('name', params.name);
    }
    if (params.npiNumber) {
      searchParams.append('number', params.npiNumber);
    }
    if (params.taxonomy) {
      searchParams.append('taxonomy_description', params.taxonomy);
    }
    if (params.location) {
      if (params.location.city) {
        searchParams.append('city', params.location.city);
      }
      if (params.location.state) {
        searchParams.append('state', params.location.state);
      }
      if (params.location.postalCode) {
        searchParams.append('postal_code', params.location.postalCode);
      }
      if (params.location.country) {
        searchParams.append('country_code', params.location.country);
      }
    }

    return this.makeRequest(searchParams);
  }

  async searchFacilities(params: {
    organizationName?: string;
    npiNumber?: string;
    facilityType?: string;
    location?: {
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
    limit?: number;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    searchParams.append('version', this.version);
    searchParams.append('limit', String(params.limit || 10));
    searchParams.append('entity_type', 'organization');

    if (params.organizationName) {
      searchParams.append('organization_name', params.organizationName);
    }
    if (params.npiNumber) {
      searchParams.append('number', params.npiNumber);
    }
    if (params.facilityType) {
      searchParams.append('taxonomy_description', this.mapFacilityType(params.facilityType));
    }
    if (params.location) {
      if (params.location.city) {
        searchParams.append('city', params.location.city);
      }
      if (params.location.state) {
        searchParams.append('state', params.location.state);
      }
      if (params.location.postalCode) {
        searchParams.append('postal_code', params.location.postalCode);
      }
      if (params.location.country) {
        searchParams.append('country_code', params.location.country);
      }
    }

    return this.makeRequest(searchParams);
  }

  private async makeRequest(searchParams: URLSearchParams): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error(`NPI Registry Error: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      throw new Error(`NPI Registry Request Failed: ${error.message}`);
    }
  }

  private mapFacilityType(type: string): string {
    const mappings: Record<string, string> = {
      'HOSPITAL': 'General Acute Care Hospital',
      'CLINIC': 'Clinic/Center',
      'LABORATORY': 'Clinical Medical Laboratory',
      'PHARMACY': 'Pharmacy',
      'NURSING_FACILITY': 'Nursing Facility/Skilled Nursing Facility',
      'HOME_HEALTH': 'Home Health'
    };
    return mappings[type] || type;
  }
}
```

### Integration with Gemini

```typescript
export class NPIToolHandler {
  private npiService: NPIRegistryService;

  constructor() {
    this.npiService = new NPIRegistryService();
  }

  async handleToolCall(toolCall: ToolCall): Promise<any> {
    const { name, arguments: args } = toolCall.function;
    const parsedArgs = JSON.parse(args);

    switch (name) {
      case 'searchProviders':
        return this.npiService.searchProviders(parsedArgs);
      case 'searchFacilities':
        return this.npiService.searchFacilities(parsedArgs);
      default:
        throw new Error(`Unknown NPI tool: ${name}`);
    }
  }
}
```

## Usage Example

```typescript
// Initialize the NPI tool handler
const npiHandler = new NPIToolHandler();

// In your Gemini service
const response = await this.client.chat.completions.create({
  model: 'gemini-2.0-flash',
  messages: [{ 
    role: 'user', 
    content: 'Find cardiologists in Denver, Colorado' 
  }],
  tools: Object.values(npiToolDefinitions),
  tool_choice: 'auto'
});

if (response.choices[0].message.tool_calls) {
  for (const toolCall of response.choices[0].message.tool_calls) {
    const result = await npiHandler.handleToolCall(toolCall);
    // Process and format the NPI data
  }
}
```

## Response Processing

```typescript
interface NPIProvider {
  number: string;
  basic: {
    name: string;
    credential?: string;
    first_name: string;
    last_name: string;
    gender?: string;
    sole_proprietor: string;
  };
  taxonomies: Array<{
    code: string;
    desc: string;
    primary: boolean;
    state: string;
    license: string;
  }>;
  addresses: Array<{
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postal_code: string;
    telephone_number?: string;
  }>;
}

function formatProviderResponse(data: NPIProvider): string {
  return `
    Dr. ${data.basic.first_name} ${data.basic.last_name}, ${data.basic.credential || ''}
    Specialties: ${data.taxonomies.map(t => t.desc).join(', ')}
    Primary Location: ${data.addresses[0].address_1}, ${data.addresses[0].city}, ${data.addresses[0].state}
    Phone: ${data.addresses[0].telephone_number || 'Not available'}
    NPI: ${data.number}
  `;
}
```

## Error Handling

1. Rate Limiting
   ```typescript
   const rateLimiter = new RateLimiter({
     maxRequests: 20,
     perSecond: 1
   });
   ```

2. Response Validation
   ```typescript
   function validateNPIResponse(response: any): boolean {
     return (
       response &&
       response.results &&
       Array.isArray(response.results) &&
       response.results.length > 0
     );
   }
   ```

3. Error Recovery
   ```typescript
   async function searchWithRetry(
     params: any,
     maxRetries = 3
   ): Promise<any> {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await npiService.searchProviders(params);
       } catch (error) {
         if (i === maxRetries - 1) throw error;
         await delay(Math.pow(2, i) * 1000);
       }
     }
   }
   ```

## Best Practices

1. Cache frequently accessed data
2. Implement proper error handling
3. Use type-safe interfaces
4. Follow rate limiting guidelines
5. Validate all responses
6. Handle timeouts appropriately
7. Format responses consistently
8. Implement proper logging
9. Monitor API usage
10. Keep taxonomy codes updated
