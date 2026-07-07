// 排行榜业务 API
import { adapter } from '../client';
import { API_PATHS } from '@/constants/api-paths';
import type { DashboardData } from '@/types/dashboard';

export const rankingApi = {
  /** 获取实时排行数据 */
  getRankingData() {
    return adapter.get<DashboardData>(API_PATHS.RANKING_LIST);
  },
};