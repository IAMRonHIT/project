import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';

interface Case {
  id: string;
  patientName: string;
  patientId: string;
  serviceRequested: string;
  cptCode: string;
  provider: string;
  specialty: string;
  recommendation: string;
  urgency: 'high' | 'medium' | 'low';
  submittedDate: string;
  deadline: string;
}

const mockCases: Case[] = [
  {
    id: "AUTH-001",
    patientName: "John Doe",
    patientId: "P001",
    serviceRequested: "MRI Brain w/ & w/o Contrast",
    cptCode: "70553",
    provider: "Dr. Sarah Smith",
    specialty: "Neurology",
    recommendation: "In Review",
    urgency: "high",
    submittedDate: "2024-02-15",
    deadline: "2024-02-17",
  },
  {
    id: "AUTH-002",
    patientName: "Jane Smith",
    patientId: "P002",
    serviceRequested: "CT Scan Chest",
    cptCode: "71250",
    provider: "Dr. Michael Johnson",
    specialty: "Pulmonology",
    recommendation: "Likely Denial",
    urgency: "medium",
    submittedDate: "2024-02-14",
    deadline: "2024-02-18",
  },
  {
    id: "AUTH-003",
    patientName: "Robert Wilson",
    patientId: "P003",
    serviceRequested: "Knee Arthroscopy",
    cptCode: "29881",
    provider: "Dr. Emily Brown",
    specialty: "Orthopedics",
    recommendation: "Experimental",
    urgency: "low",
    submittedDate: "2024-02-13",
    deadline: "2024-02-20",
  },
  {
    id: "AUTH-004",
    patientName: "Maria Garcia",
    patientId: "P004",
    serviceRequested: "PET Scan Whole Body",
    cptCode: "78813",
    provider: "Dr. James Wilson",
    specialty: "Oncology",
    recommendation: "In Review",
    urgency: "high",
    submittedDate: "2024-02-15",
    deadline: "2024-02-17",
  },
  {
    id: "AUTH-005",
    patientName: "William Taylor",
    patientId: "P005",
    serviceRequested: "Spinal Fusion",
    cptCode: "22633",
    provider: "Dr. Lisa Anderson",
    specialty: "Neurosurgery",
    recommendation: "MD Review",
    urgency: "high",
    submittedDate: "2024-02-15",
    deadline: "2024-02-16",
  }
];

interface ReviewQueueProps {
  searchTerm: string;
  selectedFilters: string[];
}

export function ReviewQueue({ searchTerm, selectedFilters }: ReviewQueueProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const filteredCases = mockCases.filter(
    (case_) =>
      case_.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.cptCode.includes(searchTerm)
  );

  return (
    <div className={`${
      isDark ? 'bg-white/5' : 'bg-white'
    } rounded-xl shadow-soft border border-ron-divider`}>
      <div className="p-6 border-b border-ron-divider">
        <h2 className={`text-lg font-medium ${
          isDark ? 'text-white' : 'text-dark-gun-metal'
        }`}>Review Queue</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ron-divider">
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
              }`}>Case Details</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
              }`}>Service</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
              }`}>Provider</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
              }`}>Status</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
              }`}>Deadline</th>
              <th className={`px-6 py-4 text-left text-sm font-medium ${
                isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
              }`}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((case_) => (
              <tr key={case_.id} className={`group border-b border-ron-divider ${
                isDark ? 'hover:bg-white/5' : 'hover:bg-ron-primary/5'
              } transition-colors`}>
                <td className="px-6 py-4">
                  <div className={`font-medium ${
                    isDark ? 'text-white' : 'text-dark-gun-metal'
                  }`}>{case_.patientName}</div>
                  <div className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                  }`}>ID: {case_.patientId}</div>
                </td>
                <td className="px-6 py-4">
                  <div className={isDark ? 'text-white' : 'text-dark-gun-metal'}>
                    {case_.serviceRequested}
                  </div>
                  <div className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                  }`}>CPT: {case_.cptCode}</div>
                </td>
                <td className="px-6 py-4">
                  <div className={isDark ? 'text-white' : 'text-dark-gun-metal'}>
                    {case_.provider}
                  </div>
                  <div className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                  }`}>{case_.specialty}</div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge
                    recommendation={case_.recommendation}
                    urgency={case_.urgency}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className={`font-medium ${
                    isDark ? 'text-white' : 'text-dark-gun-metal'
                  }`}>{case_.deadline}</div>
                  <div className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                  }`}>Submitted: {case_.submittedDate}</div>
                </td>
                <td className="px-6 py-4">
                  <button className={`invisible group-hover:visible px-3 py-1 rounded-lg flex items-center gap-2 ${
                    isDark
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-ron-primary/10 text-ron-primary hover:bg-ron-primary/20'
                  } transition-colors`}>
                    Review
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}