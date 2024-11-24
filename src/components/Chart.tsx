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
            toolbar: { show: false },
            zoom: { enabled: false },
            background: 'transparent',
            sparkline: { enabled: true }
          },
          states: {
            hover: {
              filter: { type: 'none' }
            },
            active: {
              filter: { type: 'none' }
            }
          },
          ...options
        }}
        height={height}
      />
    </div>
  );
}