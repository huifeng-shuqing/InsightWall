import type { ReactNode } from 'react';
import styles from './DashboardGrid.module.css';

interface DashboardGridProps {
  children: ReactNode;
  cols?: number;
  gap?: number;
}

export default function DashboardGrid({ children, cols = 12, gap = 12 }: DashboardGridProps) {
  return (
    <div
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
}

/** Grid 子项 — 支持跨列/跨行 */
interface GridItemProps {
  children: ReactNode;
  colSpan?: number;
  rowSpan?: number;
}
export function GridItem({ children, colSpan = 1, rowSpan = 1 }: GridItemProps) {
  return (
    <div className={styles.item} style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}` }}>
      {children}
    </div>
  );
}