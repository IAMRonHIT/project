
import { MapPin, ArrowUpRight, Phone, Mail, Calendar } from "lucide-react";
import { RatingBadge } from "@/components/RatingBadge";
import { ProviderStatusBadge } from "@/components/ProviderStatusBadge";
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

export function ProvidersTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Provider
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rating
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Network Tier
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Next Available
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