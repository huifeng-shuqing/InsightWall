import { logger } from '../index';

/** 页面访问埋点 — 在组件挂载时调用 */
export function logPageView(pageName: string): void {
  logger.pv(pageName);
}