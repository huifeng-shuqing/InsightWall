import { formatCurrency } from '@/utils/format';
import type { RankingItem } from '@/types/dashboard';

interface CityRankingProps { data: RankingItem[]; loading: boolean; }

export default function CityRanking({ data, loading }: CityRankingProps) {
  if (loading) return <div style={{ color: '#8892b0', padding: 12 }}>加载中...</div>;

  return (
    <div style={{ overflow: 'auto', maxHeight: '100%' }}>
      <table style={{ width: '100%', fontSize: 12, color: '#8892b0', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>城市</th>
            <th style={{ textAlign: 'right', padding: '4px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>销售额</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.name}>
              <td style={{ padding: '6px 8px', color: '#e8eaed' }}>{item.rank}. {item.name}</td>
              <td style={{ padding: '6px 8px', textAlign: 'right', color: '#00d4ff', fontFamily: 'monospace' }}>{formatCurrency(item.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}