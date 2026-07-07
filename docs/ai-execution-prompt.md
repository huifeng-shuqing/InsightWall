# InsightWall（洞察之墙）AI 执行提示词

> 交付给任一 AI（Claude Code / Cursor / Copilot 等）即可分步执行，最终生成可直接在浏览器运行的数据可视化大屏。
>
> 项目 GitHub：[https://github.com/huifeng-shuqing/InsightWall](https://github.com/huifeng-shuqing/InsightWall)

---

## 0. 角色设定

```
你是一位资深前端架构师和数据可视化专家，精通 React、TypeScript、ECharts、Zustand。
你现在要为一个名为 InsightWall（洞察之墙）的开源学习项目搭建完整的前端工程。

你的工作原则：
- 每一步只做一件事，做完验证通过再做下一步
- 每完成一个 Step 必须 git commit，commit message 遵循 Conventional Commits（ feat / chore / style / test / docs ）
- 禁止单文件堆砌代码，严格按目录分层
- 所有 Mock 数据均为仿真的中文业务数据
- 最终页面必须视觉美观，配色遵循"深色科技蓝"大屏风格
```

---

## 1. 项目全局约束（强制执行）

### 1.1 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | React | 18.x |
| 语言 | TypeScript | 5.x (strict mode) |
| 构建 | Vite | 6.x |
| 可视化 | ECharts | 5.x |
| 状态管理 | Zustand | 5.x |
| 路由 | React Router | 6.x |
| HTTP | Axios | 1.x |
| 样式 | Tailwind CSS + CSS Modules | 4.x |
| 测试 | Vitest + Testing Library + Playwright | 2.x / 16.x / 1.x |
| 代码质量 | ESLint + Prettier + Husky + lint-staged | latest |
| 提交规范 | Commitlint + Commitizen | latest |

### 1.2 硬性规则

- [ ] **目录即架构**：必须创建完整目录树后再写代码，不允许临时补目录
- [ ] **单文件 ≤ 200 行**：超过则拆分到 components/ hooks/ utils/
- [ ] **组件无业务逻辑**：`src/components/` 下只能是纯 UI 组件，业务逻辑在 `src/features/` 中
- [ ] **Mock 通过适配器切换**：`src/api/adapters/MockAdapter.ts` → `VITE_MOCK=true`；`HttpAdapter.ts` → `VITE_MOCK=false`
- [ ] **每个 feature 模块自包含**：index.tsx + 组件 + hooks + types + __tests__ 在同一目录下
- [ ] **TypeScript strict=true**：不允许 `any` 逃避类型（Mock 数据文件除外）

### 1.3 大屏视觉规范

- **主色调**：`#0a0e27` (深蓝黑底) → `#1a1f3a` (卡片背景) → `#00d4ff` (科技蓝强调) → `#00ff88` (数据增长绿) → `#ff4757` (告警红)
- **卡片**：半透明深蓝背景 + 1px 发光边框 + 12px 圆角 + backdrop-blur
- **标题栏**：顶部通栏，项目名 + 实时时间 + 模拟数据指示器
- **布局**：12 列栅格，1920x1080 基准分辨率，使用 CSS Transform scale 等比缩放
- **字体**：标题使用系统科技感字体（或引入 `Orbitron` webfont），数字使用 Tabular Nums 等宽数字

---

## 2. 执行步骤（严格按序执行）

---

### Step 1 — 脚手架初始化

**目标**：用 Vite 创建 React + TypeScript 项目，安装全部依赖

**执行命令**：

```bash
# 1. 创建项目
npm create vite@latest InsightWall -- --template react-ts
cd InsightWall

# 2. 安装核心依赖
npm install react-router-dom@6 zustand axios echarts echarts-for-react

# 3. 安装样式依赖
npm install -D tailwindcss @tailwindcss/vite

# 4. 安装质量保障依赖
npm install -D prettier eslint eslint-config-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react-hooks

# 5. 安装测试依赖
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8

# 6. 安装 Git hooks 依赖
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional commitizen cz-conventional-changelog

# 7. 安装 Playwright (E2E)
npm install -D @playwright/test
npx playwright install chromium

# 8. 安装工具类
npm install dayjs
```

**验证标准**：
- `npm run dev` 能启动 Vite 开发服务器
- 浏览器打开 `http://localhost:5173` 看到默认 Vite + React 页面

**提交**：`chore: scaffold Vite + React + TS project with all dependencies`

---

### Step 2 — 质量管控体系搭建

**目标**：配置 ESLint、Prettier、Husky、Commitlint

**需要创建/修改的文件**：

1. `.prettierrc` — Prettier 规则（singleQuote, semi, printWidth=100 等 8 项配置）
2. `.prettierignore` — 忽略 node_modules / dist / build
3. `eslint.config.js` — ESLint flat config（TypeScript + React Hooks 规则）
4. `.husky/pre-commit` — lint-staged 触发
5. `.husky/commit-msg` — commitlint 校验
6. `commitlint.config.cjs` — Conventional Commits 规则
7. `package.json` — 添加 lint / format / typecheck / test / prepare 等脚本
8. `.vscode/settings.json` — 保存时自动格式化

**验证标准**：
- `npm run lint` 通过
- `npm run format` 执行成功
- `npm run typecheck` 通过

**提交**：`chore: configure ESLint + Prettier + Husky + Commitlint`

---

### Step 3 — 创建完整目录树

**目标**：按照架构方案一创建所有空目录和占位文件

**目录清单**（精确创建，不遗漏任何层级）：

```
src/
├── api/
│   ├── adapters/
│   │   ├── IAdapter.ts          → 接口定义（空接口 + 注释说明）
│   │   ├── MockAdapter.ts       → 空类（implements IAdapter）
│   │   └── HttpAdapter.ts       → 空类（implements IAdapter）
│   └── modules/
│       ├── dashboard.api.ts     → 空导出 + TODO 注释
│       ├── map.api.ts           → 空导出 + TODO 注释
│       └── ranking.api.ts       → 空导出 + TODO 注释
├── components/
│   ├── ui/
│   │   ├── StatCard/            → index.tsx + StatCard.module.css
│   │   ├── PageHeader/          → index.tsx + PageHeader.module.css
│   │   └── Loading/             → index.tsx + Loading.module.css
│   ├── chart/
│   │   ├── BaseChart/           → index.tsx (ECharts 通用封装)
│   │   ├── LineChart/           → index.tsx
│   │   ├── BarChart/            → index.tsx
│   │   ├── PieChart/            → index.tsx
│   │   └── MapChart/            → index.tsx
│   └── layout/
│       ├── DashboardGrid/       → index.tsx + DashboardGrid.module.css
│       └── DashboardCard/       → index.tsx + DashboardCard.module.css
├── features/
│   ├── sales-overview/
│   │   ├── index.tsx
│   │   ├── SalesOverview.tsx
│   │   ├── hooks/
│   │   │   └── useSalesData.ts
│   │   ├── components/
│   │   │   ├── SalesKPI.tsx
│   │   │   └── SalesTrend.tsx
│   │   ├── __tests__/
│   │   │   ├── SalesOverview.test.tsx
│   │   │   └── useSalesData.test.ts
│   │   └── types.ts
│   ├── geo-distribution/
│   │   ├── index.tsx
│   │   ├── GeoDistribution.tsx
│   │   ├── hooks/
│   │   │   └── useGeoData.ts
│   │   ├── components/
│   │   │   ├── ChinaMap.tsx
│   │   │   └── CityRanking.tsx
│   │   ├── __tests__/
│   │   │   └── GeoDistribution.test.tsx
│   │   └── types.ts
│   └── real-time-ranking/
│       ├── index.tsx
│       ├── RealTimeRanking.tsx
│       ├── hooks/
│       │   └── useRankingData.ts
│       ├── components/
│       │   ├── RankingList.tsx
│       │   └── RankingBar.tsx
│       ├── __tests__/
│       │   └── RealTimeRanking.test.tsx
│       └── types.ts
├── hooks/
│   ├── useScreenAdapt.ts
│   ├── useIntervalFetch.ts
│   └── useWebSocket.ts
├── stores/
│   ├── dashboard.store.ts
│   ├── theme.store.ts
│   └── filter.store.ts
├── services/
│   ├── dashboard.service.ts
│   └── data-transform.service.ts
├── logger/
│   ├── index.ts
│   ├── LightLog.ts
│   ├── transports/
│   │   ├── ConsoleTransport.ts
│   │   ├── BufferTransport.ts
│   │   └── BeaconTransport.ts
│   └── decorators/
│       ├── logMethod.ts
│       └── logPageView.ts
├── types/
│   ├── api.ts
│   ├── dashboard.ts
│   ├── chart.ts
│   └── global.d.ts
├── utils/
│   ├── format.ts
│   ├── color.ts
│   └── screen.ts
├── constants/
│   ├── api-paths.ts
│   ├── chart-defaults.ts
│   └── theme.ts
└── styles/
    ├── global.css
    ├── variables.css
    └── dashboard-theme.css
mock-server/
├── fixtures/
│   ├── dashboard.json
│   ├── map-geo.json
│   └── ranking.json
└── handlers/
    ├── dashboard.handler.ts
    ├── map.handler.ts
    └── ranking.handler.ts
tests/
├── setup.ts
├── integration/
│   └── dashboard-flow.test.ts
└── e2e/
    └── dashboard.spec.ts
```

**验证标准**：
- `find src -type d | wc -l` 返回完整的目录数量
- 每个目录至少有一个 `.tsx` 或 `.ts` 占位文件（带 `// TODO` 注释）

**提交**：`chore: create complete directory tree with placeholder files`

---

### Step 4 — 基础类型与常量定义

**目标**：先写类型再写功能（TypeScript 类型驱动开发）

**4.1 `src/types/api.ts`** — API 通用泛型响应格式

```typescript
// 标准 API 响应包裹
export interface ApiResponse<T> {
  code: number;       // 0=成功
  message: string;
  data: T;
  timestamp: number;
}

// 列表查询通用参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}
```

**4.2 `src/types/dashboard.ts`** — 业务实体类型

```typescript
// KPI 指标
export interface KPIItem {
  id: string;
  title: string;           // "总销售额"
  value: number;           // 123456789
  unit: string;            // "元"
  trend: number;           // 同比变化百分比 12.5
  trendDirection: 'up' | 'down' | 'flat';
  icon: string;            // icon name
}

// 销售趋势数据点
export interface TrendPoint {
  date: string;            // "2026-07-01"
  sales: number;           // 当日销售额
  orders: number;          // 当日订单数
}

// 地理分布数据
export interface GeoDataItem {
  name: string;            // 省份名 "广东省"
  value: number;           // 销售额
  count: number;           // 订单数
}

// 实时排行数据
export interface RankingItem {
  rank: number;
  name: string;            // 城市/品牌/品类
  value: number;
  percentage: number;      // 占比
  trend: 'up' | 'down' | 'flat';
  change: number;          // 排名变化
}

// Dashboard 完整数据
export interface DashboardData {
  kpis: KPIItem[];
  salesTrend: TrendPoint[];
  geoData: GeoDataItem[];
  categoryRanking: RankingItem[];
  cityRanking: RankingItem[];
}
```

**4.3 `src/types/chart.ts`** — 图表组件 Props 类型

```typescript
import type { EChartsOption } from 'echarts';

export interface BaseChartProps {
  option: EChartsOption;
  height?: number | string;
  className?: string;
  loading?: boolean;
  onChartReady?: (chart: any) => void;
}

export interface ChartSeriesStyle {
  lineColor?: string;
  areaColor?: string;
  barColor?: string;
}
```

**4.4 `src/constants/theme.ts`** — 大屏配色常量

```typescript
export const DASHBOARD_COLORS = {
  background: '#0a0e27',
  cardBg: 'rgba(26, 31, 58, 0.85)',
  cardBorder: 'rgba(0, 212, 255, 0.15)',
  accent: '#00d4ff',
  success: '#00ff88',
  warning: '#ffa502',
  danger: '#ff4757',
  text: '#e8eaed',
  textSecondary: '#8892b0',
} as const;

export const CHART_COLORS = [
  '#00d4ff', '#00ff88', '#ffa502', '#ff4757',
  '#7c4dff', '#18ffff', '#ff6d00', '#76ff03',
];
```

**4.5 `src/constants/api-paths.ts`** — API 路径集中管理

```typescript
export const API_PATHS = {
  DASHBOARD_OVERVIEW: '/api/dashboard/overview',
  DASHBOARD_KPIS:     '/api/dashboard/kpis',
  GEO_DISTRIBUTION:   '/api/dashboard/geo',
  RANKING_LIST:       '/api/dashboard/ranking',
  MAP_GEOJSON:        '/api/map/geojson',
} as const;
```

**4.6 `src/constants/chart-defaults.ts`** — ECharts 默认公共配置

```typescript
import type { EChartsOption } from 'echarts';
import { DASHBOARD_COLORS, CHART_COLORS } from './theme';

export const CHART_DEFAULTS: Record<string, Partial<EChartsOption>> = {
  common: {
    backgroundColor: 'transparent',
    color: [...CHART_COLORS],
    textStyle: { color: DASHBOARD_COLORS.textSecondary },
  },
  line: {
    grid: { top: 20, right: 30, bottom: 30, left: 50 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: DASHBOARD_COLORS.textSecondary, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
      axisLabel: { color: DASHBOARD_COLORS.textSecondary, fontSize: 11 },
    },
  },
  // ... bar / pie / map 等后续逐类定义
};
```

**验证标准**：
- `npm run typecheck` 通过
- 所有 interface 有 JSDoc 注释

**提交**：`feat: define global types, constants, API paths and chart defaults`

---

### Step 5 — Mock 数据与 MockAdapter 实现

**目标**：先造数据再写 UI，确保开发过程始终有"真实感"数据可看

**5.1 Mock 数据编写**

`mock-server/fixtures/dashboard.json`：
- 生成 4 个 KPI 指标（总销售额 1.28亿、订单量 36.5万、客单价 352、转化率 8.2%）
- 生成 30 天销售趋势数据（2026-06-08 至 2026-07-07）
- 每个数据点含 `date`, `sales`, `orders`

`mock-server/fixtures/map-geo.json`：
- 中国 34 个省级行政区的地理分布数据
- 每项含 `name`, `value`（销售额，100万-5000万随机）

`mock-server/fixtures/ranking.json`：
- 品类排行 Top 8（电子产品、服装、食品、家居、美妆、运动、图书、母婴）
- 城市排行 Top 10
- 每项含 `rank`, `name`, `value`, `percentage`, `trend`, `change`

**数据约束**：
- 所有数据必须仿真（中文名称、符合商业逻辑的数值范围）
- 每次请求返回略有波动的数据（模拟真实 API 的微小变化）

**5.2 `src/api/adapters/IAdapter.ts`** — 适配器接口

```typescript
export interface IAdapter {
  get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>>;
}
```

**5.3 `src/api/adapters/MockAdapter.ts`** — Mock 实现

- 实现 IAdapter
- `get()` 方法根据 url 匹配对应的 handler
- `post()` 方法相同逻辑
- handler 读取 fixtures JSON，加入 `±2%` 随机波动
- 延迟 200-400ms（模拟真实网络延迟）

**5.4 `src/api/adapters/HttpAdapter.ts`** — 真实 HTTP 实现

- 内部实例化 Axios（baseURL 从环境变量读取）
- 实现 IAdapter

**5.5 `src/api/client.ts`** — 统一出口（工厂模式）

```typescript
// 根据环境变量选择适配器
// 导出单例 adapter 供所有 api module 使用
```

**5.6 `src/api/modules/dashboard.api.ts`** — Dashboard API

```typescript
// 调用 adapter.get<DashboardData>(API_PATHS.DASHBOARD_OVERVIEW)
```

**验证标准**：
- 在 `src/main.tsx` 中临时调用 `fetchDashboardData()` 并 console.log 结果
- 浏览器 Console 能看到完整的 Mock 数据返回
- `npm run typecheck` 通过

**提交**：`feat: implement MockAdapter with simulated Chinese business data`

---

### Step 6 — 日志埋点系统（LightLog）

**目标**：实现可插拔的轻量级日志系统

**6.1 `src/logger/LightLog.ts`** — 核心 Logger 类

```typescript
class LightLog {
  private transports: ITransport[];
  
  // 5 个层级方法
  pv(pageName: string, extra?: Record<string, unknown>): void;
  event(name: string, extra?: Record<string, unknown>): void;
  apiTrace(url: string, duration: number, status: number): void;
  error(err: Error, context?: string): void;
  perf(metric: string, value: number): void;
}
```

**6.2 三个 Transport 实现**
- `ConsoleTransport` — 开发环境彩色 console 输出
- `BufferTransport` — 内存环形缓冲（最多存 200 条，供调试查看）
- `BeaconTransport` — 占位实现（后期对接真实后端打点 API）

**6.3 `src/logger/index.ts`** — 导出单例

```typescript
export const logger = new LightLog([new ConsoleTransport(), ...]);
```

**验证标准**：
- 在 main.tsx 中调用 `logger.pv('dashboard')` 能看到 Console 彩色输出
- `logger.apiTrace('/api/dashboard', 234, 200)` 输出请求耗时日志

**提交**：`feat: implement LightLog logger system with Console and Buffer transports`

---

### Step 7 — 工具函数

**7.1 `src/utils/format.ts`**
- `formatCurrency(value: number): string` — 1.28亿 / 36.5万 等中文单位格式化
- `formatNumber(value: number): string` — 千分位
- `formatPercent(value: number): string` — 百分比 12.5%
- `formatTrend(value: number): string` — +12.5% / -3.2%（带符号）

**7.2 `src/utils/screen.ts`**
- `getScreenScale(designWidth, designHeight): number` — 根据实际视口计算 scale 比例
- `debounce(fn, delay): Function`

**7.3 `src/utils/color.ts`**
- `hexToRgba(hex, alpha): string` — rgba(0, 212, 255, 0.8)
- `generateGradient(colors, direction): string` — CSS linear-gradient

**验证标准**：
- 写 Vitest 单元测试用例覆盖每个工具函数
- `npx vitest run` 全部通过

**提交**：`feat: implement utility functions with unit tests`

---

### Step 8 — 全局 State（Zustand Stores）

**8.1 `src/stores/dashboard.store.ts`**

```typescript
// 管理 Dashboard 全量数据
// - data: DashboardData | null
// - loading: boolean
// - error: string | null
// - lastUpdated: number (timestamp)
// - fetchDashboard(): Promise<void>
// - refetchInterval: 30s 自动刷新
```

**8.2 `src/stores/theme.store.ts`**

```typescript
// 主题切换（预留）
// - theme: 'dark' | 'light'
// - toggleTheme()
```

**8.3 `src/stores/filter.store.ts`**

```typescript
// 全局筛选条件
// - dateRange: [string, string]
// - selectedRegions: string[]
// - setDateRange / setRegions
```

**验证标准**：
- 写 Vitest 测试 `dashboardStore.fetchDashboard()` 能更新 store 状态
- 测试 loading → data → lastUpdated 的完整流转

**提交**：`feat: implement Zustand stores with Vitest tests`

---

### Step 9 — 通用组件开发

**9.1 `src/components/layout/DashboardGrid/`**

```tsx
// 12 列 CSS Grid 大屏布局
// 支持 Grid Item 跨列/跨行配置
// props: { children, cols?: 12, gap?: 12 }
// CSS Modules: 使用 CSS Grid + gap
```

**9.2 `src/components/layout/DashboardCard/`**

```tsx
// 大屏卡片容器
// 半透明深蓝背景 + 发光边框 + backdrop-blur
// props: { title, children, className? }
// 左上角标题，右上角可扩展区
// 高度 100% 填充父级 Grid Cell
```

**9.3 `src/components/ui/StatCard/`**

```tsx
// KPI 数据卡片
// 顶部 icon + 标题 + 趋势箭头
// 中间：大号等宽数字（已格式化）
// 底部：同比变化 + 迷你趋势线（CSS 实现）
```

**9.4 `src/components/ui/PageHeader/`**

```tsx
// 大屏顶部标题栏
// 左侧：项目 Logo + "洞察之墙 | InsightWall" + 副标题
// 中间：当前日期时间（每秒刷新）
// 右侧：Mock 模式指示器（橙色圆点 + "模拟数据"）+ 数据刷新时间
```

**9.5 `src/components/ui/Loading/`**

```tsx
// 大屏专用 Loading
// 居中旋转动画 + "数据加载中..." 文本
```

**9.6 `src/components/chart/BaseChart/`**

```tsx
// ECharts 通用封装
// 用 echarts-for-react 的 <ReactECharts>
// 统一处理：
//   - resize 监听（容器尺寸变化时 chart.resize()）
//   - loading 状态（showLoading / hideLoading）
//   - theme 注入（合并 CHART_DEFAULTS.common）
//   - 导出 chartInstance ref 供父组件高级操作
// props: { option, height?, loading?, onChartReady?, theme? }
```

**9.7 `src/components/chart/LineChart/`、`BarChart/`、`PieChart/`、`MapChart/`**

```tsx
// 基于 BaseChart 的预设封装
// LineChart: 注入 CHART_DEFAULTS.line
// BarChart: 注入 CHART_DEFAULTS.bar
// 每个 ≤ 50 行，仅做默认配置注入 + 数据映射
```

**验证标准**：
- 写 Testing Library 组件测试
- StatCard 渲染 props.title 内容
- DashboardCard 渲染 children
- BaseChart 渲染 ECharts canvas 容器
- `npx vitest run` 全部通过

**提交**：`feat: implement common UI and chart components with tests`

---

### Step 10 — 业务 Feature 模块开发

**目标**：组装 API + Store + Components = 完整业务模块

#### 10.1 SalesOverview（销售概览）

**文件清单**：
- `src/features/sales-overview/types.ts` — 模块内类型
- `src/features/sales-overview/hooks/useSalesData.ts` — 数据获取 Hook
  - 从 `dashboardStore` 读取 kpis + salesTrend
  - useEffect 触发 fetch
  - 返回 { kpis, trend, loading, error }
- `src/features/sales-overview/components/SalesKPI.tsx`
  - 渲染 4 个 StatCard 一行排列
- `src/features/sales-overview/components/SalesTrend.tsx`
  - LineChart 渲染 30 天销售趋势
  - 双 Y 轴（销售额 + 订单数）
  - Tooltip 显示格式化金额
- `src/features/sales-overview/SalesOverview.tsx`
  - 组合 SalesKPI + SalesTrend
- `src/features/sales-overview/index.tsx` — 模块入口（导出 SalesOverview）

#### 10.2 GeoDistribution（地理分布）

**文件清单**：
- `src/features/geo-distribution/hooks/useGeoData.ts`
- `src/features/geo-distribution/components/ChinaMap.tsx`
  - MapChart 渲染中国地图热力图
  - 使用 ECharts map + scatter / effectScatter 实现
  - 加载中国 GeoJSON（从 CDN 或内置）
- `src/features/geo-distribution/components/CityRanking.tsx`
  - 省份销售排行表（左侧表格 + 右侧迷你柱状图）
- `src/features/geo-distribution/GeoDistribution.tsx`
- `src/features/geo-distribution/index.tsx`

#### 10.3 RealTimeRanking（实时排行）

**文件清单**：
- `src/features/real-time-ranking/hooks/useRankingData.ts`
  - useIntervalFetch 每 5s 刷新一次，数据微小波动
- `src/features/real-time-ranking/components/RankingList.tsx`
  - 品类排行 Top 8 列表
  - 每行：排名徽章 + 名称 + 进度条 + 数值 + 趋势箭头
  - 前 3 名金银铜色 rank badge
- `src/features/real-time-ranking/components/RankingBar.tsx`
  - BarChart 水平柱状图可视化排行
- `src/features/real-time-ranking/RealTimeRanking.tsx`
- `src/features/real-time-ranking/index.tsx`

**验证标准**：
- 每个 feature 写 2 个关键测试用例
- `npx vitest run` 全部通过

**提交**：每条 feature 单独提交
- `feat: implement SalesOverview feature with KPI cards and trend chart`
- `feat: implement GeoDistribution feature with China heatmap`
- `feat: implement RealTimeRanking feature with auto-refresh`

---

### Step 11 — 全局 Hooks

**11.1 `src/hooks/useScreenAdapt.ts`**

```typescript
// 监听 window resize，计算 transform scale
// 基准设计尺寸：1920 x 1080
// 返回 { scale, containerStyle } 直接挂到根容器
// 触发 logger.perf('screenAdapt', scale)
```

**11.2 `src/hooks/useIntervalFetch.ts`**

```typescript
// 通用轮询 Hook
// 参数：fn, interval, enabled
// 自动清理 interval
```

**11.3 `src/hooks/useWebSocket.ts`**

```typescript
// 预留 WebSocket Hook（仅骨架，不做真实连接）
// 导出 createWebSocket(url) → { send, messages, readyState }
```

**验证标准**：
- `useScreenAdapt` 测试：模拟 resize 事件，断言 scale 变化
- `useIntervalFetch` 测试：Vitest fake timers 验证 fn 被调用次数

**提交**：`feat: implement global hooks with unit tests`

---

### Step 12 — Service 层与样式系统

**12.1 `src/services/dashboard.service.ts`**

```typescript
// 业务服务层：组合多个 API 调用 + 数据聚合
// getFullDashboard(): 一次性获取全部 Dashboard 数据
// refreshRealtime(): 仅刷新实时排行数据
```

**12.2 `src/services/data-transform.service.ts`**

```typescript
// 数据转换管道
// transformSalesToChartOption(data) → ECharts option
// transformGeoToMapOption(data) → ECharts map option
// transformRankingToChartOption(data) → ECharts bar option
```

**12.3 全局样式 `src/styles/`**

`variables.css`：
```css
:root {
  --color-bg: #0a0e27;
  --color-card-bg: rgba(26, 31, 58, 0.85);
  --color-accent: #00d4ff;
  --color-success: #00ff88;
  /* ... 全部颜色变量 */
  --radius-card: 12px;
  --border-glow: 1px solid rgba(0, 212, 255, 0.15);
}
```

`dashboard-theme.css`：
- 大屏全局样式
- body 背景色
- 滚动条美化（隐藏默认滚动条）
- 标题字体导入（@import url Orbitron 或其他科技字体）
- 卡片 hover 发光增强

`global.css`：
```css
@import './variables.css';
@import './dashboard-theme.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**验证标准**：
- `npm run dev` 启动后页面背景为深色
- 浏览器开发者工具检查 CSS 变量是否生效

**提交**：`feat: implement services layer and dashboard visual styles`

---

### Step 13 — 页面装配（App.tsx + MainLayout）

**13.1 `src/App.tsx`**

```tsx
// React Router 路由配置
// "/" → MainLayout (包含大屏所有模块)
// "/demo/map" → 地图独立 demo 页（预留）
// 使用 React.lazy 懒加载（生产环境优化，开发环境可不拆）
```

**13.2 MainLayout 页面组件**

```tsx
// 完整大屏布局：
// ┌──────────────────────────────────────────────┐
// │  PageHeader（标题栏）                          │
// ├──────────┬──────────┬──────────┬─────────────┤
// │ SalesKPI │ SalesKPI │ SalesKPI │ SalesKPI    │  ← 1 行 4 列
// ├──────────┴──────────┼──────────┴─────────────┤
// │   SalesTrend        │   GeoDistribution      │  ← 1 行 2 列（左宽右窄）
// │   (折线图 60%宽)    │   (地图 40%宽)          │
// ├─────────────────────┼────────────────────────┤
// │   RealTimeRanking   │   CityRanking          │  ← 1 行 2 列
// │   (品类排行 50%)    │   (城市分布表 50%)      │
// └─────────────────────┴────────────────────────┘
//
// 外层容器使用 useScreenAdapt() 做等比缩放
```

**13.3 `src/main.tsx`**

```tsx
// ReactDOM.createRoot
// <BrowserRouter>
//   <App />
// </BrowserRouter>
//
// 额外：
// - logger.pv('dashboard') 页面浏览埋点
// - 全局错误边界 ErrorBoundary
```

**验证标准**：
- `npm run dev` 打开 `http://localhost:5173`
- 能看到完整大屏：标题栏 + 4 个 KPI + 折线图 + 地图 + 排行
- 所有数据来自 Mock，页面视觉为深色科技蓝风格
- 缩放浏览器窗口，大屏等比缩放（保持 16:9 比例）

**提交**：`feat: assemble main dashboard page with responsive layout`

---

### Step 14 — 集成测试与 E2E

**14.1 `tests/setup.ts`**

```typescript
// 引入 @testing-library/jest-dom
// Mock ResizeObserver（ECharts 需要）
// Mock window.matchMedia
```

**14.2 `tests/integration/dashboard-flow.test.ts`**

```typescript
// 测试完整数据加载流程：
// 1. 页面渲染
// 2. 标题栏显示 "洞察之墙"
// 3. 4 个 KPI 卡片加载完成
// 4. 折线图 canvas 渲染
// 5. 地图 canvas 渲染
// 6. 排行列表渲染 8 项
// Mock 所有 API 调用（使用 MockAdapter）
```

**14.3 `tests/e2e/dashboard.spec.ts`**

```typescript
// Playwright E2E
// 1. 打开页面
// 2. 等待所有图表渲染
// 3. 截图对比（截图保存到 tests/e2e/screenshots/）
// 4. 验证页面标题
// 5. 模拟窗口缩放
```

**验证标准**：
- `npx vitest run` 集成测试通过
- `npx playwright test` E2E 测试通过（有截图输出）

**提交**：`test: add integration and E2E tests for dashboard page`

---

### Step 15 — CI/CD 配置

**创建 `.github/workflows/ci.yml`**：

```yaml
name: CI
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npx vitest run --coverage
      - run: npm run build
```

**验证标准**：
- 推送到 GitHub 后 Actions 自动执行并全部通过

**提交**：`ci: add GitHub Actions workflow for lint + test + build`

---

### Step 16 — README 完善

更新项目 README.md，包含：
- 快速开始（clone + npm install + npm run dev）
- 技术栈一览
- 项目结构图
- Mock 模式说明（`.env` 中 `VITE_MOCK=true/false`）
- 学习路线图（链接到 docs/）
- 截图占位符（等 E2E 截图产出后填入）

**提交**：`docs: update README with quick start guide and project structure`

---

## 3. 每一步执行前的自检清单

AI 在每步开始前必须回答以下 4 个问题：

1. **这一步创建哪些文件？** → 列出完整路径
2. **这一步依赖哪些上一步的输出？** → 确认依赖已就绪
3. **这一步完成后如何验证？** → 给出可执行的验证命令
4. **这一步的 commit message 是什么？** → 遵循 Conventional Commits

---

## 4. 最终验收标准

完成全部 16 步后，执行以下验收：

### 4.1 运行验收

```bash
npm install && npm run dev
```

浏览器打开 `http://localhost:5173` 应看到：

- [ ] 深色科技蓝背景的全屏大屏
- [ ] 顶部标题栏："洞察之墙 | InsightWall" + 实时日期 + "模拟数据" 标记
- [ ] 第一行：4 个 KPI 卡片（总销售额 1.28亿、订单量 36.5万、客单价 352元、转化率 8.2%）
- [ ] 第二行左侧：30 天销售趋势折线图（双轴）
- [ ] 第二行右侧：中国地图热力图
- [ ] 第三行左侧：品类实时排行 Top 8（带进度条和趋势箭头）
- [ ] 第三行右侧：城市销售分布表
- [ ] 缩放浏览器窗口，大屏等比自适应缩放
- [ ] 每 5 秒排行数据轻微波动（模拟实时刷新）

### 4.2 质量验收

```bash
npm run typecheck   # ✅ 0 errors
npm run lint        # ✅ 0 errors 0 warnings
npx vitest run      # ✅ 全部测试通过
npm run build       # ✅ 构建成功
```

### 4.3 架构验收

- [ ] 目录结构与文档中方案一的目录图一致
- [ ] `src/api/adapters/` 下有 IAdapter / MockAdapter / HttpAdapter 三个文件
- [ ] `src/features/` 下三个模块各自独立（sales-overview / geo-distribution / real-time-ranking）
- [ ] 环境变量 `VITE_MOCK=true` 用 MockAdapter，`VITE_MOCK=false` 用 HttpAdapter（不需真实后端验证切换，只需代码逻辑正确）
- [ ] Logger 在浏览器 Console 输出彩色日志

---

## 5. 使用方式

将以上第 0-2 节 + 第 4 节 + 以下指令直接发送给 AI：

> 请严格按照上述"执行步骤"从 Step 1 开始执行，每完成一步自动验证并通过后提交，然后继续下一步。不要跳过任何步骤，不要合并多个 Step。在第 13 步完成后运行 `npm run dev` 并验证页面效果。

---

> 📌 提示词版本：v1.0 | 基于架构方案一 | 最后更新 2026-07-07
> 配套架构文档：[docs/architecture-proposals.md](./architecture-proposals.md)