import type { ITransport, LogEntry } from '../LightLog';

const COLORS: Record<string, string> = {
  pv: '#7c4dff',
  event: '#00d4ff',
  api: '#ffa502',
  error: '#ff4757',
  perf: '#00ff88',
};

export class ConsoleTransport implements ITransport {
  write(entry: LogEntry): void {
    const color = COLORS[entry.level] ?? '#888';
    const styles = `color: ${color}; font-weight: bold`;
    console.log(
      `%c[InsightWall] %c[${entry.level.toUpperCase()}] %c${entry.tag} %c${entry.message}`,
      styles, styles, 'color: #e8eaed', 'color: #8892b0',
      entry.data || '',
    );
  }
}