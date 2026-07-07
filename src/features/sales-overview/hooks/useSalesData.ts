import { useDashboardStore } from '@/stores/dashboard.store';
import { useEffect } from 'react';

export function useSalesData() {
  const { data, loading, fetchDashboard } = useDashboardStore();

  useEffect(() => {
    fetchDashboard();
    const timer = setInterval(fetchDashboard, 30000);
    return () => clearInterval(timer);
  }, [fetchDashboard]);

  return {
    kpis: data?.kpis ?? [],
    trend: data?.salesTrend ?? [],
    loading,
  };
}