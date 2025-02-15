import React from 'react';
import { useTheme } from '../hooks/useTheme';
// @ts-ignore
import ReactApexChart from 'react-apexcharts';

export interface ChartProps {
  type: 'area' | 'bar' | 'line' | 'radialBar' | 'donut' | 'radar' | 'pie';
  series: any[];
  options: any;
  height?: number;
  variant?: 'teal' | 'lavender' | 'lime' | 'coral';
}

export const Chart = React.forwardRef<HTMLDivElement, ChartProps>(({ 
  type, 
  series, 
  options, 
  height = 160, 
  variant = 'teal' 
}, ref) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Enhanced color mappings with more electric colors
  const colorMap: {
    [K in 'teal' | 'lavender' | 'lime' | 'coral']: {
      base: string;
      fill: string;
      glow: string;
      gradient: string;
      gradientLight: string;
    };
  } = {
    teal: {
      base: isDark ? '#00f2ea' : '#00d6d0',
      fill: isDark ? 'rgba(0, 242, 234, 0.3)' : 'rgba(0, 214, 208, 0.3)',
      glow: isDark ? 'rgba(0, 242, 234, 0.8)' : 'rgba(0, 214, 208, 0.8)',
      gradient: isDark ? '#00f2ea' : '#00d6d0',
      gradientLight: isDark ? '#4dfff8' : '#20e8e2'
    },
    lavender: {
      base: isDark ? '#c4b5fd' : '#a78bfa',
      fill: isDark ? 'rgba(196, 181, 253, 0.3)' : 'rgba(167, 139, 250, 0.3)',
      glow: isDark ? 'rgba(196, 181, 253, 0.8)' : 'rgba(167, 139, 250, 0.8)',
      gradient: isDark ? '#c4b5fd' : '#a78bfa',
      gradientLight: isDark ? '#b3a3e6' : '#9579e1'
    },
    lime: {
      base: isDark ? '#a3e635' : '#84cc16',
      fill: isDark ? 'rgba(163, 230, 53, 0.3)' : 'rgba(132, 204, 22, 0.3)',
      glow: isDark ? 'rgba(163, 230, 53, 0.8)' : 'rgba(132, 204, 22, 0.8)',
      gradient: isDark ? '#a3e635' : '#84cc16',
      gradientLight: isDark ? '#92cf2f' : '#75b514'
    },
    coral: {
      base: isDark ? '#ff6b9d' : '#ff4d8c',
      fill: isDark ? 'rgba(255, 107, 157, 0.3)' : 'rgba(255, 77, 140, 0.3)',
      glow: isDark ? 'rgba(255, 107, 157, 0.8)' : 'rgba(255, 77, 140, 0.8)',
      gradient: isDark ? '#ff6b9d' : '#ff4d8c',
      gradientLight: isDark ? '#ff8fb5' : '#ff70a3'
    }
  };

  // Colors with gradients
  const allChartColors = isDark 
    ? ['#00f2ea', '#c4b5fd', '#a3e635', '#ff6b9d']
    : ['#00d6d0', '#a78bfa', '#84cc16', '#ff4d8c'];

  const barChartColors = isDark
    ? ['#00f2ea', '#c4b5fd']
    : ['#00d6d0', '#a78bfa'];

  const radarColors = type === 'radar' && Array.isArray(series) && series.length > 1
    ? [colorMap.lavender.base, colorMap.teal.base]  // Use teal for Target series
    : [colorMap.lavender.base];

  const colors = type === 'bar' ? barChartColors :
                (type === 'donut' || type === 'pie') ? allChartColors :
                type === 'radar' ? radarColors :
                [colorMap[variant].base];

  const getGlowConfig = () => {
    const baseConfig = {
      enabled: true,
      enabledOnSeries: undefined as undefined | number[],
      top: 3,
      left: 3,
      blur: 15,
      opacity: 0.8,
      color: isDark ? '#ffffff' : '#000000'
    };

    if (type === 'pie') {
      return {
        ...baseConfig,
        blur: 12,
        opacity: 0.9,
        color: isDark ? '#00f2ea' : '#00d6d0'
      };
    } else if (type === 'bar') {
      return {
        ...baseConfig,
        blur: 15,
        opacity: 0.7,
        color: colorMap[variant].glow
      };
    } else if (type === 'radar') {
      return {
        ...baseConfig,
        blur: 25,
        opacity: 0.8,
        color: Array.isArray(series) && series.length > 1 ? colorMap.teal.glow : colorMap.lavender.glow
      };
    }
    return baseConfig;
  };

  const defaultOptions: any = {
    chart: {
      type,
      toolbar: { show: false },
      zoom: { enabled: false },
      background: 'transparent',
      foreColor: isDark ? '#fff' : '#1a2b4b',
      dropShadow: getGlowConfig(),
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    theme: {
      mode: isDark ? 'dark' : 'light' as const
    },
    colors: colors,
    grid: {
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(26, 43, 75, 0.2)',
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    },
    stroke: {
      curve: 'smooth',
      width: type === 'pie' ? 3 :
              type === 'radar' ? Array.isArray(series) && series.length > 1 ? [3, 4] : 3 :
              type === 'bar' ? 2 :
              2,
      colors: type === 'bar' ? undefined : 
              type === 'pie' ? allChartColors.map(color => color + 'FF') :
              colors,
      lineCap: 'round'
    },
    fill: {
      type: (type === 'bar' || type === 'pie') ? 'gradient' : 'solid',
      opacity: type === 'pie' ? [0.85, 0.85, 0.85, 0.85] :
              type === 'bar' ? 0.85 :
              type === 'radar' ? Array.isArray(series) && series.length > 1 ? [0.2, 0.3] : 0.2 :
              0.15,
      gradient: {
        enabled: type === 'bar' || type === 'pie',
        shade: 'light',
        type: type === 'pie' ? 'vertical' : 'vertical',
        shadeIntensity: type === 'pie' ? 0.5 : 0.5,
        gradientToColors: type === 'bar' ? 
          [colorMap.teal.gradientLight, colorMap.lavender.gradientLight] :
          type === 'pie' ?
          allChartColors.map(color => color + '99') :
          undefined,
        inverseColors: false,
        opacityFrom: 0.95,
        opacityTo: 0.55,
        stops: [0, 100]
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '45%',
        borderRadius: 8,
        dataLabels: {
          position: 'top'
        },
        colors: {
          backgroundBarColors: isDark ? ['rgba(255, 255, 255, 0.1)'] : ['rgba(0, 0, 0, 0.1)'],
          backgroundBarRadius: 8
        }
      },
      pie: {
        startAngle: -25,
        endAngle: 335,
        expandOnClick: false,
        customScale: 0.82,
        offsetX: 0,
        offsetY: 0,
        dataLabels: {
          offset: 30,
          minAngleToShowLabel: 20
        },
        donut: {
          size: '55%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              color: isDark ? '#ffffff' : '#00344E',
              offsetY: -10
            },
            value: {
              show: true,
              fontSize: '16px',
              color: isDark ? '#ffffff' : '#00344E',
              offsetY: 5
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              color: isDark ? '#ffffff' : '#00344E'
            }
          }
        }
      },
      radar: {
        size: 140,
        polygons: {
          strokeColors: isDark ? 'rgba(196, 181, 253, 0.3)' : 'rgba(167, 139, 250, 0.3)',
          fill: {
            colors: ['transparent']
          }
        }
      }
    },
    dataLabels: {
      enabled: false,
      style: {
        fontSize: '14px',
        fontFamily: 'inherit',
        colors: [isDark ? '#ffffff' : '#00344E']
      },
      background: {
        enabled: true,
        foreColor: isDark ? '#ffffff' : '#00344E',
        padding: 4,
        borderRadius: 4,
        borderWidth: 0,
        opacity: 0.9
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',
      labels: {
        colors: isDark ? '#ffffff' : '#00344E'
      },
      markers: {
        width: 12,
        height: 12,
        strokeWidth: 0,
        strokeColor: '#fff',
        radius: 12,
        offsetX: -3
      },
      itemMargin: {
        horizontal: 15
      }
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'inherit'
      }
    },
    states: {
      hover: {
        filter: {
          type: 'none'
        }
      },
      active: {
        filter: {
          type: 'none'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px'
        },
        maxWidth: 150
      }
    }
  };

  const mergedOptions: any = {
    ...defaultOptions,
    ...options,
    chart: { ...defaultOptions.chart, ...options.chart },
    stroke: { ...defaultOptions.stroke, ...options.stroke },
    fill: { ...defaultOptions.fill, ...options.fill },
    plotOptions: { ...defaultOptions.plotOptions, ...options.plotOptions },
    legend: { ...defaultOptions.legend, ...options.legend },
    tooltip: { ...defaultOptions.tooltip, ...options.tooltip },
    yaxis: { ...defaultOptions.yaxis, ...options.yaxis }
  };

  console.log('Chart props:', { type, series, options: mergedOptions, height });

  return (
    <div ref={ref} className="w-full h-full">
      <ReactApexChart
        type={type}
        series={series}
        options={mergedOptions}
        height={height}
      />
    </div>
  );
});

Chart.displayName = 'Chart';
