# AGENTS 指南（贡献者与代理必须遵守）

本文档约束仓库内所有后续改动，除非经仓库维护者明确批准，否则不得偏离。请使用中文交流，UTF-8（LF）编码。
只有经仓库维护者明确批准可以写代码，才可以修改仓库中的代码，否则不得偏离。
## 技术栈约束（强制）

- 框架：Next.js 15（App Router）。
- 语言：TypeScript（strict）。
- 样式：Tailwind CSS v4（不引入 CSS-in-JS）。
- UI：shadcn/ui（Radix + Tailwind）。
- 国际化：next-intl（消息包位于 `src/messages`）。
- 鉴权：Better Auth。
- ORM：Prisma。
- 其他：ESLint、PostCSS、`@/* -> src/*` 路径别名。

要求：后续代码必须基于以上技术栈开发。新增或替换依赖（UI 库、状态管理、样式方案等）须在 PR 中给出充分论证并获批准，否则直接拒绝。

## 目录与命名（强制）

- 路由放在 `src/app`；路由段目录使用 lower-kebab-case；组件文件使用 PascalCase。
- 共享/原子 UI 放在 `src/components/ui`；业务组件放在 `src/components/<feature>`。
- 导入一律使用 `@/` 别名；禁止使用深层相对路径（如 `../../..`）。

## 最小化组件开发（强制）

- 复用优先：优先使用 `src/components/ui/*` 与 shadcn/ui 原子组件，不重复造轮子。
- 触发条件：仅当出现 ≥2 处复用或存在清晰抽象边界时新建封装。
- 设计原则：职责单一、最小 API、`className` 透传、组合优先、无状态优先（状态上移）。
- 可访问性：语义标签、可聚焦、键盘可操作、合理的 `aria-*` 与可见焦点。
- 国际化：所有用户可见文案使用 next-intl，不得硬编码字符串。

## UI 与样式规则（强制）

- Tailwind 作为唯一样式方案；全局设计令牌集中在 `src/app/globals.css`。
- 使用 `cn()` 合并 class，避免重复与冲突。
- 禁止引入额外 UI 框架（如 MUI/Antd/Chakra 等）。

## 数据与服务边界（强制）

- ORM 使用 Prisma；禁止客户端直接访问数据库。
- 通过 Server Actions 或 API Routes 访问数据；鉴权沿用 Better Auth。

## 性能与包体积（强制）

- 谨慎引入依赖，避免重量级库；必要时使用动态导入与代码分割。
- 组件默认 Tree-shakable；避免在顶层执行副作用代码。

## 测试策略（建议/可选）

- 新增测试优先使用 Vitest + React Testing Library；覆盖率建议 ≥80%。
- 测试放在 `src/__tests__/` 或就近，命名 `*.test.ts[x]`。

## 提交与 PR（强制）

- Conventional Commits（如 `feat:`、`fix:`、`chore:`）。
- 合并前必须通过 `npm run lint` 与 `npm run build`。
- PR 必须包含：变更说明、关联 Issue、UI 截图（如有）与行为变更说明。

## 环境与安全（强制）

- `.env.local` 管理机密；仅 `NEXT_PUBLIC_*` 可暴露到客户端。
- 不修改 `.next/` 生成物；不提交构建产物与敏感数据。

## 沟通与编码（强制）

- 语言：中文（Issues/PR/讨论）；文件编码：UTF-8（LF）。

若与 README 或更深层目录的 AGENTS.md 存在冲突，以更近层级的 AGENTS.md 优先生效；若仍冲突，以维护者最新决定为准。

