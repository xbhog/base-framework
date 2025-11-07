/**
 * Better Auth 配置
 *
 * 提供统一的认证服务，包括：
 * - Google OAuth 登录
 * - 数据库会话持久化（PostgreSQL via Prisma）
 * - 服务端会话管理
 * - 客户端认证助手
 */

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';

// 验证必要的环境变量
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('BETTER_AUTH_SECRET is not defined in environment variables');
}

if (!process.env.BETTER_AUTH_URL) {
  throw new Error('BETTER_AUTH_URL is not defined in environment variables');
}

/**
 * Better Auth 实例
 *
 * 配置说明：
 * - database: 使用 Prisma adapter 连接 PostgreSQL
 * - socialProviders: 配置 Google OAuth
 * - session: 数据库持久化会话
 * - 自定义表名：使用 _Base 后缀以避免与现有业务表冲突
 */
export const auth = betterAuth({
  // 数据库配置 - 使用 Prisma adapter
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  // 自定义表名映射（使用 _Base 后缀）
  user: {
    modelName: 'User_Base',
  },

  session: {
    modelName: 'Session_Base',
  },

  account: {
    modelName: 'Account_Base',
  },

  verification: {
    modelName: 'VerificationToken_Base',
  },

  // 社交登录提供商配置
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // 可选：自定义作用域
      // scope: ['email', 'profile'],
    },
  },

  // 基础 URL 配置
  baseURL: process.env.BETTER_AUTH_URL,

  // 密钥配置
  secret: process.env.BETTER_AUTH_SECRET,
});

/**
 * 导出类型定义，用于客户端类型推断
 */
export type Auth = typeof auth;
