import React from 'react';
import { MapPin, ArrowUpRight, Phone, Mail, Calendar } from 'lucide-react';
import { RatingBadge } from '@/components/RatingBadge';
import { ProviderStatusBadge } from '@/components/ProviderStatusBadge';
import { NetworkTierBadge } from '@/components/NetworkTierBadge';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  status: 'active' | 'pending' | 'inactive';
  networkTier: 'preferred' | 'standard' | 'specialty';
  phone: string;
  email: string;
  nextAvailable: string;
}

const providers: Provider[] = [
  {
    id: 'P001',
    name: 'Dr. Sarah Miller',
    specialty: 'Cardiology',
    location: 'New York, NY',
    rating: 4.8,
    status: 'active',
    networkTier: 'preferred',
    phone: '(555) 123-4567',
    email: 'dr.miller@healthcare.com',
    nextAvailable: 'Mar 15, 2024'
  },
  {
    id: 'P002',
    name: 'Dr. James Chen',
    specialty: 'Neurology',
    location: 'San Francisco, CA',
    rating: 4.5,
    status: 'active',
    networkTier: 'specialty',
    phone: '(555) 234-5678',
    email: 'dr.chen@healthcare.com',
    nextAvailable: 'Mar 12, 2024'
  },
  {
    id: 'P003',
    name: 'Dr. Emily Parker',
    specialty: 'Orthopedics',
    location: 'Chicago, IL',
    rating: 4.2,
    status: 'pending',
    networkTier: 'standard',
    phone: '(555) 345-6789',
    email: 'dr.parker@healthcare.com',
    nextAvailable: 'Mar 18, 2024'
  },
  {
    id: 'P004',
    name: 'Dr. Michael Ross',
    specialty: 'Internal Medicine',
    location: 'Boston, MA',
    rating: 4.9,
    status: 'active',
    networkTier: 'preferred',
    phone: '(555) 456-7890',
    email: 'dr.ross@healthcare.com',
    nextAvailable: 'Mar 14, 2024'
  },
  {
    id: 'P005',
    name: 'Dr. Lisa Wong',
    specialty: 'Pediatrics',
    location: 'Seattle, WA',
    rating: 4.7,
    status: 'active',
    networkTier: 'specialty',
    phone: '(555) 567-8901',
    email: 'dr.wong@healthcare.com',
    nextAvailable: 'Mar 16, 2024'
  }
];

interface ProvidersTableProps {
  searchTerm: string;
  selectedFilters: string[];
}

export function ProvidersTable({ searchTerm, selectedFilters }: ProvidersTableProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = searchTerm === '' || 
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = selectedFilters.length === 0 ||
      selectedFilters.includes(provider.networkTier) ||
      selectedFilters.includes(provider.status);

    return matchesSearch && matchesFilters;
  });

  return (
    <div className={`${
      isDark ? 'bg-white/5' : 'bg-white'
    } rounded-xl shadow-soft border border-ron-divider`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ron-divider">
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
              }`}>Provider</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
              }`}>Rating</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
              }`}>Status</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
              }`}>Network Tier</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
              }`}>Contact</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
              }`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProviders.map((provider) => (
              <tr key={provider.id} className={`group border-b border-ron-divider ${
                isDark ? 'hover:bg-white/5' : 'hover:bg-ron-primary/5'
              } transition-colors`}>
                <td className="px-6 py-4">
                  <div className={`font-medium ${
                    isDark ? 'text-white' : 'text-dark-gun-metal'
                  }`}>{provider.name}</div>
                  <div className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                  }`}>{provider.specialty}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className={`w-3.5 h-3.5 ${
                      isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
                    }`} />
                    <span className={`text-xs ${
                      isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
                    }`}>{provider.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <RatingBadge rating={provider.rating} />
                </td>
                <td className="px-6 py-4">
                  <ProviderStatusBadge status={provider.status} />
                </td>
                <td className="px-6 py-4">
                  <NetworkTierBadge tier={provider.networkTier} />
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className={`w-4 h-4 ${
                        isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
                      }`} />
                      <span className={`text-sm ${
                        isDark ? 'text-white' : 'text-dark-gun-metal'
                      }`}>{provider.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className={`w-4 h-4 ${
                        isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
                      }`} />
                      <span className={`text-sm ${
                        isDark ? 'text-white' : 'text-dark-gun-metal'
                      }`}>{provider.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${
                        isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
                      }`} />
                      <span className={`text-sm ${
                        isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
                      }`}>Next Available: {provider.nextAvailable}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className={`invisible group-hover:visible px-3 py-1 rounded-lg flex items-center gap-2 ${
                    isDark
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-ron-primary/10 text-ron-primary hover:bg-ron-primary/20'
                  } transition-colors`}>
                    View Profile
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}