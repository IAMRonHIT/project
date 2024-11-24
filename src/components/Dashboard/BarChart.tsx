import React from 'react';
import { Chart } from '@/components/Chart';

interface BarChartProps {
  title: string;
  categories: string[];
  series: { name: string; data: number[] }[];
}

export function BarChart({ title, categories, series }: BarChartProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const options = {
    chart: {
      stacked: true,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 6,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: isDark ? '#ffffff99' : '#00344E99'
        }
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
        style: {
          colors: isDark ? '#ffffff99' : '#00344E99'
        }
      }
    },
    grid: {
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 52, 78, 0.1)',
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
    },
    colors: ['#22c55e', '#06b6d4'],
    legend: {
      position: 'top',
      horizontalAlign: 'right',
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
        type="bar"
        series={series}
        options={options}
        height={350}
      />
    </div>
  );
}