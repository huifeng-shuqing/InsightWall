/**
 * 大屏配色体系 — 深色科技蓝风格
 */
export const DASHBOARD_COLORS = {
  /** 页面底色 */
  background: '#0a0e27',
  /** 卡片背景（半透明 + 模糊） */
  cardBg: 'rgba(26, 31, 58, 0.85)',
  /** 卡片边框（发光） */
  cardBorder: 'rgba(0, 212, 255, 0.15)',
  /** 科技蓝强调色 */
  accent: '#00d4ff',
  /** 数据增长绿 */
  success: '#00ff88',
  /** 警告橙 */
  warning: '#ffa502',
  /** 告警红 */
  danger: '#ff4757',
  /** 主文本色 */
  text: '#e8eaed',
  /** 次要文本色 */
  textSecondary: '#8892b0',
} as const;

/**
 * ECharts 图表色盘
 */
export const CHART_COLORS = [
  '#00d4ff',
  '#00ff88',
  '#ffa502',
  '#ff4757',
  '#7c4dff',
  '#18ffff',
  '#ff6d00',
  '#76ff03',
] as const;

/**
 * 大屏设计基准尺寸
 */
export const DESIGN_SIZE = {
  width: 1920,
  height: 1080,
} as const;