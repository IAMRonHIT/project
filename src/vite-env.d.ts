/// <reference types="vite/client" />

// No need to redefine ImportMeta - it's defined by Vite
// interface ImportMeta {
//   readonly env: Record<string, any>;
// }

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