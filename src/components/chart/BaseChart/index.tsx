import { useRef, useEffect, useCallback } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import type { BaseChartProps } from '@/types/chart';
import { logger } from '@/logger';

export default function BaseChart({ option, height = '100%', className = '', loading = false, onChartReady }: BaseChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  const initChart = useCallback(() => {
    if (!containerRef.current) return;
    const chart = echarts.init(containerRef.current);
    chart.setOption(option);
    chartRef.current = chart;
    onChartReady?.(chart);
    logger.perf('chart-init', 0);
  }, [option, onChartReady]);

  useEffect(() => {
    if (!chartRef.current) { initChart(); return; }
    chartRef.current.setOption(option, { notMerge: true });
  }, [option, initChart]);

  useEffect(() => {
    const handleResize = () => chartRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    loading ? chartRef.current?.showLoading() : chartRef.current?.hideLoading();
  }, [loading]);

  return <div ref={containerRef} className={className} style={{ height, width: '100%' }} />;
}