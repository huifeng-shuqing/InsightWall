/** 中文单位格式化：1.28亿 / 36.5万 / 352 */
export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 100000000) {
    return (value / 100000000).toFixed(2) + '亿';
  }
  if (Math.abs(value) >= 10000) {
    return (value / 10000).toFixed(1) + '万';
  }
  return value.toLocaleString('zh-CN');
}

/** 千分位数字 */
export function formatNumber(value: number): string {
  return value.toLocaleString('zh-CN');
}

/** 百分比 12.5% */
export function formatPercent(value: number): string {
  return (value >= 0 ? '+' : '') + value.toFixed(1) + '%';
}

/** 带符号百分比 +12.5% / -3.2% */
export function formatTrend(value: number): string {
  const sign = value > 0 ? '+' : '';
  return sign + value.toFixed(1) + '%';
}
