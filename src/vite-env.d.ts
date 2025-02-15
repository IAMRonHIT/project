/// <reference types="vite/client" />

declare module 'react-apexcharts' {
  interface ReactApexChartProps {
    type: 'area' | 'bar' | 'line' | 'radialBar';
    series: any[];
    width?: string | number;
    height?: string | number;
    options?: any;
  }

  const ReactApexChart: React.FC<ReactApexChartProps>;
  export default ReactApexChart;
}