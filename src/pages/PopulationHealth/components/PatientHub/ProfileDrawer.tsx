import React from 'react';
import { PatientRecord } from '../PatientRegistry/types';
import { X, Calendar, MessageSquare, FileText } from 'lucide-react';

interface ProfileDrawerProps {
  patient: PatientRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onScheduleAppointment?: (patient: PatientRecord) => void;
  onSendMessage?: (patient: PatientRecord) => void;
  onViewDocuments?: (patient: PatientRecord) => void;
}

function ProfileDrawer({
  patient,
  isOpen,
  onClose,
  onScheduleAppointment,
  onSendMessage,
  onViewDocuments,
}: ProfileDrawerProps) {
  if (!patient || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 w-96 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Patient Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
          {/* Patient Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {patient.avatar ? (
                <img
                  src={patient.avatar}
                  alt={patient.name}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-gray-500">
                    {patient.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                <p className="text-sm text-gray-500">ID: {patient.patientId}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => onScheduleAppointment?.(patient)}
                className="flex flex-col items-center gap-2 p-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
              >
                <Calendar className="w-6 h-6" />
                <span className="text-sm">Schedule</span>
              </button>
              <button
                onClick={() => onSendMessage?.(patient)}
                className="flex flex-col items-center gap-2 p-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
              >
                <MessageSquare className="w-6 h-6" />
                <span className="text-sm">Message</span>
              </button>
              <button
                onClick={() => onViewDocuments?.(patient)}
                className="flex flex-col items-center gap-2 p-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
              >
                <FileText className="w-6 h-6" />
                <span className="text-sm">Documents</span>
              </button>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <section>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Demographics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">{patient.age}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{patient.gender}</p>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Risk Assessment</h4>
                <div className="space-y-2">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    patient.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                    patient.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {patient.riskLevel} Risk
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Conditions</h4>
                <div className="space-y-2">
                  {patient.conditions.map((condition, index) => (
                    <div
                      key={index}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        condition.severity === 'severe' ? 'bg-red-50 text-red-700' :
                        condition.severity === 'moderate' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-green-50 text-green-700'
                      }`}
                    >
                      {condition.name}
                      <span className="ml-2 opacity-75">({condition.severity})</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Compliance</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Overall</span>
                      <span className="text-sm font-medium">{patient.compliance.overall}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          patient.compliance.overall >= 90 ? 'bg-green-500' :
                          patient.compliance.overall >= 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${patient.compliance.overall}%` }}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-500">Phone:</span>{' '}
                    {patient.contactInfo.phone}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Email:</span>{' '}
                    {patient.contactInfo.email}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Address:</span>{' '}
                    {patient.location.address}
                  </p>
                  <p className="text-sm">
                    {patient.location.city}, {patient.location.state} {patient.location.zipCode}
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDrawer;