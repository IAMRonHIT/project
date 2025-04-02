import { ProviderSearchParams } from '../components/RonAI/ProviderSearchModal';

export interface Provider {
  id: string;
  npi?: string;
  name: string;
  specialty: string;
  distance?: string;
  address: string;
  phone: string;
  rating?: number; // Added back to support existing component references
  accepting: boolean;
  sex: 'male' | 'female' | 'other';
  network: 'in-network' | 'out-network';
  location?: {
    lat: number;
    lng: number;
  };
}

export async function searchProviders(params: ProviderSearchParams): Promise<Provider[]> {
  try {
    // Build query string from params based on search type
    const queryParams = new URLSearchParams();
    
    // Add the enumeration type (individual vs organization)
    if (params.enumerationType) queryParams.append('enumerationType', params.enumerationType);
    
    // Different parameters based on search type
    // Add the search type parameter - crucial for backend routing
    queryParams.append('searchType', params.searchType);
    
    // Add all parameters uniformly based on the NPI Registry API requirements
    if (params.npiNumber) queryParams.append('number', params.npiNumber);
    if (params.firstName) queryParams.append('firstName', params.firstName);
    if (params.lastName) queryParams.append('lastName', params.lastName);
    if (params.specialty) queryParams.append('specialty', params.specialty);
    if (params.postalCode) queryParams.append('postalCode', params.postalCode);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    console.log(`Searching providers with params: ${queryParams.toString()}`);
    
    // Fetch providers from our backend API - use the correct backend URL
    const response = await fetch(`/api/providers/search?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch providers: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate the response data
    if (!data || !Array.isArray(data.providers)) {
      console.error('Invalid response data format:', data);
      throw new Error('Invalid response format from provider search API');
    }
    
    console.log(`Got ${data.providers.length} providers from API`);
    
    return data.providers;
  } catch (error) {
    console.error('Error fetching providers:', error);
    
    // Return empty array instead of throwing to avoid breaking the UI
    // The component will handle the empty state
    return [];
  }
}

// Helper function to get display name for specialties
export function getSpecialtyDisplayName(specialty: string): string {
  const specialtyMap: Record<string, string> = {
    'primary-care': 'Primary Care',
    'cardiology': 'Cardiology',
    'dermatology': 'Dermatology',
    'endocrinology': 'Endocrinology',
    'gastroenterology': 'Gastroenterology',
    'neurology': 'Neurology',
    'orthopedics': 'Orthopedics',
    'pediatrics': 'Pediatrics',
    'psychiatry': 'Psychiatry',
    'urology': 'Urology'
  };
  
  // Get the display name if it's in our map
  const displayName = specialtyMap[specialty];
  if (displayName) return displayName;
  
  // Otherwise format the specialty string
  return specialty
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
