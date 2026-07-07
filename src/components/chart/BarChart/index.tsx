import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import BaseChart from '../BaseChart';
import { CHART_DEFAULTS } from '@/constants/chart-defaults';

interface BarChartProps {
  yData: string[];
  data: number[];
  height?: number | string;
  horizontal?: boolean;
}

export default function BarChart({ yData, data, height, horizontal = true }: BarChartProps) {
  const option = useMemo<EChartsOption>(() => ({
    ...CHART_DEFAULTS.bar,
    ...(horizontal
      ? { yAxis: { type: 'category', data: yData, axisLabel: { color: '#8892b0', fontSize: 11 }, axisLine: { show: false }, axisTick: { show: false } },
          xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }, axisLabel: { color: '#8892b0', fontSize: 11 } }}
      : { xAxis: { type: 'category', data: yData, axisLabel: { color: '#8892b0', fontSize: 11 } },
          yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }, axisLabel: { color: '#8892b0', fontSize: 11 } }}
    ),
    series: [{ type: 'bar', data: data, barWidth: 16, itemStyle: { borderRadius: [0, 4, 4, 0], color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#00d4ff' }, { offset: 1, color: '#00ff88' }] } } }],
  }), [yData, data, horizontal]);

  return <BaseChart option={option} height={height} />;
}