import React from 'react';

interface CareTeamMember {
  id: string;
  name: string;
  role: string;
  lastContact: string;
  nextAvailable: string;
}

interface Intervention {
  id: string;
  date: string;
  type: string;
  provider: string;
  outcome: string;
  followUpDate: string;
  notes: string;
}

interface PatientDetails {
  careTeam: CareTeamMember[];
  interventions: Intervention[];
  appointments: {
    past: Array<{ date: string; type: string; provider: string; outcome: string }>;
    upcoming: Array<{ date: string; type: string; provider: string }>;
  };
  adherence: {
    medications: number;
    appointments: number;
    overall: number;
  };
  careGaps: Array<{ issue: string; priority: 'High' | 'Medium' | 'Low'; dueDate: string }>;
}

interface PatientDetailsViewProps {
  details: PatientDetails;
  onClose: () => void;
}

const PatientDetailsView: React.FC<PatientDetailsViewProps> = ({ details, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Patient Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Care Team Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Care Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {details.careTeam.map(member => (
              <div key={member.id} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800">{member.name}</h4>
                <p className="text-sm text-gray-600">{member.role}</p>
                <p className="text-sm text-gray-600">Last Contact: {member.lastContact}</p>
                <p className="text-sm text-gray-600">Next Available: {member.nextAvailable}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interventions Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Interventions</h3>
          <div className="space-y-4">
            {details.interventions.map(intervention => (
              <div key={intervention.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-800">{intervention.type}</h4>
                    <p className="text-sm text-gray-600">Provider: {intervention.provider}</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    {intervention.outcome}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{intervention.notes}</p>
                <p className="text-sm text-gray-600 mt-2">Follow-up: {intervention.followUpDate}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Adherence Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Adherence Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600">Medications</h4>
              <p className="text-2xl font-bold text-gray-900">{details.adherence.medications}%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600">Appointments</h4>
              <p className="text-2xl font-bold text-gray-900">{details.adherence.appointments}%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600">Overall</h4>
              <p className="text-2xl font-bold text-gray-900">{details.adherence.overall}%</p>
            </div>
          </div>
        </div>

        {/* Care Gaps Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Care Gaps</h3>
          <div className="space-y-4">
            {details.careGaps.map((gap, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-800">{gap.issue}</h4>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    gap.priority === 'High' ? 'bg-red-100 text-red-800' :
                    gap.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {gap.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Due: {gap.dueDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsView;