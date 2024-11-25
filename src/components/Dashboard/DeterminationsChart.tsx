import React from 'react';
import { Chart } from '../Chart';

interface DeterminationData {
  type: string;
  count: number;
}

interface DeterminationsChartProps {
  data: DeterminationData[];
}

export function DeterminationsChart({ 
  data 
}: DeterminationsChartProps) {
  const chartData = {
    series: data.map(det => det.count),
    labels: data.map(det => det.type)
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Determinations</h2>
      <Chart
        type="pie"
        height={350}
        options={{
          labels: chartData.labels,
          colors: ['#3182ce', '#48bb78', '#ecc94b', '#ed64a6'],
          legend: {
            position: 'bottom'
          }
        }}
        series={chartData.series}
      />
    </div>
  );
}
