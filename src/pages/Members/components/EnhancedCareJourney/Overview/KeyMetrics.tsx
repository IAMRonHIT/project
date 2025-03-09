import React from 'react';
import { 
  TrendingUp, TrendingDown, Activity, Heart, 
  Calendar, AlertCircle, LucideIcon 
} from 'lucide-react';
import { Badge } from '../../../../../components/Badge';

interface Metric {
  id: string;
  name: string;
  value: string | number;
  trend: 'up' | 'down' | 'stable';
  change: string;
  status: 'success' | 'warning' | 'error';
  icon: LucideIcon;
  description?: string;
}

interface KeyMetricsProps {
  metrics: Metric[];
}

export function KeyMetrics({ metrics }: KeyMetricsProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return isDark ? 'text-[#CCFF00]' : 'text-ron-primary';
      case 'warning':
        return isDark ? 'text-ron-lime-200' : 'text-ron-lime-600';
      case 'error':
        return isDark ? 'text-ron-coral-200' : 'text-ron-coral-600';
      default:
        return '';
    }
  };

  return (
    <div className={`p-6 ${isDark ? 'bg-white/5' : 'bg-white'} border ${
      isDark ? 'border-white/10' : 'border-ron-divider'
    } rounded-xl`}>
      <div className="flex items-center gap-2 mb-6">
        <Activity className={isDark ? 'text-[#CCFF00]' : 'text-ron-primary'} />
        <h3 className={`text-lg font-medium ${
          isDark ? 'text-white' : 'text-dark-gun-metal'
        }`}>
          Key Metrics
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const TrendIcon = getTrendIcon(metric.trend);
          const MetricIcon = metric.icon;

          return (
            <div
              key={metric.id}
              className={`p-4 rounded-lg ${
                isDark ? 'bg-white/5' : 'bg-dark-gun-metal/5'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-white/5' : 'bg-dark-gun-metal/5'
                }`}>
                  <MetricIcon className={`w-4 h-4 ${getStatusColor(metric.status)}`} />
                </div>
                <Badge
                  variant={metric.status}
                  size="sm"
                  className={getStatusColor(metric.status)}
                >
                  {metric.status.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                }`}>
                  {metric.name}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-semibold ${
                    isDark ? 'text-white' : 'text-dark-gun-metal'
                  }`}>
                    {metric.value}
                  </span>
                  <div className={`flex items-center gap-1 text-sm ${
                    metric.trend === 'up'
                      ? 'text-ron-mint-500'
                      : metric.trend === 'down'
                        ? 'text-ron-coral-500'
                        : isDark
                          ? 'text-white/60'
                          : 'text-dark-gun-metal/60'
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    {metric.change}
                  </div>
                </div>
                {metric.description && (
                  <p className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                  }`}>
                    {metric.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
