import { useRankingData } from './hooks/useRankingData';
import DashboardCard from '@/components/layout/DashboardCard';
import RankingList from './components/RankingList';
import RankingBar from './components/RankingBar';

export default function RealTimeRanking() {
  const { categoryRanking, loading } = useRankingData();

  return (
    <DashboardCard title="🏆 品类实时排行">
      <div style={{ display: 'flex', gap: 12, height: '100%' }}>
        <div style={{ flex: 1 }}><RankingList data={categoryRanking} loading={loading} /></div>
        <div style={{ flex: 1 }}><RankingBar data={categoryRanking} loading={loading} /></div>
      </div>
    </DashboardCard>
  );
}