// API 统一入口 — 工厂模式根据环境变量选择适配器
import type { IAdapter } from './adapters/IAdapter';
import { MockAdapter } from './adapters/MockAdapter';
import { HttpAdapter } from './adapters/HttpAdapter';

function createAdapter(): IAdapter {
  const useMock = import.meta.env.VITE_MOCK !== 'false';
  if (useMock) {
    console.log('[InsightWall] 🔶 Mock 模式已启用 — 使用本地模拟数据');
    return new MockAdapter();
  }
  console.log('[InsightWall] 🔷 真实 API 模式 — 连接到后端服务');
  return new HttpAdapter();
}

export const adapter: IAdapter = createAdapter();