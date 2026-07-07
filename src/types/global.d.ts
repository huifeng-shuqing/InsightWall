/**
 * 全局类型声明
 */

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

/** 大屏栅格配置 */
interface GridItemConfig {
  /** 跨列数 */
  colSpan: number;
  /** 跨行数 */
  rowSpan: number;
}