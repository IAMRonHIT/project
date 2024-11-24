import React from 'react';
import { Tooltip } from './Tooltip';
import { Shield, Activity, Brain } from 'lucide-react';

interface ProgressBarProps {
  value: number;
  color: string;
  glowColor: string;
}

function ProgressBar({ value, color, glowColor }: ProgressBarProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));
  
  return (
    <div className={`
      w-32 rounded-full h-2.5 overflow-hidden
      ${isDark ? 'bg-white/10' : 'bg-ron-primary/10'}
    `}>
      <div 
        className={`
          h-full rounded-full transition-all duration-500 ease-out
          bg-gradient-glossy
          ${color}
        `}
        style={{ 
          width: `${value}%`,
          boxShadow: `0 0 15px ${glowColor}`
        }}
      />
    </div>
  );
}

interface MetricRowProps {
  icon: typeof Shield;
  name: string;
  value: number;
  tooltip: string;
  color: string;
  glowColor: string;
}

function MetricRow({ icon: Icon, name, value, tooltip, color, glowColor }: MetricRowProps) {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  return (
    <Tooltip content={tooltip}>
      <div className="flex items-center justify-between group">
        <div className="flex items-center gap-3">
          <div className={`
            p-1.5 rounded-lg
            ${color.replace('bg-', 'bg-opacity-20 bg-')}
          `}>
            <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
          </div>
          <span className={`
            ${isDark ? 'text-white/80' : 'text-ron-dark-navy/80'}
            group-hover:text-white dark:group-hover:text-white 
            transition-colors
          `}>
            {name}
          </span>
        </div>
        <ProgressBar value={value} color={color} glowColor={glowColor} />
      </div>
    </Tooltip>
  );
}

export function SystemOverview() {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  const workflows = [
    { 
      icon: Shield, 
      name: 'Prior Authorization', 
      value: 92, 
      tooltip: 'Automated approval rate', 
      color: 'bg-ron-mint-400',
      glowColor: '#70DBC4'
    },
    { 
      icon: Activity, 
      name: 'Claims Processing', 
      value: 88, 
      tooltip: 'Processing efficiency', 
      color: 'bg-ron-teal-400',
      glowColor: '#4ABEBE'
    },
    { 
      icon: Brain, 
      name: 'Appointment Scheduling', 
      value: 95, 
      tooltip: 'Scheduling accuracy', 
      color: 'bg-ron-lime-400',
      glowColor: '#A3E635'
    }
  ];

  const metrics = [
    { 
      icon: Activity, 
      name: 'API Response Time', 
      value: 98, 
      tooltip: 'System responsiveness', 
      color: 'bg-ron-mint-400',
      glowColor: '#70DBC4'
    },
    { 
      icon: Brain, 
      name: 'ML Model Accuracy', 
      value: 94, 
      tooltip: 'Prediction accuracy', 
      color: 'bg-ron-teal-400',
      glowColor: '#4ABEBE'
    },
    { 
      icon: Shield, 
      name: 'Data Processing', 
      value: 96, 
      tooltip: 'Real-time processing rate', 
      color: 'bg-ron-lime-400',
      glowColor: '#A3E635'
    }
  ];

  return (
    <div className={`
      bg-white/5 backdrop-blur-xl rounded-xl p-8 
      shadow-soft hover:shadow-glow 
      transition-all duration-300 
      relative overflow-hidden 
      border border-white/10
    `}>
      <div className="absolute inset-0 bg-gradient-glossy from-ron-mint-200/5 via-transparent to-transparent" />
      
      <h2 className="text-xl font-semibold text-white mb-8 relative">System Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        <div>
          <h3 className="text-white font-medium mb-6 pb-2 border-b border-white/10">
            Active Workflows
          </h3>
          <div className="space-y-6">
            {workflows.map((workflow) => (
              <MetricRow key={workflow.name} {...workflow} />
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-white font-medium mb-6 pb-2 border-b border-white/10">
            System Health
          </h3>
          <div className="space-y-6">
            {metrics.map((metric) => (
              <MetricRow key={metric.name} {...metric} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}