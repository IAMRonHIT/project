import React from 'react';
import { PatientRecord } from '../PatientRegistry/types';
import { Calendar, Activity, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: string;
  type: 'appointment' | 'intervention' | 'status_change';
  title: string;
  description: string;
  status: 'completed' | 'scheduled' | 'cancelled' | 'in_progress';
}

interface TimelineViewProps {
  patient: PatientRecord;
  events: TimelineEvent[];
  className?: string;
}

function TimelineView({ patient, events, className = '' }: TimelineViewProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'scheduled':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'in_progress':
        return <Activity className="w-5 h-5 text-yellow-500" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'scheduled':
        return 'bg-blue-50 border-blue-200';
      case 'cancelled':
        return 'bg-red-50 border-red-200';
      case 'in_progress':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">Patient Timeline</h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-0 left-8 bottom-0 w-px bg-gray-200" />

        {/* Events */}
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="relative flex gap-4">
              {/* Icon */}
              <div className="absolute left-6 -translate-x-1/2 mt-1.5">
                <div className="w-5 h-5 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                  {getStatusIcon(event.status)}
                </div>
              </div>

              {/* Content */}
              <div className="ml-12 flex-1">
                <div className={`p-4 rounded-lg border ${getStatusColor(event.status)}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                    <span className="text-xs text-gray-500">{event.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TimelineView;