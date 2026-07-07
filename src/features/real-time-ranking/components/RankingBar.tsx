import BarChart from '@/components/chart/BarChart';
import Loading from '@/components/ui/Loading';
import type { RankingItem } from '@/types/dashboard';

interface RankingBarProps { data: RankingItem[]; loading: boolean; }

export default function RankingBar({ data, loading }: RankingBarProps) {
  if (loading) return <Loading />;
  const yData = data.map((d) => d.name);
  const values = data.map((d) => d.value);
  return <BarChart yData={yData} data={values} height="100%" horizontal />;
}