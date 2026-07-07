import type { ITransport, LogEntry } from '../LightLog';

const MAX_BUFFER = 200;

/** 内存环形缓冲 — 调试时查看最近 200 条日志 */
export class BufferTransport implements ITransport {
  public entries: LogEntry[] = [];

  write(entry: LogEntry): void {
    this.entries.push(entry);
    if (this.entries.length > MAX_BUFFER) {
      this.entries.shift();
    }
  }

  /** 获取最近 N 条 */
  recent(n = 50): LogEntry[] {
    return this.entries.slice(-n);
  }

  /** 按级别过滤 */
  filterByLevel(level: string): LogEntry[] {
    return this.entries.filter((e) => e.level === level);
  }

  clear(): void {
    this.entries = [];
  }
}