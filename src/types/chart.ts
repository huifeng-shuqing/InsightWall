import type { EChartsOption } from 'echarts';

/**
 * BaseChart 通用 Props
 */
export interface BaseChartProps {
  option: EChartsOption;
  height?: number | string;
  className?: string;
  loading?: boolean;
  onChartReady?: (chart: unknown) => void;
}

/**
 * 图表系列样式配置
 */
export interface ChartSeriesStyle {
  lineColor?: string;
  areaColor?: string;
  barColor?: string;
}