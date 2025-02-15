import React from 'react';

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

interface CampaignTrackerProps {
  campaigns: Campaign[];
  onSelectCampaign: (campaign: Campaign) => void;
}

const CampaignTracker: React.FC<CampaignTrackerProps> = ({ campaigns, onSelectCampaign }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Active Campaigns</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map(campaign => (
          <div
            key={campaign.id}
            className="bg-gray-50 rounded-lg p-4 border cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelectCampaign(campaign)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg text-gray-800">{campaign.name}</h3>
              <span className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                {campaign.status}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Target: {campaign.target}</p>
              <p className="text-sm text-gray-600">Duration: {campaign.duration}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${campaign.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">Progress: {campaign.progress}%</p>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Patients</p>
                  <p className="font-semibold text-gray-800">{campaign.outcomes.patientsReached}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Interventions</p>
                  <p className="font-semibold text-gray-800">{campaign.outcomes.interventionsCompleted}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Success Rate</p>
                  <p className="font-semibold text-gray-800">{campaign.outcomes.successRate}%</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface CampaignDetailsModalProps {
  campaign: Campaign;
  onClose: () => void;
}

export const CampaignDetailsModal: React.FC<CampaignDetailsModalProps> = ({ campaign, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Campaign Progress: {campaign.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600">Patients Reached</h3>
            <p className="text-2xl font-bold text-gray-900">{campaign.outcomes.patientsReached}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600">Interventions</h3>
            <p className="text-2xl font-bold text-gray-900">{campaign.outcomes.interventionsCompleted}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600">Success Rate</h3>
            <p className="text-2xl font-bold text-gray-900">{campaign.outcomes.successRate}%</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Overall Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: `${campaign.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{campaign.progress}% Complete</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Campaign Details</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Target:</span> {campaign.target}</p>
                <p><span className="font-medium">Duration:</span> {campaign.duration}</p>
                <p><span className="font-medium">Budget:</span> {campaign.budget}</p>
                <p><span className="font-medium">Start Date:</span> {new Date(campaign.startDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignTracker;