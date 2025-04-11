# Google Maps Integration

This document details the integration of Google Maps services into the IntelAgents through Gemini's function calling capabilities.

## Features

1. Healthcare Facility Search
   - Hospitals and clinics
   - Pharmacies
   - Medical laboratories
   - Urgent care centers

2. Location Services
   - Geocoding
   - Distance calculations
   - Route optimization
   - Area coverage analysis

## TypeScript Implementation

### Tool Definitions

```typescript
export const mapsToolDefinitions = {
  facilitySearch: {
    type: 'function',
    function: {
      name: 'searchHealthcareFacilities',
      description: 'Search for healthcare facilities using Google Maps',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'object',
            properties: {
              address: { type: 'string' },
              latitude: { type: 'number' },
              longitude: { type: 'number' }
            },
            description: 'Search center location'
          },
          facilityType: {
            type: 'string',
            enum: [
              'hospital',
              'clinic',
              'pharmacy',
              'laboratory',
              'urgent_care',
              'medical_office'
            ],
            description: 'Type of healthcare facility'
          },
          radius: {
            type: 'number',
            description: 'Search radius in meters',
            default: 5000
          },
          maxResults: {
            type: 'number',
            description: 'Maximum number of results',
            default: 10
          }
        },
        required: ['location', 'facilityType']
      }
    }
  },

  distanceMatrix: {
    type: 'function',
    function: {
      name: 'calculateDistances',
      description: 'Calculate distances between locations',
      parameters: {
        type: 'object',
        properties: {
          origins: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                address: { type: 'string' },
                latitude: { type: 'number' },
                longitude: { type: 'number' }
              }
            },
            description: 'Starting locations'
          },
          destinations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                address: { type: 'string' },
                latitude: { type: 'number' },
                longitude: { type: 'number' }
              }
            },
            description: 'Destination locations'
          },
          mode: {
            type: 'string',
            enum: ['driving', 'walking', 'transit', 'bicycling'],
            default: 'driving',
            description: 'Travel mode'
          }
        },
        required: ['origins', 'destinations']
      }
    }
  }
};
```

### Google Maps Service Implementation

```typescript
import { Client, PlacesNearbyResponse, DistanceMatrixResponse } from '@googlemaps/google-maps-services-js';

export class GoogleMapsService {
  private client: Client;
  private apiKey: string;

  constructor(apiKey: string) {
    this.client = new Client({});
    this.apiKey = apiKey;
  }

  async searchHealthcareFacilities(params: {
    location: {
      address?: string;
      latitude?: number;
      longitude?: number;
    };
    facilityType: string;
    radius?: number;
    maxResults?: number;
  }): Promise<PlacesNearbyResponse> {
    // Get coordinates if only address provided
    let coordinates = params.location;
    if (!coordinates.latitude || !coordinates.longitude) {
      coordinates = await this.geocode(params.location.address!);
    }

    const searchType = this.mapFacilityType(params.facilityType);
    
    return this.client.placesNearby({
      params: {
        key: this.apiKey,
        location: `${coordinates.latitude},${coordinates.longitude}`,
        radius: params.radius || 5000,
        type: searchType,
        keyword: params.facilityType,
        maxResults: params.maxResults || 10
      }
    });
  }

  async calculateDistances(params: {
    origins: Array<{
      address?: string;
      latitude?: number;
      longitude?: number;
    }>;
    destinations: Array<{
      address?: string;
      latitude?: number;
      longitude?: number;
    }>;
    mode?: 'driving' | 'walking' | 'transit' | 'bicycling';
  }): Promise<DistanceMatrixResponse> {
    // Convert addresses to coordinates where needed
    const origins = await Promise.all(
      params.origins.map(async (origin) => {
        if (!origin.latitude || !origin.longitude) {
          return this.geocode(origin.address!);
        }
        return origin;
      })
    );

    const destinations = await Promise.all(
      params.destinations.map(async (dest) => {
        if (!dest.latitude || !dest.longitude) {
          return this.geocode(dest.address!);
        }
        return dest;
      })
    );

    return this.client.distancematrix({
      params: {
        key: this.apiKey,
        origins: origins.map(o => `${o.latitude},${o.longitude}`),
        destinations: destinations.map(d => `${d.latitude},${d.longitude}`),
        mode: params.mode || 'driving'
      }
    });
  }

  private async geocode(address: string): Promise<{ latitude: number; longitude: number }> {
    const response = await this.client.geocode({
      params: {
        key: this.apiKey,
        address
      }
    });

    if (!response.data.results[0]) {
      throw new Error(`Could not geocode address: ${address}`);
    }

    const location = response.data.results[0].geometry.location;
    return {
      latitude: location.lat,
      longitude: location.lng
    };
  }

  private mapFacilityType(type: string): string {
    const mappings: Record<string, string> = {
      'hospital': 'hospital',
      'clinic': 'doctor',
      'pharmacy': 'pharmacy',
      'laboratory': 'health',
      'urgent_care': 'hospital',
      'medical_office': 'doctor'
    };
    return mappings[type] || type;
  }
}
```

### Integration with Gemini

```typescript
export class MapsToolHandler {
  private mapsService: GoogleMapsService;

  constructor(apiKey: string) {
    this.mapsService = new GoogleMapsService(apiKey);
  }

  async handleToolCall(toolCall: ToolCall): Promise<any> {
    const { name, arguments: args } = toolCall.function;
    const parsedArgs = JSON.parse(args);

    switch (name) {
      case 'searchHealthcareFacilities':
        return this.mapsService.searchHealthcareFacilities(parsedArgs);
      case 'calculateDistances':
        return this.mapsService.calculateDistances(parsedArgs);
      default:
        throw new Error(`Unknown Maps tool: ${name}`);
    }
  }
}
```

## Usage Example

```typescript
// Initialize the Maps tool handler
const mapsHandler = new MapsToolHandler(process.env.GOOGLE_MAPS_API_KEY!);

// In your Gemini service
const response = await this.client.chat.completions.create({
  model: 'gemini-2.0-flash',
  messages: [{ 
    role: 'user', 
    content: 'Find hospitals within 5 miles of downtown Denver' 
  }],
  tools: Object.values(mapsToolDefinitions),
  tool_choice: 'auto'
});

if (response.choices[0].message.tool_calls) {
  for (const toolCall of response.choices[0].message.tool_calls) {
    const result = await mapsHandler.handleToolCall(toolCall);
    // Process and format the Maps data
  }
}
```

## Response Processing

```typescript
interface HealthcareFacility {
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  rating?: number;
  types: string[];
  opening_hours?: {
    open_now: boolean;
    periods: Array<{
      open: { day: number; time: string };
      close: { day: number; time: string };
    }>;
  };
  phone_number?: string;
}

function formatFacilityResponse(facility: HealthcareFacility): string {
  return `
    ${facility.name}
    Address: ${facility.address}
    Rating: ${facility.rating ? `${facility.rating}/5` : 'Not rated'}
    ${facility.phone_number ? `Phone: ${facility.phone_number}` : ''}
    ${facility.opening_hours?.open_now ? 'Currently Open' : 'Currently Closed'}
  `;
}
```

## Error Handling

1. API Errors
```typescript
class MapsAPIError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
    this.name = 'MapsAPIError';
  }
}

function handleMapsError(error: any): never {
  if (error.response) {
    throw new MapsAPIError(
      error.response.data.error_message,
      error.response.data.status,
      error.response.status
    );
  }
  throw error;
}
```

2. Rate Limiting
```typescript
const rateLimiter = new RateLimiter({
  maxRequests: 50,
  perSecond: 1
});

async function makeRequest(url: string): Promise<any> {
  await rateLimiter.waitForToken();
  return fetch(url);
}
```

## Best Practices

1. API Key Management
   - Store in environment variables
   - Use API key restrictions
   - Monitor usage and quotas

2. Performance Optimization
   - Cache geocoding results
   - Batch distance calculations
   - Implement request queuing

3. Error Recovery
   - Implement retry logic
   - Handle timeout errors
   - Provide fallback options

4. Data Validation
   - Validate coordinates
   - Check address formats
   - Verify response data

5. Response Formatting
   - Consistent data structure
   - Clear error messages
   - Proper distance units

## Security Considerations

1. API Key Protection
   - Restrict API key usage
   - Set up billing alerts
   - Monitor for abuse

2. Data Privacy
   - Minimize stored location data
   - Implement data retention policies
   - Secure transmission methods

3. Request Validation
   - Sanitize input parameters
   - Validate coordinate ranges
   - Check address formats
