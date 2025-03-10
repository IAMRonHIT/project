import React from 'react';
import { Heart, Activity, AlertCircle, Clock, Phone, Mail, MapPin, Calendar, UserCircle } from 'lucide-react';
import { PatientProfile } from '../../services/fhirPatientService';

interface PatientProfileCardProps {
  patient: PatientProfile;
  isDark?: boolean;
  onViewDetails?: () => void;
}

export const PatientProfileCard: React.FC<PatientProfileCardProps> = ({ 
  patient, 
  isDark = false,
  onViewDetails
}) => {
  // Generate CSS classes based on theme
  const cardClass = isDark 
    ? 'bg-white/5 border border-white/10 text-white' 
    : 'bg-white border border-ron-divider text-dark-gun-metal';

  const secondaryTextClass = isDark
    ? 'text-white/60'
    : 'text-dark-gun-metal/60';

  const avatarContainerClass = isDark
    ? 'bg-white/10 border-white/20'
    : 'bg-ron-primary/5 border-ron-primary/20';

  // Format risk level and color
  const getRiskLevelColor = () => {
    if (patient.riskScore >= 70) return isDark ? 'text-ron-coral-200' : 'text-ron-coral-600';
    if (patient.riskScore >= 40) return isDark ? 'text-ron-lime-200' : 'text-ron-lime-600';
    return isDark ? 'text-ron-mint-200' : 'text-ron-mint-600';
  };

  // Format risk level text
  const getRiskLevelText = () => {
    if (patient.riskScore >= 70) return 'High Risk';
    if (patient.riskScore >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  // Define metrics
  const metrics = [
    {
      title: 'Risk Score',
      value: patient.riskScore.toFixed(0),
      icon: Heart,
      color: getRiskLevelColor(),
      details: getRiskLevelText()
    },
    {
      title: 'Care Status',
      value: patient.careStatus,
      icon: Activity,
      color: isDark ? 'text-emerald-400' : 'text-emerald-500',
      details: 'Daily monitoring active'
    },
    {
      title: 'Health Plan',
      value: patient.healthPlan || 'Standard',
      icon: AlertCircle,
      color: isDark ? 'text-blue-400' : 'text-blue-500',
      details: 'Full coverage'
    },
    {
      title: 'Last Updated',
      value: new Date(patient.lastUpdated).toLocaleDateString(),
      icon: Clock,
      color: isDark ? 'text-purple-400' : 'text-purple-500',
      details: new Date(patient.lastUpdated).toLocaleTimeString()
    }
  ];

  return (
    <div className={`rounded-xl overflow-hidden ${cardClass} transition-all duration-300`}>
      {/* Header */}
      <div className="p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Avatar */}
        <div className={`w-24 h-24 rounded-full border ${avatarContainerClass} flex-shrink-0 overflow-hidden`}>
          {patient.photo ? (
            <img 
              src={patient.photo} 
              alt={patient.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
              <span className="text-2xl font-semibold">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
        </div>

        {/* Patient info */}
        <div className="flex flex-col text-center md:text-left">
          <h2 className="text-2xl font-semibold mb-1">{patient.name}</h2>
          <div className="flex flex-col md:flex-row gap-1 md:gap-3 mb-3">
            {patient.gender && (
              <span className={secondaryTextClass}>
                {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
              </span>
            )}
            {patient.birthDate && (
              <>
                <span className={`hidden md:block ${secondaryTextClass}`}>•</span>
                <span className={secondaryTextClass}>
                  <Calendar className="inline-block mr-1 w-4 h-4" />
                  {new Date(patient.birthDate).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
          <div className="flex flex-col gap-1">
            {(patient.address || patient.city || patient.state) && (
              <div className={`flex items-center gap-2 ${secondaryTextClass}`}>
                <MapPin className="w-4 h-4" />
                <span>{[patient.address, patient.city, patient.state].filter(Boolean).join(', ')}</span>
              </div>
            )}
            {patient.phone && (
              <div className={`flex items-center gap-2 ${secondaryTextClass}`}>
                <Phone className="w-4 h-4" />
                <span>{patient.phone}</span>
              </div>
            )}
            {patient.email && (
              <div className={`flex items-center gap-2 ${secondaryTextClass}`}>
                <Mail className="w-4 h-4" />
                <span>{patient.email}</span>
              </div>
            )}
          </div>
          
          {/* View Details Button - Exact copy from Member360View */}
          {onViewDetails && (
            <div className="mt-4">
              <button
                onClick={onViewDetails}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg
                  ${isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }
                  transition-colors
                `}
              >
                <UserCircle className="w-5 h-5" />
                <span>View Details</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/10">
        {metrics.map((metric, index) => (
          <div key={index} className="p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
              <span className={secondaryTextClass}>{metric.title}</span>
            </div>
            <div className="mt-auto">
              <div className="text-xl font-semibold">{metric.value}</div>
              <div className={`text-sm ${secondaryTextClass}`}>{metric.details}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
