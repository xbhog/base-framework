/**
 * Dashboard 页面 - 用户个人中心
 *
 * 功能：展示已登录用户的个人信息
 * 布局：左右分栏
 * - 左侧：用户基本信息卡片
 * - 右侧：正在开发中提示
 *
 * 实现方式：服务端组件 + Better Auth 会话助手
 */

import { headers } from 'next/headers';
import Image from 'next/image';
import { auth } from '@/auth';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DashboardActions } from '@/components/dashboard/DashboardActions';
import HeaderBrand from '@/components/home/HeaderBrand';
import Reveal from '@/components/ui/Reveal';
import { Settings, Bell, CreditCard, Shield } from 'lucide-react';

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // 获取翻译函数
  const t = await getTranslations('Dashboard');
  const tAuth = await getTranslations('Auth');

  // 在服务端获取会话
  // Better Auth 提供 auth.api.getSession() 方法用于服务端获取会话
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 如果未登录，显示提示信息
  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
          <HeaderBrand />
        </div>
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
          <ThemeToggle />
        </div>

        <Reveal direction="up" delay={80}>
          <div className="relative max-w-md w-full">
            {/* 模糊背景装饰 */}
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-3xl blur-2xl -z-10" />

            {/* 卡片 */}
            <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] text-center">
              {/* 图标 */}
              <div className="mb-6 mx-auto w-16 h-16 p-4 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              {/* 标题 */}
              <h1 className="text-2xl sm:text-3xl font-bold mb-3">
                {t('not_logged_in')}
              </h1>

              {/* 描述 */}
              <p className="text-base text-muted-foreground mb-8">
                {t('login_required')}
              </p>

              {/* 返回按钮 */}
              <a
                href={`/${locale}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                {t('back_to_login')}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 顶部导航栏 */}
        <div className="flex justify-between items-center mb-8">
          <HeaderBrand />
          <ThemeToggle />
        </div>

        {/* 页面标题 */}
        <Reveal direction="up" delay={60}>
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
              {t('title')}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              {t('welcome')}, {user.name || user.email}
            </p>
          </div>
        </Reveal>

        {/* 左右布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* 左侧：用户基本信息 */}
          <div className="lg:col-span-1">
            <Reveal direction="up" delay={100}>
              <div className="relative">
                {/* 模糊背景装饰 */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-3xl blur-2xl -z-10" />

                {/* 用户信息卡片 */}
                <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
                  {/* 卡片标题 */}
                  <h2 className="text-lg font-semibold mb-6">
                    {t('user_info_title')}
                  </h2>

                  {/* 用户头像 */}
                  <div className="flex flex-col items-center mb-6">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || tAuth('user_avatar')}
                        width={120}
                        height={120}
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-border/30 shadow-lg"
                        priority
                      />
                    ) : (
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-border/30 shadow-lg bg-muted flex items-center justify-center">
                        <svg
                          className="w-14 h-14 sm:w-16 sm:h-16 text-muted-foreground"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* 用户信息列表 */}
                  <div className="space-y-4">
                    {/* 姓名 */}
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('name')}
                      </p>
                      <p className="text-base font-medium">
                        {user.name || t('not_set')}
                      </p>
                    </div>

                    <div className="border-t border-border/30" />

                    {/* 邮箱 */}
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('email')}
                      </p>
                      <p className="text-base break-all">
                        {user.email}
                      </p>
                    </div>

                    <div className="border-t border-border/30" />

                    {/* 用户 ID */}
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('user_id')}
                      </p>
                      <p className="text-sm font-mono text-muted-foreground break-all">
                        {user.id}
                      </p>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="mt-6 pt-6 border-t border-border/30">
                    <DashboardActions
                      locale={locale}
                      signOutText={tAuth('sign_out')}
                      backToHomeText={t('back_to_home')}
                      signOutTooltip={tAuth('sign_out_tooltip') || 'Sign out from your account'}
                      homeTooltip={t('home_tooltip') || 'Return to home page'}
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* 右侧：正在开发中提示 */}
          <div className="lg:col-span-2">
            <Reveal direction="up" delay={140}>
              <div className="relative">
                {/* 模糊背景装饰 */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-3xl blur-2xl -z-10" />

                {/* 开发中提示卡片 */}
                <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] min-h-[400px] flex flex-col items-center justify-center text-center">
                  {/* 图标 */}
                  <div className="mb-6 p-6 rounded-full bg-primary/10 border border-primary/20">
                    <svg
                      className="w-16 h-16 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>

                  {/* 标题 */}
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                    {t('coming_soon_title')}
                  </h2>

                  {/* 描述 */}
                  <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-md">
                    {t('coming_soon_desc')}
                  </p>

                  {/* 敬请期待 */}
                  <div className="inline-flex items-center px-6 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {t('coming_soon_subtitle')}
                  </div>

                  {/* 即将上线的功能列表 */}
                  <div className="mt-12 w-full max-w-lg">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
                      {t('features_coming')}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/30">
                        <Settings className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">{t('feature_settings')}</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/30">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">{t('feature_notifications')}</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/30">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">{t('feature_billing')}</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/30">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">{t('feature_security')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* 会话信息（调试用） */}
        {process.env.NODE_ENV === 'development' && (
          <Reveal direction="up" delay={180}>
            <div className="mt-8 bg-muted/50 rounded-2xl p-6 border border-border/30">
              <h2 className="text-lg font-semibold mb-4">
                {t('session_info')}
              </h2>
              <pre className="text-xs text-muted-foreground overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
