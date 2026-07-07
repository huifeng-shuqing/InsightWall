import { useEffect } from 'react';
import { useDashboardStore } from '@/stores/dashboard.store';
import { rankingApi } from '@/api/modules/ranking.api';

export function useRankingData() {
  const { data, fetchDashboard } = useDashboardStore();

  useEffect(() => {
    fetchDashboard();
    // 每 5 秒刷新排行数据（含微小波动）
    const timer = setInterval(async () => {
      try {
        const res = await rankingApi.getRankingData();
        if (res.code === 0 && res.data) {
          useDashboardStore.setState((s) => ({
            data: s.data ? { ...s.data, categoryRanking: res.data.categoryRanking } : s.data,
          }));
        }
      } catch { /* 静默失败 */ }
    }, 5000);
    return () => clearInterval(timer);
  }, [fetchDashboard]);

  return {
    categoryRanking: data?.categoryRanking ?? [],
    loading: !data,
  };
}