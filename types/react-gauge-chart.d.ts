declare module 'react-gauge-chart' {
  import { Component } from 'react';

  interface GaugeChartProps {
    id?: string;
    nrOfLevels?: number;
    colors?: string[];
    arcWidth?: number;
    percent?: number;
    textColor?: string;
    animDelay?: number;
    animateDuration?: number;
    hideText?: boolean;
    formatTextValue?: (value: string) => string;
    style?: React.CSSProperties;
    arcsLength?: number[];
    cornerRadius?: number;
    marginsInPercent?: number;
    needleColor?: string;
    needleBaseColor?: string;
  }

  declare class GaugeChart extends Component<GaugeChartProps> {}
  export default GaugeChart;
}
