export interface KPIItem {
  id: string; title: string; value: number; unit: string;
  trend: number; trendDirection: 'up' | 'down' | 'flat';
  icon: 'sales' | 'orders' | 'customer' | 'conversion';
}
export interface TrendPoint { date: string; sales: number; orders: number; }
export interface GeoDataItem { name: string; value: number; count: number; }
export interface RankingItem {
  rank: number; name: string; value: number; percentage: number;
  trend: 'up' | 'down' | 'flat'; change: number;
}
export interface CategoryItem { name: string; value: number; }
export interface RadarItem { name: string; value: number; }
export interface TopologyNode { name: string; category: number; symbolSize: number; x: number; y: number; }
export interface TopologyLink { source: string; target: string; }
export interface ActivityItem { time: string; type: 'info'|'warning'|'error'|'success'; content: string; }

export interface DashboardData {
  kpis: KPIItem[];
  salesTrend: TrendPoint[];
  geoData: GeoDataItem[];
  categoryRanking: RankingItem[];
  cityRanking: RankingItem[];
  categoryDistribution: CategoryItem[];
  radarData: RadarItem[];
  topologyNodes: TopologyNode[];
  topologyLinks: TopologyLink[];
  activityLog: ActivityItem[];
}