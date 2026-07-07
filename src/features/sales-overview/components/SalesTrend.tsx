import LineChart from '@/components/chart/LineChart';
import Loading from '@/components/ui/Loading';
import type { TrendPoint } from '@/types/dashboard';

interface SalesTrendProps { data: TrendPoint[]; loading: boolean; }

export default function SalesTrend({ data, loading }: SalesTrendProps) {
  if (loading) return <Loading />;
  const xData = data.map((d) => d.date.slice(5));
  const salesData = data.map((d) => d.sales);
  const ordersData = data.map((d) => d.orders);

  return <LineChart xData={xData} series={[{ name: '销售额', data: salesData, color: '#00d4ff' }, { name: '订单量', data: ordersData, color: '#00ff88' }]} height={240} />;
}