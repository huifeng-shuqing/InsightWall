import { useState, useEffect } from 'react';
import { useDashboardStore } from '@/stores/dashboard.store';
import { formatCurrency, formatNumber, formatTrend } from '@/utils/format';

export default function MainLayout() {
  const { data, loading, fetchDashboard, lastUpdated } = useDashboardStore();
  const [now, setNow] = useState(new Date());

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = now.toLocaleString('zh-CN', { hour12: false });
  const kpis = data?.kpis ?? [];
  const trend = data?.salesTrend ?? [];
  const ranking = data?.categoryRanking ?? [];

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'auto', background: '#0a0e27', color: '#e8eaed', fontFamily: 'system-ui, sans-serif' }}>
      {/* ===== Header ===== */}
      <header style={{
        display: 'flex', alignItems: 'center', padding: '0 32px', height: 60,
        background: 'linear-gradient(180deg, #0a0e27 0%, rgba(10,14,39,0.6) 100%)',
        borderBottom: '1px solid rgba(0,212,255,0.12)',
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#00d4ff', margin: 0, letterSpacing: 2 }}>
            洞察之墙 <span style={{ fontWeight: 400, color: '#8892b0', fontSize: 15 }}>| InsightWall</span>
          </h1>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 15, color: '#e8eaed' }}>{timeStr}</div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <span style={{ padding: '3px 12px', borderRadius: 10, fontSize: 12, background: 'rgba(255,165,2,0.15)', color: '#ffa502' }}>
            {loading ? '⏳ 加载中...' : '🔶 模拟数据'}
          </span>
          {lastUpdated > 0 && <span style={{ color: '#8892b0', fontSize: 11, marginLeft: 8 }}>更新 {new Date(lastUpdated).toLocaleTimeString()}</span>}
        </div>
      </header>

      {loading && !data ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 60px)', color: '#8892b0', fontSize: 18 }}>
          ⏳ 数据加载中...
        </div>
      ) : (
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* ===== KPI 行 ===== */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {kpis.map((kpi) => (
              <div key={kpi.id} style={{
                background: 'rgba(26,31,58,0.85)', border: '1px solid rgba(0,212,255,0.15)',
                borderRadius: 12, padding: '20px 24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>{kpi.icon === 'sales' ? '💰' : kpi.icon === 'orders' ? '📦' : kpi.icon === 'customer' ? '👤' : '📈'}</span>
                  <span style={{ color: '#8892b0', fontSize: 13 }}>{kpi.title}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 600,
                    color: kpi.trendDirection === 'up' ? '#00ff88' : kpi.trendDirection === 'down' ? '#ff4757' : '#8892b0',
                  }}>
                    {formatTrend(kpi.trend)} {kpi.trendDirection === 'up' ? '↑' : kpi.trendDirection === 'down' ? '↓' : '→'}
                  </span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 30, fontWeight: 700, color: '#e8eaed' }}>
                  {kpi.unit === '%' ? kpi.value.toFixed(1) + '%' : formatCurrency(kpi.value)}
                  {kpi.unit !== '%' && <span style={{ fontSize: 14, color: '#8892b0', marginLeft: 4, fontWeight: 400 }}>{kpi.unit}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* ===== 趋势 + 排行 ===== */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* 销售趋势表格 */}
            <div style={{ background: 'rgba(26,31,58,0.85)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: 12, padding: 16 }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 15, color: '#e8eaed' }}>📈 销售趋势（近30天）</h3>
              <table style={{ width: '100%', fontSize: 12, color: '#8892b0', borderCollapse: 'collapse' }}>
                <thead>
                  <tr><th style={{ textAlign: 'left', padding: 4 }}>日期</th><th style={{ textAlign: 'right', padding: 4 }}>销售额</th><th style={{ textAlign: 'right', padding: 4 }}>订单量</th></tr>
                </thead>
                <tbody>
                  {trend.slice(-10).reverse().map((t) => (
                    <tr key={t.date}>
                      <td style={{ padding: 4, color: '#e8eaed' }}>{t.date}</td>
                      <td style={{ padding: 4, textAlign: 'right', color: '#00d4ff' }}>{formatCurrency(t.sales)}</td>
                      <td style={{ padding: 4, textAlign: 'right' }}>{formatNumber(t.orders)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 品类排行 */}
            <div style={{ background: 'rgba(26,31,58,0.85)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: 12, padding: 16 }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 15, color: '#e8eaed' }}>🏆 品类排行 Top 8</h3>
              {ranking.map((item) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', padding: '7px 0', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: item.rank <= 3 ? '#0a0e27' : '#8892b0',
                    background: item.rank === 1 ? '#ffa502' : item.rank === 2 ? '#c0c0c0' : item.rank === 3 ? '#cd7f32' : 'rgba(255,255,255,0.06)',
                  }}>{item.rank}</span>
                  <span style={{ flex: 2, color: '#e8eaed', fontSize: 13 }}>{item.name}</span>
                  <div style={{ flex: 3, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${item.percentage * 100}%`, background: 'linear-gradient(to right, #00d4ff, #00ff88)', borderRadius: 3 }} />
                  </div>
                  <span style={{ flex: 1, textAlign: 'right', fontSize: 12, color: '#e8eaed', fontFamily: 'monospace' }}>{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ===== 地理分布 ===== */}
          <div style={{ background: 'rgba(26,31,58,0.85)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: 12, padding: 16 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 15, color: '#e8eaed' }}>🗺️ 省份销售分布 Top 15</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {(data?.geoData ?? []).slice(0, 15).map((geo) => (
                <div key={geo.name} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(0,212,255,0.04)', borderRadius: 8, gap: 8 }}>
                  <span style={{ color: '#e8eaed', fontSize: 13, flex: 1 }}>{geo.name}</span>
                  <div style={{ flex: 2, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${(geo.value / 5000) * 100}%`, background: '#00d4ff', borderRadius: 3 }} />
                  </div>
                  <span style={{ color: '#00d4ff', fontSize: 12, fontFamily: 'monospace' }}>{formatCurrency(geo.value)}万</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}