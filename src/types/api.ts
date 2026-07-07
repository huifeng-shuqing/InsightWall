/**
 * API 通用响应格式
 */
export interface ApiResponse<T> {
  /** 0 = 成功 */
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

/**
 * 列表查询通用参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}