/** 日志传输接口 */
export interface ITransport {
  write(entry: LogEntry): void;
}

/** 日志条目 */
export interface LogEntry {
  level: 'pv' | 'event' | 'api' | 'error' | 'perf';
  tag: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

/** 轻量级日志系统 — 可插拔 Transport */
export class LightLog {
  private transports: ITransport[] = [];

  constructor(transports: ITransport[] = []) {
    this.transports = transports;
  }

  addTransport(t: ITransport): void {
    this.transports.push(t);
  }

  private write(entry: LogEntry): void {
    for (const t of this.transports) {
      try {
        t.write(entry);
      } catch {
        // Transport 异常不影响业务
      }
    }
  }

  /** 页面浏览埋点 */
  pv(pageName: string, extra?: Record<string, unknown>): void {
    this.write({ level: 'pv', tag: pageName, message: `Page view: ${pageName}`, data: extra, timestamp: Date.now() });
  }

  /** 用户事件埋点 */
  event(name: string, extra?: Record<string, unknown>): void {
    this.write({ level: 'event', tag: name, message: `Event: ${name}`, data: extra, timestamp: Date.now() });
  }

  /** API 调用追踪 */
  apiTrace(url: string, duration: number, status: number): void {
    this.write({ level: 'api', tag: url, message: `API ${url} ${status} ${duration}ms`, data: { url, duration, status }, timestamp: Date.now() });
  }

  /** 错误记录 */
  error(err: Error, context?: string): void {
    this.write({ level: 'error', tag: context ?? 'unknown', message: err.message, data: { stack: err.stack, context }, timestamp: Date.now() });
  }

  /** 性能指标 */
  perf(metric: string, value: number): void {
    this.write({ level: 'perf', tag: metric, message: `Perf ${metric}: ${value}`, data: { value }, timestamp: Date.now() });
  }
}