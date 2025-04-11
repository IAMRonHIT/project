import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Navigation, ChevronRight, Clock, Map } from 'lucide-react';
import { DirectionsResult } from '../GoogleMapsComponent';

interface DirectionsDisplayProps {
  origin: string;
  destination: string;
  onClose?: () => void;
  mode?: string;
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  showMap?: boolean;
  onDirectionsLoaded?: (directions: DirectionsResult) => void;
}

const DirectionsDisplay: React.FC<DirectionsDisplayProps> = ({
  origin,
  destination,
  onClose,
  mode = 'driving',
  avoidTolls = false,
  avoidHighways = false,
  showMap = true,
  onDirectionsLoaded
}) => {
  const [directions, setDirections] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [staticMapUrl, setStaticMapUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchDirections = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get directions from our API
        const response = await axios.post('/api/directions', {
          origin,
          destination,
          travelMode: mode,
          avoidTolls,
          avoidHighways
        });
        
        if (response.data.status === 'OK') {
          setDirections(response.data);
          
          // If caller wants notification of loaded directions
          if (onDirectionsLoaded) {
            onDirectionsLoaded(response.data);
          }
          
          // Get a static map for the route if available
          if (showMap && response.data.overview_polyline && response.data.routes?.[0]) {
            // Get the first route destination coordinates
            const leg = response.data.routes[0];
            if (leg && leg.distance && leg.duration) {
              try {
                const mapResponse = await axios.get('/api/directions/static-map', {
                  params: {
                    lat: leg.end_location?.lat || 0,
                    lng: leg.end_location?.lng || 0,
                    zoom: 13
                  }
                });
                
                if (mapResponse.data.url) {
                  setStaticMapUrl(mapResponse.data.url);
                }
              } catch (mapErr) {
                console.error('Error fetching static map:', mapErr);
                // Non-critical error, so don't set error state
              }
            }
          }
        } else {
          setError(`Could not find directions: ${response.data.error_message || 'Unknown error'}`);
        }
      } catch (err) {
        console.error('Error fetching directions:', err);
        setError('Error fetching directions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (origin && destination) {
      fetchDirections();
    } else {
      setError('Origin and destination are required');
      setLoading(false);
    }
  }, [origin, destination, mode, avoidTolls, avoidHighways, showMap, onDirectionsLoaded]);

  // Format duration string (remove parentheses if present)
  const formatDuration = (text: string) => {
    return text.replace(/[()]/g, '');
  };

  // Sanitize HTML instructions from Google Directions API
  // We need to keep some formatting but remove potentially unsafe parts
  const sanitizeInstructions = (html: string) => {
    // Create a DOMParser to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove potentially unsafe elements
    const scripts = doc.querySelectorAll('script, iframe, object, embed');
    scripts.forEach(el => el.remove());
    
    return doc.body.innerHTML;
  };
  
  if (loading) {
    return (
      <div className="p-4 rounded-lg bg-indigo-950/80 text-white animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Getting directions...</h3>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 rounded hover:bg-black/20 text-gray-300 hover:text-white"
              aria-label="Close directions panel"
              title="Close directions"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-indigo-800/50 rounded w-3/4"></div>
          <div className="h-4 bg-indigo-800/50 rounded w-1/2"></div>
          <div className="h-24 bg-indigo-800/50 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-950/80 text-white">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Directions Error</h3>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 rounded hover:bg-black/20 text-gray-300 hover:text-white"
              aria-label="Close directions error panel"
              title="Close error"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <p className="text-red-200">{error}</p>
        <div className="flex justify-between mt-4">
          <p className="text-sm text-red-200">Try a different destination or mode of transportation</p>
        </div>
      </div>
    );
  }

  if (!directions) return null;

  return (
    <div className="rounded-lg bg-indigo-950/80 text-white overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Directions to Destination</h3>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 rounded hover:bg-black/20 text-gray-300 hover:text-white"
              aria-label="Close directions panel" 
              title="Close directions"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        {/* Route summary */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Navigation className="text-blue-400" size={16} />
            <span className="font-medium">{directions.distance?.text || 'Unknown distance'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-blue-400" size={16} />
            <span>{directions.duration ? formatDuration(directions.duration.text) : 'Unknown time'}</span>
          </div>
        </div>

        {/* Static map (if available) */}
        {showMap && staticMapUrl && (
          <div className="mb-4 relative">
            <img 
              src={staticMapUrl} 
              alt="Route Map" 
              className="w-full h-auto rounded-lg"
            />
            <a 
              href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${mode}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center"
            >
              <Map size={12} className="mr-1" />
              Open in Google Maps
            </a>
          </div>
        )}

        {/* Turn-by-turn directions */}
        <div className="space-y-3 mt-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          <h4 className="font-medium text-blue-200">Turn-by-turn directions</h4>
          
          {directions.steps?.map((step: any, index: number) => (
            <div 
              key={index}
              className="flex items-start gap-2 pb-3 border-b border-indigo-800/30 last:border-0"
            >
              <div className="mt-1 min-w-[20px] text-center">
                <ChevronRight size={16} className="text-blue-400" />
              </div>
              <div className="flex-1">
                {/* Use dangerouslySetInnerHTML carefully with sanitized content */}
                <div 
                  className="text-sm" 
                  dangerouslySetInnerHTML={{
                    __html: sanitizeInstructions(step.instructions)
                  }}
                />
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <span>{step.distance?.text || ''}</span>
                  {step.duration && (
                    <>
                      <span className="mx-1">•</span>
                      <span>{formatDuration(step.duration.text)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Link to open in Google Maps */}
        <div className="mt-4">
          <a 
            href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${mode}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
          >
            <Navigation size={16} className="mr-2" />
            Open directions in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};

export default DirectionsDisplay;
