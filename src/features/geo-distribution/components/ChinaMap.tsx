import MapChart from '@/components/chart/MapChart';
import Loading from '@/components/ui/Loading';
import type { GeoDataItem } from '@/types/dashboard';

interface ChinaMapProps { data: GeoDataItem[]; loading: boolean; }

export default function ChinaMap({ data, loading }: ChinaMapProps) {
  if (loading) return <Loading />;
  return <MapChart data={data} height="100%" />;
}