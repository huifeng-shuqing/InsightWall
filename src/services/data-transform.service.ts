import type { EChartsOption } from 'echarts';
import type { TrendPoint } from '@/types/dashboard';
import { CHART_DEFAULTS } from '@/constants/chart-defaults';

/** 销售趋势 → ECharts line option */
export function transformSalesToChartOption(data: TrendPoint[]): EChartsOption {
  return {
    ...CHART_DEFAULTS.line,
    xAxis: { ...CHART_DEFAULTS.line!.xAxis, data: data.map((d) => d.date.slice(5)) },
    series: [
      { type: 'line', name: '销售额', data: data.map((d) => d.sales), smooth: true },
      { type: 'line', name: '订单量', data: data.map((d) => d.orders), smooth: true },
    ],
  };
}