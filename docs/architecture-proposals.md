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
│   ├── index.ts                 # MSW 或 json-server 入口
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
              │ MSW handlers │   │ nginx → 后端  │
              └──────────────┘   └──────────────┘
```

核心实现思路：

```typescript
// src/api/adapters/IAdapter.ts
interface IAdapter {
  get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: Record<string, any>): Promise<ApiResponse<T>>;
}

// src/api/client.ts
const adapter: IAdapter = import.meta.env.VITE_MOCK
  ? new MockAdapter(mockHandlers)
  : new HttpAdapter(axiosInstance);

// 上层完全不感知 Mock / 真实差异
// dashboard.api.ts
export const fetchDashboardData = () =>
  adapter.get<DashboardData>(API_PATHS.DASHBOARD_OVERVIEW);
```

切换后端只需：**改一行环境变量** `VITE_MOCK=false`，架构零变化。

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
| ✅ 最大优势 | ECharts 中文文档 + 海量示例，学习曲线最平缓；Zustand 学习成本极低 |
| ❌ 劣势 | React 体系较庞大，进阶概念（Suspense/Server Components）需后期消化 |
| ❌ 不适合 | 极致轻量场景（几百行就够的小项目会显得 over-engineering） |

---

## 方案二：Vue 3 + TypeScript + ECharts + Pinia

### 定位

**渐进式 · SFC 直觉化 · 国内企业采用率上升最快**

### 技术栈

| 层级 | 选型 | 版本 | 选择理由 |
|------|------|------|----------|
| 框架 | Vue 3 | 3.x | Composition API + `<script setup>` 极简写法 |
| 语言 | TypeScript | 5.x | 与方案一一致 |
| 可视化 | ECharts | 5.x | 与方案一一致 |
| 状态管理 | Pinia | 2.x | Vue 官方推荐，Store 即函数 |
| 路由 | Vue Router | 4.x | 官方配套 |
| 构建 | Vite | 6.x | 与方案一一致 |
| 样式 | UnoCSS + Scoped CSS | 0.x | 原子化 + Vue SFC 局部样式 |
| HTTP 客户端 | Axios | 1.x | 与方案一一致 |
| Mock | MSW (Mock Service Worker) | 2.x | Service Worker 拦截，业务代码彻底零侵入 |
| 测试框架 | Vitest | 2.x | 与方案一一致 |
| 组件测试 | Vue Test Utils + Testing Library | - | Vue 官方测试工具 |
| E2E | Playwright | 1.x | 与方案一一致 |
| 日志埋点 | 自研 LightLog | - | 框架无关，方案一/二复用 |
| 代码质量 | ESLint + Prettier + Husky + lint-staged | - | 与方案一一致 |
| 提交规范 | Commitlint + Commitizen | - | 与方案一一致 |

### 目录分层设计

```
InsightWall/
├── mock-server/                 # MSW 拦截层（与方案一共用）
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
│   └── mockServiceWorker.js     # MSW 自动生成
├── src/
│   ├── main.ts
│   ├── App.vue
│   │
│   ├── adapter/                 # ⭐ Mock/API 切换层
│   │   ├── IAdapter.ts          # 公共接口
│   │   ├── MockAdapter.ts       # MSW 适配实现
│   │   ├── HttpAdapter.ts       # 真实 HTTP
│   │   └── adapter-factory.ts   # 工厂函数
│   │
│   ├── api/                     # 按领域拆分
│   │   ├── modules/
│   │   │   ├── dashboard.api.ts
│   │   │   ├── map.api.ts
│   │   │   └── ranking.api.ts
│   │   └── types.ts             # API 响应泛型
│   │
│   ├── components/              # 通用组件
│   │   ├── ui/                  # 原子 UI
│   │   │   ├── AppButton.vue
│   │   │   ├── AppModal.vue
│   │   │   └── AppSpin.vue
│   │   ├── charts/              # 图表封装
│   │   │   ├── BaseChart.vue
│   │   │   ├── LineChart.vue
│   │   │   ├── BarChart.vue
│   │   │   ├── PieChart.vue
│   │   │   └── MapChart.vue
│   │   └── layout/
│   │       ├── DashboardGrid.vue
│   │       └── DashboardCard.vue
│   │
│   ├── features/                # ⭐ 业务模块（每个模块自包含）
│   │   ├── sales-overview/
│   │   │   ├── SalesOverview.vue
│   │   │   ├── composables/     # Vue3 组合式逻辑
│   │   │   │   └── useSalesData.ts
│   │   │   ├── components/
│   │   │   │   ├── SalesTrend.vue
│   │   │   │   └── SalesKPI.vue
│   │   │   ├── __tests__/
│   │   │   │   ├── SalesOverview.spec.ts
│   │   │   │   └── useSalesData.spec.ts
│   │   │   └── types.ts
│   │   ├── geo-distribution/
│   │   │   └── ...（同上结构）
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
│   ├── logger/                  # 与方案一共用设计
│   │   ├── LightLog.ts
│   │   ├── transports/
│   │   ├── composables/         # Vue Composable 封装
│   │   │   └── usePageLogger.ts
│   │   └── directives/          # Vue 指令封装
│   │       └── v-log-click.ts   # 点击埋点指令
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
│       └── ...
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

### Mock 与 API 兼容机制（MSW 方案核心差异）

Vue 3 方案选型 **MSW（Mock Service Worker）** 替代方案一的 axios 拦截器：

```
   Vue App (业务代码)                     Service Worker
        │                                      │
        │ fetch('/api/dashboard')              │
        ▼                                      │
   Axios Instance                              │
        │                                      │
        │    ╔══════════════════╗              │
        └────╣  M  S  W  拦截   ║◄─────────────┘
             ╚══════════════════╝
             VITE_MOCK=true  →  SW 返回 Mock
             VITE_MOCK=false →  请求放行到真实网络
```

优势：**业务代码完全不感知 Mock**。`dashboard.api.ts` 中使用标准 `axios.get()`，MSW 在 Service Worker 层拦截 `fetch`，连 axios 拦截器都不需要写。切换真实 API 同样只改一行环境变量。

### 测试方案

与方案一同等规模，差异在于组件测试工具链：

| 层级 | 工具 | 差异说明 |
|------|------|----------|
| 单元测试 | Vitest | composables 测试特别简单（纯函数） |
| 组件测试 | Vue Test Utils + Testing Library | `mount()` + `@vue/test-utils` |
| 其他 | Playwright / Vitest | 与方案一一致 |

### 适用场景与优缺点

| 维度 | 评价 |
|------|------|
| ✅ 适合 | 国内技术社区活跃（Element Plus / Ant Design Vue）；喜欢 SFC 模板直觉化的同学；毕业后瞄准 Vue 技术栈企业的同学 |
| ✅ 最大优势 | SFC 模板/逻辑/样式三合一，单文件即组件，拆分心智负担低；MSW 方案 Mock 侵入性最低 |
| ❌ 劣势 | 国际社区规模 < React，英文教程相对少；大规模项目（>50 模块）组织方案不如 React 生态成熟 |
| ❌ 不适合 | 希望广泛接触 React Hooks 思维模式的初学者 |

---

## 方案三：React + TypeScript + D3.js + RxJS（进阶向）

### 定位

**极致可控 · 数据流驱动 · 面向想理解可视化底层原理的进阶学习者**

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

与方案一基本同构，差异点在 `features/` 内部引入 RxJS 管道和 D3 绘制层：

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
// hooks/useSalesStream.ts
const salesStream$ = adapter.get<DashboardData>(url)  // ← Mock/真实透明
  .pipe(
    map(transformSalesData),
    throttleTime(3000),           // 大屏刷新频率 3s
    retry(3),                     // 失败重试
    catchError(handleStreamError)
  );
```

### 测试方案

| 差异点 | 说明 |
|--------|------|
| RxJS 管道测试 | `TestScheduler` 虚拟时间，无需等待真实 timer |
| D3 渲染测试 | JSDOM + 快照测试，验证 SVG 节点结构 |
| Marble Testing | RxJS 弹珠图测试流行为，确保管道时序正确 |

### 适用场景与优缺点

| 维度 | 评价 |
|------|------|
| ✅ 适合 | 对可视化底层原理有强烈兴趣的进阶学习者；自定义图表需求远超 ECharts 内置类型；毕业后瞄准数据可视化专精方向 |
| ✅ 最大优势 | D3 自由度高，可绘制任意图形；RxJS 流式思维天然匹配实时大屏 |
| ❌ 劣势 | 学习曲线陡峭（D3 + RxJS 双高门槛）；开发效率低于 ECharts 方案（一个散点图 D3 写 50 行 vs ECharts 5 行） |
| ❌ 不适合 | 零基础自学者；需要快速产出的项目（课设/毕设时间紧）；团队没有 D3 经验 |

---

## 三方案横向对比

| 维度 | 方案一 React+ECharts | 方案二 Vue3+ECharts | 方案三 React+D3+RxJS |
|------|---------------------|----------------------|-----------------------|
| **学习曲线** | ⭐⭐ 中低 | ⭐⭐ 中低 | ⭐⭐⭐⭐⭐ 高陡 |
| **开发效率** | ⭐⭐⭐⭐⭐ 最高 | ⭐⭐⭐⭐⭐ 最高 | ⭐⭐ 偏低 |
| **教程丰富度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **自定义能力** | ⭐⭐⭐ ECharts 内置 | ⭐⭐⭐ ECharts 内置 | ⭐⭐⭐⭐⭐ 无上限 |
| **零基础友好** | ✅ 最友好 | ✅ 友好 | ❌ 不推荐零基础 |
| **国内认可度** | ⭐⭐⭐⭐⭐ 全球第一 | ⭐⭐⭐⭐ 国内第二 | ⭐⭐⭐ 专精小众 |
| **Mock 侵入性** | 低（适配器） | 极低（MSW） | 极低（MSW） |
| **大屏实时性** | ⭐⭐⭐ 轮询 | ⭐⭐⭐ 轮询 | ⭐⭐⭐⭐⭐ RxJS 流式 |
| **测试体系** | 完整 | 完整 | 完整 + Marble |
| **代码质量** | 四件套 | 四件套 | 四件套 |

---

## 🏆 最终推荐：方案一 — React + TypeScript + ECharts + Zustand

### 推荐理由（针对本项目的 5 个决策点）

1. **零基础定位匹配度最高**：ECharts 中文官网有 600+ 示例可直接运行修改，React 中文教程全球最多，遇到问题搜索引擎秒出答案。方案二 Vue 3 也是好选择，但 React 生态的范围和深度对自学者更友好。

2. **学习价值最大化**：从 Zustand（极简状态管理）→ Axios 拦截器（Mock/API 切换）→ Custom Hooks（逻辑复用）→ 模块化拆分的全景式前端工程实践，这套技术栈能教给你的不仅是"做大屏"，而是**中大型前端项目如何组织**。

3. **适配器模式零重构**：MockAdapter / HttpAdapter 的工厂切换方案，比 MSW 更"看得见"——对学习者来说，理解自己在做什么比"无感切换"更重要。MSW 在方案二中可作为进阶重构目标。

4. **国内就业市场数据**：React 在数据可视化/中台/大屏方向的岗位需求量为 Vue 的 2~3 倍（2026 年 BOSS 直聘数据），掌握 React + ECharts 组合的求职竞争力更强。

5. **渐进式扩展**：后续可平滑引入 RxJS（管道处理）、D3（自定义图形）、WebSocket（真实实时推送），架构预留了 `hooks/useWebSocket.ts` 和 `services/` 层，不需要推倒重来。

### 不选方案二的唯一重要原因

对零基础学习者来说，MSW 的 Service Worker 拦截是"黑盒魔法"——看起来很酷，出了问题不知道怎么调试。方案一的适配器模式每一步都是自己写的代码，调试和理解的透明度更高。

### 不选方案三的根本原因

D3 + RxJS 双高门槛叠加零基础 = 极高的放弃率。这不是技术优劣问题，是**阶段匹配**问题。方案三适合你在完成方案一后再去探索的进阶方向。

---

> 📌 决定方案后，下一步输出：项目工程脚手架搭建命令 + 初始代码结构。