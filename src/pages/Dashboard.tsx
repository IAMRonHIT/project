import React from 'react';
import { DashboardCard as MetricCard } from '../components/DashboardCard';
import { SystemOverview } from '../components/SystemOverview';
import { PieChart } from '../components/Dashboard/PieChart';
import { StackedBarChart as BarChart } from '../components/Dashboard/BarChart';
import { RadarChart } from '../components/Dashboard/RadarChart';
import { Activity, Users, Clock } from 'lucide-react';

// Define colors for PieChart
const pieChartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function Dashboard() {
  // Prepare data for PieChart
  const pieChartData = ['Primary Care', 'Specialty Care', 'Emergency', 'Preventive'].map((label, index) => ({
    label,
    value: [44, 55, 13, 33][index],
    color: pieChartColors[index % pieChartColors.length],
  }));

  return (
    <div className="container mx-auto px-4 py-8 h-full w-full relative transition-all duration-300 ease-in-out bg-[#f5f5f5] text-[#1a1a1a] dark:bg-[#1a1a1a] dark:text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-dark-gun-metal dark:text-white">Dashboard</h1>
        <p className="text-dark-gun-metal/60 dark:text-white/60 mt-1">
          Welcome back, Dr. Sarah Chen
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <MetricCard
          title="Active Care Journeys"
          value="1,284"
          icon={Activity}
          trend={{ value: 12, isPositive: true }}
          description="Currently active patient care plans"
        />
        <MetricCard
          title="Team Members"
          value="48"
          icon={Users}
          description="Healthcare professionals online"
        />
        <MetricCard
          title="Avg. Response Time"
          value="2.4 mins"
          icon={Clock}
          trend={{ value: 18, isPositive: true }}
          description="Real-time response metrics"
        />
      </div>

      {/* Advanced Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <PieChart data={pieChartData} />
        <BarChart
          data={[
            { label: 'Jan', segments: [{ value: 44, color: '#3b82f6', label: 'Inpatient' }, { value: 76, color: '#10b981', label: 'Outpatient' }] },
            { label: 'Feb', segments: [{ value: 55, color: '#3b82f6', label: 'Inpatient' }, { value: 85, color: '#10b981', label: 'Outpatient' }] },
            { label: 'Mar', segments: [{ value: 57, color: '#3b82f6', label: 'Inpatient' }, { value: 101, color: '#10b981', label: 'Outpatient' }] },
            { label: 'Apr', segments: [{ value: 56, color: '#3b82f6', label: 'Inpatient' }, { value: 98, color: '#10b981', label: 'Outpatient' }] },
            { label: 'May', segments: [{ value: 61, color: '#3b82f6', label: 'Inpatient' }, { value: 87, color: '#10b981', label: 'Outpatient' }] },
          ]}
        />
        <RadarChart
          title="Performance Overview"
          categories={[
            'Patient Safety',
            'Care Quality',
            'Response Time',
            'Documentation',
            'Patient Satisfaction'
          ]}
          series={[
            {
              name: 'Current',
              data: [85, 90, 88, 87, 92]
            },
            {
              name: 'Target',
              data: [90, 90, 90, 90, 90]
            }
          ]}
        />
      </div>

      <SystemOverview />
    </div>
  );
}