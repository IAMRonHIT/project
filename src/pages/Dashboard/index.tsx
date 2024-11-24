import React from 'react';
import { SystemOverview } from '@/components/SystemOverview';
import { MetricCard } from '@/components/MetricCard';
import { Activity, Brain, Clock, FileCheck2, Heart, Shield, Users, Zap } from 'lucide-react';

export function Dashboard() {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className={`text-2xl font-semibold ${
          isDark ? 'text-white' : 'text-ron-dark-navy'
        }`}>Dashboard</h1>
        <p className={`mt-1 ${
          isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
        }`}>
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
        <MetricCard
          title="Automated Workflows"
          value="842"
          icon="Zap"
          trend={{ value: 24, isPositive: true }}
          description="Active automated processes"
        />
        <MetricCard
          title="Prior Auths Processed"
          value="3,421"
          icon="FileCheck2"
          trend={{ value: 8, isPositive: true }}
          isPriority
          description="Monthly authorization volume"
        />
        <MetricCard
          title="AI Insights Generated"
          value="12,458"
          icon="Brain"
          trend={{ value: 32, isPositive: true }}
          description="ML-powered recommendations"
        />
      </div>

      <SystemOverview />
    </div>
  );
}