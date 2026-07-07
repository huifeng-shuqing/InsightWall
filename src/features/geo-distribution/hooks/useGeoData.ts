import { useDashboardStore } from '@/stores/dashboard.store';
import { useEffect } from 'react';

export function useGeoData() {
  const { data, loading, fetchDashboard } = useDashboardStore();

  useEffect(() => {
    if (!data) fetchDashboard();
  }, [data, fetchDashboard]);

  return {
    geoData: data?.geoData ?? [],
    cityRanking: data?.cityRanking ?? [],
    loading,
  };
}