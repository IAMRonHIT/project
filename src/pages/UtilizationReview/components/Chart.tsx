import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartProps {
  type: 'area' | 'bar' | 'line' | 'radialBar';
  series: any[];
  options: any;
  height?: number;
}

export function Chart({ type, series, options, height = 160 }: ChartProps) {
  return (
    <div className="w-full h-full">
      <ReactApexChart
        type={type}
        series={series}
        options={{
          chart: {
            type,
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false
            },
            background: 'transparent'
          },
          stroke: {
            curve: 'smooth',
            width: 2
          },
          grid: {
            show: false
          },
          tooltip: {
            theme: 'dark',
            x: {
              show: false
            }
          },
          ...options
        }}
        height={height}
      />
    </div>
  );
}