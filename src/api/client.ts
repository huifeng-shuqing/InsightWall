// API 统一入口 — 工厂模式根据环境变量选择适配器
// TODO: Step 5 实现完整逻辑
import type { IAdapter } from './adapters/IAdapter';

export const adapter: IAdapter = null as unknown as IAdapter; // Step 5 初始化为 MockAdapter