import { useRef, useEffect, useState } from 'react';
import type { BaseChartProps } from '@/types/chart';

export default function BaseChart({ option, height = '100%', className = '', loading = false }: BaseChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<{ setOption: (o: unknown) => void; dispose: () => void; showLoading: () => void; hideLoading: () => void; resize: () => void } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || error) return;

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let chart: any = null;

    import('echarts')
      .then((echarts) => {
        if (cancelled || !containerRef.current) return;
        chart = echarts.init(containerRef.current);
        chart.setOption(option);
        chartRef.current = chart;
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
      if (chart) {
        try { chart.dispose(); } catch { /* ignore */ }
      }
    };
  }, [option, error]);

  useEffect(() => {
    const handleResize = () => {
      try { chartRef.current?.resize(); } catch { /* ignore */ }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    try {
      if (loading) chartRef.current?.showLoading();
      else chartRef.current?.hideLoading();
    } catch { /* ignore */ }
  }, [loading]);

  if (error) {
    return <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height, color: '#8892b0', fontSize: 13 }}>图表加载失败</div>;
  }

  return <div ref={containerRef} className={className} style={{ height, width: '100%' }} />;
}