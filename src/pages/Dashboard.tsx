import React from 'react';
import { MetricCard } from '@/components/DashboardCard';
import { SystemOverview } from '@/components/SystemOverview';
import { PieChart } from '@/components/Dashboard/PieChart';
import { BarChart } from '@/components/Dashboard/BarChart';
import { RadarChart } from '@/components/Dashboard/RadarChart';

export function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-ron-dark-navy dark:text-white">Dashboard</h1>
        <p className="text-ron-dark-navy/60 dark:text-white/60 mt-1">
          Welcome back, Dr. Sarah Chen
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <MetricCard
          title="Active Care Journeys"
          value="1,284"
          icon="Activity"
          trend={{ value: 12, isPositive: true }}
          isPriority
          description="Currently active patient care plans"
        />
        <MetricCard
          title="Team Members"
          value="48"
          icon="Users"
          description="Healthcare professionals online"
        />
        <MetricCard
          title="Avg. Response Time"
          value="2.4 mins"
          icon="Clock"
          trend={{ value: 18, isPositive: true }}
          isPriority
          description="Real-time response metrics"
        />
      </div>

      {/* Advanced Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <PieChart
          title="Care Distribution"
          series={[44, 55, 13, 33]}
          labels={['Primary Care', 'Specialty Care', 'Emergency', 'Preventive']}
        />
        <BarChart
          title="Monthly Admissions"
          categories={['Jan', 'Feb', 'Mar', 'Apr', 'May']}
          series={[
            {
              name: 'Inpatient',
              data: [44, 55, 57, 56, 61]
            },
            {
              name: 'Outpatient',
              data: [76, 85, 101, 98, 87]
            }
          ]}
        />
        <RadarChart
          title="Quality Metrics"
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