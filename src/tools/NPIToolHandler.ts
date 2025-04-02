interface ProviderSearchParams {
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
}

interface FacilitySearchParams {
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
}

export class NPIToolHandler {
  private baseUrl = 'https://npiregistry.cms.hhs.gov/api';
  private version = '2.1';

  async handleToolCall(toolCall: any): Promise<any> {
    const { name, arguments: args } = toolCall.function;
    const parsedArgs = JSON.parse(args);

    switch (name) {
      case 'searchProviders':
        return this.searchProviders(parsedArgs);
      case 'searchFacilities':
        return this.searchFacilities(parsedArgs);
      default:
        throw new Error(`Unknown NPI tool: ${name}`);
    }
  }

  async searchProviders(params: ProviderSearchParams): Promise<any> {
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

  async searchFacilities(params: FacilitySearchParams): Promise<any> {
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
      throw new Error(`NPI Registry Request Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

// Export tool definitions
export const npiToolDefinitions = {
  providerSearch: {
    type: 'function' as const,
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
    type: 'function' as const,
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
