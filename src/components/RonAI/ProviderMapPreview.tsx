import React, { useState, useEffect } from 'react';
import { X, Search, MapPin, ExternalLink, AlertTriangle, Mail, List } from 'lucide-react';
import { ProviderSearchParams } from './ProviderSearchModal';
import { 
  searchProviders, 
  getSpecialtyDisplayName,
  Provider 
} from '../../services/providerService';
import GoogleMapsComponent from '../../components/GoogleMapsComponent';
import { ErrorBoundary } from 'react-error-boundary';
import ProviderListModal from './ProviderListModal';

interface ProviderMapPreviewProps {
  searchParams: ProviderSearchParams;
  onClose: () => void;
  isVisible: boolean;
  patientAddress?: string; // Add patient address prop
}

const ProviderMapPreview: React.FC<ProviderMapPreviewProps> = ({ 
  searchParams, 
  onClose, 
  isVisible,
  patientAddress = '' // Default to empty string
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showProviderListModal, setShowProviderListModal] = useState(false);
  
  // Handle visibility changes
  useEffect(() => {
    if (isVisible) {
      setIsTransitioning(true);
      // Small delay to ensure transition starts
      setTimeout(() => setIsTransitioning(false), 50);
    }
  }, [isVisible]);

  // Load providers when search parameters change
  useEffect(() => {
    if (isVisible) {
      setIsLoading(true);
      setIsError(false);
      setProviders([]);
      
      searchProviders(searchParams)
        .then(fetchedProviders => {
          console.log("Providers fetched:", fetchedProviders);
          setProviders(fetchedProviders);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching providers:", error);
          setIsError(true);
          setIsLoading(false);
        });
    }
  }, [isVisible, searchParams]);

  const handleClose = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onClose();
      setIsTransitioning(false);
    }, 200);
  };
  
  if (!isVisible && !isTransitioning) return null;
  
  return (
    <>
      <div className={`fixed inset-0 z-50 flex items-start justify-end transition-all duration-300 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}>
        {/* Semi-transparent overlay */}
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-40 transition-opacity duration-300"
          onClick={handleClose}
        />
        
        {/* Panel with responsive width */}
        <div className={`fixed right-0 top-0 z-50 w-1/3 min-w-[580px] max-w-[800px] h-screen bg-gray-900/95 border-l border-gray-700 flex flex-col transform transition-all duration-300 ease-out ${
          isTransitioning ? 'translate-x-full' : 'translate-x-0'
        }`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white flex flex-col">
              {searchParams.searchType === 'specialty' && searchParams.specialty 
                ? getSpecialtyDisplayName(searchParams.specialty) 
                : 'Healthcare'} Providers
              <span className="text-sm text-gray-400 font-normal">
                {(searchParams.searchType === 'specialty' || searchParams.searchType === 'name') && searchParams.postalCode 
                  ? `in ${searchParams.postalCode}` 
                  : searchParams.searchType === 'npi' && searchParams.npiNumber
                  ? `NPI: ${searchParams.npiNumber}`
                  : ''}
              </span>
            </h3>
            
            <div className="flex items-center gap-2">
              {/* Provider List Button */}
              {providers.length > 0 && (
                <button
                  onClick={() => setShowProviderListModal(true)}
                  className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors flex items-center gap-1"
                  title="View Provider List"
                >
                  <List size={16} />
                  <span className="text-xs">List</span>
                </button>
              )}
              
              <button
                onClick={handleClose}
                className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                title="Close preview"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-2 border-t-teal-500 border-gray-700 rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-400">Loading providers...</p>
                </div>
              </div>
            ) : isError ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <AlertTriangle size={40} className="text-red-500 mb-4" />
                <p className="text-lg font-medium text-white mb-2">Failed to load provider data</p>
                <p className="text-gray-400">Please try again later</p>
              </div>
            ) : providers.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <Search size={40} className="text-gray-500 mb-4" />
                <p className="text-lg font-medium text-white mb-2">No providers found</p>
                <p className="text-gray-400">Try adjusting your search parameters</p>
              </div>
            ) : (
              <>
                {/* Interactive Google Maps integration */}
                <div className="flex-1 relative min-h-[400px]">
                  <div className="w-full h-full relative">
                    {/* Wrap Google Maps in error boundary */}
                    <ErrorBoundary fallback={
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-8 text-center">
                        <AlertTriangle size={48} className="text-amber-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Google Maps Error</h3>
                        <p className="text-gray-400 mb-4">Unable to load the map. Please check API configuration.</p>
                        <div className="text-sm text-gray-500">
                          Showing provider list without map visualization
                        </div>
                      </div>
                    }>
                      <GoogleMapsComponent
                        apiKey={(import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || ''}
                        locations={providers.map((provider, index) => {
                          const fallbackPosition = {
                            lat: 40.7608 + (Math.random() * 0.04 - 0.02),
                            lng: -111.8910 + (Math.random() * 0.04 - 0.02)
                          };
                          
                          return {
                            id: provider.id,
                            position: provider.location || fallbackPosition,
                            title: provider.name,
                            population: parseInt(provider.npi?.slice(-4) || '0') || 1,
                            healthIndex: (provider.rating ?? 4.0) * 20
                          };
                        })}
                        selectedLocationId={selectedProviderId}
                        onLocationSelect={(id) => {
                          console.log(`Provider selected on map: ${id}`);
                          if (id) {
                            setSelectedProviderId(id);
                          } else {
                            setSelectedProviderId(null);
                          }
                        }}
                      />
                    </ErrorBoundary>
                    
                    {/* Custom "Search on Google" button */}
                    {selectedProviderId && (
                      <div className="absolute bottom-4 right-4 z-20">
                        <button 
                          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-blue-500 transition-colors"
                          onClick={() => {
                            const provider = providers.find(p => p.id === selectedProviderId);
                            if (provider) {
                              const searchQuery = encodeURIComponent(`${provider.name} ${provider.address} reviews`);
                              window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank', 'noopener,noreferrer');
                            }
                          }}
                        >
                          <Search size={14} className="mr-2" />
                          View on Google
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="h-[40vh] overflow-y-auto border-t border-gray-700">
            {isLoading ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="p-4 border-b border-gray-700 animate-pulse">
                  <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                </div>
              ))
            ) : providers.length > 0 ? (
              providers.map((provider) => (
                <div 
                  id={`provider-${provider.id}`}
                  key={provider.id} 
                  className={`p-4 border-b border-gray-700 hover:bg-white/5 transition-colors cursor-pointer ${
                    selectedProviderId === provider.id ? 'bg-white/10' : ''
                  }`}
                  onClick={() => setSelectedProviderId(provider.id)}
                  onMouseEnter={() => setSelectedProviderId(provider.id)}
                  onMouseLeave={() => setSelectedProviderId(null)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-medium">{provider.name}</h4>
                    <span className="text-gray-400 text-sm">{provider.distance}</span>
                  </div>
                  
                  <div className="text-sm text-teal-400 mb-1">{getSpecialtyDisplayName(provider.specialty)}</div>
                  
                  {provider.rating !== undefined && (
                    <div className="flex items-center text-gray-400 text-sm mb-2">
                      <span className="text-amber-400 mr-1">{'★'.repeat(Math.floor(provider.rating))}</span>
                      <span>{provider.rating}</span>
                    </div>
                  )}
                  
                  <div className="text-gray-400 text-sm mb-2">
                    <MapPin size={14} className="inline mr-1" />
                    {provider.address}
                  </div>
                  
                  <div className="text-gray-400 text-sm mb-3">
                    {provider.phone}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      provider.network === 'in-network' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {provider.network === 'in-network' ? 'In-Network' : 'Out-of-Network'}
                    </span>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      provider.accepting
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {provider.accepting ? 'Accepting New Patients' : 'Not Accepting New Patients'}
                    </span>
                  </div>
                  
                  {provider.npi && (
                    <div className="text-gray-400 text-xs mt-2">
                      NPI: {provider.npi}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Search size={48} className="text-gray-500 mb-4" />
                <p className="text-lg font-medium text-white mb-2">No providers found matching your criteria.</p>
                <p className="text-gray-400">Try adjusting your search parameters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Provider List Modal */}
      <ProviderListModal
        isOpen={showProviderListModal}
        onClose={() => setShowProviderListModal(false)}
        providers={providers}
        patientAddress={patientAddress} // Pass patient address down
      />
    </>
  );
};

export default ProviderMapPreview;
