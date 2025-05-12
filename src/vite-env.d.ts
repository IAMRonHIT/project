/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_GEMINI_API_BASE_URL: string;
  readonly VITE_FDA_API_KEY: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_PUBMED_API_KEY: string;
  readonly VITE_PERPLEXITY_API_KEY: string; // Added Perplexity API Key
  [key: string]: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

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
