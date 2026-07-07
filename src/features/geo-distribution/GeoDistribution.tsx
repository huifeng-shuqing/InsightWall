import { useGeoData } from './hooks/useGeoData';
import ChinaMap from './components/ChinaMap';
import CityRanking from './components/CityRanking';
import DashboardCard from '@/components/layout/DashboardCard';

export default function GeoDistribution() {
  const { geoData, cityRanking, loading } = useGeoData();

  return (
    <DashboardCard title="🗺️ 地理分布">
      <div style={{ display: 'flex', gap: 12, height: '100%' }}>
        <div style={{ flex: 1 }}><ChinaMap data={geoData} loading={loading} /></div>
        <div style={{ width: 220 }}><CityRanking data={cityRanking} loading={loading} /></div>
      </div>
    </DashboardCard>
  );
}