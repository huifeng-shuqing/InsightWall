import StatCard from '@/components/ui/StatCard';
import type { KPIItem } from '@/types/dashboard';

interface SalesKPIProps { kpis: KPIItem[]; loading: boolean; }

export default function SalesKPI({ kpis, loading }: SalesKPIProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      {kpis.length > 0
        ? kpis.map((kpi) => <StatCard key={kpi.id} kpi={kpi} loading={loading} />)
        : [1, 2, 3, 4].map((i) => <StatCard key={i} kpi={{ id: '', title: '', value: 0, unit: '', trend: 0, trendDirection: 'flat', icon: 'sales' }} loading />)
      }
    </div>
  );
}