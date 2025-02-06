import React from 'react';
import { useTheme } from '../../../../../../project/src/contexts/ThemeContext';
import { themes } from '../../../../../../project/src/lib/themes';
import { Badge } from '../../../../../../project/src/components/ui/badge';
import { PatientRecord } from './types';
import {
  User,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle2,
  Clock,
  Activity
} from 'lucide-react';

interface IdentifiedPatientsTableProps {
  patients: PatientRecord[];
  columns: Column[];
  onPatientClick?: (patient: PatientRecord) => void;
  className?: string;
}

export const IdentifiedPatientsTable: React.FC<IdentifiedPatientsTableProps> = ({
  patients,
  columns,
  onPatientClick,
  className = '',
}): JSX.Element => {
  const { theme: themeKey } = useTheme();
  const theme = themes[themeKey];

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'critical':
        return <AlertCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'critical':
        return 'error';
      case 'pending':
      case 'watch':
        return 'warning';
      case 'new':
        return 'info';
      default:
        return 'default';
    }
  };

  const getRiskVariant = (level: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <div className={`rounded-xl overflow-hidden ${theme.cardBg} border ${theme.border} ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${theme.columnBg} border-b ${theme.border}`}>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${theme.text}`}>Patient</th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${theme.text}`}>Status</th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${theme.text}`}>Risk Level</th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${theme.text}`}>Conditions</th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${theme.text}`}>Compliance</th>
              <th className={`px-6 py-4 text-left text-sm font-semibold ${theme.text}`}>Contact</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                onClick={() => onPatientClick?.(patient)}
                className={`
                  border-b ${theme.border}
                  ${onPatientClick ? 'cursor-pointer' : ''}
                  ${theme.hover}
                  transition-colors duration-200
                `}
              >
                {/* Patient Info */}
                <td className={`px-6 py-4 ${theme.text}`}>
                  <div className="flex items-center gap-3">
                    {patient.avatar ? (
                      <img
                        src={patient.avatar}
                        alt={patient.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className={`text-sm ${theme.muted}`}>
                        ID: {patient.patientId}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <Badge
                    variant={getStatusVariant(patient.status)}
                    size="sm"
                    glow
                    icon={getStatusIcon(patient.status)}
                  >
                    {patient.status}
                  </Badge>
                </td>

                {/* Risk Level */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getRiskVariant(patient.riskLevel)}
                      size="sm"
                      glow
                    >
                      {patient.riskLevel}
                    </Badge>
                    {patient.riskTrend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    ) : patient.riskTrend === 'down' ? (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    ) : (
                      <Minus className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </td>

                {/* Conditions */}
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {patient.conditions.map((condition, index) => (
                      <Badge
                        key={index}
                        variant={
                          condition.severity === 'severe' ? 'error' :
                          condition.severity === 'moderate' ? 'warning' : 'info'
                        }
                        size="sm"
                      >
                        {condition.name}
                      </Badge>
                    ))}
                  </div>
                </td>

                {/* Compliance */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            patient.compliance.overall >= 90 ? 'bg-ron-mint-500' :
                            patient.compliance.overall >= 70 ? 'bg-ron-coral-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${patient.compliance.overall}%` }}
                        />
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${theme.text}`}>
                      {patient.compliance.overall}%
                    </span>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className={`text-sm ${theme.text}`}>
                        {patient.contactInfo.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className={`text-sm ${theme.text}`}>
                        {patient.contactInfo.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className={`text-sm ${theme.text}`}>
                        {patient.location.city}, {patient.location.state}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IdentifiedPatientsTable;