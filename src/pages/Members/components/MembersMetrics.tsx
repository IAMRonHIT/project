import React from 'react';
import { Chart } from '@/components/Chart';

interface MetricCardProps {
  title: string;
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ElementType;
  chartData?: {
    data: number[];
    color: string;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  icon: Icon,
  chartData,
}: MetricCardProps) => {
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
  return (
    <div>
      <MetricCard
        title="Example Title"
        value="Example Value"
        trend={{ value: 10, isPositive: true }}
        icon={() => <div>Example Icon</div>}
        chartData={{ data: [1, 2, 3], color: 'red' }}
      />
    </div>
  );
}
