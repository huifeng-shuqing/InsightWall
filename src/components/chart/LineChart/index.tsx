import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import BaseChart from '../BaseChart';
import { CHART_DEFAULTS } from '@/constants/chart-defaults';
import { DASHBOARD_COLORS } from '@/constants/theme';

interface LineChartProps {
  xData: string[];
  series: Array<{ name: string; data: number[]; color?: string }>;
  height?: number | string;
}

export default function LineChart({ xData, series, height }: LineChartProps) {
  const option = useMemo<EChartsOption>(() => ({
    ...CHART_DEFAULTS.line,
    xAxis: { ...CHART_DEFAULTS.line!.xAxis, data: xData },
    series: series.map((s, i) => ({
      type: 'line',
      name: s.name,
      data: s.data,
      smooth: true,
      symbol: 'none',
      lineStyle: { color: s.color ?? [DASHBOARD_COLORS.accent, DASHBOARD_COLORS.success][i], width: 2 },
      areaStyle: { color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: `${s.color ?? DASHBOARD_COLORS.accent}30` },
          { offset: 1, color: 'transparent' },
        ],
      }},
    })),
  }), [xData, series]);

  return <BaseChart option={option} height={height} />;
}