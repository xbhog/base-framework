import { ReactNode } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { auth } from '@/auth'

interface DashboardLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

/**
 * 受保护路由布局：在服务端校验会话，不通过则重定向到对应语言的首页。
 */
export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    redirect(`/${locale}`)
  }

  return <>{children}</>
}

