import { DESIGN_SIZE } from '@/constants/theme';

/** 根据实际视口计算等比缩放比例 */
export function getScreenScale(designWidth = DESIGN_SIZE.width, designHeight = DESIGN_SIZE.height): number {
  const w = window.innerWidth / designWidth;
  const h = window.innerHeight / designHeight;
  return Math.min(w, h);
}

/** debounce */
export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
