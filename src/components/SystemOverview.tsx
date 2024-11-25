import React from 'react';
import { Tooltip } from './Tooltip';
import { Shield, Activity, Brain } from 'lucide-react';
import { useTheme } from '../hooks/useTheme.tsx';

interface ProgressBarProps {
  value: number;
  variant: 'lavender' | 'coral' | 'teal' | 'lime';
}

function ProgressBar({ value, variant }: ProgressBarProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const getGlowColor = () => {
    switch (variant) {
      case 'lavender':
        return isDark ? 'rgba(196, 181, 253, 0.8)' : 'rgba(167, 139, 250, 0.8)';
      case 'coral':
        return isDark ? 'rgba(255, 107, 157, 0.8)' : 'rgba(255, 77, 140, 0.8)'; // Matching fluorescent pink/coral
      case 'teal':
        return isDark ? 'rgba(0, 242, 234, 0.8)' : 'rgba(0, 214, 208, 0.8)'; // Matching electric teal
      case 'lime':
        return isDark ? 'rgba(163, 230, 53, 0.8)' : 'rgba(132, 204, 22, 0.8)';
      default:
        return isDark ? 'rgba(196, 181, 253, 0.8)' : 'rgba(167, 139, 250, 0.8)';
    }
  };

  const getBarColor = () => {
    switch (variant) {
      case 'lavender':
        return isDark ? '#c4b5fd' : '#a78bfa';
      case 'coral':
        return isDark ? '#ff6b9d' : '#ff4d8c'; // Matching fluorescent pink/coral
      case 'teal':
        return isDark ? '#00f2ea' : '#00d6d0'; // Matching electric teal
      case 'lime':
        return isDark ? '#a3e635' : '#84cc16';
      default:
        return isDark ? '#c4b5fd' : '#a78bfa';
    }
  };

  const getBarStyles = () => {
    const baseStyles = `
      h-full rounded-full transition-all duration-500 ease-out
      bg-gradient-glossy backdrop-blur-sm
    `;

    switch (variant) {
      case 'lavender':
        return `${baseStyles} ${
          isDark 
            ? 'bg-violet-400/20'
            : 'bg-violet-500/20'
        }`;
      case 'coral':
        return `${baseStyles} ${
          isDark 
            ? 'bg-pink-400/20'
            : 'bg-pink-500/20'
        }`;
      case 'teal':
        return `${baseStyles} ${
          isDark 
            ? 'bg-cyan-400/20'
            : 'bg-cyan-500/20'
        }`;
      case 'lime':
        return `${baseStyles} ${
          isDark 
            ? 'bg-lime-400/20'
            : 'bg-lime-500/20'
        }`;
      default:
        return `${baseStyles} ${
          isDark 
            ? 'bg-violet-400/20'
            : 'bg-violet-500/20'
        }`;
    }
  };

  return (
    <div className={`
      w-32 rounded-full h-2.5 overflow-hidden
      ${isDark ? 'bg-white/5' : 'bg-ron-primary/5'}
      backdrop-blur-sm
    `}>
      <div 
        className={getBarStyles()}
        style={{ 
          width: `${value}%`,
          background: `linear-gradient(90deg, ${getBarColor()}CC, ${getBarColor()}66)`,
          boxShadow: `
            0 0 20px ${getGlowColor()},
            0 0 10px ${getGlowColor()},
            inset 0 0 15px ${getGlowColor()}
          `
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
  variant: 'lavender' | 'coral' | 'teal' | 'lime';
}

function MetricRow({ icon: Icon, name, value, tooltip, variant }: MetricRowProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getIconStyles = () => {
    switch (variant) {
      case 'lavender':
        return isDark 
          ? 'bg-violet-400/20 text-violet-200'
          : 'bg-violet-100/80 text-violet-700';
      case 'coral':
        return isDark 
          ? 'bg-pink-400/20 text-pink-200'
          : 'bg-pink-100/80 text-pink-700';
      case 'teal':
        return isDark 
          ? 'bg-cyan-400/20 text-cyan-200'
          : 'bg-cyan-100/80 text-cyan-700';
      case 'lime':
        return isDark 
          ? 'bg-lime-400/20 text-lime-200'
          : 'bg-lime-100/80 text-lime-700';
      default:
        return isDark 
          ? 'bg-violet-400/20 text-violet-200'
          : 'bg-violet-100/80 text-violet-700';
    }
  };

  return (
    <Tooltip content={tooltip}>
      <div className="flex items-center justify-between group">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg backdrop-blur-sm ${getIconStyles()}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className={`
            ${isDark ? 'text-white/80' : 'text-ron-dark-navy/80'}
            group-hover:text-white dark:group-hover:text-white 
            transition-colors
          `}>
            {name}
          </span>
        </div>
        <ProgressBar value={value} variant={variant} />
      </div>
    </Tooltip>
  );
}

export function SystemOverview() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const workflows = [
    { 
      icon: Shield, 
      name: 'Prior Authorization', 
      value: 92, 
      tooltip: 'Automated approval rate', 
      variant: 'lavender' as const
    },
    { 
      icon: Activity, 
      name: 'Claims Processing', 
      value: 88, 
      tooltip: 'Processing efficiency', 
      variant: 'coral' as const
    },
    { 
      icon: Brain, 
      name: 'Appointment Scheduling', 
      value: 95, 
      tooltip: 'Scheduling accuracy', 
      variant: 'lime' as const
    }
  ];

  const metrics = [
    { 
      icon: Activity, 
      name: 'API Response Time', 
      value: 98, 
      tooltip: 'System responsiveness', 
      variant: 'teal' as const
    },
    { 
      icon: Brain, 
      name: 'ML Model Accuracy', 
      value: 94, 
      tooltip: 'Prediction accuracy', 
      variant: 'lavender' as const
    },
    { 
      icon: Shield, 
      name: 'Data Processing', 
      value: 96, 
      tooltip: 'Real-time processing rate', 
      variant: 'coral' as const
    }
  ];

  return (
    <div className={`
      ${isDark ? 'bg-white/5' : 'bg-white'} 
      backdrop-blur-xl rounded-xl p-8 
      shadow-soft hover:shadow-glow 
      transition-all duration-300 
      relative overflow-hidden 
      border ${isDark ? 'border-white/10' : 'border-ron-divider'}
    `}>
      <div className="absolute inset-0 bg-gradient-glossy from-violet-400/5 via-transparent to-transparent" />
      
      <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-ron-dark-navy'} mb-8 relative`}>
        System Overview
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        <div>
          <h3 className={`font-medium mb-6 pb-2 border-b ${isDark ? 'text-white border-white/10' : 'text-ron-dark-navy border-ron-divider'}`}>
            Active Workflows
          </h3>
          <div className="space-y-6">
            {workflows.map((workflow) => (
              <MetricRow key={workflow.name} {...workflow} />
            ))}
          </div>
        </div>
        
        <div>
          <h3 className={`font-medium mb-6 pb-2 border-b ${isDark ? 'text-white border-white/10' : 'text-ron-dark-navy border-ron-divider'}`}>
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
