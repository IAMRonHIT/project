import React from 'react';
import { Chart } from '../Chart';
import { useTheme } from '../../hooks/useTheme';

interface PieChartProps {
  title: string;
  series: number[];
  labels: string[];
  variant?: 'teal' | 'lavender' | 'lime' | 'coral';
}

export function PieChart({ title, series, labels, variant = 'teal' }: PieChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getContainerStyles = () => {
    const baseStyles = `
      p-6 rounded-xl backdrop-blur-sm border
      transition-all duration-300
      bg-gradient-glossy
      shadow-glow hover:shadow-glow-hover
      flex flex-col justify-between h-full
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
            ? 'bg-ron-teal-400/10 border-ron-teal-400/20'
            : 'bg-ron-teal-50 border-ron-teal-200'
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
        return isDark ? 'text-ron-teal-200' : 'text-ron-teal-700';
    }
  };

  const options = {
    labels,
    chart: {
      type: 'pie',
      height: 400,
      width: '100%',
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      floating: true,
      fontSize: '10px',
      itemMargin: {
        horizontal: 5,
        vertical: 2
      },
      markers: {
        radius: 8,
        width: 8,
        height: 8,
        offsetX: 0
      },
      labels: {
        colors: isDark ? '#ffffff' : '#00344E'
      }
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        expandOnClick: false,
        dataLabels: {
          offset: 0,
          minAngleToShowLabel: 10
        },
        donut: {
          size: '55%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: 600,
              color: isDark ? '#ffffff' : '#00344E'
            },
            value: {
              show: true,
              fontSize: '18px',
              fontWeight: 700,
              color: isDark ? '#ffffff' : '#00344E'
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '14px',
              fontWeight: 600,
              color: isDark ? '#ffffff' : '#00344E'
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 320
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  return (
    <div className={getContainerStyles()}>
      <h3 className={`text-lg font-medium mb-3 ${getTitleStyles()}`}>
        {title}
      </h3>
      <div className="flex-grow flex items-center justify-center">
        <Chart
          type="pie"
          series={series}
          options={options}
          height={400}
          width="100%"
          variant={variant}
        />
      </div>
    </div>
  );
}
