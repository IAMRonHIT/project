import React from 'react';
import { Trophy, Activity, Building2, Share2, Clock, Star as StarIcon } from 'lucide-react';
import { Chart } from '../../../components/Chart';

interface ChartCardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, icon: Icon, children }) => {
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

export function ProvidersChartGrid() {
  // Network Satisfaction Gauge Chart Data
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

  // Provider Distribution Bar Chart Data
  const distributionOptions = {
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
      categories: ['Primary', 'Cardiology', 'Neurology', 'Oncology', 'Pediatrics'],
      labels: { style: { colors: '#fff' } }
    },
    yaxis: { labels: { style: { colors: '#fff' } } }
  };

  // Contract Status Area Chart Data
  const contractOptions = {
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

  // Quality Metrics Radar Chart Data
  const qualityOptions = {
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
      categories: ['Clinical', 'Patient Exp', 'Efficiency', 'Documentation', 'Engagement'],
      labels: { style: { colors: '#fff' } }
    }
  };

  // Response Times Bar Chart Data
  const responseOptions = {
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
      categories: ['Morning', 'Afternoon', 'Evening', 'Night'],
      labels: { style: { colors: '#fff' } }
    },
    yaxis: { 
      labels: { style: { colors: '#fff' } },
      title: { text: 'Avg Response Time (hrs)', style: { color: '#fff' } }
    }
  };

  // Network Coverage Bar Chart Data
  const coverageOptions = {
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
      categories: ['Urban', 'Suburban', 'Rural', 'Remote'],
      labels: { style: { colors: '#fff' } }
    },
    yaxis: { labels: { style: { colors: '#fff' } } }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Network Satisfaction Gauge */}
      <ChartCard title="Network Satisfaction" icon={Trophy}>
        <Chart
          type="radialBar"
          series={[92]}
          options={gaugeOptions}
          height={450}
        />
      </ChartCard>

      {/* Provider Distribution */}
      <ChartCard title="Provider Distribution" icon={Building2}>
        <Chart
          type="bar"
          series={[{
            name: 'Providers',
            data: [450, 280, 220, 180, 150]
          }]}
          options={distributionOptions}
          height={350}
        />
      </ChartCard>

      {/* Contract Status */}
      <ChartCard title="Contract Status" icon={Activity}>
        <Chart
          type="area"
          series={[{
            name: 'Active Contracts',
            data: [1500, 1650, 1750, 1800, 1850, 1924]
          }]}
          options={contractOptions}
          height={350}
        />
      </ChartCard>

      {/* Quality Metrics */}
      <ChartCard title="Quality Metrics" icon={StarIcon}>
        <Chart
          type="radar"
          series={[{
            name: 'Score',
            data: [85, 90, 82, 88, 86]
          }]}
          options={qualityOptions}
          height={350}
        />
      </ChartCard>

      {/* Response Times */}
      <ChartCard title="Response Times" icon={Clock}>
        <Chart
          type="bar"
          series={[{
            name: 'Hours',
            data: [1.2, 1.8, 2.1, 2.4]
          }]}
          options={responseOptions}
          height={350}
        />
      </ChartCard>

      {/* Network Coverage */}
      <ChartCard title="Network Coverage" icon={Share2}>
        <Chart
          type="bar"
          series={[{
            name: 'Coverage',
            data: [95, 88, 75, 60]
          }]}
          options={coverageOptions}
          height={350}
        />
      </ChartCard>
    </div>
  );
}
