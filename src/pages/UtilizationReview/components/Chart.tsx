import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartProps {
  type: 'area' | 'bar' | 'line' | 'radialBar';
  series: any[];
  options: any;
  height?: number;
}

export function Chart({ type, series, options, height = 160 }: ChartProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const defaultOptions = {
    chart: {
      type,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      background: 'transparent',
      foreColor: isDark ? '#fff' : '#1a1a1a'
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      lineCap: 'round'
    },
    grid: {
      show: true,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      strokeDashArray: 4,
      padding: {
        top: -10,
        right: 0,
        bottom: -10,
        left: 10
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: isDark ? 'dark' : 'light',
        type: 'horizontal',
        colorStops: [
          { offset: 0, color: '#00F0FF' },
          { offset: 100, color: '#7C3AED' }
        ]
      }
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      x: {
        show: true
      },
      style: {
        fontSize: '12px'
      }
    },
    colors: ['#00F0FF'],
    ...options
  };

  return (
    <div className="w-full h-full">
      <ReactApexChart
        type={type}
        series={series}
        options={defaultOptions}
        height={height}
      />
    </div>
  );
}
