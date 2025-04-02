interface MapsToolConfig {
  apiKey: string;
}

interface Location {
  address?: string;
  latitude?: number;
  longitude?: number;
}

interface FacilitySearchParams {
  location: Location;
  facilityType: string;
  radius?: number;
  maxResults?: number;
}

interface DistanceMatrixParams {
  origins: Location[];
  destinations: Location[];
  mode?: 'driving' | 'walking' | 'transit' | 'bicycling';
}

export class MapsToolHandler {
  private apiKey: string;

  constructor(config: MapsToolConfig) {
    this.apiKey = config.apiKey;
  }

  async handleToolCall(toolCall: any): Promise<any> {
    const { name, arguments: args } = toolCall.function;
    const parsedArgs = JSON.parse(args);

    switch (name) {
      case 'searchHealthcareFacilities':
        return this.searchHealthcareFacilities(parsedArgs);
      case 'calculateDistances':
        return this.calculateDistances(parsedArgs);
      default:
        throw new Error(`Unknown Maps tool: ${name}`);
    }
  }

  async searchHealthcareFacilities(params: FacilitySearchParams): Promise<any> {
    // Get coordinates if only address provided
    let coordinates = params.location;
    if (!coordinates.latitude || !coordinates.longitude) {
      coordinates = await this.geocode(params.location.address!);
    }

    const searchType = this.mapFacilityType(params.facilityType);
    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    
    url.searchParams.append('key', this.apiKey);
    url.searchParams.append('location', `${coordinates.latitude},${coordinates.longitude}`);
    url.searchParams.append('radius', String(params.radius || 5000));
    url.searchParams.append('type', searchType);
    url.searchParams.append('keyword', params.facilityType);

    return this.makeRequest(url.toString());
  }

  async calculateDistances(params: DistanceMatrixParams): Promise<any> {
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

    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    
    url.searchParams.append('key', this.apiKey);
    url.searchParams.append('origins', origins.map(o => `${o.latitude},${o.longitude}`).join('|'));
    url.searchParams.append('destinations', destinations.map(d => `${d.latitude},${d.longitude}`).join('|'));
    url.searchParams.append('mode', params.mode || 'driving');

    return this.makeRequest(url.toString());
  }

  private async geocode(address: string): Promise<{ latitude: number; longitude: number }> {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.append('key', this.apiKey);
    url.searchParams.append('address', address);

    const response = await this.makeRequest(url.toString());
    
    if (!response.results?.[0]) {
      throw new Error(`Could not geocode address: ${address}`);
    }

    const location = response.results[0].geometry.location;
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

  private async makeRequest(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Google Maps API Error: ${response.statusText}`);
      }
      const data = await response.json();
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Maps API Error: ${data.status}`);
      }
      
      return data;
    } catch (error) {
      throw new Error(`Google Maps API Request Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export tool definitions
export const mapsToolDefinitions = {
  facilitySearch: {
    type: 'function' as const,
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
    type: 'function' as const,
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
