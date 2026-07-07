import type { ReactNode } from 'react';
import styles from './DashboardCard.module.css';

interface DashboardCardProps {
  title?: string;
  children: ReactNode;
  extra?: ReactNode;
  className?: string;
}

export default function DashboardCard({ title, children, extra, className = '' }: DashboardCardProps) {
  return (
    <div className={`${styles.card} ${className}`}>
      {(title || extra) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {extra && <div className={styles.extra}>{extra}</div>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </div>
  );
}