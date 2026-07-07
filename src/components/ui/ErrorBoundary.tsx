import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100vw', height: '100vh', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: '#0a0e27', color: '#ff4757', fontFamily: 'monospace', padding: 40,
        }}>
          <h1 style={{ color: '#ff4757', marginBottom: 16 }}>⚠️ 页面渲染错误</h1>
          <pre style={{ color: '#8892b0', maxWidth: 800, whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: 13 }}>
            {this.state.error?.message}
          </pre>
          <pre style={{ color: '#555', maxWidth: 800, maxHeight: 300, overflow: 'auto', fontSize: 11, marginTop: 8 }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}