import { useScreenAdapt } from '@/hooks/useScreenAdapt';
import { useDashboardStore } from '@/stores/dashboard.store';
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

export default function MainLayout() {
  const { containerStyle } = useScreenAdapt();
  const { loading, lastUpdated } = useDashboardStore();
  const { kpis, trend } = useSalesData();

  useEffect(() => { logger.pv('dashboard'); }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0a0e27', position: 'relative' }}>
      <div style={containerStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <PageHeader loading={loading} lastUpdated={lastUpdated} />

          <DashboardGrid cols={12} gap={12}>
            {/* Row 1: KPI cards */}
            <GridItem colSpan={12}>
              <SalesKPI kpis={kpis} loading={loading} />
            </GridItem>

            {/* Row 2: Sales trend + Geo map */}
            <GridItem colSpan={7}>
              <DashboardCard title="📈 销售趋势">
                <SalesTrend data={trend} loading={loading} />
              </DashboardCard>
            </GridItem>
            <GridItem colSpan={5}>
              <GeoDistribution />
            </GridItem>

            {/* Row 3: Real-time ranking */}
            <GridItem colSpan={12}>
              <RealTimeRanking />
            </GridItem>
          </DashboardGrid>
        </div>
      </div>
    </div>
  );
}