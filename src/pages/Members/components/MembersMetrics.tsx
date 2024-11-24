import React from 'react';
import { Users, Activity, Heart, Star, Brain, Shield, Clock } from 'lucide-react';
import { Chart } from '@/components/Chart';

interface MetricCardProps {
  title: string;
  value: string;
  trend?: { value: number; isPositive: boolean };
  icon: React.ElementType;
  chartData?: {
    data: number[];
    color: string;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon: Icon, chartData }) => {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const chartOptions = chartData ? {
    colors: [chartData.color],
    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        shadeIntensity: 0.2,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { labels: { show: false } },
    grid: { show: false },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      x: { show: false }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    }
  } : {};

  const chartSeries = chartData ? [{
    name: 'Trend',
    data: chartData.data
  }] : [];

  return (
    <div className={`
      relative overflow-hidden
      ${isDark ? 'bg-white/5' : 'bg-white'}
      p-6 rounded-xl shadow-soft hover:shadow-glow 
      transition-all duration-300 border border-ron-divider
      backdrop-blur-xl
    `}>
      <div className="absolute inset-0 bg-gradient-glossy from-ron-mint-200/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className={`text-sm font-medium ${
              isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
            }`}>{title}</p>
            <h3 className={`text-2xl font-semibold mt-1 ${
              isDark ? 'text-white' : 'text-ron-dark-navy'
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

        {chartData && (
          <div className="mt-4 h-[60px]">
            <Chart
              type="area"
              series={chartSeries}
              options={chartOptions}
              height={60}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export function MembersMetrics() {
  const metrics = [
    {
      title: 'Total Members',
      value: '24,892',
      trend: { value: 12, isPositive: true },
      icon: Users,
      chartData: {
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
        color: '#22c55e'
      }
    },
    {
      title: 'Active Care Journeys',
      value: '1,284',
      trend: { value: 8, isPositive: true },
      icon: Activity,
      chartData: {
        data: [45, 52, 38, 45, 19, 23, 32, 45, 56],
        color: '#06b6d4'
      }
    },
    {
      title: 'Care Management Needed',
      value: '486',
      trend: { value: 5, isPositive: false },
      icon: Heart,
      chartData: {
        data: [35, 41, 62, 42, 13, 18, 29, 37, 36],
        color: '#f43f5e'
      }
    },
    {
      title: 'Member Satisfaction',
      value: '94%',
      trend: { value: 3, isPositive: true },
      icon: Star,
      chartData: {
        data: [85, 88, 90, 89, 92, 93, 91, 94, 94],
        color: '#eab308'
      }
    },
    {
      title: 'AI Insights Generated',
      value: '12,458',
      trend: { value: 15, isPositive: true },
      icon: Brain,
      chartData: {
        data: [78, 81, 80, 45, 34, 12, 40, 85, 91],
        color: '#8b5cf6'
      }
    },
    {
      title: 'Risk Assessments',
      value: '892',
      trend: { value: 7, isPositive: true },
      icon: Shield,
      chartData: {
        data: [25, 30, 45, 35, 55, 40, 60, 75, 85],
        color: '#ec4899'
      }
    },
    {
      title: 'Avg. Response Time',
      value: '2.4m',
      trend: { value: 12, isPositive: true },
      icon: Clock,
      chartData: {
        data: [15, 20, 25, 30, 25, 20, 15, 20, 25],
        color: '#14b8a6'
      }
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