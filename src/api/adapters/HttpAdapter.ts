// 真实 HTTP 适配器 — 对接后端 API
import axios, { type AxiosInstance } from 'axios';
import type { IAdapter } from './IAdapter';
import type { ApiResponse } from '@/types/api';

export class HttpAdapter implements IAdapter {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });

    // 响应拦截器：统一解包
    this.client.interceptors.response.use(
      (res) => res.data,
      (err) => {
        const apiResponse: ApiResponse<null> = {
          code: err.response?.status ?? -1,
          message: err.message,
          data: null,
          timestamp: Date.now(),
        };
        return Promise.reject(apiResponse);
      },
    );
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.client.get(url, { params });
  }

  async post<T>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.client.post(url, data);
  }
}