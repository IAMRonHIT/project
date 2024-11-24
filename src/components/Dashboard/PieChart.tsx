import React from 'react';
import { Chart } from '@/components/Chart';

interface PieChartProps {
  title: string;
  series: number[];
  labels: string[];
}

export function PieChart({ title, series, labels }: PieChartProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const options = {
    labels,
    colors: ['#22c55e', '#06b6d4', '#f43f5e', '#eab308'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '16px',
              fontFamily: 'Inter, sans-serif',
              color: isDark ? '#ffffff' : '#00344E'
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: isDark ? '#ffffff' : '#00344E'
      }
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light'
    }
  };

  return (
    <div className={`${
      isDark ? 'bg-white/5' : 'bg-white'
    } p-6 rounded-xl shadow-soft hover:shadow-glow transition-all duration-300 border border-ron-divider backdrop-blur-xl`}>
      <h3 className={`text-lg font-medium mb-4 ${
        isDark ? 'text-white' : 'text-ron-dark-navy'
      }`}>{title}</h3>
      <Chart
        type="donut"
        series={series}
        options={options}
        height={350}
      />
    </div>
  );
}