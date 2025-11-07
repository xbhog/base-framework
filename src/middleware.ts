import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

/**
 * 仅负责 i18n 路由解析与重定向。
 *
 * 说明：Next.js Middleware 始终运行在 Edge Runtime，
 * 不应在此引入 Node.js 依赖（如 Prisma/Better Auth）。
 * 受保护路由的鉴权放在相应的 Server Component 布局中处理。
 */
export default createMiddleware(routing)

export const config = {
  // 匹配除了 API 路由、静态文件等之外的所有路径
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
