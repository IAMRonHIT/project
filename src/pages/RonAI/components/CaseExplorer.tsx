import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Case, Patient, Stakeholder } from '../types';

interface CaseExplorerProps {
  onSelectCase: (caseId: string) => void;
}

export function CaseExplorer({ onSelectCase }: CaseExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);

  // Mock data - replace with actual API calls
  const cases: Case[] = [
    {
      id: '1',
      title: 'Post-Surgery Follow-up',
      description: 'Patient requires follow-up after knee surgery',
      patientId: 'P123',
      status: 'open',
      createdAt: '2025-02-05T13:00:00Z',
      updatedAt: '2025-02-05T13:00:00Z'
    }
  ];

  const handleCaseSelect = (caseItem: Case) => {
    setSelectedCase(caseItem);
    onSelectCase(caseItem.id);
    // In real app, fetch patient and stakeholder data here
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-ron-teal-400/20">
        <div className="relative">
          <input
            type="text"
            placeholder="Search cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/50 border border-ron-teal-400/20 rounded-lg
              text-white placeholder-gray-400 focus:outline-none focus:border-ron-teal-400/40"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Case List / Case Details */}
      <div className="flex-1 overflow-y-auto">
        {!selectedCase ? (
          // Case List
          <div className="space-y-2 p-4">
            {cases
              .filter(c => 
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(caseItem => (
                <div
                  key={caseItem.id}
                  onClick={() => handleCaseSelect(caseItem)}
                  className="p-4 bg-black/50 border border-ron-teal-400/20 rounded-lg cursor-pointer
                    hover:bg-ron-teal-400/10 hover:border-ron-teal-400/40 transition-colors"
                >
                  <h3 className="text-white font-medium">{caseItem.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{caseItem.description}</p>
                  <div className="flex items-center mt-2">
                    <span className={`
                      px-2 py-1 rounded-full text-xs
                      ${caseItem.status === 'open' ? 'bg-green-500/20 text-green-400' :
                        caseItem.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'}
                    `}>
                      {caseItem.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          // Case Details
          <div className="p-4 space-y-6">
            {/* Case Info */}
            <div className="bg-black/50 border border-ron-teal-400/20 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-white mb-2">{selectedCase.title}</h2>
              <p className="text-gray-300">{selectedCase.description}</p>
              <div className="mt-4 flex items-center space-x-4">
                <span className={`
                  px-2 py-1 rounded-full text-xs
                  ${selectedCase.status === 'open' ? 'bg-green-500/20 text-green-400' :
                    selectedCase.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'}
                `}>
                  {selectedCase.status.toUpperCase()}
                </span>
                <span className="text-gray-400 text-sm">
                  Created: {new Date(selectedCase.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Patient Info */}
            {patient && (
              <div className="bg-black/50 border border-ron-teal-400/20 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-3">Patient Information</h3>
                <div className="space-y-2">
                  <p className="text-gray-300">Name: {patient.name}</p>
                  <p className="text-gray-300">DOB: {patient.dateOfBirth}</p>
                  <p className="text-gray-300">Gender: {patient.gender}</p>
                  <div className="mt-3">
                    <p className="text-gray-300">Contact:</p>
                    <p className="text-gray-400 text-sm">{patient.contactInfo.phone}</p>
                    <p className="text-gray-400 text-sm">{patient.contactInfo.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Stakeholders */}
            {stakeholders.length > 0 && (
              <div className="bg-black/50 border border-ron-teal-400/20 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-3">Stakeholders</h3>
                <div className="space-y-4">
                  {stakeholders.map(stakeholder => (
                    <div key={stakeholder.id} className="border-b border-ron-teal-400/10 last:border-0 pb-3 last:pb-0">
                      <p className="text-gray-300 font-medium">{stakeholder.name}</p>
                      <p className="text-gray-400 text-sm">{stakeholder.role}</p>
                      <p className="text-gray-400 text-sm">{stakeholder.organization}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}