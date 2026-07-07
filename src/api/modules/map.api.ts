// 地图业务 API
import { adapter } from '../client';
import { API_PATHS } from '@/constants/api-paths';
import type { DashboardData } from '@/types/dashboard';

export const mapApi = {
  /** 获取地理分布数据 */
  getGeoData() {
    return adapter.get<DashboardData>(API_PATHS.GEO_DISTRIBUTION);
  },
};