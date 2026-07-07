// Mock 适配器 — 读取本地 fixtures JSON 模拟 API 响应
import type { IAdapter } from './IAdapter';
import type { ApiResponse } from '@/types/api';
import dashboardFixture from '@/../mock-server/fixtures/dashboard.json';
import mapGeoFixture from '@/../mock-server/fixtures/map-geo.json';
import rankingFixture from '@/../mock-server/fixtures/ranking.json';

/** 模拟网络延迟（ms） */
const MOCK_DELAY = () => 200 + Math.random() * 200;

/** 给数值加 ±2% 随机波动 */
function jitter(value: number, pct = 0.02): number {
  const delta = value * pct * (Math.random() * 2 - 1);
  return Math.round((value + delta) * 100) / 100;
}

/** 给排行数据加微小波动（模拟实时变化） */
function jitterRanking(items: Array<Record<string, unknown>>) {
  return items.map((item) => ({
    ...item,
    value: jitter(item.value as number, 0.005),
    percentage: item.percentage,
  }));
}

const fixtures: Record<string, unknown> = {
  '/api/dashboard/overview': dashboardFixture,
  '/api/dashboard/kpis': dashboardFixture,
  '/api/dashboard/geo': mapGeoFixture,
  '/api/dashboard/ranking': rankingFixture,
};

export class MockAdapter implements IAdapter {
  async get<T>(url: string, _params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    // 模拟网络延迟
    await new Promise((r) => setTimeout(r, MOCK_DELAY()));

    const fixture = fixtures[url];
    if (!fixture) {
      return {
        code: 404,
        message: `Mock: no fixture for ${url}`,
        data: null as unknown as T,
        timestamp: Date.now(),
      };
    }

    // 深拷贝 + 添加微小波动
    const rawData = JSON.parse(JSON.stringify(fixture));
    const data =
      url === '/api/dashboard/ranking'
        ? {
            categoryRanking: jitterRanking(rawData.categoryRanking),
            cityRanking: jitterRanking(rawData.cityRanking),
          }
        : rawData;

    return {
      code: 0,
      message: 'ok',
      data: data as T,
      timestamp: Date.now(),
    };
  }

  async post<T>(_url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    // POST 也返回 GET 的逻辑（Mock 简化处理）
    return this.get<T>(_url, data);
  }
}