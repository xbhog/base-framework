# Create Base App

一个用于快速创建 Next.js 项目的 CLI 脚手架工具，基于 [base-framework](../) 模板。

## 功能特性

- 🚀 快速创建 Next.js 项目
- ⚙️ 交互式配置选项
- 📦 支持多种技术栈选择
- 🎨 支持多种样式方案
- 🔧 可选功能模块

## 使用方法

### 全局安装

```bash
npm install -g create-base-app
# 或
yarn global add create-base-app
# 或
pnpm add -g create-base-app
```

### 创建新项目

```bash
create-base-app my-project
```

或者不指定项目名称，在交互过程中输入：

```bash
create-base-app
```

### 配置选项

CLI 会引导你完成以下配置：

#### 基本信息
- **项目名称**: 项目的目录名称
- **作者**: 作者名称（可选）
- **项目描述**: 项目描述（可选）

#### 技术选择
- **TypeScript**: 是否使用 TypeScript
- **样式方案**:
  - Tailwind CSS
  - CSS Modules
  - Styled Components
  - Plain CSS
- **路由模式**:
  - App Router（推荐）
  - Pages Router

#### 可选功能
- Authentication (NextAuth.js)
- API Routes
- Environment Variables (.env.example)
- ESLint + Prettier
- Git Repository (.git)
- i18n Support
- State Management (Zustand)
- Testing (Jest + React Testing Library)

#### 包管理器
- npm
- yarn
- pnpm

### 示例

```bash
$ create-base-app my-app

┌─────────────────────────────────────┐
│     Create Base App CLI Tool       │
│     Next.js + Base Framework       │
└─────────────────────────────────────┘

? What is your project name? my-app
? Would you like to use TypeScript? Yes
? Which styling solution would you like to use? Tailwind CSS
? Use Next.js App Router (app directory) or Pages Router (pages directory)? App Router (Recommended)
? Which features would you like to include? (Press <space> to select, <a> to toggle all, <i> to invert selection)
◉ API Routes
◯ Authentication (NextAuth.js)
◯ i18n Support
◯ State Management (Zustand)
...
```

## 项目结构

生成的项目包含以下结构：

```
my-app/
├── src/
│   ├── app/              # App Router 目录（如果选择 App Router）
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── pages/            # Pages Router 目录（如果选择 Pages Router）
│   │   └── index.tsx
│   ├── components/       # React 组件
│   ├── lib/              # 工具函数
│   ├── styles/           # 样式文件
│   └── public/           # 静态资源
├── package.json
├── next.config.js
├── tsconfig.json         # 如果选择 TypeScript
├── .gitignore
├── .env.example          # 如果选择环境变量支持
├── README.md
└── ...
```

## 后续步骤

创建项目后：

```bash
cd my-app
npm install    # 或 yarn / pnpm install
npm run dev    # 启动开发服务器
```

访问 http://localhost:3000 查看你的应用。

## 开发

### 本地开发

```bash
cd create-base-app
npm install
node bin/cli.js test-project
```

### 发布

```bash
npm publish
```

## 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [base-framework](../)

## License

MIT
