import { useState, useEffect, useRef, useCallback } from 'react';
import { useDashboardStore } from '@/stores/dashboard.store';
import { formatCurrency, formatNumber, formatTrend } from '@/utils/format';

/* ================================================================
   ChartBlock — 安全加载 ECharts 的动态图表容器
   ================================================================ */
function ChartBlock({
  renderOption,
  height = 300,
}: {
  renderOption: () => unknown;
  height?: number;
}) {
  const domRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<{ setOption(o: unknown): void; dispose(): void; resize(): void } | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'err'>('loading');

  const init = useCallback(async () => {
    if (!domRef.current) return;
    try {
      const echarts = await import('echarts');
      if (!domRef.current) return;
      const inst = echarts.init(domRef.current);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      inst.setOption(renderOption() as any);
      chartRef.current = inst;
      setStatus('ok');
    } catch {
      setStatus('err');
    }
  }, [renderOption]);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    const h = () => chartRef.current?.resize();
    window.addEventListener('resize', h);
    return () => { window.removeEventListener('resize', h); chartRef.current?.dispose(); };
  }, []);

  if (status === 'err') return <div style={styles.chartErr}>图表加载失败</div>;
  return (
    <div style={{ position: 'relative', height, minHeight: height }}>
      {status === 'loading' && <div style={styles.chartLoading}>⏳ 加载图表...</div>}
      <div ref={domRef} style={{ width: '100%', height }} />
    </div>
  );
}

/* ================================================================
   MainLayout
   ================================================================ */
export default function MainLayout() {
  const { data, loading, fetchDashboard, lastUpdated } = useDashboardStore();
  const [now, setNow] = useState(new Date());

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const kpis = data?.kpis ?? [];
  const trend = data?.salesTrend ?? [];
  const ranking = data?.categoryRanking ?? [];
  const geo = data?.geoData ?? [];
  const cities = data?.cityRanking ?? [];

  // ECharts option builders — defined with useCallback to be stable
  const trendOption = useCallback(() => ({
    backgroundColor: 'transparent',
    color: ['#00d4ff', '#00ff88'],
    tooltip: { trigger: 'axis' as const },
    legend: { bottom: 0, textStyle: { color: '#8892b0', fontSize: 11 } },
    grid: { top: 10, right: 40, bottom: 30, left: 50 },
    xAxis: {
      type: 'category' as const,
      data: trend.slice(-14).map((d) => d.date.slice(5)),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#8892b0', fontSize: 10 },
    },
    yAxis: [
      {
        type: 'value' as const,
        name: '销售额',
        nameTextStyle: { color: '#8892b0', fontSize: 10 },
        axisLabel: { color: '#8892b0', fontSize: 10, formatter: (v: number) => (v / 10000).toFixed(0) + 'w' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
      },
    ],
    series: [
      {
        type: 'line' as const,
        name: '销售额',
        data: trend.slice(-14).map((d) => d.sales),
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { width: 2 },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(0,212,255,0.25)' }, { offset: 1, color: 'transparent' }] } },
      },
    ],
  }), [trend]);

  const barOption = useCallback(() => ({
    backgroundColor: 'transparent',
    color: ['#00d4ff'],
    tooltip: { trigger: 'axis' as const },
    grid: { top: 5, right: 20, bottom: 5, left: 80 },
    xAxis: { type: 'value' as const, axisLabel: { color: '#8892b0', fontSize: 10, formatter: (v: number) => (v / 10000).toFixed(0) + 'w' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } } },
    yAxis: { type: 'category' as const, data: ranking.map((r) => r.name).reverse(), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#e8eaed', fontSize: 11 } },
    series: [{
      type: 'bar' as const,
      data: ranking.map((r) => r.value).reverse(),
      barWidth: 14,
      itemStyle: { borderRadius: [0, 6, 6, 0], color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#00d4ff' }, { offset: 1, color: '#00ff88' }] } },
      label: { show: true, position: 'right' as const, color: '#8892b0', fontSize: 10, formatter: (p: { value: number }) => formatCurrency(p.value) },
    }],
  }), [ranking]);

  const pieOption = useCallback(() => ({
    backgroundColor: 'transparent',
    color: ['#00d4ff', '#00ff88', '#ffa502', '#ff4757', '#7c4dff', '#18ffff', '#ff6d00', '#76ff03'],
    tooltip: { trigger: 'item' as const, formatter: '{b}: {d}%' },
    series: [{
      type: 'pie' as const,
      radius: ['55%', '78%'],
      center: ['50%', '50%'],
      data: ranking.map((r) => ({ name: r.name, value: r.value })),
      label: { color: '#8892b0', fontSize: 10, formatter: '{b}\n{d}%' },
      itemStyle: { borderColor: '#0a0e27', borderWidth: 2 },
      emphasis: { label: { fontSize: 14, fontWeight: 'bold' } },
    }],
  }), [ranking]);

  return (
    <div style={styles.shell}>
      {/* ======== HEADER ======== */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoBox}>IW</div>
          <div>
            <h1 style={styles.title}>洞察之墙 <span style={styles.subtitle}>InsightWall</span></h1>
            <span style={styles.desc}>数据可视化大屏 · 实时监控驾驶舱</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 18, color: '#e8eaed', letterSpacing: 1 }}>
            {now.toLocaleString('zh-CN', { hour12: false })}
          </span>
          <span style={styles.mockBadge}>
            {loading ? '⏳ 加载中' : '🔶 模拟数据'}
          </span>
          {lastUpdated > 0 && (
            <span style={{ color: '#8892b0', fontSize: 11 }}>
              刷新 {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>
      </header>

      {/* ======== BODY ======== */}
      <div style={styles.body}>
        {/* KPI 行 */}
        <div style={styles.kpiRow}>
          {kpis.map((kpi, i) => {
            const colors = ['#00d4ff', '#00ff88', '#ffa502', '#7c4dff'];
            const icons = ['💰', '📦', '👤', '📈'];
            return (
              <div key={kpi.id} style={{ ...styles.kpiCard, borderTop: `3px solid ${colors[i]}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 28 }}>{icons[i]}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                    color: kpi.trendDirection === 'up' ? '#00ff88' : kpi.trendDirection === 'down' ? '#ff4757' : '#8892b0',
                    background: kpi.trendDirection === 'up' ? 'rgba(0,255,136,0.1)' : kpi.trendDirection === 'down' ? 'rgba(255,71,87,0.1)' : 'rgba(255,255,255,0.05)',
                  }}>
                    {formatTrend(kpi.trend)} {kpi.trendDirection === 'up' ? '↑' : '↓'}
                  </span>
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: '#8892b0' }}>{kpi.title}</div>
                <div style={{ marginTop: 4, fontFamily: 'monospace', fontSize: 26, fontWeight: 700, color: '#e8eaed' }}>
                  {kpi.unit === '%' ? kpi.value.toFixed(1) + '%' : formatCurrency(kpi.value)}
                </div>
              </div>
            );
          })}
        </div>

        {/* 第二行：趋势图 + 饼图 */}
        <div style={styles.row2}>
          <div style={{ ...styles.card, flex: 7 }}>
            <div style={styles.cardHead}>
              <span style={styles.cardDot} /> 销售趋势
            </div>
            <ChartBlock renderOption={trendOption} height={280} />
          </div>
          <div style={{ ...styles.card, flex: 5 }}>
            <div style={styles.cardHead}>
              <span style={styles.cardDot} /> 品类占比
            </div>
            <ChartBlock renderOption={pieOption} height={280} />
          </div>
        </div>

        {/* 第三行：排行柱状图 + 城市分布 */}
        <div style={styles.row3}>
          <div style={{ ...styles.card, flex: 6 }}>
            <div style={styles.cardHead}>
              <span style={styles.cardDot} /> 品类排行 Top 8
            </div>
            <ChartBlock renderOption={barOption} height={300} />
          </div>
          <div style={{ ...styles.card, flex: 6 }}>
            <div style={styles.cardHead}>
              <span style={styles.cardDot} /> 城市销售 Top 10
            </div>
            <div style={{ overflow: 'auto', maxHeight: 300 }}>
              {cities.map((c, i) => (
                <div key={c.name} style={styles.rankRow}>
                  <span style={{ ...styles.rankIdx, background: i < 3 ? ['#ffa502', '#c0c0c0', '#cd7f32'][i] : 'rgba(255,255,255,0.06)', color: i < 3 ? '#0a0e27' : '#8892b0' }}>{c.rank}</span>
                  <span style={{ flex: 2, color: '#e8eaed', fontSize: 13 }}>{c.name}</span>
                  <div style={{ flex: 3, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${c.percentage * 100}%`, background: 'linear-gradient(to right, #00d4ff, #00ff88)', borderRadius: 3 }} />
                  </div>
                  <span style={{ flex: 1, textAlign: 'right', fontSize: 12, color: '#e8eaed', fontFamily: 'monospace' }}>{formatCurrency(c.value)}</span>
                  <span style={{ width: 50, textAlign: 'right', fontSize: 11, color: c.trend === 'up' ? '#00ff88' : c.trend === 'down' ? '#ff4757' : '#8892b0' }}>
                    {formatTrend(c.change)} {c.trend === 'up' ? '↑' : '↓'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 第四行：省份分布 */}
        <div style={{ ...styles.card }}>
          <div style={styles.cardHead}>
            <span style={styles.cardDot} /> 全国省份销售分布
          </div>
          <div style={styles.geoGrid}>
            {geo.slice(0, 18).map((g) => (
              <div key={g.name} style={styles.geoItem}>
                <span style={{ color: '#e8eaed', fontSize: 12, width: 70 }}>{g.name}</span>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, margin: '0 8px' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (g.value / 5200) * 100)}%`, background: 'linear-gradient(to right, #0d3b66, #00d4ff)', borderRadius: 3 }} />
                </div>
                <span style={{ color: '#00d4ff', fontSize: 12, fontFamily: 'monospace', width: 60, textAlign: 'right' }}>{formatCurrency(g.value)}万</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   Styles
   ================================================================ */
const styles: Record<string, React.CSSProperties> = {
  shell: {
    width: '100vw', height: '100vh', overflow: 'hidden',
    background: 'radial-gradient(ellipse at 50% 0%, #0d1a3a 0%, #0a0e27 60%)',
    color: '#e8eaed', fontFamily: 'system-ui, -apple-system, sans-serif',
    display: 'flex', flexDirection: 'column',
  },

  // Header
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 32px', height: 64, flexShrink: 0,
    background: 'linear-gradient(180deg, rgba(10,14,39,1) 0%, rgba(10,14,39,0.4) 100%)',
    borderBottom: '1px solid rgba(0,212,255,0.12)',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  logoBox: {
    width: 40, height: 40, borderRadius: 10,
    background: 'linear-gradient(135deg, #00d4ff, #7c4dff)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, fontWeight: 900, color: '#fff', fontFamily: 'monospace',
  },
  title: { fontSize: 20, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: 2, fontFamily: 'monospace' },
  subtitle: { fontWeight: 400, color: '#8892b0', fontSize: 15, fontFamily: 'system-ui' },
  desc: { color: '#556', fontSize: 11 },
  mockBadge: {
    padding: '3px 14px', borderRadius: 12, fontSize: 12,
    background: 'rgba(255,165,2,0.12)', color: '#ffa502', border: '1px solid rgba(255,165,2,0.2)',
  },

  // Body
  body: {
    flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14,
  },

  // KPI
  kpiRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 },
  kpiCard: {
    background: 'rgba(20,26,50,0.8)', borderRadius: 12, padding: '18px 22px',
    border: '1px solid rgba(0,212,255,0.1)',
    backdropFilter: 'blur(10px)',
    transition: 'border-color 0.3s',
  },

  // Cards
  card: {
    background: 'rgba(20,26,50,0.7)', borderRadius: 12, padding: 16,
    border: '1px solid rgba(0,212,255,0.08)',
    backdropFilter: 'blur(10px)',
  },
  cardHead: { fontSize: 14, fontWeight: 600, color: '#e8eaed', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 },
  cardDot: { width: 8, height: 8, borderRadius: '50%', background: '#00d4ff', boxShadow: '0 0 8px #00d4ff' },

  // Rows
  row2: { display: 'flex', gap: 14 },
  row3: { display: 'flex', gap: 14 },

  // Chart placeholders
  chartErr: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#ff4757', fontSize: 13 },
  chartLoading: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8892b0', fontSize: 13, zIndex: 1 },

  // Ranking
  rankRow: { display: 'flex', alignItems: 'center', padding: '6px 0', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.03)' },
  rankIdx: { width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 },

  // Geo
  geoGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 },
  geoItem: { display: 'flex', alignItems: 'center', padding: '6px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.02)' },
};