/**
 * Better Auth 客户端配置
 *
 * 提供客户端认证功能，包括：
 * - signIn: 登录方法（社交登录、邮箱登录等）
 * - signOut: 登出方法
 * - useSession: React Hook，获取当前会话状态
 *
 * @see https://www.better-auth.com/docs/concepts/client
 */

import { createAuthClient } from 'better-auth/react';

/**
 * 创建 Better Auth 客户端实例
 *
 * baseURL 从环境变量 NEXT_PUBLIC_SITE_URL 获取
 * 如果客户端和服务端在同一域名，可以省略 baseURL
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
});

/**
 * 导出常用的认证方法和 Hooks
 *
 * - signIn: 登录方法
 *   - signIn.social({ provider: 'google', callbackURL: '/' })
 *   - signIn.email({ email, password })
 *
 * - signOut: 登出方法
 *   - signOut({ fetchOptions: { onSuccess: () => {...} } })
 *
 * - useSession: React Hook
 *   - const { data: session, isPending, error } = useSession()
 *
 * - signUp: 注册方法（如果启用邮箱注册）
 */
export const { signIn, signOut, signUp, useSession } = authClient;
