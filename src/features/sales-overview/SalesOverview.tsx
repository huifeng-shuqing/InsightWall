import { useSalesData } from './hooks/useSalesData';
import SalesKPI from './components/SalesKPI';
import SalesTrend from './components/SalesTrend';
import DashboardCard from '@/components/layout/DashboardCard';

export default function SalesOverview() {
  const { kpis, trend, loading } = useSalesData();

  return (
    <>
      <SalesKPI kpis={kpis} loading={loading} />
      <DashboardCard title="📈 销售趋势">
        <SalesTrend data={trend} loading={loading} />
      </DashboardCard>
    </>
  );
}