import { useState } from 'react';
import GoogleMapsComponent from '../../components/GoogleMapsComponent';

// Sample data with SDOH information
const sampleHealthLocations = [
  {
    id: '1',
    position: { lat: 40.7128, lng: -74.0060 },
    title: 'East Harlem',
    population: 115000,
    healthIndex: 68,
    sdohFactors: [
      { factor: 'Food Access', score: 4, description: 'Limited access to fresh food markets' },
      { factor: 'Transportation', score: 3, description: 'Limited public transit options' },
      { factor: 'Healthcare Access', score: 5, description: 'Few primary care providers' }
    ],
    potentialImpact: {
      patientsReached: 2500,
      revenueOpportunity: 750000,
      communityBenefit: 'High'
    }
  },
  {
    id: '2',
    position: { lat: 34.0522, lng: -118.2437 },
    title: 'South Central',
    population: 168000,
    healthIndex: 72,
    sdohFactors: [
      { factor: 'Housing', score: 3, description: 'Housing instability concerns' },
      { factor: 'Education', score: 4, description: 'Below average health literacy' },
      { factor: 'Employment', score: 3, description: 'High unemployment rate' }
    ],
    potentialImpact: {
      patientsReached: 3800,
      revenueOpportunity: 980000,
      communityBenefit: 'Very High'
    }
  },
  {
    id: '3',
    position: { lat: 41.8781, lng: -87.6298 },
    title: 'West Side',
    population: 132000,
    healthIndex: 70,
    sdohFactors: [
      { factor: 'Safety', score: 3, description: 'Community safety concerns' },
      { factor: 'Food Access', score: 3, description: 'Food desert area' },
      { factor: 'Healthcare Access', score: 4, description: 'Limited specialist availability' }
    ],
    potentialImpact: {
      patientsReached: 3200,
      revenueOpportunity: 850000,
      communityBenefit: 'High'
    }
  }
];

const PopulationHealthPage = () => {
  const [selectedMetric, setSelectedMetric] = useState<'population' | 'healthIndex'>('population');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  const getScoreColor = (score: number) => {
    return score >= 4 ? 'bg-red-100 text-red-800' : 
           score >= 3 ? 'bg-yellow-100 text-yellow-800' : 
           'bg-green-100 text-green-800';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Population Health & SDOH Analysis</h1>
          
          <div className="flex gap-4 mb-6">
            <select
              className="border rounded p-2 bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as 'population' | 'healthIndex')}
            >
              <option value="population">Population Impact</option>
              <option value="healthIndex">Health Index</option>
            </select>
          </div>
        </div>

        {/* SDOH Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {sampleHealthLocations.map(location => (
            <div 
              key={location.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-bold text-xl text-gray-800 mb-2">{location.title}</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-semibold">Population: </span>
                    <span className="text-gray-800">{location.population.toLocaleString()}</span>
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Health Index: </span>
                    <span className={`font-medium ${
                      location.healthIndex >= 80 
                        ? 'text-green-600' 
                        : location.healthIndex >= 70 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                    }`}>
                      {location.healthIndex}
                    </span>
                  </p>
                </div>
              </div>

              {/* SDOH Factors */}
              <div className="p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-700 mb-3">SDOH Factors</h4>
                <div className="space-y-2">
                  {location.sdohFactors.map((factor, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{factor.factor}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(factor.score)}`}>
                        Score: {factor.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Impact */}
              <div className="p-4 bg-blue-50">
                <h4 className="font-semibold text-blue-900 mb-3">Potential Impact</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-blue-800">
                    <span className="font-medium">Patients Reached:</span> {location.potentialImpact.patientsReached.toLocaleString()}
                  </p>
                  <p className="text-blue-800">
                    <span className="font-medium">Revenue Opportunity:</span> ${location.potentialImpact.revenueOpportunity.toLocaleString()}
                  </p>
                  <p className="text-blue-800">
                    <span className="font-medium">Community Benefit:</span> {location.potentialImpact.communityBenefit}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="space-y-2">
                  <button
                    onClick={() => setShowCampaignModal(true)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Campaign
                  </button>
                  <button
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    View Detailed Analysis
                  </button>
                </div>
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

        {/* Campaign Modal */}
        {showCampaignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Create Community Health Campaign</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2"
                    placeholder="Enter campaign name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target SDOH Factors</label>
                  <select className="w-full border rounded-lg p-2">
                    <option>Food Access</option>
                    <option>Transportation</option>
                    <option>Healthcare Access</option>
                    <option>Housing</option>
                    <option>Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Duration</label>
                  <select className="w-full border rounded-lg p-2">
                    <option>3 months</option>
                    <option>6 months</option>
                    <option>12 months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
                  <select className="w-full border rounded-lg p-2">
                    <option>$10,000 - $25,000</option>
                    <option>$25,000 - $50,000</option>
                    <option>$50,000 - $100,000</option>
                    <option>$100,000+</option>
                  </select>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setShowCampaignModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopulationHealthPage;