import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { PlansList } from './components/PlansList';
import { PlanDetailView } from './components/PlanDetailView';
import type { HealthPlan } from './types';

// Mock data - replace with API call
const mockPlans: HealthPlan[] = [
  {
    id: '1',
    name: 'Blue Cross PPO',
    type: 'Commercial PPO',
    description: 'Comprehensive PPO plan with nationwide coverage',
    logo: 'https://placehold.co/100',
    contact: {
      phone: '1-800-555-0123',
      email: 'provider@bcbs.com',
      website: 'www.bcbs.com'
    },
    coverage: {
      status: 'active',
      type: 'primary',
      effectiveDate: '2025-01-01',
      network: {
        type: 'in-network',
        tier: 'preferred'
      },
      benefits: [
        {
          serviceType: 'Primary Care',
          coverage: 90,
          deductible: 500,
          outOfPocketMax: 3000,
          requiresAuth: false
        },
        {
          serviceType: 'Specialty Care',
          coverage: 80,
          deductible: 1000,
          outOfPocketMax: 5000,
          requiresAuth: true
        }
      ]
    }
  },
  {
    id: '2',
    name: 'Aetna HMO',
    type: 'Commercial HMO',
    description: 'Managed care plan with coordinated care delivery',
    logo: 'https://placehold.co/100',
    contact: {
      phone: '1-800-555-0124',
      email: 'provider@aetna.com',
      website: 'www.aetna.com'
    },
    coverage: {
      status: 'active',
      type: 'primary',
      effectiveDate: '2025-01-01',
      network: {
        type: 'in-network',
        tier: 'standard'
      },
      benefits: [
        {
          serviceType: 'Primary Care',
          coverage: 100,
          deductible: 0,
          outOfPocketMax: 2000,
          requiresAuth: false
        },
        {
          serviceType: 'Specialty Care',
          coverage: 90,
          deductible: 500,
          outOfPocketMax: 4000,
          requiresAuth: true
        }
      ]
    }
  },
  {
    id: '3',
    name: 'UnitedHealthcare Choice Plus',
    type: 'Commercial PPO',
    description: 'Flexible PPO plan with large provider network',
    logo: 'https://placehold.co/100',
    contact: {
      phone: '1-800-555-0125',
      email: 'provider@uhc.com',
      website: 'www.uhc.com'
    },
    coverage: {
      status: 'pending',
      type: 'secondary',
      effectiveDate: '2025-02-01',
      network: {
        type: 'in-network',
        tier: 'premium'
      },
      benefits: [
        {
          serviceType: 'Primary Care',
          coverage: 85,
          deductible: 750,
          outOfPocketMax: 4000,
          requiresAuth: false
        },
        {
          serviceType: 'Specialty Care',
          coverage: 75,
          deductible: 1500,
          outOfPocketMax: 6000,
          requiresAuth: true
        }
      ]
    }
  }
];

export function HealthPlansPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<HealthPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, this would trigger an API call
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500); // Simulate API delay
  };

  const handleFilter = () => {
    // Implement advanced filtering
    console.log('Open filter modal');
  };

  const filteredPlans = mockPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-primary text-3xl font-bold mb-2">
            Health Plans
          </h1>
          <p className="text-secondary text-lg">
            Manage and view health plan information
          </p>
        </header>

        {/* Search */}
        <SearchBar
          onSearch={handleSearch}
          onFilter={handleFilter}
        />

        {/* Plans List */}
        <PlansList
          plans={filteredPlans}
          onPlanSelect={setSelectedPlan}
          isLoading={isLoading}
        />

        {/* Detail View */}
        {selectedPlan && (
          <PlanDetailView
            plan={selectedPlan}
            onClose={() => setSelectedPlan(null)}
          />
        )}
      </div>
    </div>
  );
}
