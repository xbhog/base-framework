/**
 * Better Auth API Route Handler
 *
 * 此文件挂载 Better Auth 的处理器到 /api/auth/* 路径
 * 处理所有认证相关的请求，包括：
 * - OAuth 回调 (/api/auth/callback/google)
 * - 会话管理 (/api/auth/get-session)
 * - 登录/登出 (/api/auth/sign-in, /api/auth/sign-out)
 *
 * @see https://www.better-auth.com/docs/integrations/next
 */

import { auth } from '@/auth';
import { toNextJsHandler } from 'better-auth/next-js';

/**
 * 导出 GET 和 POST 处理器
 *
 * Better Auth 会自动处理以下端点：
 * - GET  /api/auth/get-session - 获取当前会话
 * - POST /api/auth/sign-in - 登录
 * - POST /api/auth/sign-out - 登出
 * - GET  /api/auth/callback/google - Google OAuth 回调
 * - 以及其他 Better Auth 内置端点
 */
export const { GET, POST } = toNextJsHandler(auth.handler);
