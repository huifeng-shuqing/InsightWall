// 适配器接口 — Mock/真实 API 切换的核心抽象
import type { ApiResponse } from '@/types/api';

export interface IAdapter {
  get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>>;
}