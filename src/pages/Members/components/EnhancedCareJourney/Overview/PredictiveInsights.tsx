import React from 'react';
import { Brain, AlertCircle, TrendingUp, Clock } from 'lucide-react';
import { Badge } from '../../../../../components/Badge';
import { Prediction } from './types';

interface PredictiveInsightsProps extends Readonly<{
  predictions: ReadonlyArray<Prediction>;
}> {}

export function PredictiveInsights({ predictions }: PredictiveInsightsProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const getPriorityColor = (priority: Prediction['priority']) => {
    switch (priority) {
      case 'high':
        return isDark ? 'text-ron-coral-200' : 'text-ron-coral-600';
      case 'medium':
        return isDark ? 'text-ron-lime-200' : 'text-ron-lime-600';
      case 'low':
        return isDark ? 'text-ron-mint-200' : 'text-ron-mint-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return isDark ? 'text-[#CCFF00]' : 'text-ron-primary';
    if (confidence >= 70) return isDark ? 'text-ron-lime-200' : 'text-ron-lime-600';
    return isDark ? 'text-ron-teal-200' : 'text-ron-teal-600';
  };

  return (
    <div className={`p-6 ${isDark ? 'bg-white/5' : 'bg-white'} border ${
      isDark ? 'border-white/10' : 'border-ron-divider'
    } rounded-xl`}>
      <div className="flex items-center gap-2 mb-6">
        <Brain className={isDark ? 'text-[#CCFF00]' : 'text-ron-primary'} />
        <h3 className={`text-lg font-medium ${
          isDark ? 'text-white' : 'text-dark-gun-metal'
        }`}>
          Predictive Insights
        </h3>
      </div>

      <div className="space-y-6">
        {predictions.map((prediction) => (
          <div
            key={prediction.id}
            className={`p-4 rounded-lg ${
              isDark ? 'bg-white/5' : 'bg-dark-gun-metal/5'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={prediction.priority === 'high' ? 'error' : prediction.priority === 'medium' ? 'warning' : 'success'}
                    size="sm"
                    className={getPriorityColor(prediction.priority)}
                  >
                    {prediction.priority.toUpperCase()} PRIORITY
                  </Badge>
                  <div className={`flex items-center gap-1 text-xs ${
                    isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                  }`}>
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    {prediction.timeframe}
                  </div>
                </div>

                <h4 className={`font-medium mb-1 ${
                  isDark ? 'text-white' : 'text-dark-gun-metal'
                }`}>
                  {prediction.title}
                </h4>
                <p className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                }`}>
                  {prediction.description}
                </p>

                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className={`text-sm font-medium ${getConfidenceColor(prediction.confidence)}`}>
                      {prediction.confidence}% Confidence
                    </span>
                  </div>
                </div>
              </div>

              <button
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  isDark
                    ? 'bg-[#CCFF00] text-dark-gun-metal hover:bg-[#CCFF00]/90'
                    : 'bg-ron-primary text-white hover:bg-ron-primary/90'
                }`}
              >
                {prediction.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
