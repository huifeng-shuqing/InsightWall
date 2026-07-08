import { useState, useEffect, useRef } from 'react';
import { useDashboardStore } from '@/stores/dashboard.store';
import { formatCurrency } from '@/utils/format';

/* ========== ECharts 面板 ========== */
function ChartPanel({ option, style }: { option: Record<string, unknown>; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<{ setOption: (o: unknown) => void; dispose: () => void; resize: () => void } | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    let c: { setOption: (o: unknown) => void; dispose: () => void; resize: () => void } | null = null;
    let cancelled = false;
    import('echarts').then((e) => {
      if (cancelled || !ref.current) return;
      c = e.init(ref.current);
      c.setOption(option);
      chartRef.current = c;
    }).catch(() => {});
    return () => { cancelled = true; c?.dispose(); };
  }, [option]);
  useEffect(() => {
    const h = () => chartRef.current?.resize();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return <div ref={ref} style={{ width: '100%', height: '100%', ...style }} />;
}

/* ========== Option 构建函数 ========== */
function buildLineOption(trend: Array<{ date: string; sales: number; orders: number }>) {
  return {
    backgroundColor: 'transparent',
    grid: { top: 20, right: 40, bottom: 25, left: 55 },
    tooltip: { trigger: 'axis' as const },
    legend: { data: ['销售额', '订单数'], textStyle: { color: '#8892b0', fontSize: 10 }, top: 0, right: 0 },
    xAxis: { type: 'category' as const, data: trend.map((d) => d.date), axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, axisLabel: { color: '#8892b0', fontSize: 9, interval: 3 } },
    yAxis: [
      { type: 'value' as const, name: '销售额', nameTextStyle: { color: '#8892b0', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } }, axisLabel: { color: '#8892b0', fontSize: 9, formatter: (v: unknown) => (Number(v) / 10000).toFixed(0) + '万' } },
      { type: 'value' as const, name: '订单数', nameTextStyle: { color: '#8892b0', fontSize: 10 }, splitLine: { show: false }, axisLabel: { color: '#8892b0', fontSize: 9 } },
    ],
    series: [
      { name: '销售额', type: 'line' as const, yAxisIndex: 0, data: trend.map((d) => d.sales), smooth: true, symbol: 'none', lineStyle: { color: '#00d4ff', width: 2 }, areaStyle: { color: { type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(0,212,255,0.25)' }, { offset: 1, color: 'transparent' }] } } },
      { name: '订单数', type: 'line' as const, yAxisIndex: 1, data: trend.map((d) => d.orders), smooth: true, symbol: 'none', lineStyle: { color: '#ffa502', width: 2 }, areaStyle: { color: { type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(255,165,2,0.2)' }, { offset: 1, color: 'transparent' }] } } },
    ],
  };
}

function buildBarOption(ranking: Array<{ name: string; value: number }>) {
  const names = [...ranking].reverse().map((d) => d.name);
  const values = [...ranking].reverse().map((d) => d.value);
  return {
    backgroundColor: 'transparent',
    grid: { top: 5, right: 50, bottom: 10, left: 70 },
    tooltip: { trigger: 'axis' as const },
    xAxis: { type: 'value' as const, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } }, axisLabel: { color: '#8892b0', fontSize: 9 } },
    yAxis: { type: 'category' as const, data: names, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#e0e6ed', fontSize: 10 } },
    series: [{ type: 'bar' as const, data: values, barWidth: 12, itemStyle: { borderRadius: [0, 6, 6, 0], color: { type: 'linear' as const, x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#00d4ff' }, { offset: 1, color: '#00ff88' }] } }, label: { show: true, position: 'right' as const, color: '#8892b0', fontSize: 9 } }],
  };
}

function buildPieOption(dist: Array<{ name: string; value: number }>) {
  const colors = ['#00d4ff', '#00ff88', '#ffa502', '#ff4757'];
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' as const },
    legend: { orient: 'vertical' as const, right: 5, top: 'center', textStyle: { color: '#8892b0', fontSize: 10 }, itemWidth: 8, itemHeight: 8 },
    series: [{ type: 'pie' as const, radius: ['55%', '75%'], center: ['40%', '50%'], data: dist.map((d, i) => ({ ...d, itemStyle: { color: colors[i] } })), label: { show: false }, emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' as const }, scaleSize: 8 } }],
  };
}

function buildRadarOption(radar: Array<{ name: string; value: number }>) {
  return {
    backgroundColor: 'transparent',
    radar: { center: ['50%', '55%'], radius: '65%', indicator: radar.map((d) => ({ name: d.name, max: 100 })), axisName: { color: '#8892b0', fontSize: 9 }, splitArea: { areaStyle: { color: ['rgba(0,212,255,0.02)', 'rgba(0,212,255,0.04)'] } }, splitLine: { lineStyle: { color: 'rgba(0,212,255,0.15)' } }, axisLine: { lineStyle: { color: 'rgba(0,212,255,0.15)' } } },
    series: [{ type: 'radar' as const, data: [{ value: radar.map((d) => d.value), name: '运营能力' }], symbol: 'circle', symbolSize: 4, lineStyle: { color: '#00d4ff', width: 2 }, areaStyle: { color: 'rgba(0,212,255,0.15)' }, itemStyle: { color: '#00d4ff' } }],
  };
}

function buildTopoOption(nodes: Array<{ name: string; category: number; symbolSize: number }>, links: Array<{ source: string; target: string }>) {
  return {
    backgroundColor: 'transparent', tooltip: {},
    series: [{ type: 'graph' as const, layout: 'none' as const, roam: true, data: nodes.map((n) => ({ ...n, itemStyle: { color: n.category === 0 ? '#ffa502' : '#00d4ff', shadowBlur: n.category === 0 ? 20 : 10, shadowColor: n.category === 0 ? 'rgba(255,165,2,0.6)' : 'rgba(0,212,255,0.4)' } })), links: links.map((l) => ({ ...l, lineStyle: { color: 'rgba(0,212,255,0.3)', curveness: 0.1 } })), label: { show: true, color: '#e0e6ed', fontSize: 9, position: 'bottom' as const }, emphasis: { focus: 'adjacency' as const, lineStyle: { width: 3 } } }],
  };
}

/* ========== 动态日志面板 — 滚一次即停 ========== */
function LogPanel({ items }: { items: Array<{ time: string; type: string; content: string }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;
    const el = ref.current;
    if (!el) return;
    const onEnd = () => setDone(true);
    el.addEventListener('animationend', onEnd, { once: true });
    return () => el.removeEventListener('animationend', onEnd);
  }, [items]);

  const doubled = [...items, ...items];
  const logPanelStyle: React.CSSProperties = {
    background: 'rgba(10,16,40,0.9)', border: '1px solid rgba(0,212,255,0.15)',
    borderRadius: 8, flexShrink: 0, height: 48, overflow: 'hidden',
    display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0 14px',
  };
  return (
    <div style={logPanelStyle}>
      <span style={{ color: '#00d4ff', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, marginRight: 12 }}>📡 实时动态</span>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div
          ref={ref}
          className={done ? 'log-done' : 'log-anim'}
          style={{
            display: 'flex', gap: 40, whiteSpace: 'nowrap',
            ...(done ? { transform: 'none' } : {}),
          }}
        >
          {doubled.map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, flexShrink: 0 }}>
              <span style={{ color: item.type === 'error' ? '#ff4757' : item.type === 'warning' ? '#ffa502' : item.type === 'success' ? '#00ff88' : '#8892b0', fontWeight: 600 }}>{item.time}</span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: item.type === 'error' ? '#ff4757' : item.type === 'warning' ? '#ffa502' : item.type === 'success' ? '#00ff88' : '#00d4ff' }} />
              <span style={{ color: '#c0c8d8' }}>{item.content}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ========== 主组件 ========== */
export default function MainLayout() {
  const { data, loading, fetchDashboard } = useDashboardStore();
  const [now, setNow] = useState(new Date());

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // 始终渲染，不提前 return
  const kpis = data?.kpis ?? [];
  const salesTrend = data?.salesTrend ?? [];
  const cityRanking = data?.cityRanking ?? [];
  const categoryDistribution = data?.categoryDistribution ?? [];
  const radarD = data?.radarData ?? [];
  const topoNodes = data?.topologyNodes ?? [];
  const topoLinks = data?.topologyLinks ?? [];
  const activityLog = data?.activityLog ?? [];
  const hasData = !!data;

  const pageStyle: React.CSSProperties = {
    width: '100vw', height: '100vh', overflow: 'hidden',
    background: '#080c24', color: '#e0e6ed',
    fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif', position: 'relative',
  };
  const panelStyle: React.CSSProperties = {
    background: 'rgba(10,16,40,0.9)', border: '1px solid rgba(0,212,255,0.15)',
    borderRadius: 8, padding: '10px 14px', display: 'flex', flexDirection: 'column',
  };
  const kpiCard: React.CSSProperties = {
    background: 'rgba(10,16,40,0.9)', border: '1px solid rgba(0,212,255,0.12)',
    borderRadius: 8, padding: '14px 18px', position: 'relative', overflow: 'hidden',
  };

  return (
    <div style={pageStyle}>
      {/* 背景 */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 30%, rgba(0,212,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,255,136,0.04) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '0 20px 12px' }}>
        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', height: 52, flexShrink: 0, borderBottom: '1px solid rgba(0,212,255,0.08)', marginBottom: 10 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#00d4ff', margin: 0, letterSpacing: 3, fontFamily: 'monospace' }}>
              洞察之墙 <span style={{ fontWeight: 400, color: '#8892b0', fontSize: 14, letterSpacing: 1 }}>InsightWall</span>
            </h1>
            <span style={{ color: '#556', fontSize: 10, background: 'rgba(0,212,255,0.08)', padding: '2px 10px', borderRadius: 10 }}>
              教学型开源项目 React + TypeScript + ECharts
            </span>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 15, color: '#e0e6ed', letterSpacing: 1 }}>
            {now.toLocaleString('zh-CN', { hour12: false })}
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <span style={{ padding: '3px 12px', borderRadius: 10, fontSize: 11, background: 'rgba(255,165,2,0.12)', color: '#ffa502', letterSpacing: 1 }}>
              🔶 MOCK DATA VISUALIZATION DASHBOARD
            </span>
          </div>
        </header>

        {/* 加载中覆盖层 */}
        {!hasData && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8892b0', fontSize: 18 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
              <div>数据加载中...</div>
            </div>
          </div>
        )}

        {/* 数据内容 — data 为 null 时用空数组不会崩溃 */}
        <div style={{ display: hasData ? 'flex' : 'none', flexDirection: 'column', flex: 1, gap: 10 }}>
          {/* Row 1: KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, flexShrink: 0 }}>
            {kpis.map((kpi, i) => (
              <div key={kpi.id} style={{ ...kpiCard, animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}>
                <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>{kpi.icon === 'sales' ? '💰' : kpi.icon === 'orders' ? '📦' : kpi.icon === 'customer' ? '👤' : '📊'}</span>
                    <span style={{ color: '#8892b0', fontSize: 12 }}>{kpi.title}</span>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 30, fontWeight: 700, color: '#e0e6ed' }}>
                    {kpi.unit === '%' ? kpi.value.toFixed(1) + '%' : formatCurrency(kpi.value)}
                    {kpi.unit !== '%' && <span style={{ fontSize: 13, color: '#8892b0', marginLeft: 4, fontWeight: 400 }}>{kpi.unit}</span>}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: kpi.trendDirection === 'up' ? '#00ff88' : kpi.trendDirection === 'down' ? '#ff4757' : '#8892b0' }}>
                    {kpi.trendDirection === 'up' ? '↑' : kpi.trendDirection === 'down' ? '↓' : '→'} {Math.abs(kpi.trend)}% 较昨日
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: 3列 */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', gap: 12, flex: 3, minHeight: 0 }}>
            <div style={panelStyle}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#00d4ff', marginBottom: 6 }}>📈 实时销售趋势 Trend</div>
              <div style={{ flex: 1, minHeight: 0 }}>{hasData && <ChartPanel option={buildLineOption(salesTrend)} />}</div>
            </div>
            <div style={panelStyle}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#00d4ff', marginBottom: 6 }}>🌐 仓储网络拓扑 Overview</div>
              <div style={{ flex: 1, minHeight: 0 }}>{hasData && <ChartPanel option={buildTopoOption(topoNodes, topoLinks)} />}</div>
            </div>
            <div style={panelStyle}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#00d4ff', marginBottom: 6 }}>🏙️ 城市销售额排名 Ranking</div>
              <div style={{ flex: 1, minHeight: 0 }}>{hasData && <ChartPanel option={buildBarOption(cityRanking)} />}</div>
            </div>
          </div>

          {/* Row 3: 2列 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 2, minHeight: 0 }}>
            <div style={panelStyle}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#00d4ff', marginBottom: 6 }}>🍩 品类销售占比 Distribution</div>
              <div style={{ flex: 1, minHeight: 0 }}>{hasData && <ChartPanel option={buildPieOption(categoryDistribution)} />}</div>
            </div>
            <div style={panelStyle}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#00d4ff', marginBottom: 6 }}>🎯 运营能力雷达 Ability</div>
              <div style={{ flex: 1, minHeight: 0 }}>{hasData && <ChartPanel option={buildRadarOption(radarD)} />}</div>
            </div>
          </div>

          {/* Bottom: Activity Log — scrolls once then stops */}
          <LogPanel items={activityLog} />
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes scrollOnce { 0% { transform:translateX(0) } 100% { transform:translateX(-50%) } }
        .log-anim { animation: scrollOnce 20s linear forwards }
        .log-done { transform: none }
      `}</style>
    </div>
  );
}