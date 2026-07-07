import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import BaseChart from '../BaseChart';
import { CHART_DEFAULTS } from '@/constants/chart-defaults';

interface PieChartProps {
  data: Array<{ name: string; value: number }>;
  height?: number | string;
}

export default function PieChart({ data, height }: PieChartProps) {
  const option = useMemo<EChartsOption>(() => ({
    ...CHART_DEFAULTS.pie,
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '45%'],
      data,
      label: { color: '#8892b0', fontSize: 11 },
      itemStyle: { borderColor: '#0a0e27', borderWidth: 2 },
      emphasis: { label: { fontSize: 16, fontWeight: 'bold' } },
    }],
  }), [data]);

  return <BaseChart option={option} height={height} />;
}