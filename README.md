# InsightWall · 洞察之墙

<p align="center">
  <img src="https://img.shields.io/badge/status-learning-blue" alt="Learning Project" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" />
  <img src="https://img.shields.io/badge/students-beginner--friendly-orange" alt="Beginner Friendly" />
</p>

<p align="center">
  <em>从 0 到 1，构建你的第一个数据可视化大屏 🚀</em>
</p>

<p align="center">
  <img src="1.png" alt="InsightWall 大屏截图" width="100%" />
</p>

---

## 📖 项目定位

**InsightWall（洞察之墙）** 是一个面向大学生的开源学习类数据可视化大屏项目。

本项目旨在帮助 **零基础** 的同学，从最基础的概念开始，逐步掌握数据大屏的完整开发流程——涵盖数据获取、数据处理、可视化渲染、大屏布局、交互设计、性能优化等各个环节。

> 🎯 **核心理念**：每一步都讲清楚"为什么这样做"，不堆砌代码，不跳过细节。

## 👥 目标用户

- 🎓 计算机/软件/数据科学相关专业的大学生
- 🌱 对数据可视化感兴趣，但不知从何入门的初学者
- 📊 希望在校期间积累一个完整数据大屏项目经验的同学

## 🗺️ 学习路线图（规划中）

| 阶段 | 主题 | 内容概要 |
|------|------|----------|
| ① 基础 | 项目初始化与环境搭建 | 工程结构、工具链、开发规范 |
| ② 数据 | 数据获取与处理 | API 对接、数据清洗、状态管理 |
| ③ 图表 | 核心图表组件 | 折线图、柱状图、饼图、地图等 |
| ④ 布局 | 大屏布局与适配 | 比例适配、响应式、多屏方案 |
| ⑤ 动效 | 动效与交互 | 过渡动画、事件交互、轮播刷新 |
| ⑥ 实战 | 综合案例 | 从设计稿到完整大屏交付 |
| ⑦ 进阶 | 性能与部署 | 渲染优化、构建发布、CI/CD |

## 🚀 快速开始

```bash
# 1. 克隆项目
git clone git@github.com:huifeng-shuqing/InsightWall.git
cd InsightWall

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 浏览器打开
# http://localhost:5173
```

> 💡 项目默认使用 **Mock 模拟数据**，无需后端即可运行。切换方式见下方 Mock 模式说明。

## 📁 项目结构

```
InsightWall/
├── .github/workflows/ci.yml       # CI/CD
├── .husky/                         # Git hooks
├── docs/                           # 架构方案文档
├── mock-server/fixtures/           # Mock 数据（仿真中文数据）
├── public/                         # 静态资源
├── src/
│   ├── api/                        # API 层（适配器模式）
│   │   ├── adapters/               # MockAdapter / HttpAdapter
│   │   └── modules/                # dashboard / map / ranking
│   ├── components/                 # 通用组件（无业务逻辑）
│   │   ├── chart/                  # BaseChart / LineChart / BarChart / PieChart / MapChart
│   │   ├── layout/                 # DashboardGrid / DashboardCard
│   │   └── ui/                     # StatCard / PageHeader / Loading
│   ├── features/                   # 业务模块（独立拆分）
│   │   ├── sales-overview/         # 销售概览（KPI + 趋势）
│   │   ├── geo-distribution/       # 地理分布（中国地图热力图）
│   │   └── real-time-ranking/      # 实时排行（品类 + 城市）
│   ├── hooks/                      # 全局 Hooks
│   ├── stores/                     # Zustand 状态管理
│   ├── services/                   # 业务服务层
│   ├── logger/                     # 日志埋点系统
│   ├── types/                      # TypeScript 类型定义
│   ├── utils/                      # 工具函数
│   ├── constants/                  # 常量（API 路径、主题色、图表默认值）
│   └── styles/                     # 全局样式 + CSS 变量
├── tests/                          # 测试（集成 + E2E）
├── .env                            # 环境变量（VITE_MOCK=true）
└── package.json
```

## 🛠️ 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | 18.x |
| 可视化库 | ECharts | 5.x |
| 状态管理 | Zustand | 5.x |
| 路由 | React Router | 6.x |
| 构建工具 | Vite | 6.x |
| 语言 | TypeScript | 5.x (strict) |
| HTTP | Axios | 1.x |
| 样式 | Tailwind CSS + CSS Modules | 4.x |
| 测试 | Vitest + Testing Library + Playwright | 2.x / 16.x / 1.x |
| 代码质量 | ESLint + Prettier + Husky + Commitlint | latest |

## 🔄 Mock 模式

项目通过**适配器模式**实现 Mock 数据与真实 API 的无缝切换：

```bash
# .env 文件中控制
VITE_MOCK=true    # 使用本地 Mock 数据（默认，无需后端）
VITE_MOCK=false   # 切换到真实 HTTP 后端 API
```

切换后无需修改任何业务代码。详见 [docs/architecture-proposals.md](docs/architecture-proposals.md)。

## 📄 开源协议

本项目基于 **MIT License** 开源，完整协议文本见 [LICENSE](#mit-license) 章节。

你可以自由地：
- ✅ 学习、复制、修改代码
- ✅ 用于个人项目或课程作业
- ✅ 用于商业项目
- ✅ 分发和再发布

前提是保留原始版权声明。详见下方完整协议文本。

---

## MIT License

```
MIT License

Copyright (c) 2026 InsightWall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🤝 贡献指南

当前项目处于初始化阶段，欢迎以下方式的参与：

- 💡 **提 Issue**：建议学习内容、分享学习资源
- ⭐ **Star 项目**：鼓励作者持续更新
- 👀 **Watch 项目**：第一时间获取内容推送
- 📢 **分享给同学**：让更多人一起学习

> 代码贡献将在项目进入开发阶段后开放，敬请期待！

---

## 📬 联系方式

- 📧 Email：[待补充]
- 🐙 GitHub Issues：欢迎直接提问

---

<p align="center">
  <strong>🌟 如果这个项目对你有帮助，请给一个 Star 鼓励一下！</strong>
</p>