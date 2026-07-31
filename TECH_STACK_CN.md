# 技术栈与工作方式

[English](TECH_STACK.md) · [← 返回个人主页](README_CN.md)

> 我专注于构建本地优先的 AI 产品与开发者工具，把模糊、重复的工作整理成可检查、可编辑、可复用的系统。

## 当前重点

| 方向 | 技术栈 | 主要用途 |
| --- | --- | --- |
| AI 与自动化 | `Python` · `TypeScript` · `SQL` · `Bash` | 研究型 Agent、结构化内容工作流、数据处理与任务自动化 |
| 产品工程 | `React` · `Next.js` · `Vite` · `PostgreSQL` | 本地优先工作台、增长实验、落地页与转化追踪 |
| 开发者工具 | `Rust` · `Node.js` · `macOS 自动化` | 输出稳定、边界清晰、可被脚本调用的小型 CLI |
| AI 辅助交付 | `Claude Code` · `Codex CLI` · `Git` · `tmux` | 规划、实现、审查、验证与文档沉淀 |

## 代表项目

- **[GrowthLab](https://github.com/tinylion1024/GrowthLab)** — 本地优先的 AI 增长实验工作台，把增长问题转化为可编辑、可验证的实验方案。`React 19` · `TypeScript` · `Vite` · `Zod`
- **[LaunchKit](https://github.com/tinylion1024/LaunchKit)** — 轻量增长活动搭建工具，用于发布落地页、收集线索并追踪真实转化漏斗。`Next.js 16` · `React 19` · `Prisma` · `PostgreSQL`
- **[osamail](https://github.com/tinylion1024/osamail)** — 本地优先的 Apple Mail 命令行工具，无需增加一套账号凭据即可读取、整理、自动化和发送邮件。`Rust` · `JXA` · `macOS`
- **[aenv](https://github.com/tinylion1024/aenv)** — 项目级 AI 编码环境管理器，用于初始化、审计、对比和保护 Claude Code 与 Codex 配置。`TypeScript` · `Node.js` · `CLI`

## 我的工作方式

`研究 → 定义 → 构建 → 验证 → 文档化 → 复用`

- **研究与定义** — 把模糊问题拆成假设、约束、成功指标和一个可验证的小范围。
- **构建与验证** — 用 AI 加速实现，再通过类型、测试、Lint、代码审查与真实流程判断是否完成。
- **文档化与复用** — 把决策、命令和操作知识留在仓库里，让下一次执行拥有更高的起点。

## 工程原则

- **适合时优先本地运行。** 除非服务端能创造明确的产品价值，否则尽量把数据和凭据留在用户设备上。
- **显式状态优于隐藏魔法。** 偏好可检查的文件、确定性命令、Dry Run 和结构化输出。
- **小工具也要可组合。** 专注的 CLI 或工作台应该自然融入现有流程，而不是强迫用户重建流程。
- **AI 负责加速，验证负责定稿。** 生成代码只是草稿，检查与真实使用结果才决定它是否完成。
- **为可重复执行而优化。** 好的工作流应该在第二次运行时更容易执行、解释和改进。

## 技术栈全景

下图区分了我正在使用的技术、持续深入的方向、过往经验，以及已经迁移离开的工具。

<p>
  <picture>
    <source media="(max-width: 600px)" srcset="assets/badges/profile-cn-mobile.svg">
    <img alt="技术栈、AI 开发工作流、正在学习、过往经验与曾用工具" src="assets/badges/profile-cn.svg">
  </picture>
</p>

### 带着目标学习

- **Go** — 用于紧凑的服务与运维工具。
- **Rust** — 深入更安全的系统编程和生产级 CLI 设计，并实践于 [osamail](https://github.com/tinylion1024/osamail)。
- **Swift** — 用于原生 macOS 工具和更深入的平台集成。

### 过往经验

我曾长期接触 `C`、`Java`、`Scala`、机器学习、深度学习、`Apache Spark`、`Hadoop` 与 `Hive`。即使现在的产品更适合小而精的技术栈，这些经历仍然影响着我对数据管道、系统边界与运行可靠性的判断。
