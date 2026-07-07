import { formatCurrency, formatTrend } from '@/utils/format';
import type { RankingItem } from '@/types/dashboard';

interface RankingListProps { data: RankingItem[]; loading: boolean; }

const RANK_COLORS = ['#ffa502', '#c0c0c0', '#cd7f32'];

export default function RankingList({ data, loading }: RankingListProps) {
  if (loading) return <div style={{ color: '#8892b0', padding: 12 }}>加载中...</div>;

  return (
    <div style={{ overflow: 'auto', maxHeight: '100%' }}>
      {data.map((item) => (
        <div key={item.name} style={{
          display: 'flex', alignItems: 'center', padding: '6px 0', gap: 8,
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <span style={{
            width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 12, fontWeight: 700,
            background: item.rank <= 3 ? RANK_COLORS[item.rank - 1] : 'rgba(255,255,255,0.06)',
            color: item.rank <= 3 ? '#0a0e27' : '#8892b0',
          }}>{item.rank}</span>
          <span style={{ flex: 1, color: '#e8eaed', fontSize: 13 }}>{item.name}</span>
          <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${item.percentage * 100}%`, background: 'linear-gradient(to right, #00d4ff, #00ff88)', borderRadius: 3 }} />
          </div>
          <span style={{ color: '#e8eaed', fontSize: 12, fontFamily: 'monospace', minWidth: 60, textAlign: 'right' }}>{formatCurrency(item.value)}</span>
          <span style={{ color: item.trend === 'up' ? '#00ff88' : item.trend === 'down' ? '#ff4757' : '#8892b0', fontSize: 11, minWidth: 50 }}>
            {formatTrend(item.change)}
            {item.trend === 'up' ? ' ↑' : item.trend === 'down' ? ' ↓' : ' →'}
          </span>
        </div>
      ))}
    </div>
  );
}