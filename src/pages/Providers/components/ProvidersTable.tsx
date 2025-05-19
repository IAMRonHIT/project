import { MapPin, ArrowUpRight, Phone, Mail, Calendar } from "lucide-react";
import { RatingBadge } from "@/components/RatingBadge";
import React from 'react';
import { ProviderStatusBadge } from '@/components/ProviderStatusBadge';
import { NetworkTierBadge } from "@/components/NetworkTierBadge";

interface Provider {
  id: string;
  name: string;
  rating: number;
  status: string;
  networkTier: string;
  location: string;
  phone: string;
  email: string;
  nextAvailable: string;
}

interface ProvidersTableProps {
  searchTerm?: string; // Added to match usage in Providers/index.tsx
  selectedFilters?: string[]; // Added to match usage in Providers/index.tsx
  columnNames?: {
    providerHeader?: string;
    ratingHeader?: string;
    statusHeader?: string;
    networkTierHeader?: string;
    contactHeader?: string;
    nextAvailableHeader?: string;
  };
}

export function ProvidersTable(props: ProvidersTableProps = {}) {
  const { columnNames = {} } = props;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {columnNames.providerHeader || 'Provider'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {columnNames.ratingHeader || 'Rating'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {columnNames.statusHeader || 'Status'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {columnNames.networkTierHeader || 'Network Tier'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {columnNames.contactHeader || 'Contact'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {columnNames.nextAvailableHeader || 'Next Available'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {/* Provider rows would be mapped here */}
        </tbody>
      </table>
    </div>
  );
}