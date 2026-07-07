import { useEffect, useRef } from 'react';

export function useIntervalFetch(fn: () => void, intervalMs: number, enabled = true) {
  const savedFn = useRef(fn);
  savedFn.current = fn;

  useEffect(() => {
    if (!enabled) return;
    savedFn.current();
    const timer = setInterval(() => savedFn.current(), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs, enabled]);
}