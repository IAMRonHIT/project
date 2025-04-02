import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ProviderSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (searchParams: ProviderSearchParams) => void;
}

export interface ProviderSearchParams {
  searchType: 'npi' | 'name' | 'specialty';
  // NPI search
  npiNumber?: string;
  // Name search
  firstName?: string;
  lastName?: string;
  // Specialty search
  specialty?: string;
  // Shared parameters
  postalCode?: string; // Single postal code field for all search types
  enumerationType?: 'ind' | 'org';
  limit?: number;
  sex?: 'male' | 'female' | 'any'; // Added sex filter
}

const ProviderSearchModal: React.FC<ProviderSearchModalProps> = ({ 
  isOpen, 
  onClose,
  onSearch 
}) => {
  const [searchType, setSearchType] = useState<'npi' | 'name' | 'specialty'>('specialty');
  const [searchParams, setSearchParams] = useState<ProviderSearchParams>({
    searchType: 'specialty',
    specialty: 'primary-care',
    postalCode: '84101', // Salt Lake City downtown
    enumerationType: 'ind', // Default to individual providers
    limit: 20,
    sex: 'any' // Default to any sex
  });

  if (!isOpen) return null;

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSearchType = e.target.value as 'npi' | 'name' | 'specialty';
    setSearchType(newSearchType);
    setSearchParams(prev => ({
      ...prev,
      searchType: newSearchType
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gradient-to-b from-gray-900/95 to-gray-800/95 rounded-lg border border-indigo-500/30 shadow-xl shadow-black/30 overflow-hidden">
        <div className="p-4 border-b border-indigo-500/30 bg-gray-800/50 flex items-center justify-between relative">
          {/* Decorative elements */}
          <div className="absolute left-0 top-0 w-1/3 h-0.5 bg-gradient-to-r from-indigo-500/80 to-transparent"></div>
          <div className="absolute right-0 bottom-0 w-1/4 h-0.5 bg-gradient-to-l from-teal-500/80 to-transparent"></div>
          
          <h3 className="text-sm font-medium text-white">Provider Search</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors relative group"
            aria-label="Close provider search modal"
          >
            <X size={18} />
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          {/* Search type selector */}
          <div className="mb-4">
            <label htmlFor="searchType" className="block text-xs font-medium text-gray-400 mb-1">Search By</label>
            <select 
              id="searchType"
              name="searchType"
              value={searchType}
              onChange={handleSearchTypeChange}
              className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
              focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50
              shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200
              hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]"
            >
              <option value="npi">NPI Number</option>
              <option value="name">Provider Name</option>
              <option value="specialty">Specialty</option>
            </select>
          </div>
          
          {/* NPI Number search fields */}
          {searchType === 'npi' && (
            <div className="mb-4">
              <label htmlFor="npiNumber" className="block text-xs font-medium text-gray-400 mb-1">NPI Number</label>
              <input 
                type="text"
                id="npiNumber"
                name="npiNumber"
                value={searchParams.npiNumber || ''}
                onChange={handleInputChange}
                placeholder="Enter 10-digit NPI number"
                className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
                focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50
                shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200
                hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]"
                maxLength={10}
                pattern="[0-9]{10}"
              />
            </div>
          )}
          
          {/* Name search fields */}
          {searchType === 'name' && (
            <>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-xs font-medium text-gray-400 mb-1">First Name</label>
                <input 
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={searchParams.firstName || ''}
                  onChange={handleInputChange}
                  placeholder="Enter provider first name"
                  className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
                  focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50
                  shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200
                  hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="lastName" className="block text-xs font-medium text-gray-400 mb-1">Last Name</label>
                <input 
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={searchParams.lastName || ''}
                  onChange={handleInputChange}
                  placeholder="Enter provider last name"
                  className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
                  focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50
                  shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200
                  hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="postalCode" className="block text-xs font-medium text-gray-400 mb-1">Zip Code</label>
                <input 
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={searchParams.postalCode || ''}
                  onChange={handleInputChange}
                  placeholder="Enter zip code"
                  className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
                  focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50
                  shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200
                  hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]"
                  maxLength={5}
                  pattern="[0-9]{5}"
                />
              </div>
            </>
          )}
          
          {/* Specialty search fields */}
          {searchType === 'specialty' && (
            <>
              <div className="mb-4">
                <label htmlFor="specialty" className="block text-xs font-medium text-gray-400 mb-1">Specialty</label>
                <select 
                  id="specialty"
                  name="specialty"
                  value={searchParams.specialty || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
                  focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50
                  shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200
                  hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]"
                >
                  <option value="">Select a specialty</option>
                  <option value="primary-care">Primary Care</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="dermatology">Dermatology</option>
                  <option value="endocrinology">Endocrinology</option>
                  <option value="gastroenterology">Gastroenterology</option>
                  <option value="neurology">Neurology</option>
                  <option value="orthopedics">Orthopedics</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="psychiatry">Psychiatry</option>
                  <option value="urology">Urology</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="postalCode" className="block text-xs font-medium text-gray-400 mb-1">Zip Code</label>
                <input 
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={searchParams.postalCode || ''}
                  onChange={handleInputChange}
                  placeholder="Enter zip code"
                  className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
                  focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50
                  shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200
                  hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]"
                  maxLength={5}
                  pattern="[0-9]{5}"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="sex" className="block text-xs font-medium text-gray-400 mb-1">Provider Sex</label>
                <select 
                  id="sex"
                  name="sex"
                  value={searchParams.sex || 'any'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
                  focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50
                  shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200
                  hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]"
                >
                  <option value="any">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </>
          )}
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700/50">
            <button 
              type="button" 
              onClick={onClose}
              className="py-2 px-4 rounded-md text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="py-2 px-4 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_15px_rgba(79,70,229,0.7)] transition-all"
            >
              Search Providers
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderSearchModal;
