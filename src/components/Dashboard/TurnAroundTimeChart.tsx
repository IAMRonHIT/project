import React from 'react';
import { Chart } from '../Chart';

interface TATData {
  stage: string;
  averageDays: number;
}

interface TurnAroundTimeChartProps {
  data: TATData[];
}

export function TurnAroundTimeChart({ 
  data 
}: TurnAroundTimeChartProps) {
  const chartData = {
    categories: data.map(item => item.stage),
    series: [{
      name: 'Average Days',
      data: data.map(item => item.averageDays)
    }]
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Turn Around Time</h2>
      <Chart
        type="line"
        height={350}
        options={{
          xaxis: {
            categories: chartData.categories
          },
          colors: ['#3182ce'],
          stroke: {
            curve: 'smooth'
          },
          markers: {
            size: 5
          }
        }}
        series={chartData.series}
      />
    </div>
  );
}
