import React from 'react';
import { Activity, Users, Clock, FileCheck2, Brain, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme.tsx';
import { Chart } from './Chart';

const iconMap = {
  Activity,
  Users,
  Clock,
  FileCheck2,
  Brain,
  Zap,
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: keyof typeof iconMap;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isPriority?: boolean;
  description?: string;
  chartData?: {
    type: 'area' | 'bar' | 'line';
    series: { name: string; data: number[] }[];
    categories: string[];
  };
}

export function MetricCard({ 
  title, 
  value, 
  icon,
  trend, 
  isPriority,
  description,
  chartData 
}: MetricCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const Icon = iconMap[icon];

  const getGlowColor = () => {
    return isDark ? 'rgba(0, 242, 234, 0.15)' : 'rgba(0, 214, 208, 0.15)';
  };

  const chartOptions = chartData ? {
    chart: {
      sparkline: {
        enabled: true
      },
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        show: false
      }
    },
    yaxis: {
      show: false
    },
    grid: {
      show: false
    },
    tooltip: {
      enabled: true,
      theme: isDark ? 'dark' : 'light',
      x: {
        show: false
      }
    }
  } : {};

  return (
    <div className={`
      group relative rounded-xl p-6 
      ${isDark ? 'bg-white/5' : 'bg-white'} 
      backdrop-blur-xl border
      ${isDark ? 'border-white/10' : 'border-ron-divider'}
      transition-all duration-300
    `}
    style={{
      boxShadow: `0 0 20px ${getGlowColor()}, 0 0 40px ${getGlowColor()}`
    }}
    >
      <div className="flex items-center justify-between">
        <div className="relative">
          <div className={`
            p-2 rounded-lg 
            ${isDark ? 'bg-cyan-400/10' : 'bg-cyan-50'}
            transition-colors duration-300
            group-hover:bg-cyan-400/20
          `}
          style={{
            boxShadow: `0 0 10px ${isDark ? 'rgba(0, 242, 234, 0.3)' : 'rgba(0, 214, 208, 0.3)'}`
          }}
          >
            <Icon className={`
              w-6 h-6 
              ${isDark ? 'text-cyan-200' : 'text-cyan-600'}
              transition-all duration-300 
              group-hover:scale-110
              group-hover:text-cyan-400
            `} />
          </div>
        </div>
        {trend && (
          <span className={`
            text-sm font-medium
            ${trend.isPositive 
              ? isDark ? 'text-cyan-200' : 'text-cyan-600'
              : isDark ? 'text-ron-coral-200' : 'text-ron-coral-600'
            }
            transition-colors duration-300
            group-hover:${trend.isPositive ? 'text-cyan-400' : 'text-ron-coral-400'}
          `}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <h3 className={`
            text-base font-medium
            ${isDark ? 'text-white/90' : 'text-ron-dark-navy/90'}
            transition-colors duration-300
            group-hover:text-white dark:group-hover:text-white
          `}>
            {title}
          </h3>
        </div>
        <p className={`
          mt-2 text-2xl font-semibold tracking-tight
          ${isDark ? 'text-white' : 'text-ron-dark-navy'}
          transition-colors duration-300
          group-hover:text-white dark:group-hover:text-white
        `}>
          {value}
        </p>
        {description && (
          <p className={`
            mt-2 text-sm
            ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}
            transition-colors duration-300
            group-hover:text-white/80 dark:group-hover:text-white/80
          `}>
            {description}
          </p>
        )}
      </div>
      {chartData && (
        <div className="mt-4 h-16">
          <Chart
            type={chartData.type}
            series={chartData.series}
            options={chartOptions}
            height={64}
            variant="teal"
          />
        </div>
      )}
      <div className="
        absolute inset-0 rounded-xl 
        bg-gradient-glossy from-cyan-400/10 via-transparent to-transparent 
        opacity-0 group-hover:opacity-100 
        transition-opacity duration-300
      " />
    </div>
  );
}
