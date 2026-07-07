import type { EChartsOption } from 'echarts';
import { DASHBOARD_COLORS, CHART_COLORS } from './theme';

const { textSecondary } = DASHBOARD_COLORS;

/**
 * ECharts 默认公共配置
 * 每个图表继承 common + 对应类型默认值
 */
export const CHART_DEFAULTS: Record<string, Partial<EChartsOption>> = {
  /** 通用默认值 */
  common: {
    backgroundColor: 'transparent',
    color: [...CHART_COLORS],
    textStyle: { color: textSecondary },
    animationDuration: 800,
    animationEasing: 'cubicOut',
  },

  /** 折线图默认值 */
  line: {
    grid: { top: 20, right: 30, bottom: 30, left: 50 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: textSecondary, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
      axisLabel: { color: textSecondary, fontSize: 11 },
    },
  },

  /** 柱状图默认值 */
  bar: {
    grid: { top: 20, right: 30, bottom: 30, left: 50 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: textSecondary, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
      axisLabel: { color: textSecondary, fontSize: 11 },
    },
  },

  /** 饼图默认值 */
  pie: {
    tooltip: { trigger: 'item' },
    legend: {
      textStyle: { color: textSecondary, fontSize: 11 },
      bottom: 0,
    },
  },

  /** 地图默认值 */
  map: {
    tooltip: { trigger: 'item' },
    visualMap: {
      min: 0,
      max: 5000,
      text: ['高', '低'],
      textStyle: { color: textSecondary },
      inRange: {
        color: ['#0a1a3a', '#0d3b66', '#1a73e8', '#00d4ff', '#00ff88'],
      },
    },
  },
};