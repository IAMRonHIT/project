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
    colors: ['#00344E'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      labels: {
        show: false
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
        show: false
      }
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
          <div key={index} className={`${
            isDark ? 'bg-white/5' : 'bg-white'
          } rounded-xl p-6 shadow-soft border border-ron-divider`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                }`}>{stat.label}</p>
                <p className={`mt-2 text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-dark-gun-metal'
                }`}>{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-white/10' : 'bg-ron-primary/10'
              }`}>
                <Icon className={`h-5 w-5 ${
                  isDark ? 'text-white' : 'text-ron-primary'
                }`} />
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
        );
      })}
    </div>
  );
}