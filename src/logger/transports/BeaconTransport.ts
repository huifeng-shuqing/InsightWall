import type { ITransport, LogEntry } from '../LightLog';

/** 预留 — 后期对接真实后端埋点 API */
export class BeaconTransport implements ITransport {
  private endpoint: string;

  constructor(endpoint = '/api/analytics/beacon') {
    this.endpoint = endpoint;
  }

  write(entry: LogEntry): void {
    // 使用 sendBeacon 确保页面关闭时也能发送
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(entry)], { type: 'application/json' });
      navigator.sendBeacon(this.endpoint, blob);
    }
    // 降级：不做任何处理，避免阻塞
  }
}