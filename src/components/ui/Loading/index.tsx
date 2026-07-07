import styles from './Loading.module.css';

interface LoadingProps {
  text?: string;
}

export default function Loading({ text = '数据加载中...' }: LoadingProps) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <span className={styles.text}>{text}</span>
    </div>
  );
}