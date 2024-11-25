import React from 'react';
import { SystemOverview } from '../../components/SystemOverview';
import { MetricCard } from '../../components/MetricCard';
import { BarChart } from '../../components/Dashboard/BarChart';
import { PieChart } from '../../components/Dashboard/PieChart';
import { RadarChart } from '../../components/Dashboard/RadarChart';
import { ActiveCareJourneysChart } from '../../components/Dashboard/ActiveCareJourneysChart';
import { DeterminationsChart } from '../../components/Dashboard/DeterminationsChart';
import { TurnAroundTimeChart } from '../../components/Dashboard/TurnAroundTimeChart';
import { useTheme } from '../../hooks/useTheme';

export function Dashboard() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Existing metric data
  const metricsData = {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    series: [{
      name: 'Workflows',
      data: [12000, 12200, 12300, 12350, 12400, 12458]
    }, {
      name: 'Insights',
      data: [11850, 12100, 12250, 12350, 12458, 12400, 12458]
    }]
  };

  // Mock data for new visualizations
  const careJourneysData = [
    { 
      category: 'Primary Care', 
      stages: { 
        'Referral': 50, 
        'Authorization Pending': 30, 
        'Active': 100, 
        'Closed': 20 
      } 
    },
    { 
      category: 'Specialty Care', 
      stages: { 
        'Referral': 20, 
        'Authorization Pending': 10, 
        'Active': 50, 
        'Closed': 15 
      } 
    }
  ];

  const determinationsData = [
    { type: 'Approved', count: 200 },
    { type: 'Denied', count: 50 },
    { type: 'Pending', count: 75 },
    { type: 'Reconsideration', count: 25 }
  ];

  const tatData = [
    { stage: 'Initial Review', averageDays: 36 },
    { stage: 'Peer Review', averageDays: 48 },
    { stage: 'Final Approval', averageDays: 24 }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className={`text-2xl font-semibold ${
          isDark ? 'text-white' : 'text-ron-dark-navy'
        }`}>
          Dashboard Overview
        </h1>
      </div>

      {/* New Visualizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <ActiveCareJourneysChart 
          data={careJourneysData} 
          timeIntervals={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} 
        />
        <DeterminationsChart 
          data={determinationsData} 
        />
        <TurnAroundTimeChart 
          data={tatData} 
        />
      </div>
    </div>
  );
}
