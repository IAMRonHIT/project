import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Chart } from './Chart';
import { useTheme } from '../hooks/useTheme';
import { luxuryEffects } from '../lib/themes';

export interface DataPoint {
  date: string;
  value: number;
  unit: string;
}

export interface ClinicalTrend {
  metric: string;
  values: DataPoint[];
  trend: 'UP' | 'DOWN' | 'STABLE';
  unit: string;
  normalRange?: {
    min: number;
    max: number;
  };
}

interface ClinicalTrendsProps {
  trends: ClinicalTrend[];
}

export const ClinicalTrends: React.FC<ClinicalTrendsProps> = ({ trends }) => {
  const [selectedMetric, setSelectedMetric] = useState<string>(trends[0]?.metric || '');
  const { theme } = useTheme();

  const selectedTrend = trends.find(t => t.metric === selectedMetric);

  interface ChartDataPoint {
    x: number;
    y: number;
  }

  interface ChartSeries {
    name: string;
    data: ChartDataPoint[];
  }

  const getChartData = (trend: ClinicalTrend): ChartSeries[] => {
    const mainSeries: ChartSeries = {
      name: trend.metric,
      data: trend.values.map(v => ({
        x: new Date(v.date).getTime(),
        y: v.value
      }))
    };

    const series: ChartSeries[] = [mainSeries];

    if (trend.normalRange) {
      const minSeries: ChartSeries = {
        name: 'Normal Range Min',
        data: trend.values.map(v => ({
          x: new Date(v.date).getTime(),
          y: trend.normalRange!.min
        }))
      };

      const maxSeries: ChartSeries = {
        name: 'Normal Range Max',
        data: trend.values.map(v => ({
          x: new Date(v.date).getTime(),
          y: trend.normalRange!.max
        }))
      };

      series.push(minSeries, maxSeries);
    }

    return series;
  };

  const chartOptions = {
    chart: {
      type: 'area' as const,
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1000,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 450
        }
      },
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 3,
        opacity: 0.2,
        color: theme === 'dark' ? '#00f2ea' : '#00d6d0'
      },
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: [3, 1, 1]
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: theme === 'dark' ? 0.45 : 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: theme === 'dark' ? '#00f2ea' : '#00d6d0',
            opacity: theme === 'dark' ? 0.45 : 0.35
          },
          {
            offset: 100,
            color: theme === 'dark' ? '#0ea5e9' : '#0891b2',
            opacity: 0.05
          }
        ]
      }
    },
    xaxis: {
      type: 'datetime' as const,
      labels: {
        style: {
          colors: theme === 'dark' ? '#B0C7D1' : '#1E293B'
        },
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM',
          day: 'dd',
          hour: 'HH:mm'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: theme === 'dark' ? '#B0C7D1' : '#1E293B'
        },
        formatter: (value: number) => `${value}${selectedTrend?.unit || ''}`
      }
    },
    tooltip: {
      theme: theme === 'dark' ? 'dark' : 'light',
      x: {
        format: 'MMM dd, yyyy'
      }
    },
    grid: {
      borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      strokeDashArray: 4
    }
  };

  const getTrendColor = (trend: 'UP' | 'DOWN' | 'STABLE') => {
    switch (trend) {
      case 'UP':
        return 'text-emerald-500 dark:text-emerald-400';
      case 'DOWN':
        return 'text-rose-500 dark:text-rose-400';
      case 'STABLE':
        return 'text-cyan-500 dark:text-cyan-400';
      default:
        return '';
    }
  };

  const getTrendIcon = (trend: 'UP' | 'DOWN' | 'STABLE') => {
    switch (trend) {
      case 'UP':
        return '↑';
      case 'DOWN':
        return '↓';
      case 'STABLE':
        return '→';
      default:
        return '';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
          Clinical Trends
        </h3>
        <motion.div
          variants={itemVariants}
          className="flex space-x-2"
        >
          {trends.map((trend) => (
            <motion.button
              key={trend.metric}
              onClick={() => setSelectedMetric(trend.metric)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium
                transition-all duration-300 transform-gpu
                ${selectedMetric === trend.metric
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : `${luxuryEffects.glassmorphism[theme === 'dark' ? 'dark' : 'light']} 
                     hover:${luxuryEffects.neonGlow.cyan}
                     hover:translate-y-[-2px]
                     hover:shadow-lg
                     ${theme === 'dark' ? 'hover:shadow-cyan-500/20' : 'hover:shadow-cyan-500/10'}`
                }
              `}
            >
              {trend.metric}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {selectedTrend && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`
            rounded-lg p-4
            ${luxuryEffects.glassmorphism[theme === 'dark' ? 'dark' : 'light']}
            ${luxuryEffects.neonGlow.cyan}
          `}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-medium bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                {selectedTrend.metric}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Latest: {selectedTrend.values[selectedTrend.values.length - 1].value}
                {selectedTrend.unit}
              </p>
            </div>
            <motion.div
              className={`flex items-center space-x-1 ${getTrendColor(selectedTrend.trend)}`}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-2xl font-bold">
                {getTrendIcon(selectedTrend.trend)}
              </span>
              <span className="text-sm font-medium">
                {selectedTrend.trend}
              </span>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="h-64 relative"
          >
            <div className={`
              absolute inset-0 pointer-events-none
              bg-gradient-to-b from-transparent
              ${theme === 'dark'
                ? 'to-cyan-500/10 via-cyan-500/5'
                : 'to-cyan-500/5 via-cyan-500/2'
              }
            `} />
            <Chart
              type="area"
              series={getChartData(selectedTrend)}
              options={chartOptions}
              height={256}
              variant={selectedTrend.trend === 'UP' ? 'lime' : selectedTrend.trend === 'DOWN' ? 'coral' : 'teal'}
            />
          </motion.div>

          {selectedTrend.normalRange && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <span>
                Normal Range: {selectedTrend.normalRange.min} - {selectedTrend.normalRange.max} {selectedTrend.unit}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
