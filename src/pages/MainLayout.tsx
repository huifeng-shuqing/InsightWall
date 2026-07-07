import { useEffect } from 'react';
import { logger } from '@/logger';
import PageHeader from '@/components/ui/PageHeader';
import DashboardGrid, { GridItem } from '@/components/layout/DashboardGrid';
import DashboardCard from '@/components/layout/DashboardCard';
import SalesKPI from '@/features/sales-overview/components/SalesKPI';
import SalesTrend from '@/features/sales-overview/components/SalesTrend';
import { useSalesData } from '@/features/sales-overview/hooks/useSalesData';
import GeoDistribution from '@/features/geo-distribution';
import RealTimeRanking from '@/features/real-time-ranking';
import { useDashboardStore } from '@/stores/dashboard.store';

export default function MainLayout() {
  const { loading, lastUpdated } = useDashboardStore();
  const { kpis, trend } = useSalesData();

  useEffect(() => { logger.pv('dashboard'); }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'auto',
      background: '#0a0e27',
      color: '#e8eaed',
    }}>
      <PageHeader loading={loading} lastUpdated={lastUpdated} />

      <div style={{ padding: 12 }}>
        <SalesKPI kpis={kpis} loading={loading} />
      </div>

      <DashboardGrid cols={12} gap={12}>
        <GridItem colSpan={7}>
          <DashboardCard title="📈 销售趋势">
            <SalesTrend data={trend} loading={loading} />
          </DashboardCard>
        </GridItem>
        <GridItem colSpan={5}>
          <GeoDistribution />
        </GridItem>
        <GridItem colSpan={12}>
          <RealTimeRanking />
        </GridItem>
      </DashboardGrid>
    </div>
  );
}