import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Metric {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    value: number;
    period: string;
  };
  target?: number;
  category: 'clinical' | 'engagement' | 'operational';
}

interface MetricsDisplayProps {
  metrics: Metric[];
  className?: string;
}

function MetricsDisplay({
  metrics,
  className = '',
}: MetricsDisplayProps) {
  const getTrendIcon = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (metric: Metric) => {
    if (!metric.trend) return 'text-gray-500';

    const isPositive = (metric.category === 'clinical' && metric.trend.direction === 'down') ||
                      (metric.category !== 'clinical' && metric.trend.direction === 'up');

    return isPositive ? 'text-green-500' : 'text-red-500';
  };

  const getProgressColor = (value: number, target?: number) => {
    if (!target) return 'bg-blue-500';
    const percentage = (value / target) * 100;
    return percentage >= 100 ? 'bg-green-500' :
           percentage >= 75 ? 'bg-blue-500' :
           percentage >= 50 ? 'bg-yellow-500' :
           'bg-red-500';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">Clinical Metrics</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="p-4 bg-white rounded-lg border border-gray-200 space-y-3"
          >
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-medium text-gray-600">{metric.label}</h4>
              {metric.trend && (
                <div className={`flex items-center gap-1 ${getTrendColor(metric)}`}>
                  {getTrendIcon(metric.trend.direction)}
                  <span className="text-sm font-medium">
                    {metric.trend.value}%
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {metric.value}
              </span>
              {metric.unit && (
                <span className="text-sm text-gray-500">{metric.unit}</span>
              )}
            </div>

            {metric.target && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium text-gray-700">
                    {Math.round((metric.value / metric.target) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(metric.value, metric.target)}`}
                    style={{
                      width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>Target: {metric.target}</span>
                </div>
              </div>
            )}

            {metric.trend && (
              <p className="text-xs text-gray-500">
                vs previous {metric.trend.period}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MetricsDisplay;