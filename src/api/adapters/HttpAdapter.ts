// 真实 HTTP 适配器 — 对接后端 API
// TODO: Step 5 实现完整逻辑
import type { IAdapter } from './IAdapter';
import type { ApiResponse } from '@/types/api';

export class HttpAdapter implements IAdapter {
  async get<T>(_url: string, _params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    throw new Error('HttpAdapter.get not implemented yet — Step 5');
  }

  async post<T>(_url: string, _data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    throw new Error('HttpAdapter.post not implemented yet — Step 5');
  }
}