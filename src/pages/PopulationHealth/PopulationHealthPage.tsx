import { useState } from 'react';
import PatientDetailsView from '../../components/PatientDetailsView';
import CampaignTracker, { CampaignDetailsModal } from '../../components/CampaignTracker';
import GoogleMapsComponent from '../../components/GoogleMapsComponent';

// Sample data with SDOH information and patients
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

// Sample SDOH patients data
const sdohPatients = [
  {
    id: 'p1',
    name: 'John Smith',
    age: 45,
    position: { lat: 40.7589, lng: -73.9851 },
    address: '123 Madison Ave, New York, NY',
    sdohRisks: ['Food Insecurity', 'Transportation Barriers'],
    lastVisit: '2024-01-15',
    riskScore: 78
  },
  {
    id: 'p2',
    name: 'Maria Garcia',
    age: 62,
    position: { lat: 34.0522, lng: -118.2437 },
    address: '456 Figueroa St, Los Angeles, CA',
    sdohRisks: ['Housing Instability', 'Healthcare Access'],
    lastVisit: '2024-01-20',
    riskScore: 85
  },
  {
    id: 'p3',
    name: 'Robert Johnson',
    age: 58,
    position: { lat: 41.8819, lng: -87.6278 },
    address: '789 State St, Chicago, IL',
    sdohRisks: ['Food Insecurity', 'Social Isolation'],
    lastVisit: '2024-01-25',
    riskScore: 72
  }
];

interface Trend {
  period: string;
  score: number;
}

type Metric = { label: string; value: number };

interface Campaign {
  id: string;
  name: string;
  target: string;
  startDate: string;
  duration: string;
  budget: string;
  status: 'Active' | 'Completed' | 'Planned';
  progress: number;
  outcomes: {
    patientsReached: number;
    interventionsCompleted: number;
    successRate: number;
  };
}

const PopulationHealthPage = () => {
  const [selectedMetric, setSelectedMetric] = useState<'population' | 'healthIndex'>('population');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedAnalysisData, setSelectedAnalysisData] = useState<any>(null);
  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState<any>(null);
  const [showCampaignProgress, setShowCampaignProgress] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const getScoreColor = (score: number) => {
    return score >= 4 ? 'bg-red-100 text-red-800' : 
           score >= 3 ? 'bg-yellow-100 text-yellow-800' : 
           'bg-green-100 text-green-800';
  };

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocationId(locationId || null);
    setSelectedPatientId(null);
  };

  const handleViewPatientDetails = (patient: any) => {
    const details = {
      careTeam: [
        { id: 'ct1', name: 'Dr. Sarah Smith', role: 'Primary Care', lastContact: '2024-01-20', nextAvailable: '2024-02-10' },
        { id: 'ct2', name: 'John Doe', role: 'Social Worker', lastContact: '2024-01-25', nextAvailable: '2024-02-05' }
      ],
      interventions: [
        {
          id: 'int1',
          date: '2024-01-15',
          type: 'Home Visit',
          provider: 'Community Health Worker',
          outcome: 'Successful',
          followUpDate: '2024-02-15',
          notes: 'Provided transportation resources and food assistance information'
        }
      ],
      appointments: {
        past: [
          { date: '2024-01-10', type: 'Check-up', provider: 'Dr. Smith', outcome: 'Completed' }
        ],
        upcoming: [
          { date: '2024-02-15', type: 'Follow-up', provider: 'Dr. Smith' }
        ]
      },
      adherence: {
        medications: 85,
        appointments: 90,
        overall: 87
      },
      careGaps: [
        { issue: 'Annual wellness visit', priority: 'High', dueDate: '2024-03-01' },
        { issue: 'Diabetes screening', priority: 'Medium', dueDate: '2024-04-01' }
      ]
    };
    setSelectedPatientDetails(details);
    setShowPatientDetails(true);
  };

  const handleCreateCampaign = (campaignData: any) => {
    const newCampaign: Campaign = {
      id: `campaign-${activeCampaigns.length + 1}`,
      name: campaignData.name || 'New Campaign',
      target: campaignData.target || 'Food Access',
      startDate: new Date().toISOString(),
      duration: campaignData.duration || '3 months',
      budget: campaignData.budget || '$25,000 - $50,000',
      status: 'Active',
      progress: 0,
      outcomes: {
        patientsReached: 0,
        interventionsCompleted: 0,
        successRate: 0
      }
    };
    setActiveCampaigns([...activeCampaigns, newCampaign]);
    setShowCampaignModal(false);
  };

  const handlePatientSelect = (patient: any) => {
    setSelectedPatientId(patient.id);
    setSelectedLocationId(null);
  };

  const handleViewAnalysis = (locationId: string) => {
    const location = sampleHealthLocations.find(loc => loc.id === locationId);
    setSelectedAnalysisData({
      title: location?.title,
      metrics: [
        { label: 'Population Health Score', value: location?.healthIndex || 0 },
        { label: 'Total Patients', value: location?.potentialImpact.patientsReached || 0 },
        { label: 'Revenue Impact', value: location?.potentialImpact.revenueOpportunity || 0 }
      ],
      sdohFactors: location?.sdohFactors || [],
      trends: [
        { period: 'Jan 2024', score: 72 },
        { period: 'Feb 2024', score: 75 },
        { period: 'Mar 2024', score: 78 }
      ]
    });
    setShowAnalysisModal(true);
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

        {/* SDOH Patients Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Identified SDOH Patients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sdohPatients.map(patient => (
              <div
                key={patient.id}
                className={`bg-gray-50 border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow ${
                  selectedPatientId === patient.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handlePatientSelect(patient)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{patient.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    patient.riskScore >= 80 ? 'bg-red-100 text-red-800' :
                    patient.riskScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    Risk: {patient.riskScore}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{patient.address}</p>
                <div className="space-y-1">
                  <p className="text-sm"><span className="font-medium">Age:</span> {patient.age}</p>
                  <p className="text-sm"><span className="font-medium">Last Visit:</span> {patient.lastVisit}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewPatientDetails(patient);
                    }}
                    className="w-full bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm mt-2"
                  >View Patient Details</button>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {patient.sdohRisks.map((risk, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-900 text-xs px-2 py-1 rounded-full"
                      >
                        {risk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SDOH Impact Cards */}
        {/* Campaign Tracker */}
        {activeCampaigns.length > 0 && (
          <CampaignTracker
            campaigns={activeCampaigns}
            onSelectCampaign={(campaign) => {
              setSelectedCampaign(campaign);
              setShowCampaignProgress(true);
            }}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {sampleHealthLocations.map(location => (
            <div 
              key={location.id} 
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer ${
                selectedLocationId === location.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleLocationSelect(location.id)}
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
                  <p className="text-blue-900">
                    <span className="font-medium">Patients Reached:</span> {location.potentialImpact.patientsReached.toLocaleString()}
                  </p>
                  <p className="text-blue-900">
                    <span className="font-medium">Revenue Opportunity:</span> ${location.potentialImpact.revenueOpportunity.toLocaleString()}
                  </p>
                  <p className="text-blue-900">
                    <span className="font-medium">Community Benefit:</span> {location.potentialImpact.communityBenefit}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCampaignModal(true);
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Campaign
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewAnalysis(location.id);
                    }}
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
            <p className="text-gray-600 mt-1">Click on a location card or map marker to zoom in</p>
          </div>
          <div className="p-4">
            <GoogleMapsComponent 
              apiKey="AIzaSyBbQkbsYbWvjnFUgssk4Nz5dD12djuO4mk"
              locations={[
                ...sampleHealthLocations,
                ...(selectedPatientId
                  ? sdohPatients
                      .filter(p => p.id === selectedPatientId)
                      .map(p => ({
                        id: p.id,
                        position: p.position,
                        title: p.name,
                        population: 1,
                        healthIndex: p.riskScore
                      }))
                  : [])
              ]}
              selectedLocationId={selectedLocationId || selectedPatientId}
              onLocationSelect={(id) => {
                const isPatient = sdohPatients.some(p => p.id === id);
                if (isPatient) {
                  setSelectedPatientId(id);
                  setSelectedLocationId(null);
                } else {
                  setSelectedLocationId(id);
                  setSelectedPatientId(null);
                }
              }}
            />
          </div>
        </div>

        {/* Campaign Modal */}
        {showCampaignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Create Community Health Campaign</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2 bg-white"
                    placeholder="Enter campaign name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target SDOH Factors</label>
                  <select className="w-full border rounded-lg p-2 bg-white">
                    <option>Food Access</option>
                    <option>Transportation</option>
                    <option>Healthcare Access</option>
                    <option>Housing</option>
                    <option>Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Duration</label>
                  <select className="w-full border rounded-lg p-2 bg-white">
                    <option>3 months</option>
                    <option>6 months</option>
                    <option>12 months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>

        {/* Patient Details Modal */}
        {showPatientDetails && selectedPatientDetails && (
          <PatientDetailsView
            details={selectedPatientDetails}
            onClose={() => setShowPatientDetails(false)}
          />
        )}

        {/* Campaign Progress Modal */}
        {showCampaignProgress && selectedCampaign && (
          <CampaignDetailsModal
            campaign={selectedCampaign}
            onClose={() => setShowCampaignProgress(false)}
          />
        )}

                  <select className="w-full border rounded-lg p-2 bg-white">
                    <option>$10,000 - $25,000</option>
                    <option>$25,000 - $50,000</option>
                    <option>$50,000 - $100,000</option>
                    <option>$100,000+</option>
                  </select>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setShowCampaignModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 bg-white text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => handleCreateCampaign({
                      name: 'New Campaign',
                      target: 'Food Access',
                      duration: '3 months',
                      budget: '$25,000 - $50,000'
                    })}
                  >
                    Create Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Modal */}
        {showAnalysisModal && selectedAnalysisData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Detailed Analysis: {selectedAnalysisData.title}</h2>
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="text-gray-600 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {selectedAnalysisData.metrics.map((metric: Metric, idx: number) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-600">{metric.label}</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {typeof metric.value === 'number' && metric.value > 1000
                        ? metric.value.toLocaleString()
                        : metric.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* SDOH Factors Analysis */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">SDOH Factor Analysis</h3>
                <div className="space-y-4">
                  {selectedAnalysisData.sdohFactors.map((factor: { factor: string; score: number; description: string }, idx: number) => (
                    <div key={idx} className="bg-white border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{factor.factor}</h4>
                        <span className={`px-2 py-1 rounded-full text-sm ${getScoreColor(factor.score)}`}>
                          Score: {factor.score}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{factor.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trends */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Health Score Trends</h3>
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    {selectedAnalysisData.trends.map((trend: Trend, idx: number) => (
                      <div key={idx} className="text-center">
                        <p className="text-sm text-gray-600">{trend.period}</p>
                        <p className="text-lg font-semibold">{trend.score}</p>
                      </div>
                    ))}
                  </div>
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