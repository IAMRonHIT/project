import React from 'react';
import { Chart } from '@/components/Chart';

interface RadarChartProps {
  title: string;
  categories: string[];
  series: { name: string; data: number[] }[];
}

export function RadarChart({ title, categories, series }: RadarChartProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const options = {
    chart: {
      dropShadow: {
        enabled: true,
        blur: 1,
        left: 1,
        top: 1
      }
    },
    labels: categories,
    plotOptions: {
      radar: {
        size: 140,
        polygons: {
          strokeColors: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 52, 78, 0.1)',
          strokeWidth: 1,
          connectorColors: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 52, 78, 0.1)',
        }
      }
    },
    colors: ['#22c55e', '#06b6d4'],
    markers: {
      size: 4,
      colors: ['#22c55e', '#06b6d4'],
      strokeColors: isDark ? '#1a1a1a' : '#ffffff',
      strokeWidth: 2,
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light'
    },
    yaxis: {
      show: false
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
        type="radar"
        series={series}
        options={options}
        height={350}
      />
    </div>
  );
}