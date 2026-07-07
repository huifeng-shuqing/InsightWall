import { dashboardApi } from '@/api/modules/dashboard.api';
import { mapApi } from '@/api/modules/map.api';
import { rankingApi } from '@/api/modules/ranking.api';

/** 业务服务层：一次性获取全部 Dashboard 数据 */
export async function getFullDashboard() {
  const results = await Promise.allSettled([
    dashboardApi.getOverview(),
    rankingApi.getRankingData(),
  ]);

  return results.map((r) => (r.status === 'fulfilled' ? r.value : null));
}

/** 仅刷新实时排行 */
export async function refreshRealtime() {
  return rankingApi.getRankingData();
}