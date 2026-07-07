// WebSocket Hook — 预留骨架，后期对接真实实时推送

interface WsState {
  messages: string[];
  readyState: number;
}

export function createWebSocket(_url: string) {
  const state: WsState = { messages: [], readyState: 0 };
  return {
    send: (_data: string) => { /* 预留 */ },
    getState: () => state,
  };
}

// React Hook 版本（预留）
export function useWebSocket(_url: string) {
  return { messages: [], readyState: 0, send: (_data: string) => {} };
}