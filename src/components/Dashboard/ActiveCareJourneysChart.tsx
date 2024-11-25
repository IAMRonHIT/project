import React from 'react';
import { Chart } from '../Chart';

interface CareJourneyData {
  category: string;
  stages: {
    [stage: string]: number;
  };
}

interface ActiveCareJourneysChartProps {
  data: CareJourneyData[];
  timeIntervals: string[];
}

export function ActiveCareJourneysChart({ 
  data, 
  timeIntervals 
}: ActiveCareJourneysChartProps) {
  // Prepare chart data
  const chartData = {
    categories: timeIntervals,
    series: data.map(journey => ({
      name: journey.category,
      data: Object.values(journey.stages)
    }))
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Active Care Journeys</h2>
      <Chart
        type="bar"
        height={350}
        options={{
          chart: {
            stacked: true,
          },
          xaxis: {
            categories: chartData.categories
          },
          legend: {
            position: 'top'
          },
          colors: ['#3182ce', '#48bb78', '#ecc94b', '#ed64a6']
        }}
        series={chartData.series}
      />
    </div>
  );
}
