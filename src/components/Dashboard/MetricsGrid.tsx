import React, { useState } from 'react';
import { Activity, Users, Clock, FileCheck } from 'lucide-react';
import { DashboardCard } from '../DashboardCard';
import { PieChart } from './PieChart';
import { StackedBarChart } from './BarChart';
import { LineChart } from './LineChart';
import { MultiSelect } from '../Multiselect';

export function MetricsGrid() {
  const [periodType, setPeriodType] = useState<string>('Week');
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>(['Week 1', 'Week 2', 'Week 3']);
  const [showingPeriods, setShowingPeriods] = useState(false);
  
  const pieChartData = [
    { label: 'Primary Care', value: 45, color: '#00F0FF' },
    { label: 'Specialty Care', value: 30, color: '#00B8CC' },
    { label: 'Emergency', value: 15, color: '#00D6D0' },
    { label: 'Preventive', value: 10, color: '#008299' }
  ];

  // Sample data for the line chart
  const lineChartData = {
    requests: [
      { x: 'Jan', y: 45 },
      { x: 'Feb', y: 52 },
      { x: 'Mar', y: 48 },
      { x: 'Apr', y: 58 },
      { x: 'May', y: 50 },
      { x: 'Jun', y: 55 },
      { x: 'Jul', y: 60 }
    ],
    decisions: [
      { x: 'Jan', y: 42 },
      { x: 'Feb', y: 48 },
      { x: 'Mar', y: 45 },
      { x: 'Apr', y: 52 },
      { x: 'May', y: 47 },
      { x: 'Jun', y: 53 },
      { x: 'Jul', y: 58 }
    ]
  };

  const getPeriodOptions = (type: string) => {
    switch (type) {
      case 'Week':
        return Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);
      case 'Month':
        return [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
      case 'Quarter':
        return ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'];
      default:
        return [];
    }
  };

  // Get current options based on view state
  const getCurrentOptions = () => {
    if (!showingPeriods) {
      return ['Week', 'Month', 'Quarter'];
    }
    return getPeriodOptions(periodType);
  };

  // Handle selection changes
  const handleSelectionChange = (selected: string[]) => {
    if (!showingPeriods) {
      // When selecting a view type
      const newType = selected[0];
      setPeriodType(newType);
      setShowingPeriods(true);
      if (newType !== periodType) {
        setSelectedPeriods(newType === 'Week' ? ['Week 1', 'Week 2', 'Week 3'] : []);
      }
    } else {
      // When selecting periods
      setSelectedPeriods(selected);
    }
  };

  // Handle back to views
  const handleBack = () => {
    setShowingPeriods(false);
  };

  // Generate bar chart data based on selection
  const getBarChartData = () => {
    return selectedPeriods.map(period => ({
      label: period,
      segments: [
        { label: 'Complete', value: Math.floor(Math.random() * 30) + 40, color: '#00F0FF' },
        { label: 'In Progress', value: Math.floor(Math.random() * 20) + 20, color: '#00B8CC' },
        { label: 'Pending', value: Math.floor(Math.random() * 15) + 10, color: '#008299' }
      ]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Active Care Plans"
          value="1,284"
          description="Currently active patient care plans"
          icon={Activity}
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardCard
          title="Team Members"
          value="48"
          description="Healthcare professionals online"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <DashboardCard
          title="Response Time"
          value="2.4m"
          description="Average response time"
          icon={Clock}
          trend={{ value: 18, isPositive: false }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Care Distribution Chart */}
        <div className="bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-gradient-glossy from-violet-400/5 via-transparent to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-[#00F0FF]" />
              <h2 className="text-xl font-bold text-white">Care Distribution</h2>
            </div>
            <PieChart data={pieChartData} height={350} />
          </div>
        </div>

        {/* Care Progress Chart */}
        <div className="bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-gradient-glossy from-violet-400/5 via-transparent to-transparent" />
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-[#00F0FF]" />
                <h2 className="text-xl font-bold text-white">Care Progress</h2>
              </div>
              <div className="w-48 relative">
                <MultiSelect
                  options={getCurrentOptions()}
                  selected={showingPeriods ? selectedPeriods : [periodType]}
                  onChange={handleSelectionChange}
                  placeholder={showingPeriods ? `Select ${periodType.toLowerCase()}s` : `${periodType} View`}
                  showBack={showingPeriods}
                  onBack={handleBack}
                />
              </div>
            </div>
            <StackedBarChart data={getBarChartData()} height={350} />
          </div>
        </div>

        {/* Authorization Metrics Chart */}
        <div className="bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-gradient-glossy from-violet-400/5 via-transparent to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <FileCheck className="w-6 h-6 text-[#00F0FF]" />
              <h2 className="text-xl font-bold text-white">Authorization Metrics</h2>
            </div>
            <LineChart data={lineChartData} height={350} />
          </div>
        </div>
      </div>
    </div>
  );
}
