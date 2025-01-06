import React from 'react';
import { Activity, Users, Heart, Brain, Clock, FileCheck } from 'lucide-react';
import { Chart } from '../../../components/Chart';

interface ChartCardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, icon: Icon, children }) => {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

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

export function MembersChartGrid() {
  // Member Satisfaction Gauge Chart Data
  const gaugeOptions = {
    chart: { 
      type: 'radialBar',
      offsetY: -10
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: '60%',
          background: 'transparent'
        },
        track: { 
          background: "#333",
          strokeWidth: '120%',
          margin: 0
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            show: true,
            fontSize: '48px',
            color: '#fff',
            offsetY: 10,
            formatter: function (val: number) {
              return val + '%';
            }
          }
        }
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        colorStops: [
          { offset: 0, color: "#00F0FF" },
          { offset: 100, color: "#7C3AED" }
        ]
      }
    },
    stroke: { 
      lineCap: "round",
      dashArray: 4
    },
    legend: {
      show: false
    }
  };

  // Care Journey Funnel Chart Data
  const funnelOptions = {
    chart: { type: 'bar' },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        dataLabels: { position: 'bottom' }
      }
    },
    colors: ['#00F0FF', '#00B8CC', '#00D6D0', '#008299'],
    dataLabels: {
      enabled: true,
      style: { colors: ['#fff'] }
    },
    xaxis: {
      categories: ['Completed', 'In Progress', 'Scheduled', 'Initial Contact'],
      labels: { style: { colors: '#fff' } }
    },
    yaxis: { labels: { style: { colors: '#fff' } } }
  };

  // Resource Utilization Area Chart Data
  const areaOptions = {
    chart: { type: 'area' },
    stroke: { curve: 'smooth' },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    dataLabels: { enabled: false },
    colors: ['#00F0FF'],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      labels: { style: { colors: '#fff' } }
    },
    yaxis: { labels: { style: { colors: '#fff' } } }
  };

  // Care Plan Distribution Bar Chart Data
  const barOptions = {
    chart: { type: 'bar' },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4
      }
    },
    dataLabels: { enabled: false },
    colors: ['#00F0FF'],
    xaxis: {
      categories: ['Primary', 'Specialty', 'Preventive', 'Emergency', 'Follow-up'],
      labels: { style: { colors: '#fff' } }
    },
    yaxis: { labels: { style: { colors: '#fff' } } }
  };

  // Member Activity Patterns Data
  const activityOptions = {
    chart: { type: 'bar' },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4
      }
    },
    dataLabels: { enabled: false },
    colors: ['#00F0FF', '#00B8CC', '#00D6D0', '#008299'],
    xaxis: {
      categories: ['9AM', '12PM', '3PM', '6PM'],
      labels: { style: { colors: '#fff' } }
    },
    yaxis: { 
      labels: { style: { colors: '#fff' } },
      title: { text: 'Activity Level', style: { color: '#fff' } }
    }
  };

  // Health Assessment Radar Chart Data
  const radarOptions = {
    chart: { type: 'radar' },
    stroke: {
      width: 2,
      colors: ['#00F0FF']
    },
    fill: {
      opacity: 0.5,
      colors: ['#00F0FF']
    },
    markers: { size: 4 },
    xaxis: {
      categories: ['Physical', 'Mental', 'Social', 'Preventive', 'Medication'],
      labels: { style: { colors: '#fff' } }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Member Satisfaction Gauge */}
      <ChartCard title="Member Satisfaction" icon={Users}>
        <Chart
          type="radialBar"
          series={[94]}
          options={gaugeOptions}
          height={450}
        />
      </ChartCard>

      {/* Care Journey Funnel */}
      <ChartCard title="Care Journey Progress" icon={Activity}>
        <Chart
          type="bar"
          series={[{
            name: 'Members',
            data: [120, 180, 250, 400]
          }]}
          options={funnelOptions}
          height={350}
        />
      </ChartCard>

      {/* Resource Utilization Area */}
      <ChartCard title="Resource Utilization" icon={Clock}>
        <Chart
          type="area"
          series={[{
            name: 'Utilization',
            data: [45, 52, 38, 45, 19, 23]
          }]}
          options={areaOptions}
          height={350}
        />
      </ChartCard>

      {/* Care Plan Distribution Bar */}
      <ChartCard title="Care Plan Distribution" icon={FileCheck}>
        <Chart
          type="bar"
          series={[{
            name: 'Plans',
            data: [44, 55, 41, 67, 22]
          }]}
          options={barOptions}
          height={350}
        />
      </ChartCard>

      {/* Member Activity Patterns */}
      <ChartCard title="Activity Patterns" icon={Brain}>
        <Chart
          type="bar"
          series={[
            {
              name: 'Mon',
              data: [30, 20, 10, 5]
            },
            {
              name: 'Wed',
              data: [45, 35, 25, 15]
            },
            {
              name: 'Fri',
              data: [50, 40, 30, 20]
            }
          ]}
          options={activityOptions}
          height={350}
        />
      </ChartCard>

      {/* Health Assessment Radar */}
      <ChartCard title="Health Assessment" icon={Heart}>
        <Chart
          type="radar"
          series={[{
            name: 'Score',
            data: [80, 75, 85, 70, 90]
          }]}
          options={radarOptions}
          height={350}
        />
      </ChartCard>
    </div>
  );
}
