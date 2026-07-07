import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  loading?: boolean;
  lastUpdated: number;
}

export default function PageHeader({ loading, lastUpdated }: PageHeaderProps) {
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>洞察之墙 <span className={styles.subtitle}>| InsightWall</span></h1>
        <span className={styles.desc}>数据可视化大屏学习项目</span>
      </div>
      <div className={styles.center}>
        <span className={styles.datetime}>{now.format('YYYY-MM-DD HH:mm:ss')}</span>
      </div>
      <div className={styles.right}>
        <span className={`${styles.badge} ${loading ? styles.loading : styles.ok}`}>
          {loading ? '⏳ 加载中' : '🔶 模拟数据'}
        </span>
        {lastUpdated > 0 && (
          <span className={styles.updated}>更新于 {dayjs(lastUpdated).format('HH:mm:ss')}</span>
        )}
      </div>
    </header>
  );
}