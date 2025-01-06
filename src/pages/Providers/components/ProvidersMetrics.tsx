import React from 'react';
import { Users, Star, Activity, Building2, Network, UserCheck, Clock, TrendingUp } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string;
  trend?: { value: number; isPositive: boolean };
  icon: React.ElementType;
  chart?: {
    data: Array<{ value: number }>;
    color: string;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon: Icon, chart }) => {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  return (
    <div className={`${
      isDark ? 'bg-white/5' : 'bg-white'
    } p-6 rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 border border-ron-divider`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className={`text-sm font-medium ${
            isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
          }`}>{title}</p>
          <h3 className={`text-2xl font-semibold mt-1 ${
            isDark ? 'text-white' : 'text-dark-gun-metal'
          }`}>{value}</h3>
          {trend && (
            <p className={`text-sm mt-1 ${trend.isPositive ? 'text-ron-success' : 'text-ron-error'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </p>
          )}
        </div>
        <div className={`p-2 rounded-lg ${
          isDark ? 'bg-white/10' : 'bg-ron-primary/10'
        }`}>
          <Icon className={`w-5 h-5 ${
            isDark ? 'text-white' : 'text-ron-primary'
          }`} />
        </div>
      </div>
      {chart && (
        <div className="mt-4 h-[60px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart.data}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chart.color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={chart.color} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={chart.color}
                fill={`url(#gradient-${title})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export function ProvidersMetrics() {
  const metrics = [
    {
      title: 'Total Providers',
      value: '2,847',
      trend: { value: 12, isPositive: true },
      icon: Users,
      chart: {
        data: [
          { value: 2100 }, { value: 2300 }, { value: 2450 },
          { value: 2600 }, { value: 2700 }, { value: 2847 }
        ],
        color: '#22c55e'
      }
    },
    {
      title: 'Network Satisfaction',
      value: '92%',
      trend: { value: 5, isPositive: true },
      icon: Star,
      chart: {
        data: [
          { value: 85 }, { value: 87 }, { value: 88 },
          { value: 90 }, { value: 91 }, { value: 92 }
        ],
        color: '#eab308'
      }
    },
    {
      title: 'Active Contracts',
      value: '1,924',
      trend: { value: 8, isPositive: true },
      icon: Building2,
      chart: {
        data: [
          { value: 1500 }, { value: 1650 }, { value: 1750 },
          { value: 1800 }, { value: 1850 }, { value: 1924 }
        ],
        color: '#3b82f6'
      }
    },
    {
      title: 'Avg Response Time',
      value: '1.8h',
      trend: { value: 15, isPositive: true },
      icon: Clock
    },
    {
      title: 'Quality Score',
      value: '4.2/5',
      trend: { value: 3, isPositive: true },
      icon: Activity,
      chart: {
        data: [
          { value: 3.8 }, { value: 3.9 }, { value: 4.0 },
          { value: 4.1 }, { value: 4.15 }, { value: 4.2 }
        ],
        color: '#8b5cf6'
      }
    },
    {
      title: 'Network Coverage',
      value: '94%',
      trend: { value: 2, isPositive: true },
      icon: UserCheck
    },
    {
      title: 'Utilization Rate',
      value: '78%',
      trend: { value: 5, isPositive: true },
      icon: TrendingUp
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}