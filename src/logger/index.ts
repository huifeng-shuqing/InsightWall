import { LightLog } from './LightLog';
import { ConsoleTransport } from './transports/ConsoleTransport';
import { BufferTransport } from './transports/BufferTransport';

const consoleTransport = new ConsoleTransport();
export const bufferTransport = new BufferTransport();

/** 全局 Logger 单例 */
export const logger = new LightLog([consoleTransport, bufferTransport]);