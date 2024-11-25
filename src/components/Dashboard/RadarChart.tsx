import React from 'react';
import { Chart } from '../Chart';
import { useTheme } from '../../hooks/useTheme';

interface RadarChartProps {
  title: string;
  categories: string[];
  series: { name: string; data: number[] }[];
  variant?: 'teal' | 'lavender' | 'lime' | 'coral';
}

export function RadarChart({ title, categories, series, variant = 'lavender' }: RadarChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getContainerStyles = () => {
    const baseStyles = `
      p-6 rounded-xl backdrop-blur-sm border
      transition-all duration-300
      bg-gradient-glossy
      shadow-glow hover:shadow-glow-hover
    `;
    
    switch (variant) {
      case 'teal':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-teal-400/10 border-ron-teal-400/20'
            : 'bg-ron-teal-50 border-ron-teal-200'
        }`;
      case 'lavender':
        return `${baseStyles} ${
          isDark 
            ? 'bg-violet-400/10 border-violet-400/20'
            : 'bg-violet-50 border-violet-200'
        }`;
      case 'lime':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-lime-400/10 border-ron-lime-400/20'
            : 'bg-ron-lime-50 border-ron-lime-200'
        }`;
      case 'coral':
        return `${baseStyles} ${
          isDark 
            ? 'bg-ron-coral-400/10 border-ron-coral-400/20'
            : 'bg-ron-coral-50 border-ron-coral-200'
        }`;
      default:
        return `${baseStyles} ${
          isDark 
            ? 'bg-violet-400/10 border-violet-400/20'
            : 'bg-violet-50 border-violet-200'
        }`;
    }
  };

  const getTitleStyles = () => {
    switch (variant) {
      case 'teal':
        return isDark ? 'text-ron-teal-200' : 'text-ron-teal-700';
      case 'lavender':
        return isDark ? 'text-violet-200' : 'text-violet-700';
      case 'lime':
        return isDark ? 'text-ron-lime-200' : 'text-ron-lime-700';
      case 'coral':
        return isDark ? 'text-ron-coral-200' : 'text-ron-coral-700';
      default:
        return isDark ? 'text-violet-200' : 'text-violet-700';
    }
  };

  const options = {
    chart: {
      dropShadow: {
        enabled: false
      }
    },
    labels: categories,
    plotOptions: {
      radar: {
        size: 140,
        polygons: {
          strokeWidth: 1,
          fill: {
            colors: ['transparent']
          }
        }
      }
    },
    yaxis: {
      show: false,
      labels: {
        style: {
          fontSize: '12px'
        },
        maxWidth: 160 // Increased width for labels
      }
    },
    xaxis: {
      labels: {
        style: {
          fontSize: '12px'
        },
        trim: false, // Prevent text trimming
        maxHeight: 100 // Allow more height for labels
      }
    }
  };

  return (
    <div className={getContainerStyles()}>
      <h3 className={`text-lg font-medium mb-4 ${getTitleStyles()}`}>
        {title}
      </h3>
      <Chart
        type="radar"
        series={series}
        options={options}
        height={350}
        variant={variant}
      />
    </div>
  );
}
