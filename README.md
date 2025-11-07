# base-framework（Next.js App Router）

本仓库是基于 Next.js App Router 的前端基础框架，内置 TypeScript 严格模式、Tailwind CSS、shadcn/ui 组件体系、next-intl 国际化、Better Auth 鉴权、Prisma ORM 等能力，开箱即用并约束统一的工程规范。

## 技术栈

- 应用框架：Next.js 15（App Router）
- 语言与类型：TypeScript（strict）
- 样式系统：Tailwind CSS v4（原子化 + 设计令牌）
- UI 组件：shadcn/ui（Radix + Tailwind）
- 国际化：next-intl（消息包位于 `src/messages`）
- 鉴权：Better Auth（OAuth/Session）
- 数据访问：Prisma（`prisma/schema.prisma`）
- 主题与图标：next-themes、lucide-react
- 质量与构建：ESLint（Next + TS）、PostCSS、Path Alias `@/* -> src/*`

## 目录结构

- `src/app`：Next.js App Router（`layout.tsx`、`page.tsx`、`globals.css`）
- `src/components`：共享与业务组件（UI 原子组件在 `src/components/ui`）
- `public`：静态资源
- `src/lib`：工具与客户端 SDK（如 `utils.ts`、`auth-client.ts`、`feature-flags.ts`）
- `src/messages`：i18n 语言包（`en.json`、`zh-CN.json`）
- `prisma`：Prisma schema 与本地开发数据库
- 配置：`next.config.ts`、`tsconfig.json`、`eslint.config.mjs`、`postcss.config.mjs`
- 生成物：`.next/`、`node_modules/`（已忽略，不要提交）

## 开发与构建

```bash
npm run dev    # 本地开发（http://localhost:3000）
npm run build  # 生产构建（输出到 .next/）
npm start      # 启动生产构建
npm run lint   # ESLint（Next + TypeScript 规则）
```

## 编码规范（关键约束）

- TypeScript 严格模式；2 空格缩进；函数式组件 + Hooks 优先。
- 组件命名：`src/components` 内部使用 PascalCase 文件名（如 `Button.tsx`）。
- 路由段命名：目录使用 lower-kebab-case（如 `src/app/dashboard/page.tsx`）。
- 导入路径：统一使用 `@/` 别名（如 `@/components/Button`）。
- 样式：在 JSX 中使用 Tailwind class；全局令牌集中于 `src/app/globals.css`。
- 不引入 CSS-in-JS；不引入额外 UI 库，优先复用 `src/components/ui/*`。

## UI 与最小化组件

- 优先使用 shadcn/ui 原子组件与已存在的封装；仅在出现跨页面复用（≥2 处）或存在明显复复杂度时新增组件。
- 新增组件遵循“最小 API”：职责单一、必要 props、`className` 透传、可组合优先，避免过度抽象。
- 无状态优先，业务逻辑上移到容器或调用方；关注可访问性（语义标签、键盘可用、ARIA）。

## 鉴权与特性开关

- 鉴权：Better Auth 封装位于 `src/lib/auth-client.ts` 与 `src/auth.ts`。
- UI 特性开关：通过 `NEXT_PUBLIC_SHADCN_AUTHUI` 切换认证相关的 UI 实现（原生 Tailwind vs. shadcn/ui）。
  - 启用：`NEXT_PUBLIC_SHADCN_AUTHUI=true`
  - 禁用（默认）：`NEXT_PUBLIC_SHADCN_AUTHUI=false`

## 国际化

- 使用 `next-intl`，所有对用户可见的文案使用文案键，不得硬编码。
- 语言包：`src/messages/en.json`、`src/messages/zh-CN.json`；组件使用 `useTranslations()`。

## 数据与数据库

- ORM：Prisma；数据模型位于 `prisma/schema.prisma`。
- 客户端避免直接访问数据库；通过 Server Actions 或 API Route 访问。

## 测试（当前未内置测试框架）

- 新增测试时，优先使用 Vitest + React Testing Library。
- 测试文件放置于 `src/__tests__/` 或就近；命名 `*.test.ts[x]`；引入后建议 ≥80% 覆盖。

## 提交与 PR

- 使用 Conventional Commits（如 `feat:`、`fix:`、`chore:`）。
- PR 前确保 `npm run lint`、`npm run build` 通过；PR 需包含说明、关联 Issue、UI 变更截图（如有）。

## 环境与安全

- 机密存放于 `.env.local`（已忽略）；客户端暴露仅使用 `NEXT_PUBLIC_*` 前缀。
- 不编辑 `.next/` 生成物；不提交构建产物与私密数据。

## 交流与编码

- 首选语言：中文（Issue/PR/讨论）。
- 文件编码：UTF-8（LF）。仓库通过 `.editorconfig`/`.gitattributes` 约束。
