import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Chart } from '../Chart';
import { useTheme } from '../../hooks/useTheme';
import { MultiSelect } from './MultiSelect';

interface BarChartProps {
  title: string;
  categories: string[];
  series: { name: string; data: number[] }[];
  variant?: 'teal' | 'lavender' | 'lime' | 'coral';
}

type TimeUnit = 'week' | 'month' | 'quarter';

interface TimeData {
  [key: string]: number[];
}

const quarters: string[] = ['Q1', 'Q2', 'Q3', 'Q4'];
const months: string[] = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const weeks: string[] = Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);

export function BarChart({ title, categories, series, variant = 'teal' }: BarChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('month');
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Sample data structure with weekly, monthly, and quarterly data
  const mockData: Record<TimeUnit, TimeData> = {
    week: weeks.reduce((acc, week) => ({
      ...acc,
      [week]: [30 + Math.random() * 20, 20 + Math.random() * 15, 15 + Math.random() * 10, 10 + Math.random() * 5]
    }), {} as TimeData),
    month: months.reduce((acc, month, index) => ({
      ...acc,
      [month]: [30 + index, 20 + index, 15 + index, 10 + index]
    }), {} as TimeData),
    quarter: quarters.reduce((acc, quarter, index) => ({
      ...acc,
      [quarter]: [30 + index * 5, 20 + index * 5, 15 + index * 5, 10 + index * 5]
    }), {} as TimeData)
  };

  const getFilteredData = useMemo(() => {
    const mockSeries = [
      { name: 'Inpatient', data: [] as number[] },
      { name: 'Outpatient', data: [] as number[] },
      { name: 'Homecare', data: [] as number[], color: 'lime' },
      { name: 'DME', data: [] as number[], color: 'coral' }
    ];

    if (selectedPeriods.length === 0) {
      return {
        series: mockSeries,
        categories: []
      };
    }

    selectedPeriods.forEach(period => {
      const periodData = mockData[timeUnit][period];
      mockSeries.forEach((series, index) => {
        series.data.push(periodData[index]);
      });
    });

    return {
      series: mockSeries,
      categories: selectedPeriods
    };
  }, [timeUnit, selectedPeriods]);

  const options = {
    chart: {
      stacked: false,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 6,
        columnWidth: '55%',
        distributed: false,
        rangeBarOverlap: true
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: getFilteredData.categories,
      labels: {
        style: {
          colors: isDark ? '#ffffff99' : '#00344E99',
          fontSize: '12px'
        },
        rotate: -45,
        trim: true
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? '#ffffff99' : '#00344E99'
        }
      }
    },
    grid: {
      show: true,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      strokeDashArray: 4,
      position: 'back',
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '10px',
      itemMargin: {
        horizontal: 4,
        vertical: 2
      },
      markers: {
        radius: 6,
        width: 6,
        height: 6
      },
      labels: {
        colors: isDark ? '#ffffff' : '#00344E'
      }
    }
  };

  const getButtonStyles = (isActive: boolean = false) => {
    const baseStyles = 'px-3 py-1.5 text-sm rounded-md transition-all duration-200';
    const activeStyles = isDark 
      ? 'bg-ron-teal-400/20 text-ron-teal-200'
      : 'bg-ron-teal-100 text-ron-teal-700';
    const inactiveStyles = isDark
      ? 'text-gray-400 hover:bg-ron-teal-400/10'
      : 'text-gray-600 hover:bg-ron-teal-50';
    
    return `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`;
  };

  const getFilterPanelStyles = () => {
    return `
      absolute right-0 mt-2 p-4 rounded-lg shadow-lg z-50 w-[300px]
      ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
    `;
  };

  const handleTimeUnitChange = (unit: TimeUnit) => {
    setTimeUnit(unit);
    setSelectedPeriods([]);
  };

  const getTimeOptions = () => {
    switch (timeUnit) {
      case 'week':
        return weeks;
      case 'quarter':
        return quarters;
      case 'month':
      default:
        return months;
    }
  };

  return (
    <div className={getContainerStyles()}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-lg font-medium ${getTitleStyles()}`}>
          {title}
        </h3>
        <div className="relative" ref={filterRef}>
          <button
            className={getButtonStyles(isFilterOpen)}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
              {selectedPeriods.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-ron-teal-400/20 text-ron-teal-200">
                  {selectedPeriods.length}
                </span>
              )}
            </div>
          </button>

          {isFilterOpen && (
            <div className={getFilterPanelStyles()}>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <button
                    className={getButtonStyles(timeUnit === 'week')}
                    onClick={() => handleTimeUnitChange('week')}
                  >
                    Weekly
                  </button>
                  <button
                    className={getButtonStyles(timeUnit === 'month')}
                    onClick={() => handleTimeUnitChange('month')}
                  >
                    Monthly
                  </button>
                  <button
                    className={getButtonStyles(timeUnit === 'quarter')}
                    onClick={() => handleTimeUnitChange('quarter')}
                  >
                    Quarterly
                  </button>
                </div>

                <MultiSelect
                  options={getTimeOptions()}
                  selected={selectedPeriods}
                  onChange={setSelectedPeriods}
                  placeholder={`Select ${timeUnit}s`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Chart
        type="bar"
        series={getFilteredData.series}
        options={options}
        height={350}
        variant={variant}
      />
    </div>
  );
}
