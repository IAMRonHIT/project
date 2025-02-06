import React from 'react';
import { PatientRecord } from '../PatientRegistry/types';
import { AlertCircle, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'alert' | 'suggestion' | 'reminder';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

interface RecommendationEngineProps {
  patient: PatientRecord;
  recommendations: Recommendation[];
  onActionClick: (recommendationId: string, action: string) => void;
  className?: string;
}

function RecommendationEngine({
  patient,
  recommendations,
  onActionClick,
  className = '',
}: RecommendationEngineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'suggestion':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-50 border-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-50 border-green-100 text-green-700';
      default:
        return 'bg-gray-50 border-gray-100 text-gray-700';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Clinical Recommendations</h3>
        <span className="text-sm text-gray-500">
          {recommendations.length} active recommendations
        </span>
      </div>

      <div className="space-y-3">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className={`p-4 rounded-lg border ${getPriorityColor(recommendation.priority)}`}
          >
            <div className="flex items-start gap-3">
              {getIcon(recommendation.type)}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{recommendation.title}</h4>
                    <p className="text-sm mt-1">{recommendation.description}</p>
                  </div>
                  {recommendation.dueDate && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                      Due: {recommendation.dueDate}
                    </span>
                  )}
                </div>

                {recommendation.actions && recommendation.actions.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {recommendation.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => onActionClick(recommendation.id, action.label)}
                        className="flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-white hover:bg-opacity-80 transition-colors"
                      >
                        {action.label}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendationEngine;