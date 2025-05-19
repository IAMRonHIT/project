import React, { useState } from 'react';
import MenuBar from '../../components/Dashboard/MenuBar'; // Added import for MenuBar
import { SystemOverview } from '../../components/SystemOverview';
// Imports for Prior Authorizations (from MembersPage)
import { MembersChartGrid } from '../Members/components/MembersChartGrid';
import { MembersTable } from '../Members/components/MembersTable';
// Imports for Appeals (from ProvidersPage)
import { ProvidersChartGrid } from '../Providers/components/ProvidersChartGrid';
import { ProvidersTable } from '../Providers/components/ProvidersTable';
import { Badge } from '../../components/Badge';
import { useTheme } from '../../hooks/useTheme';
import { MessageSquare, Activity, ClipboardCheck, TrendingUp, PieChart, BarChart, ListChecks, Target, CheckCircle, CalendarDays, ListTodo, CalendarPlus, UserCheck, UserX } from 'lucide-react';
import Chart from 'react-apexcharts'; // Added for ClaimsView charts
import { TasksView } from '../../components/TasksView/TasksView';

export type DashboardView = 'overview' | 'priorAuthorizations' | 'appeals' | 'claims' | 'carePlans' | 'appointments' | 'agents' | 'tasks';

// --- ChartCard Component Definition (Local to Dashboard/index.tsx) ---
interface ChartCardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, icon: Icon, children }) => {
  // const [isDark] = React.useState(document.documentElement.classList.contains('dark')); // isDark is already defined in ClaimsChartGrid

  return (
    <div className="bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10">
      <div className="absolute inset-0 bg-gradient-glossy from-violet-400/5 via-transparent to-transparent" />
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <Icon className="w-6 h-6 text-[#00F0FF]" />
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
};

// --- ClaimsView Component (Expanded) ---
interface ClaimsChartGridProps {
  chartTitles?: {
    volume?: string;
    statusDistribution?: string;
    processingTime?: string;
    byType?: string;
  };
  seriesNames?: {
    volume?: string;
    processingTime?: string;
    byType?: string;
  };
}

const ClaimsChartGrid: React.FC<ClaimsChartGridProps> = (props = {}) => {
  const { chartTitles = {}, seriesNames = {} } = props;
  const isDark = document.documentElement.classList.contains('dark');

  const lineChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'line', background: 'transparent', toolbar: { show: false }, foreColor: isDark ? '#fff' : '#333' },
    stroke: { curve: 'smooth', width: 3 },
    colors: ['#00E396'],
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], labels: { style: { colors: isDark ? '#A0AEC0' : '#4A5568' } } },
    yaxis: { labels: { style: { colors: isDark ? '#A0AEC0' : '#4A5568' } } },
    grid: { borderColor: isDark ? '#4A5568' : '#E2E8F0' },
    tooltip: { theme: isDark ? 'dark' : 'light' },
  };

  const donutChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'donut', background: 'transparent', foreColor: isDark ? '#fff' : '#333' },
    labels: ['Pending', 'Approved', 'Denied', 'Paid'],
    colors: ['#FFC107', '#4CAF50', '#F44336', '#2196F3'],
    legend: { position: 'bottom', labels: { colors: isDark ? '#fff' : '#333' } },
    tooltip: { theme: isDark ? 'dark' : 'light' },
    dataLabels: { enabled: true, style: { colors: ['#fff'] }, formatter: (val: number, opts: any) => opts.w.globals.series[opts.seriesIndex] },
  };

  const barChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: false }, foreColor: isDark ? '#fff' : '#333' },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 5 } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    colors: ['#3B82F6'],
    xaxis: { categories: ['Inpatient', 'Outpatient', 'Pharmacy', 'Dental'], labels: { style: { colors: isDark ? '#A0AEC0' : '#4A5568' } } },
    yaxis: { title: { text: 'Count / Days', style: { color: isDark ? '#A0AEC0' : '#4A5568' } }, labels: { style: { colors: isDark ? '#A0AEC0' : '#4A5568' } } },
    fill: { opacity: 1 },
    grid: { borderColor: isDark ? '#4A5568' : '#E2E8F0' },
    tooltip: { theme: isDark ? 'dark' : 'light', y: { formatter: (val) => String(val) } },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <ChartCard title={chartTitles.volume || 'Claim Volume Over Time'} icon={TrendingUp}>
        <Chart type="line" series={[{ name: seriesNames.volume || 'Claims', data: [120, 150, 130, 180, 160, 200] }]} options={lineChartOptions} height={350} />
      </ChartCard>
      <ChartCard title={chartTitles.statusDistribution || 'Claim Status Distribution'} icon={PieChart}>
        <Chart type="donut" series={[44, 55, 13, 33]} options={donutChartOptions} height={350} />
      </ChartCard>
      <ChartCard title={chartTitles.processingTime || 'Average Claim Processing Time (Days)'} icon={BarChart}>
        <Chart type="bar" series={[{ name: seriesNames.processingTime || 'Avg Days', data: [5, 7, 6, 8, 5, 9] }]} options={{...barChartOptions, xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], labels: { style: { colors: isDark ? '#A0AEC0' : '#4A5568' } }}}} height={350} />
      </ChartCard>
      <ChartCard title={chartTitles.byType || 'Claims by Type'} icon={ListChecks}>
        <Chart type="bar" series={[{ name: seriesNames.byType || 'Count', data: [250, 180, 320, 90] }]} options={{...barChartOptions, xaxis: {categories: ['Inpatient', 'Outpatient', 'Pharmacy', 'Dental']}}} height={350} />
      </ChartCard>
    </div>
  );
};

const ClaimsView: React.FC = () => {
  return (
    <div className="p-4 space-y-0">
      <h1 className="text-2xl font-semibold text-white">Claims Dashboard</h1>
      <ClaimsChartGrid />
    </div>
  );
};
// --- CarePlansView Component (Expanded) ---
interface CarePlansChartGridProps {
  chartTitles?: {
    adherenceRate?: string;
    byStatus?: string;
    averageDuration?: string;
    taskCompletion?: string;
  };
  // Add seriesNames or other props if needed for customization
}

const CarePlansChartGrid: React.FC<CarePlansChartGridProps> = (props = {}) => {
  const { chartTitles = {} } = props;
  const isDark = document.documentElement.classList.contains('dark');

  const gaugeOptions: ApexCharts.ApexOptions = {
    chart: { type: 'radialBar', offsetY: -20, foreColor: isDark ? '#fff' : '#333' },
    plotOptions: {
      radialBar: {
        startAngle: -135, endAngle: 135, hollow: { margin: 0, size: '70%', background: 'transparent' },
        track: { background: isDark ? '#4A5568' : '#E2E8F0', strokeWidth: '67%', margin: 0 },
        dataLabels: {
          name: { show: false }, 
          value: { offsetY: 5, fontSize: '22px', color: isDark ? '#fff' : '#333', formatter: (val) => val + '%' }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        gradientToColors: ['#A78BFA'], // End color
        stops: [0, 100] // Percentages for start and end colors
      }
    },
    colors: ['#34D399'], // Start color
    stroke: { lineCap: 'round' },
    labels: ['Adherence'],
  };

  const donutChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'donut', background: 'transparent', foreColor: isDark ? '#fff' : '#333' },
    labels: ['Active', 'Completed', 'Pending Review', 'Cancelled'],
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    legend: { position: 'bottom', labels: { colors: isDark ? '#fff' : '#333' } },
    tooltip: { theme: isDark ? 'dark' : 'light' },
    dataLabels: { enabled: true, style: { colors: ['#fff'] }, formatter: (val: number, opts: any) => opts.w.globals.series[opts.seriesIndex] },
  };

  const barChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: false }, foreColor: isDark ? '#fff' : '#333' },
    plotOptions: { bar: { horizontal: false, columnWidth: '50%', borderRadius: 5 } },
    dataLabels: { enabled: false },
    colors: ['#6366F1'],
    xaxis: { categories: ['Diabetes Mgmt', 'Cardiac Rehab', 'Post-Op Recovery', 'Mental Wellness'], labels: { style: { colors: isDark ? '#A0AEC0' : '#4A5568' } } },
    yaxis: { title: { text: 'Avg Duration (Weeks)', style: { color: isDark ? '#A0AEC0' : '#4A5568' } }, labels: { style: { colors: isDark ? '#A0AEC0' : '#4A5568' } } },
    grid: { borderColor: isDark ? '#4A5568' : '#E2E8F0' },
    tooltip: { theme: isDark ? 'dark' : 'light', y: { formatter: (val) => val + ' weeks' } },
  };
  
  const horizontalBarOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: false }, foreColor: isDark ? '#fff' : '#333' },
    plotOptions: { bar: { horizontal: true, barHeight: '50%', borderRadius: 5, distributed: true } }, // Distributed for varied colors
    colors: ['#22D3EE', '#A3E635', '#FACC15', '#FB923C', '#F472B6'], // Example colors
    dataLabels: { enabled: true, textAnchor: 'start', style: { colors: [isDark ? '#fff' : '#333'] }, formatter: (val) => val + '%', offsetX: 0, dropShadow: { enabled: true } },
    xaxis: { categories: ['Medication Reminders', 'Dietary Adjustments', 'Exercise Routine', 'Symptom Tracking', 'Follow-up Appts'], labels: { style: { colors: isDark ? '#A0AEC0' : '#4A5568' } }, max: 100 },
    yaxis: { labels: { style: { colors: isDark ? '#A0AEC0' : '#4A5568' } } },
    grid: { borderColor: isDark ? '#4A5568' : '#E2E8F0', xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
    tooltip: { theme: isDark ? 'dark' : 'light', x: { formatter: (val) => val + '%' } },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <ChartCard title={chartTitles.adherenceRate || 'Care Plan Adherence Rate'} icon={Target}>
        <Chart type="radialBar" series={[76]} options={gaugeOptions} height={300} />
      </ChartCard>
      <ChartCard title={chartTitles.byStatus || 'Care Plans by Status'} icon={CheckCircle}>
        <Chart type="donut" series={[60, 25, 10, 5]} options={donutChartOptions} height={300} />
      </ChartCard>
      <ChartCard title={chartTitles.averageDuration || 'Average Care Plan Duration'} icon={CalendarDays}>
        <Chart type="bar" series={[{ name: 'Avg Weeks', data: [12, 16, 8, 24] }]} options={barChartOptions} height={300} />
      </ChartCard>
      <ChartCard title={chartTitles.taskCompletion || 'Task Completion Rate'} icon={ListTodo}>
        <Chart type="bar" series={[{ name: 'Completion %', data: [90, 75, 82, 60, 95] }]} options={horizontalBarOptions} height={300} />
      </ChartCard>
    </div>
  );
};

const CarePlansView: React.FC = () => {
  return (
    <div className="p-4 space-y-0">
      <h1 className="text-2xl font-semibold text-white">Care Plans Dashboard</h1>
      <CarePlansChartGrid />
    </div>
  );
};
// --- AppointmentsView Component (Expanded) ---
interface AppointmentsChartGridProps {
  chartTitles?: {
    scheduledVsCompleted?: string;
    typeDistribution?: string;
    noShowRate?: string;
    upcomingVolume?: string;
  };
  // seriesNames, etc. as needed
}

const AppointmentsChartGrid: React.FC<AppointmentsChartGridProps> = (props = {}) => {
  const { chartTitles = {} } = props;
  const isDark = document.documentElement.classList.contains('dark');

  const groupedBarOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: false }, foreColor: isDark ? '#fff' : '#333' },
    plotOptions: { bar: { horizontal: false, columnWidth: '60%', borderRadius: 5 } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    colors: ['#8B5CF6', '#22D3EE'], // Purple for Scheduled, Cyan for Completed
    xaxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], labels: { style: { colors: isDark ? '#A0AEC0' : '#4A5568' } } },
    yaxis: { title: { text: 'Count', style: { color: isDark ? '#A0AEC0' : '#4A5568' } }, labels: { style: { colors: isDark ? '#A0AEC0' : '#4A5568' } } },
    legend: { position: 'top', horizontalAlign: 'left', labels: { colors: isDark ? '#fff' : '#333' } },
    grid: { borderColor: isDark ? '#4A5568' : '#E2E8F0' },
    tooltip: { theme: isDark ? 'dark' : 'light' },
  };

  const donutOptions: ApexCharts.ApexOptions = {
    chart: { type: 'donut', background: 'transparent', foreColor: isDark ? '#fff' : '#333' },
    labels: ['New Patient', 'Follow-up', 'Annual Check', 'Telehealth', 'Specialist'],
    colors: ['#F97316', '#0EA5E9', '#10B981', '#6366F1', '#EC4899'],
    legend: { position: 'bottom', labels: { colors: isDark ? '#fff' : '#333' } },
    tooltip: { theme: isDark ? 'dark' : 'light' },
    dataLabels: { enabled: true, style: { colors: ['#fff'] }, formatter: (val: number, opts: any) => opts.w.globals.series[opts.seriesIndex] },
  };

  const lineChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'line', background: 'transparent', toolbar: { show: false }, foreColor: isDark ? '#fff' : '#333' },
    stroke: { curve: 'smooth', width: 3 },
    colors: ['#EF4444'], // Red for No-Show Rate
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], labels: { style: { colors: isDark ? '#A0AEC0' : '#4A5568' } } },
    yaxis: { title: { text: 'No-Show Rate (%)', style: { color: isDark ? '#A0AEC0' : '#4A5568' } }, labels: { style: { colors: isDark ? '#A0AEC0' : '#4A5568' }, formatter: (val) => val + '%' } },
    grid: { borderColor: isDark ? '#4A5568' : '#E2E8F0' },
    tooltip: { theme: isDark ? 'dark' : 'light', y: { formatter: (val) => val + '%' } },
  };
  
  const barChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: false }, foreColor: isDark ? '#fff' : '#333' },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 5 } },
    dataLabels: { enabled: false },
    colors: ['#3B82F6'],
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], labels: { style: { colors: isDark ? '#A0AEC0' : '#4A5568' } } },
    yaxis: { title: { text: 'Appointments', style: { color: isDark ? '#A0AEC0' : '#4A5568' } }, labels: { style: { colors: isDark ? '#A0AEC0' : '#4A5568' } } },
    grid: { borderColor: isDark ? '#4A5568' : '#E2E8F0' },
    tooltip: { theme: isDark ? 'dark' : 'light' },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <ChartCard title={chartTitles.scheduledVsCompleted || 'Scheduled vs. Completed'} icon={UserCheck}>
        <Chart type="bar" series={[{ name: 'Scheduled', data: [50, 60, 70, 55] }, { name: 'Completed', data: [45, 50, 62, 48] }]} options={groupedBarOptions} height={350} />
      </ChartCard>
      <ChartCard title={chartTitles.typeDistribution || 'Appointment Types'} icon={PieChart}>
        <Chart type="donut" series={[30, 25, 20, 15, 10]} options={donutOptions} height={350} />
      </ChartCard>
      <ChartCard title={chartTitles.noShowRate || 'No-Show Rate Trend'} icon={UserX}>
        <Chart type="line" series={[{ name: 'No-Show %', data: [8, 7, 9, 6, 7] }]} options={lineChartOptions} height={350} />
      </ChartCard>
      <ChartCard title={chartTitles.upcomingVolume || 'Upcoming Appointments (Next 7 Days)'} icon={CalendarPlus}>
        <Chart type="bar" series={[{ name: 'Count', data: [15, 22, 18, 25, 20, 10, 12] }]} options={barChartOptions} height={350} />
      </ChartCard>
    </div>
  );
};

const AppointmentsView: React.FC = () => {
  return (
    <div className="p-4 space-y-0">
      <h1 className="text-2xl font-semibold text-white">Appointments Dashboard</h1>
      <AppointmentsChartGrid />
    </div>
  );
};
const AgentsView = () => <div className="p-4"><h1 className="text-2xl font-semibold text-white">Agents Dashboard</h1><p className="text-white/60">Content for agents will be displayed here.</p></div>;


export function Dashboard() {
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleNavigate = (view: DashboardView) => {
    setActiveView(view);
  };

  return (
    <div className="min-h-full flex flex-col bg-gradient-to-br from-black/50 via-transparent to-black/50"> {/* Removed p-4, MenuBar handles its own padding/layout */}
      <MenuBar onNavigate={handleNavigate} /> {/* Added MenuBar component with navigation handler */}
      <div className="flex-1 rounded-xl bg-black/5 backdrop-blur-xl border border-white/10 p-4"> {/* Added p-4 back here for content spacing */}
        {activeView === 'overview' ? (
          <SystemOverview />
        ) : activeView === 'tasks' ? (
          <TasksView />
        ) : activeView === 'priorAuthorizations' ? (
          <div className="space-y-6 p-4">
            <h1 className="text-2xl font-semibold text-white">Prior Authorizations</h1>
            <MembersChartGrid 
                chartTitles={{
                  satisfaction: "Authorizations Overview",
                  journeyProgress: "Authorization Status Distribution",
                  resourceUtilization: "Recent Authorization Activity",
                  carePlanDistribution: "Authorization Approval Rate",
                  activityPatterns: "Volume by Department",
                  healthAssessment: "Processing Times"
                }}
                seriesNames={{
                  journeyMembers: "Statuses",
                  plans: "Authorizations",
                  activityMon: "Dept A", 
                  activityWed: "Dept B", 
                  activityFri: "Dept C"
                }}
              />
            <MembersTable 
                columnNames={{
                  memberHeader: "Auth ID"
                }}
              /> {/* Removed onMemberClick prop */}
          </div>
        ) : activeView === 'appeals' ? (
          <div className="space-y-6 p-4">
            <h1 className="text-2xl font-semibold text-white">Appeals</h1>
            <ProvidersChartGrid 
                chartTitles={{
                  satisfaction: "Appeals Overview",
                  distribution: "Appeal Categories",
                  growth: "Appeals Volume Trend",
                  quality: "Appeal Quality Metrics",
                  responseTimes: "Appeal Response Times",
                  coverage: "Appeal Coverage"
                }}
                seriesNames={{
                  distributionProviders: "Appeals"
                }}
                xAxisCategories={{
                  distribution: ['Medical Necessity', 'Eligibility', 'Coding Dispute', 'Out-of-Network']
                }}
              />
            {/* For simplicity, only showing ProvidersTable. Add ProvidersMap toggle later if needed. */}
            <ProvidersTable 
                columnNames={{
                  providerHeader: "Appeal ID",
                  ratingHeader: "Complexity",
                  statusHeader: "Appeal Status",
                  networkTierHeader: "Appeal Stage",
                  contactHeader: "Assigned To",
                  nextAvailableHeader: "Due Date"
                }}
              /> {/* Removed searchTerm and selectedFilters props */}
          </div>
        ) : activeView === 'claims' ? (
          <ClaimsView />
        ) : activeView === 'carePlans' ? (
          <CarePlansView />
        ) : activeView === 'appointments' ? (
          <AppointmentsView />
        ) : activeView === 'agents' ? (
          <AgentsView />
        ) : (
          <SystemOverview /> // Default fallback or handle unknown view
        )}
      </div>
    </div>
  );
}
