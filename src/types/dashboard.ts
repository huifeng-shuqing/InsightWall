/**
 * KPI 指标卡片数据
 */
export interface KPIItem {
  id: string;
  /** 指标标题，如 "总销售额" */
  title: string;
  /** 指标数值 */
  value: number;
  /** 单位，如 "元"、"单" */
  unit: string;
  /** 同比变化百分比，如 12.5 表示 +12.5% */
  trend: number;
  /** 趋势方向 */
  trendDirection: 'up' | 'down' | 'flat';
  /** 图标名称 */
  icon: 'sales' | 'orders' | 'customer' | 'conversion';
}

/**
 * 销售趋势数据点
 */
export interface TrendPoint {
  date: string;
  sales: number;
  orders: number;
}

/**
 * 地理分布数据
 */
export interface GeoDataItem {
  /** 省份名称，如 "广东省" */
  name: string;
  /** 销售额（万元） */
  value: number;
  /** 订单数 */
  count: number;
}

/**
 * 实时排行数据
 */
export interface RankingItem {
  rank: number;
  name: string;
  value: number;
  /** 占比（小数），如 0.28 表示 28% */
  percentage: number;
  trend: 'up' | 'down' | 'flat';
  /** 排名变化（正数表示上升名次） */
  change: number;
}

/**
 * Dashboard 完整数据集合
 */
export interface DashboardData {
  kpis: KPIItem[];
  salesTrend: TrendPoint[];
  geoData: GeoDataItem[];
  categoryRanking: RankingItem[];
  cityRanking: RankingItem[];
}