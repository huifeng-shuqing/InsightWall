import { formatCurrency, formatTrend } from '@/utils/format';
import type { KPIItem } from '@/types/dashboard';
import styles from './StatCard.module.css';

interface StatCardProps {
  kpi: KPIItem;
  loading?: boolean;
}

const ICONS: Record<string, string> = {
  sales: '💰',
  orders: '📦',
  customer: '👤',
  conversion: '📈',
};

export default function StatCard({ kpi, loading }: StatCardProps) {
  if (loading) return <div className={styles.card} data-testid="kpi-card"><div className={styles.skeleton} /></div>;

  const isUp = kpi.trendDirection === 'up';
  const isDown = kpi.trendDirection === 'down';

  return (
    <div className={styles.card} data-testid="kpi-card">
      <div className={styles.header}>
        <span className={styles.icon}>{ICONS[kpi.icon] ?? '📊'}</span>
        <span className={styles.title}>{kpi.title}</span>
        <span className={`${styles.trend} ${isUp ? styles.up : isDown ? styles.down : styles.flat}`}>
          {formatTrend(kpi.trend)}
          {isUp ? ' ↑' : isDown ? ' ↓' : ' →'}
        </span>
      </div>
      <div className={styles.value}>
        {kpi.unit === '%' ? kpi.value.toFixed(1) : formatCurrency(kpi.value)}
        {kpi.unit !== '%' && <span className={styles.unit}>{kpi.unit}</span>}
      </div>
    </div>
  );
}