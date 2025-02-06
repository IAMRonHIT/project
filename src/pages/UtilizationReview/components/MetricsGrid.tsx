import React from 'react';
import { Clock, Users, Calendar, MessageSquare } from 'lucide-react';
import { Chart } from './Chart';

const stats = [
  { label: "Pending Review", value: "42", icon: Clock },
  { label: "Requires MD Review", value: "15", icon: Users },
  { label: "Due Today", value: "8", icon: Calendar },
  { label: "New Messages", value: "3", icon: MessageSquare },
];

export function MetricsGrid() {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const chartOptions = {
    colors: ['#00F0FF'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: isDark ? 'dark' : 'light',
        type: 'horizontal',
        colorStops: [
          { offset: 0, color: '#00F0FF' },
          { offset: 100, color: '#7C3AED' }
        ],
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      labels: {
        show: false,
        style: { colors: isDark ? '#fff' : '#1a1a1a' }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: false,
        style: { colors: isDark ? '#fff' : '#1a1a1a' }
      }
    },
    grid: {
      show: true,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      strokeDashArray: 4
    }
  };

  const chartSeries = [{
    name: 'Trend',
    data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
  }];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-black backdrop-blur-xl rounded-xl p-6 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-gradient-glossy from-violet-400/5 via-transparent to-transparent" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/10">
                  <Icon className="h-5 w-5 text-[#00F0FF]" />
                </div>
              </div>
              <div className="mt-4 h-16">
                <Chart
                  type="area"
                  series={chartSeries}
                  options={chartOptions}
                  height={64}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
