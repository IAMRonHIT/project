import { useState } from 'react';
import GoogleMapsComponent from '../../components/GoogleMapsComponent';

const sampleHealthLocations = [
  {
    id: '1',
    position: { lat: 40.7128, lng: -74.0060 },
    title: 'New York City',
    population: 8400000,
    healthIndex: 78
  },
  {
    id: '2',
    position: { lat: 34.0522, lng: -118.2437 },
    title: 'Los Angeles',
    population: 3900000,
    healthIndex: 82
  },
  {
    id: '3',
    position: { lat: 41.8781, lng: -87.6298 },
    title: 'Chicago',
    population: 2700000,
    healthIndex: 75
  }
];

const PopulationHealthPage = () => {
  const [selectedMetric, setSelectedMetric] = useState<'population' | 'healthIndex'>('population');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Population Health Overview</h1>
          
          <div className="flex gap-4 mb-6">
            <select
              className="border rounded p-2 bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as 'population' | 'healthIndex')}
            >
              <option value="population">Population</option>
              <option value="healthIndex">Health Index</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {sampleHealthLocations.map(location => (
            <div 
              key={location.id} 
              className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow"
            >
              <h3 className="font-bold text-xl text-gray-800 mb-2">{location.title}</h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold">Population: </span>
                  <span className="text-gray-800">{location.population.toLocaleString()}</span>
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Health Index: </span>
                  <span className={`text-${location.healthIndex >= 80 ? 'green' : location.healthIndex >= 70 ? 'yellow' : 'red'}-600`}>
                    {location.healthIndex}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Geographic Distribution</h2>
            <p className="text-gray-600 mt-1">Interactive map showing health metrics by location</p>
          </div>
          <div className="p-4">
            <GoogleMapsComponent 
              apiKey="AIzaSyBbQkbsYbWvjnFUgssk4Nz5dD12djuO4mk"
              locations={sampleHealthLocations}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopulationHealthPage;