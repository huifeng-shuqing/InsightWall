# InsightWall（洞察之墙）前端技术架构方案

> 输出日期：2026-07-07 | 阶段：架构设计 | 项目当前状态：骨架初始化

---

## 硬性约束回顾

| 约束 | 说明 |
|------|------|
| **纯前端 + Mock** | 当前零后端，全量 Mock；架构预留真实 API 切换能力 |
| **完整配套体系** | 测试 → 日志埋点 → 代码质量管控，三件套缺一不可 |
| **强制分层拆分** | 禁止单文件堆砌，目录即架构，模块即边界 |

---

## 方案一：React + TypeScript + ECharts + Zustand（推荐）

### 定位

**稳定可靠 · 社区第一 · 最适合零基础 → 进阶的学习曲线**

### 技术栈

| 层级 | 选型 | 版本 | 选择理由 |
|------|------|------|----------|
| 框架 | React | 18.x | 生态最大，教程最多，企业需求第一 |
| 语言 | TypeScript | 5.x | 严格模式 + 类型即文档 |
| 可视化 | ECharts | 5.x | 中文友好，示例海量，内置地图 |
| 状态管理 | Zustand | 5.x | 比 Redux 轻 10 倍，无模板代码，TS 天然友好 |
| 路由 | React Router | 6.x | 标准选择，懒加载内置 |
| 构建 | Vite | 6.x | 秒级 HMR，零配置 |
| 样式 | Tailwind CSS + CSS Modules | 4.x | 原子化 + 局部隔离互补 |
| HTTP 客户端 | Axios | 1.x | 拦截器机制天然适合 Mock/API 切换 |
| 测试框架 | Vitest | 2.x | 与 Vite 共享配置，零切换成本 |
| 组件测试 | Testing Library | 16.x | 以用户视角测试，不测实现细节 |
| E2E 测试 | Playwright | 1.x | 多浏览器，内置录屏/截图 |
| 日志埋点 | 自研 LightLog + AOP 装饰器 | - | 轻量、可插拔、零依赖 |
| 代码质量 | ESLint + Prettier + Husky + lint-staged | - | 业界标准四件套 |
| 提交规范 | Commitlint + Commitizen | - | Conventional Commits |

### 目录分层设计

```
InsightWall/
├── .github/
│   └── workflows/               # CI/CD
│       ├── ci.yml               # lint + test + build
│       └── chromatic.yml        # 可选：视觉回归
├── .husky/
│   ├── pre-commit               # lint-staged
│   └── commit-msg               # commitlint
├── docs/                        # 文档独立于源码
│   └── architecture-proposals.md
├── mock-server/                 # ⭐ Mock 独立进程（非侵入式）
│   ├── index.ts                 # JSON Server 或 Mock 入口
│   ├── handlers/                # 按域拆分 Mock 处理器
│   │   ├── dashboard.handler.ts
│   │   ├── map.handler.ts
│   │   └── ranking.handler.ts
│   └── fixtures/                # Mock 数据静态文件
│       ├── dashboard.json
│       ├── map-geo.json
│       └── ranking.json
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                 # 应用入口（< 30 行）
│   ├── App.tsx                  # 路由挂载（< 20 行）
│   │
│   ├── api/                     # ⭐ API 层 — Mock/真实切换的核心
│   │   ├── client.ts            # Axios 实例 + 拦截器
│   │   ├── adapters/            # 请求适配器（工厂模式）
│   │   │   ├── IAdapter.ts      # 适配器接口
│   │   │   ├── MockAdapter.ts   # Mock 实现
│   │   │   └── HttpAdapter.ts   # 真实 HTTP 实现
│   │   └── modules/            # 按业务域拆分 API
│   │       ├── dashboard.api.ts
│   │       ├── map.api.ts
│   │       └── ranking.api.ts
│   │
│   ├── components/              # 通用 UI 组件（无业务逻辑）
│   │   ├── ui/                  # 原子级 UI
│   │   │   ├── Button/
│   │   │   ├── Modal/
│   │   │   └── Spin/
│   │   ├── chart/               # 图表组件封装
│   │   │   ├── BaseChart/       # ECharts 通用封装
│   │   │   ├── LineChart/
│   │   │   ├── BarChart/
│   │   │   ├── PieChart/
│   │   │   └── MapChart/
│   │   └── layout/              # 布局组件
│   │       ├── DashboardGrid/   # 大屏栅格系统
│   │       └── DashboardCard/   # 卡片容器
│   │
│   ├── features/                # ⭐ 业务功能模块（核心拆分单元）
│   │   ├── sales-overview/      # 销售概览模块
│   │   │   ├── index.tsx        # 模块入口
│   │   │   ├── SalesOverview.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useSalesData.ts
│   │   │   ├── components/      # 模块私有组件
│   │   │   │   ├── SalesTrend.tsx
│   │   │   │   └── SalesKPI.tsx
│   │   │   ├── __tests__/
│   │   │   │   ├── SalesOverview.test.tsx
│   │   │   │   └── useSalesData.test.ts
│   │   │   └── types.ts
│   │   ├── geo-distribution/    # 地理分布模块
│   │   │   ├── index.tsx
│   │   │   ├── GeoDistribution.tsx
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   ├── __tests__/
│   │   │   └── types.ts
│   │   └── real-time-ranking/   # 实时排行模块
│   │       ├── index.tsx
│   │       ├── RealTimeRanking.tsx
│   │       ├── hooks/
│   │       ├── components/
│   │       ├── __tests__/
│   │       └── types.ts
│   │
│   ├── hooks/                   # 全局通用 Hooks
│   │   ├── useMockMode.ts       # Mock 模式开关
│   │   ├── useScreenAdapt.ts    # 大屏缩放适配
│   │   ├── useIntervalFetch.ts  # 轮询数据
│   │   └── useWebSocket.ts      # WebSocket（预留）
│   │
│   ├── stores/                  # Zustand 状态管理
│   │   ├── dashboard.store.ts
│   │   ├── theme.store.ts
│   │   └── filter.store.ts      # 全局筛选条件
│   │
│   ├── services/                # 业务服务层（组合多个 API）
│   │   ├── dashboard.service.ts
│   │   └── data-transform.service.ts
│   │
│   ├── logger/                  # ⭐ 日志埋点系统
│   │   ├── index.ts             # 对外导出
│   │   ├── LightLog.ts          # 日志核心类
│   │   ├── transports/          # 日志传输通道
│   │   │   ├── ConsoleTransport.ts
│   │   │   ├── BufferTransport.ts
│   │   │   └── BeaconTransport.ts
│   │   └── decorators/          # AOP 装饰器
│   │       ├── logMethod.ts     # 方法调用埋点
│   │       └── logPageView.ts   # 页面访问埋点
│   │
│   ├── types/                   # 全局类型定义
│   │   ├── api.ts               # API 通用响应格式
│   │   ├── dashboard.ts
│   │   ├── chart.ts
│   │   └── global.d.ts
│   │
│   ├── utils/                   # 纯工具函数（可单独测试）
│   │   ├── format.ts            # 数值/日期格式化
│   │   ├── color.ts             # 大屏配色方案
│   │   ├── screen.ts            # 分辨率计算
│   │   └── validator.ts         # 数据校验
│   │
│   ├── constants/               # 常量
│   │   ├── api-paths.ts         # API 路径集中管理
│   │   ├── chart-defaults.ts    # ECharts 默认配置
│   │   └── theme.ts
│   │
│   └── styles/
│       ├── global.css
│       ├── variables.css        # CSS 变量（主题色/尺寸）
│       └── dashboard-theme.css  # 大屏专有样式
│
├── tests/                       # 集成 / E2E 测试
│   ├── setup.ts                 # 全局测试配置
│   ├── integration/
│   │   └── dashboard-flow.test.ts
│   └── e2e/
│       ├── dashboard.spec.ts
│       └── fixtures/
│
├── .eslintrc.cjs
├── .prettierrc
├── commitlint.config.cjs
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

### 核心理念：声明式配置，React 的自然延伸

ECharts 的核心抽象是 **option 对象**——一个巨大的 JSON 声明式配置。这天然契合 React `props → UI` 的数据驱动理念。把 ECharts option 视为 React 组件的输出，你的思维模型是统一的：**写一套声明式配置，得到一个图表**。

```tsx
// 典型使用：数据 → option → 图表，单一数据流
const option = useMemo<ECHartsOption>(() => ({
  ...CHART_DEFAULTS.line,
  dataset: { source: salesData }
}), [salesData]);

return <BaseChart option={option} />;
```

### Mock 与 API 兼容机制

```
                        ┌──────────────────────┐
                        │   .env 环境变量       │
                        │   VITE_MOCK=true      │
                        └────────┬─────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   src/api/adapters/      │
                    │                          │
                    │  ┌──────────────────┐    │
                    │  │  IAdapter 接口    │    │
                    │  │  request(config)  │    │
                    │  └───┬──────────▲───┘    │
                    │      │          │         │
                    │  ┌───▼──┐  ┌───┴──────┐  │
                    │  │Mock  │  │  Http    │  │
                    │  │Adapter│  │Adapter   │  │
                    │  └───┬──┘  └───┬──────┘  │
                    └──────┼─────────┼─────────┘
                           │         │
              ┌────────────▼─┐   ┌───▼──────────┐
              │ mock-server/ │   │ 真实后端 API  │
              │ handlers     │   │ nginx → 后端  │
              └──────────────┘   └──────────────┘
```

核心实现思路：

```typescript
// src/api/adapters/IAdapter.ts
interface IAdapter {
  get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: Record<string, any>): Promise<ApiResponse<T>>;
}

// src/api/client.ts — 统一入口，根据环境变量选择实现
const adapter: IAdapter = import.meta.env.VITE_MOCK
  ? new MockAdapter(mockHandlers)
  : new HttpAdapter(axiosInstance);

// 上层完全不感知 Mock / 真实差异
// dashboard.api.ts
export const fetchDashboardData = () =>
  adapter.get<DashboardData>(API_PATHS.DASHBOARD_OVERVIEW);
```

**切换后端只需：改一行环境变量** `VITE_MOCK=false`，架构零变化。

适配器模式对学习者的关键价值：**每一行切换代码都是你自己写的**，出问题直接打印 `adapter instanceof MockAdapter` 就能追踪，没有"黑盒魔法"。理解"接口抽象→工厂注入→上层无感"这个模式，比 Mock 本身更重要——这是企业级项目中"替换数据源"的标准范式。

### 测试方案

```
测试金字塔                    InsightWall 覆盖策略
─────────────────────────────────────────────────
      ╱ E2E ╲                 Playwright
     ╱───────╲                • 大屏完整渲染 + 所有模块加载
    ╱  集成   ╲               • 数据刷新轮询流程
   ╱───────────╲              Vitest + Testing Library
  ╱   单元测试   ╲            • 每个 feature/hooks/stores 独立测
 ╱───────────────╲           • 工具函数纯函数全覆盖
╱  静态分析        ╲          TypeScript strict + ESLint
─────────────────────────────────────────────────
```

| 层级 | 工具 | 覆盖目标 | 目录规则 |
|------|------|----------|----------|
| 静态分析 | TS strict + ESLint | 类型错误零容忍 | 提交前 gate |
| 单元测试 | Vitest | utils/hooks/stores ≥90% | `__tests__/` 与源文件同目录 |
| 组件测试 | Testing Library | 每个 feature 核心组件 | 与 feature 同目录 `__tests__/` |
| 集成测试 | Vitest | Mock 数据 → 渲染 → 交互全链路 | `tests/integration/` |
| E2E | Playwright | 大屏全页面关键路径 | `tests/e2e/` |
| 视觉回归 | 预留 Chromatic | 大屏视觉一致性 | CI 可选 |

**Testing Library 核心理念**：测试行为，不测试实现。用户看到什么，测试就断言什么。

```typescript
// ✅ TDD-friendly：先写测试，再写 UI
// 测试关心"用户看到什么"，不关心内部状态变量名
test('加载完成后显示 4 个 KPI 卡片', async () => {
  render(<SalesOverview />);
  await waitFor(() => {
    expect(screen.getAllByTestId('kpi-card')).toHaveLength(4);
  });
});
```

### 日志埋点方案

分层设计，从组件 → 业务 → 请求全链路覆盖：

```
┌──────────────────────────────────────┐
│           日志层级模型                 │
├──────────────────────────────────────┤
│  Level 1: PV/UV    页面级埋点         │
│  Level 2: Event     用户交互          │
│  Level 3: API       请求/响应耗时     │
│  Level 4: Error     JS 错误/异常      │
│  Level 5: Perf      渲染/布局耗时     │
└─────────────┬────────────────────────┘
              │
    ┌─────────▼──────────┐
    │  LightLog 核心      │
    │  .level() .tag()    │
    │  .pageView()        │
    │  .apiTrace()        │
    ├─────────────────────┤
    │  Transports         │
    │  ConsoleTransport   │ → 开发控制台
    │  BufferTransport    │ → 内存环形缓冲
    │  BeaconTransport    │ → 后期对接后端
    └─────────────────────┘
```

### 代码质量管控

```
Developer Push ──► Pre-commit Hook (Husky)
                       │
                ┌──────▼──────────┐
                │  lint-staged     │
                │  ├─ prettier     │  格式化
                │  ├─ eslint fix   │  自动修复
                │  └─ vitest run   │  只跑改动相关的测试
                └──────┬──────────┘
                       │
                ┌──────▼──────────┐
                │  commitlint      │  Conventional Commits
                └──────┬──────────┘
                       │
                ┌──────▼──────────┐
                │  CI (GitHub)     │
                │  ├─ type-check   │
                │  ├─ lint         │
                │  ├─ test         │
                │  └─ build        │
                └──────────────────┘
```

### 适用场景与优缺点

| 维度 | 评价 |
|------|------|
| ✅ 适合 | 大学生从 0 → 1 学习，React 生态教程最多；课程作业/毕设/竞赛；中小团队快速落地 |
| ✅ 最大优势 | ECharts 中文文档 + 海量示例，学习曲线最平缓；声明式配置，React Hooks 数据流天然契合 |
| ❌ 劣势 | ECharts 自定义样式需深入 option 配置（如 formatter 函数）；React 进阶概念需后期消化 |
| ❌ 不适合 | 需要高度自定义/艺术化图表（ECharts 主题系统虽强但边界清晰）；只想写几十行的小项目 |

---

## 方案二：Vue 3 + TypeScript + AntV G2 + DataV + Pinia + MSW

### 定位

**图形语法驱动 · 大屏开箱即用 · 阿里数据可视化体系完整解决方案**

### 核心差异化

| 对比维度 | 方案一（ECharts） | 方案二（AntV G2） |
|------|------|------|
| 可视化哲学 | **声明式配置**（写一个 option 对象） | **图形语法**（The Grammar of Graphics） |
| 抽象层级 | 高层（option = 做好的预制件） | 中层（geometry + scale + coordinate = 积木） |
| 自由度 | option API 边界内 | 任意组合，无预设上限 |
| 学习曲线 | 上手快，深入难 | 上手需理解图形语法，但一通百通 |
| React 适配 | 天然（声明式配置 ≈ props） | 需封装 G2 Chart 实例 |
| Vue 适配 | 中等（option 是 JS 对象，框架无关） | **天然**（setup 内 new Chart → 组合式 API 即图形语法管道） |
| 大屏专属 | 无（自己封装边框/装饰/飞线） | **DataV Vue 版**（边框/装饰/飞线组件开箱即用） |

> **一句话**：方案一是"用预制件搭房子"（学 1 天就能搭），方案二是"用砖块自己砌"（学 3 天但能造任何形状）。

### 技术栈

| 层级 | 选型 | 版本 | 选择理由 |
|------|------|------|----------|
| 框架 | Vue 3 | 3.x | Composition API + `<script setup>` 极简写法 |
| 语言 | TypeScript | 5.x | 严格模式 |
| 可视化 | **AntV G2** + **@antv/l7** | 5.x / 2.x | G2 图形语法引擎；L7 地理空间可视化 |
| 大屏组件 | **@dataview/datav-vue3** | - | 阿里 DataV 开源版：边框、装饰、水位图等大屏专属组件 |
| 状态管理 | Pinia | 2.x | Vue 官方推荐，Store 即 Composable |
| 路由 | Vue Router | 4.x | 官方配套 |
| 构建 | Vite | 6.x | 与方案一一致 |
| 样式 | UnoCSS + Scoped CSS | 0.x | 原子化 + Vue SFC 局部样式 |
| HTTP 客户端 | Axios | 1.x | 与方案一一致 |
| Mock | **MSW** (Mock Service Worker) | 2.x | Service Worker 拦截，业务代码零侵入 |
| 测试框架 | Vitest | 2.x | 与方案一一致 |
| 组件测试 | Vue Test Utils + Testing Library | - | Vue 官方测试工具 |
| E2E | Playwright | 1.x | 与方案一一致 |
| 日志埋点 | 自研 LightLog + Vue 指令封装 | - | 框架无关核心 + `v-log-click` 指令 |
| 代码质量 | ESLint + Prettier + Husky + lint-staged | - | 与方案一一致 |
| 提交规范 | Commitlint + Commitizen | - | 与方案一一致 |

### 图形语法 vs 声明式配置 — 一段代码看懂差异

```typescript
// ─── 方案一：ECharts 声明式 option ───
// "我要一个折线图，X 轴是时间，Y 轴是销售额"
const option = {
  xAxis: { type: 'time' },
  yAxis: { type: 'value' },
  series: [{ type: 'line', data: salesData }]
};

// ─── 方案二：AntV G2 图形语法 ───
// "我从数据中分出一个面（geom），用折线连接（line），
//  时间映射到 x 通道，销售额映射到 y 通道"
chart
  .data(salesData)
  .line()                              // geom: 线的几何形态
  .encode('x', 'date')                // 通道：数据 → 视觉属性
  .encode('y', 'sales')
  .encode('color', 'region');         // 多通道：一个 geom 分层出多条线
```

**关键差异**：ECharts 的 `type: 'line'` 是固定的图表物种；G2 的 `.line()` 是几何形态——你可以在同一个图表中组合 `.line()` + `.area()` + `.point()`，自由装配。G2 和 Vue 3 Composable 函数式管道思维的契合度极高。

### 目录分层设计

```
InsightWall/
├── mock-server/                 # MSW 拦截层
│   ├── browser.ts               # 浏览器端 Service Worker
│   ├── handlers/
│   │   ├── dashboard.ts
│   │   ├── map.ts
│   │   └── ranking.ts
│   └── fixtures/
│       ├── dashboard.json
│       ├── geo.json
│       └── ranking.json
├── public/
│   ├── favicon.svg
│   └── mockServiceWorker.js     # MSW CLI 自动生成
├── src/
│   ├── main.ts
│   ├── App.vue
│   │
│   ├── adapter/                 # ⭐ Mock/API 切换层（MSW 版）
│   │   ├── IAdapter.ts          # 公共接口
│   │   ├── MswAdapter.ts        # MSW 适配（开发时启动 SW）
│   │   ├── HttpAdapter.ts       # 真实 HTTP
│   │   └── adapter-factory.ts   # 工厂函数：VITE_MOCK ? MswAdapter : HttpAdapter
│   │
│   ├── api/                     # 按领域拆分
│   │   ├── modules/
│   │   │   ├── dashboard.api.ts
│   │   │   ├── map.api.ts
│   │   │   └── ranking.api.ts
│   │   └── types.ts
│   │
│   ├── components/              # 通用组件
│   │   ├── ui/                  # 原子 UI
│   │   │   ├── AppButton.vue
│   │   │   ├── AppModal.vue
│   │   │   └── AppSpin.vue
│   │   ├── g2-charts/           # ⭐ G2 图表封装（替代方案一的 Chart/）
│   │   │   ├── BaseChart.vue    # G2 Chart 实例管理基类
│   │   │   ├── LineChart.vue    # G2 .line() 封装
│   │   │   ├── BarChart.vue     # G2 .interval() 封装
│   │   │   ├── PieChart.vue     # G2 .interval() + polar 封装
│   │   │   └── L7Map.vue        # ⭐ AntV L7 地图组件
│   │   ├── datav/               # ⭐ DataV 大屏装饰组件
│   │   │   ├── DvBorder.vue     # 大屏边框盒子
│   │   │   ├── DvDecoration.vue # 背景装饰元素
│   │   │   └── DvFlyLine.vue    # 飞线动效
│   │   └── layout/
│   │       ├── DashboardGrid.vue
│   │       └── DashboardCard.vue
│   │
│   ├── features/                # ⭐ 业务模块（完全相同结构范式）
│   │   ├── sales-overview/
│   │   │   ├── SalesOverview.vue
│   │   │   ├── composables/     # Vue3 组合式逻辑
│   │   │   │   ├── useSalesData.ts
│   │   │   │   └── useSalesChart.ts  # ⭐ G2 Chart 实例 hook
│   │   │   ├── components/
│   │   │   │   ├── SalesKPI.vue
│   │   │   │   └── SalesTrend.vue
│   │   │   ├── __tests__/
│   │   │   │   ├── SalesOverview.spec.ts
│   │   │   │   └── useSalesData.spec.ts
│   │   │   └── types.ts
│   │   ├── geo-distribution/
│   │   │   └── ...（同上结构，使用 L7Map + DvFlyLine）
│   │   └── real-time-ranking/
│   │       └── ...（同上结构）
│   │
│   ├── composables/             # 全局可复用逻辑
│   │   ├── useMockMode.ts
│   │   ├── useScreenAdapt.ts
│   │   ├── usePolling.ts
│   │   └── useLogger.ts
│   │
│   ├── stores/                  # Pinia stores
│   │   ├── dashboard.store.ts
│   │   ├── theme.store.ts
│   │   └── filter.store.ts
│   │
│   ├── services/                # 业务服务
│   │   ├── dashboard.service.ts
│   │   └── data-transform.service.ts
│   │
│   ├── logger/                  # 日志埋点（框架无关核心）
│   │   ├── LightLog.ts          # 核心实现（与方案一复用）
│   │   ├── transports/
│   │   │   ├── ConsoleTransport.ts
│   │   │   ├── BufferTransport.ts
│   │   │   └── BeaconTransport.ts
│   │   ├── composables/         # Vue 封装
│   │   │   └── usePageLogger.ts
│   │   └── directives/          # ⭐ Vue 专属：埋点指令
│   │       └── v-log-click.ts   # v-log-click="'btn_search'" 一行埋点
│   │
│   ├── types/
│   ├── utils/                   # 纯函数工具
│   ├── constants/
│   └── styles/
│       ├── variables.css
│       └── dashboard-theme.css
│
├── tests/
│   ├── setup.ts
│   ├── integration/
│   └── e2e/
│
├── .eslintrc.cjs
├── .prettierrc
├── commitlint.config.cjs
├── unocss.config.ts
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

### Mock 与 API 兼容机制（MSW 核心差异）

方案二选型 **MSW（Mock Service Worker）** 替代方案一的适配器模式：

```
   Vue App (业务代码)                     Service Worker
        │                                      │
        │ axios.get('/api/dashboard')          │
        ▼                                      │
   Axios Instance                              │
        │                                      │
        │    ╔══════════════════╗              │
        └────╣  M  S  W  拦截   ║◄─────────────┘
             ╚══════════════════╝
             VITE_MOCK=true  →  SW 返回 Mock fixture
             VITE_MOCK=false →  请求透过 SW 到达真实网络
```

核心实现：

```typescript
// mock-server/handlers/dashboard.ts
export const dashboardHandlers = [
  http.get('/api/dashboard/overview', () => {
    return HttpResponse.json(dashboardFixture);
  }),
];

// src/adapter/adapter-factory.ts
const adapter: IAdapter = import.meta.env.VITE_MOCK
  ? new MswAdapter()      // 启动 MSW Service Worker
  : new HttpAdapter(axiosInstance);

// 业务代码完全不变！
// SalesOverview.vue 的 <script setup> 中：
const { data } = await axios.get('/api/dashboard/overview');
// ↑ 这句代码不因 Mock/真实而有任何变化
```

**与方案一的适配器差异**：

| 维度 | 方案一（Axios 适配器） | 方案二（MSW） |
|------|------|------|
| 切换粒度 | Axios 请求层 | 网络 fetch 层（更低层） |
| 业务代码感知 | 需通过 adapter 间接调用 | **零感知**，直接用 axios |
| 调试体验 | `console.log(adapter)` 可见 | 浏览器 Network 面板可见（像真实请求） |
| 学习价值 | 理解"依赖注入/接口抽象" | 理解"网络拦截/Service Worker" |
| 对初学者 | **代码可见，可逐步调试** | 黑盒感强，出问题难排查 |

> ⚠️ 这也是为什么方案一是推荐方案：对零基础学习者，MSW 的浏览器 Network 面板能看到 Mock 请求很酷炫，但一旦 MSW 没启动成功，新手很难定位是 Service Worker 注册失败还是路径匹配错误。方案一的适配器模式每一步都能打断点调试。

### 测试方案 — 组件快照 + Composable 单元测试

| 层级 | 工具 | 与方案一的差异 |
|------|------|----------------|
| 静态分析 | TS strict + ESLint | 相同 |
| 单元测试 | Vitest | Composable 测试更简洁（无 JSX 心智负担） |
| 组件测试 | Vue Test Utils + Testing Library | `mount()` 返回 wrapper，支持 `wrapper.emitted()` / `wrapper.props()` |
| 集成/E2E | Playwright / Vitest | 相同 |

```typescript
// Vue Test Utils 快照测试示例
test('SalesTrend 在数据加载后渲染完整图表', async () => {
  const wrapper = mount(SalesTrend, {
    props: { data: mockSalesData }
  });
  await nextTick();
  // 断言 G2 Canvas 容器存在
  expect(wrapper.find('.g2-chart-container').exists()).toBe(true);
  // 断言 emit 事件
  expect(wrapper.emitted('chart-ready')).toBeTruthy();
});
```

### 适用场景与优缺点

| 维度 | 评价 |
|------|------|
| ✅ 适合 | Vue 技术栈偏好者；国内中台/大屏项目（DataV 组件库天然适配）；希望学习"图形语法"可视化范式的同学 |
| ✅ 最大优势 | G2 图形语法的自由度远超 ECharts option 模式可及范围；DataV 边框/装饰/飞线零代码开箱即用；MSW 网络面板可见 Mock 请求 |
| ❌ 劣势 | G2 学习曲线比 ECharts 陡（需理解 geometry / scale / coordinate / channel）；AntV 文档中文为主，国际资源少 |
| ❌ 不适合 | 需要大量国际英文教程的自学者；不想学图形语法只想快速出图 |

---

## 方案三：React + TypeScript + D3.js + RxJS（进阶向）

### 定位

**极致可控 · 数据流驱动 · 面向想理解可视化底层原理的进阶学习者**

### 核心差异化

方案三在三套方案中的独特定位是 **"不依赖任何图表库的声明式高层封装"**——D3 直接操作 SVG/Canvas，RxJS 管理异步数据流：

| 对比维度 | 方案一（ECharts） | 方案三（D3 + RxJS） |
|------|------|------|
| 图表抽象 | option 声明式 | 无抽象，直接操作 path/rect/circle |
| 数据流 | React Hooks | RxJS Observable 流 |
| 动画 | ECharts 内置 | D3 transition + RxJS 流控制 |
| 地图 | ECharts Map（内置） | D3-geo projection（手动投影） |
| 适合 | "我想要一个折线图" | "我想自己定义什么是折线图" |

> **一句话**：方案一是"开特斯拉"（踩油门就走），方案三是"拆开发动机看活塞怎么动"——不是为了快，是为了懂。

### 技术栈

| 层级 | 选型 | 版本 | 选择理由 |
|------|------|------|----------|
| 框架 | React | 18.x | 与方案一一致 |
| 语言 | TypeScript | 5.x | 与方案一一致 |
| 可视化 | **D3.js** | 7.x | 绝对可控，自定义图形能力无上限 |
| 数据流 | **RxJS** | 7.x | 流式数据天然映射大屏实时刷新需求 |
| 状态管理 | Zustand | 5.x | 同步状态，RxJS 管异步流 |
| 路由 | React Router | 6.x | 与方案一一致 |
| 构建 | Vite | 6.x | 与方案一一致 |
| 样式 | Tailwind CSS + CSS Modules | 4.x | 与方案一一致 |
| HTTP 客户端 | Axios | 1.x | 与方案一一致 |
| Mock | MSW | 2.x | 与方案二一致 |
| 测试框架 | Vitest | 2.x | 与方案一一致 |
| 组件测试 | Testing Library | 16.x | 与方案一一致 |
| E2E | Playwright | 1.x | 与方案一一致 |
| 日志埋点 | 自研 LightLog | - | 与方案一一致 |
| 代码质量 | ESLint + Prettier + Husky + lint-staged | - | 与方案一一致 |

### 目录分层设计

与方案一同构，差异点在 `features/` 内部引入 RxJS 管道和 D3 绘制层：

```
InsightWall/
├── src/
│   ├── features/
│   │   ├── sales-overview/
│   │   │   ├── SalesOverview.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useSalesData.ts
│   │   │   │   └── useSalesStream.ts   # ⭐ RxJS 数据管道
│   │   │   ├── pipes/                   # ⭐ 数据处理管道
│   │   │   │   ├── sales-transform.pipe.ts
│   │   │   │   └── sales-filter.pipe.ts
│   │   │   ├── d3-layers/               # ⭐ D3 自定义图层
│   │   │   │   ├── SalesTrendLine.ts    # D3 折线图（非 ECharts）
│   │   │   │   └── SalesAreaLayer.ts    # D3 面积图
│   │   │   ├── components/
│   │   │   ├── __tests__/
│   │   │   └── types.ts
│   │   └── ...
│   │
│   ├── streams/                 # ⭐ 全局 RxJS Subject 总线
│   │   ├── data-stream.bus.ts   # 数据流总线
│   │   ├── event-stream.bus.ts  # 事件流总线
│   │   └── operators/           # 自定义操作符
│   │       ├── throttleAnimation.ts  # 动画帧节流
│   │       └── deduplicateData.ts    # 数据去重
│   │
│   ├── d3-engine/               # ⭐ D3 渲染引擎
│   │   ├── BaseRenderer.ts      # 渲染器基类
│   │   ├── renderers/           # 各图表渲染器
│   │   │   ├── LineRenderer.ts
│   │   │   ├── BarRenderer.ts
│   │   │   └── MapRenderer.ts   # D3 Geo 地图
│   │   └── transitions/         # D3 过渡动画
│   │       ├── morphing.ts
│   │       └── staggered.ts
│   │
│   └── ...（其余与方案一一致）
```

### Mock 与 API 兼容机制

与方案二一致采用 MSW，但 Mock 数据通过 RxJS Observable 发出，提前验证数据流的响应形态：

```typescript
// hooks/useSalesStream.ts — RxJS 流式数据管道
const salesStream$ = adapter.get<DashboardData>(url)  // ← Mock/真实透明
  .pipe(
    map(transformSalesData),       // 数据转换
    throttleTime(3000),           // 大屏刷新频率 3s
    retry(3),                     // 失败重试 3 次
    catchError(handleStreamError)
  );
```

### 差异化测试方案 — Marble Testing（弹珠测试）

方案三的测试体系在方案一基础上新增 **RxJS Marble Testing**：

| 层级 | 在方案一基础上新增 |
|------|------|
| RxJS 管道 | **TestScheduler + Marble Diagram** — 虚拟时间，无需等待真实 timeout |
| D3 渲染 | JSDOM + SVG 快照测试，验证 `d` 路径 / 节点数量 |
| 传统层级 | 与方案一完全相同（Vitest + RTL + Playwright） |

```typescript
// ⭐ RxJS Marble Testing — 用弹珠图描述异步时序
// Marble 语法：'-' = 10ms 虚拟帧，数字 = 发出的值，'|' = complete
import { TestScheduler } from 'rxjs/testing';

test('salesStream 3秒节流后只发出最新值', () => {
  testScheduler.run(({ cold, expectObservable }) => {
    const source$  = cold('1-2---3-4|');          // 快速连发 4 个值
    const expected$ =     '---1---2---(3|)';     // 期望：节流后只保留间隔 > 3s 的值

    const result$ = source$.pipe(throttleTime(30, testScheduler));
    expectObservable(result$).toBe(expected$);
  });
});
```

> 弹珠测试的价值：不用写 `setTimeout` 等真实时间，TestScheduler 虚拟化时间轴，所有异步行为瞬间验证。这是企业级 RxJS 项目的标准测试范式。

```typescript
// D3 渲染测试 — 验证 SVG 结构
test('LineRenderer 生成正确的 path d 属性', () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const line = new LineRenderer(svg, mockPoints);
  line.render();

  const path = svg.querySelector('path.line');
  expect(path).not.toBeNull();
  expect(path!.getAttribute('d')).toMatch(/^M[\d,.]+L/); // 验证路径字符串合法
});
```

### 适用场景与优缺点

| 维度 | 评价 |
|------|------|
| ✅ 适合 | 对可视化底层原理有强烈兴趣的进阶学习者；自定义图表需求远超 ECharts 内置类型；毕业后瞄准数据可视化专精方向 |
| ✅ 最大优势 | D3 自由度高，可绘制任意图形；RxJS 流式思维天然匹配实时大屏；学到的是底层能力而非库的 API |
| ❌ 劣势 | 学习曲线双重陡峭（D3 + RxJS）；开发效率远不如 ECharts（一个散点图 D3 写 50+ 行 vs ECharts 5 行） |
| ❌ 不适合 | **零基础自学者**（极高放弃率）；需要快速产出的项目（课设/毕设时间紧）；团队没有 D3/RxJS 经验 |

---

## 三方案横向对比

| 维度 | 方案一 React+ECharts+Zustand | 方案二 Vue3+G2+DataV+Pinia | 方案三 React+D3+RxJS |
|------|------|------|------|
| **可视化哲学** | 声明式 option | 图形语法（Grammar of Graphics） | 底层操控 SVG/Canvas |
| **图表自由度** | ⭐⭐⭐ ECharts 内置 | ⭐⭐⭐⭐ G2 自由组合 geom | ⭐⭐⭐⭐⭐ 无上限 |
| **大屏专属组件** | 无（自封装） | ⭐⭐⭐⭐⭐ DataV 边框/装饰/飞线 | 无（全部自绘） |
| **学习曲线** | ⭐⭐ 低 | ⭐⭐⭐ 中 | ⭐⭐⭐⭐⭐ 高陡 |
| **开发效率** | ⭐⭐⭐⭐⭐ 最高 | ⭐⭐⭐⭐ 高 | ⭐⭐ 偏低 |
| **教程丰富度** | ⭐⭐⭐⭐⭐ 全球最多 | ⭐⭐⭐ 中文为主 | ⭐⭐⭐ 英文为主 |
| **零基础友好** | ✅ 最友好 | ⚠️ 中等（G2 图形语法门槛） | ❌ 不推荐零基础 |
| **Mock 方案** | 适配器（可见可控） | MSW（零侵入，但黑盒） | MSW + RxJS Observable |
| **Mock 调试透明度** | ⭐⭐⭐⭐⭐ 每步可见 | ⭐⭐⭐ Network 面板可见 | ⭐⭐⭐ 同 MSW |
| **测试亮点** | RTL 用户视角 | Vue Test Utils 组件快照 | Marble Testing 流时序 |
| **大屏实时性** | ⭐⭐⭐ 轮询 | ⭐⭐⭐ 轮询 | ⭐⭐⭐⭐⭐ RxJS 流式 |
| **国内就业匹配** | ⭐⭐⭐⭐⭐ 岗位最多 | ⭐⭐⭐⭐ 国内第二 | ⭐⭐⭐ 专精方向 |

---

## 🏆 最终推荐：方案一 — React + TypeScript + ECharts + Zustand

### 推荐理由（针对本项目的 5 个决策点）

1. **零基础定位匹配度最高**：ECharts 中文官网有 600+ 示例可直接运行修改，React 中文教程全球最多，遇到问题搜索引擎秒出答案。方案二 Vue 3 也是好选择，但 React 生态的范围和深度对自学者更友好。

2. **学习价值最大化**：从 Zustand（极简状态管理）→ Axios 拦截器（Mock/API 切换）→ Custom Hooks（逻辑复用）→ 模块化拆分的全景式前端工程实践，这套技术栈能教给你的不仅是"做大屏"，而是**中大型前端项目如何组织**。

3. **适配器模式零重构 + 可调试**：MockAdapter / HttpAdapter 的工厂切换方案，每一步都是你自己写的代码，`console.log` 随时追踪，比 MSW 的 Service Worker 黑盒更适合作学习脚手架。

4. **国内就业市场**：React 在数据可视化/中台/大屏方向的岗位需求量为 Vue 的 2~3 倍（2026 年数据），React + ECharts 组合的求职竞争力最强。

5. **渐进式扩展**：后续可平滑引入 RxJS（管道处理）、D3（自定义图形）、WebSocket（真实实时推送），架构预留了 `hooks/useWebSocket.ts` 和 `services/` 层，不需要推倒重来。

### 不选方案二的原因

G2 图形语法 + DataV 是优秀的方案——**如果你已有 Vue 技术栈基础**。但对零基础同学来说，G2 的 geometry / scale / coordinate / channel 概念体系需要额外学习成本。DataV 的边框和装饰虽然开箱即用，但会掩盖"大屏 UI 是怎么做出来的"这个关键学习点。建议在完成方案一后，将方案二作为横向对比学习。

### 不选方案三的原因

D3 + RxJS 双高门槛叠加零基础 = 极高的放弃率。这不是技术优劣问题，是**阶段匹配**问题。方案三适合你在完成方案一后去探索的进阶方向——你会深刻理解 ECharts 的 option 底层究竟做了什么。

---

> 📌 决定方案后，下一步输出：项目工程脚手架搭建命令 + 初始代码结构。