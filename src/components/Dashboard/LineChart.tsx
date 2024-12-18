import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

interface DataPoint {
  x: string;
  y: number;
}

interface LineChartProps {
  data: {
    requests: DataPoint[];
    decisions: DataPoint[];
  };
  height?: number;
}

export function LineChart({ data, height = 350 }: LineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const options = {
        chart: {
          type: 'area',
          height: height,
          toolbar: {
            show: false
          },
          background: 'transparent',
          dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 3,
            opacity: 0.5,
            color: ['#00F0FF', '#98FF98']
          }
        },
        stroke: {
          curve: 'smooth',
          width: 4,
          lineCap: 'round',
          colors: ['#00F0FF', '#98FF98']
        },
        colors: ['#00F0FF', '#98FF98'],
        dataLabels: {
          enabled: false
        },
        series: [
          {
            name: 'Authorization Requests',
            data: data.requests.map(point => ({ x: point.x, y: point.y }))
          },
          {
            name: 'Timely Decisions',
            data: data.decisions.map(point => ({ x: point.x, y: point.y }))
          }
        ],
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.3,
            opacityTo: 0.1,
            stops: [0, 100],
            colorStops: [
              [
                {
                  offset: 0,
                  color: '#00F0FF',
                  opacity: 0.3
                },
                {
                  offset: 100,
                  color: '#00F0FF',
                  opacity: 0.1
                }
              ],
              [
                {
                  offset: 0,
                  color: '#98FF98',
                  opacity: 0.3
                },
                {
                  offset: 100,
                  color: '#98FF98',
                  opacity: 0.1
                }
              ]
            ]
          }
        },
        grid: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          strokeDashArray: 4,
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          }
        },
        xaxis: {
          type: 'category',
          labels: {
            style: {
              colors: 'rgba(255, 255, 255, 0.6)'
            }
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
              colors: 'rgba(255, 255, 255, 0.6)'
            }
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          labels: {
            colors: 'rgba(255, 255, 255, 0.6)'
          }
        },
        tooltip: {
          theme: 'dark',
          x: {
            show: true
          }
        }
      };

      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, [data, height]);

  return <div ref={chartRef} />;
}
