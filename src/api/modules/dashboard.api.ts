// Dashboard 业务 API
import { adapter } from '../client';
import { API_PATHS } from '@/constants/api-paths';
import type { DashboardData } from '@/types/dashboard';

export const dashboardApi = {
  /** 获取 Dashboard 全量数据 */
  getOverview() {
    return adapter.get<DashboardData>(API_PATHS.DASHBOARD_OVERVIEW);
  },

  /** 获取 KPI 指标 */
  getKPIs() {
    return adapter.get<DashboardData>(API_PATHS.DASHBOARD_KPIS);
  },
};