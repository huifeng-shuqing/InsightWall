/**
 * API 路径集中管理
 * 修改后端路径时只需改这一个文件
 */
export const API_PATHS = {
  /** Dashboard 全量数据 */
  DASHBOARD_OVERVIEW: '/api/dashboard/overview',
  /** KPI 指标 */
  DASHBOARD_KPIS: '/api/dashboard/kpis',
  /** 地理分布数据 */
  GEO_DISTRIBUTION: '/api/dashboard/geo',
  /** 排行数据 */
  RANKING_LIST: '/api/dashboard/ranking',
} as const;