declare module 'react-apexcharts' {
  import { Component } from 'react';
  
  export interface ApexOptions {
    chart?: {
      type?: string;
      height?: number;
      width?: number;
      animations?: {
        enabled?: boolean;
        easing?: string;
        speed?: number;
        animateGradually?: {
          enabled?: boolean;
          delay?: number;
        };
      };
      toolbar?: {
        show?: boolean;
      };
      zoom?: {
        enabled?: boolean;
      };
      background?: string;
    };
    stroke?: {
      curve?: string;
      width?: number | number[];
    };
    fill?: {
      type?: string;
      gradient?: {
        shadeIntensity?: number;
        opacityFrom?: number;
        opacityTo?: number;
        stops?: number[];
      };
    };
    xaxis?: {
      type?: 'datetime' | 'category' | 'numeric';
      labels?: {
        style?: {
          colors?: string | string[];
        };
        datetimeFormatter?: {
          year?: string;
          month?: string;
          day?: string;
          hour?: string;
        };
      };
    };
    yaxis?: {
      labels?: {
        style?: {
          colors?: string | string[];
        };
        formatter?: (value: number) => string;
      };
    };
    tooltip?: {
      theme?: 'light' | 'dark';
      x?: {
        format?: string;
      };
    };
    grid?: {
      borderColor?: string;
      strokeDashArray?: number;
    };
  }

  export interface Props {
    type?: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'scatter' | 'bubble' | 'heatmap' | 'radialBar' | 'radar';
    series: any[];
    width?: string | number;
    height?: string | number;
    options?: ApexOptions;
    [key: string]: any;
  }

  export default class ReactApexChart extends Component<Props> {}
}
