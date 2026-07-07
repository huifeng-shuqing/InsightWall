// Mock 适配器 — 读取本地 fixtures JSON 模拟 API 响应
// TODO: Step 5 实现完整逻辑
import type { IAdapter } from './IAdapter';
import type { ApiResponse } from '@/types/api';

export class MockAdapter implements IAdapter {
  async get<T>(_url: string, _params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    throw new Error('MockAdapter.get not implemented yet — Step 5');
  }

  async post<T>(_url: string, _data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    throw new Error('MockAdapter.post not implemented yet — Step 5');
  }
}