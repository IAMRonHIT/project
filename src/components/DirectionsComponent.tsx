import React, { useState, useEffect } from 'react';
import { MapPin, Clock, ArrowRight, RotateCw } from 'lucide-react';

interface DirectionsComponentProps {
  origin: string;
  destination: string;
  onClose?: () => void;
}

interface DirectionStep {
  instructions: string;
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  travel_mode: string;
}

interface DirectionsData {
  status: string;
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  start_address: string;
  end_address: string;
  steps: DirectionStep[];
}

const DirectionsComponent: React.FC<DirectionsComponentProps> = ({ 
  origin, 
  destination,
  onClose 
}) => {
  const [directions, setDirections] = useState<DirectionsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [travelMode, setTravelMode] = useState<string>('driving');
  const [isDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    if (!origin || !destination) {
      setError('Origin and destination are required');
      return;
    }

    const fetchDirections = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching directions from ${origin} to ${destination} via ${travelMode}`);
        
        const response = await fetch('/api/directions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            origin,
            destination,
            mode: travelMode
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status !== 'OK') {
          setError(data.error_message || 'Failed to get directions');
          setDirections(null);
        } else {
          console.log('Directions fetched successfully:', data);
          setDirections(data);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error fetching directions';
        setError(errorMessage);
        console.error('Error fetching directions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDirections();
  }, [origin, destination, travelMode]);

  const getTravelModeIcon = (mode: string) => {
    switch (mode) {
      case 'driving':
        return <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 8l-3-3H7L4 8m16 0H4m16 0v8m0 0H4m16 0l-3 3H7l-3-3M4 8v8m4-9v1m8-1v1"/></svg>;
      case 'walking':
        return <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 4.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-1.5 3l-4 12m-.5-8l4-4 4 4v8m-4-12v20"/></svg>;
      case 'bicycling':
        return <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 12l-3-9 9 4-4 4 5 9-8-5m-3.5 5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm14 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/></svg>;
      case 'transit':
        return <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 16h10M7 12h10M7 8h10M5 22h14a2 2 0 002-2V4a2 2 0 00-2-2H5a2 2 0 00-2 2v16a2 2 0 002 2z"/></svg>;
      default:
        return <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 8l-3-3H7L4 8m16 0H4m16 0v8m0 0H4m16 0l-3 3H7l-3-3M4 8v8m4-9v1m8-1v1"/></svg>;
    }
  };

  return (
    <div className={`rounded-lg border ${
      isDark 
        ? 'bg-gray-800/40 border-indigo-500/20' 
        : 'bg-white border-gray-200'
    } overflow-hidden`}>
      <div className={`p-4 border-b ${
        isDark ? 'border-indigo-500/20' : 'border-gray-200'
      } flex justify-between items-center`}>
        <h3 className={`font-medium ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Directions
        </h3>
        
        <div className="flex gap-2">
          <div className="flex rounded-md overflow-hidden border border-gray-700">
            <button
              onClick={() => setTravelMode('driving')}
              className={`px-2 py-1 flex items-center justify-center ${
                travelMode === 'driving'
                  ? isDark 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-blue-600 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Driving"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 8l-3-3H7L4 8m16 0H4m16 0v8m0 0H4m16 0l-3 3H7l-3-3M4 8v8m4-9v1m8-1v1"/>
              </svg>
            </button>
            <button
              onClick={() => setTravelMode('walking')}
              className={`px-2 py-1 flex items-center justify-center ${
                travelMode === 'walking'
                  ? isDark 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-blue-600 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Walking"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 4.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-1.5 3l-4 12m-.5-8l4-4 4 4v8m-4-12v20"/>
              </svg>
            </button>
            <button
              onClick={() => setTravelMode('bicycling')}
              className={`px-2 py-1 flex items-center justify-center ${
                travelMode === 'bicycling'
                  ? isDark 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-blue-600 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Bicycling"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 12l-3-9 9 4-4 4 5 9-8-5m-3.5 5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm14 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
              </svg>
            </button>
            <button
              onClick={() => setTravelMode('transit')}
              className={`px-2 py-1 flex items-center justify-center ${
                travelMode === 'transit'
                  ? isDark 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-blue-600 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Transit"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 16h10M7 12h10M7 8h10M5 22h14a2 2 0 002-2V4a2 2 0 00-2-2H5a2 2 0 00-2 2v16a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              className={`p-1 rounded-md ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Close directions"
              title="Close directions"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className={`flex justify-center items-center py-8 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <RotateCw className="w-5 h-5 animate-spin mr-2" />
            <span>Loading directions...</span>
          </div>
        ) : error ? (
          <div className={`p-4 rounded-md ${
            isDark 
              ? 'bg-red-900/20 text-red-400 border border-red-900/30' 
              : 'bg-red-100 text-red-700'
          }`}>
            {error}
          </div>
        ) : directions ? (
          <div>
            <div className={`flex justify-between items-center mb-4 p-3 rounded-md ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-100'
            }`}>
              <div className="flex items-center">
                <MapPin className={`w-4 h-4 mr-2 ${
                  isDark ? 'text-indigo-400' : 'text-blue-600'
                }`} />
                <div>
                  <div className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Distance
                  </div>
                  <div className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {directions.distance.text}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className={`w-4 h-4 mr-2 ${
                  isDark ? 'text-indigo-400' : 'text-blue-600'
                }`} />
                <div>
                  <div className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Duration
                  </div>
                  <div className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {directions.duration.text}
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`text-sm mb-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <strong>From:</strong> {directions.start_address}
            </div>
            <div className={`text-sm mb-4 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <strong>To:</strong> {directions.end_address}
            </div>
            
            <h4 className={`font-medium mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Step by Step Directions
            </h4>
            
            <div className={`space-y-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {directions.steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-md ${
                    isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      isDark ? 'bg-indigo-600' : 'bg-blue-600'
                    } text-white text-xs font-medium`}>
                      {index + 1}
                    </div>
                    <div>
                      <div 
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: step.instructions }}
                      />
                      <div className={`mt-1 text-xs flex items-center ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <span className="mr-2">{getTravelModeIcon(step.travel_mode.toLowerCase())}</span>
                        <span>{step.distance.text}</span>
                        <span className="mx-1">•</span>
                        <span>{step.duration.text}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${travelMode}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  isDark 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                View on Google Maps
              </a>
            </div>
          </div>
        ) : (
          <div className={`text-center py-8 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No directions available
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectionsComponent;
