'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import HeroTool from '@/components/home/HeroTool';
import Reveal from '@/components/ui/Reveal';
import { Skeleton } from '@/components/ui/skeleton';

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className }: HeroSectionProps) {
  const t = useTranslations('home.hero');
  const tTool = useTranslations('home.hero.tool');
  const tLegal = useTranslations('legal');
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // 状态管理：上传文件、Prompt、处理状态
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  // 处理生成按钮点击
  const handleGenerate = () => {
    // 如果正在加载会话状态，不执行操作
    if (isPending) {
      return;
    }

    // 未登录：跳转到登录页（或触发登录流程）
    if (!session) {
      // 跳转到首页，Header 组件会处理登录
      router.push('/');
      // 可以在这里添加提示消息
      alert(tTool('loginRequired'));
      return;
    }

    // 已登录：显示占位提示（模拟队列处理）
    setIsProcessing(true);
    setShowNotice(true);

    // 3 秒后恢复状态
    setTimeout(() => {
      setIsProcessing(false);
      setShowNotice(false);
    }, 3000);
  };

  return (
    <section className={className}>
      {/* 两列布局容器 - 桌面横排,移动端纵向堆叠 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start lg:items-center">
        {/* 左列: 文案区 */}
        <Reveal direction="up" delay={80}>
          <div className="flex flex-col space-y-6 w-full">
            {/* Beta 标签 + Info 链接 */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {t('badge')}
              </span>
              <Link
                href="#"
                className="text-xs text-muted-foreground hover:text-primary transition-apple underline underline-offset-2"
              >
                {t('badgeInfo')}
              </Link>
            </div>

            {/* H1 标题 - 页面唯一，权重提升 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              {t('title')}
            </h1>

            {/* 副标题 - 弱化色 */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t('subtitle')}
            </p>

            {/* CTA 文案 - 类似 WasItAI */}
            <p className="text-base font-medium text-foreground">
              {t('ctaText')}
            </p>
          </div>
        </Reveal>

        {/* 右列: 工具卡 */}
        <Reveal direction="down" delay={120}>
          <div className="flex flex-col space-y-6 w-full">
            {/* 加载状态：显示 Skeleton */}
            {isPending ? (
              <div className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-3/4" />
              </div>
            ) : (
              <>
                {/* "Try it now" 标签 */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-sm">
                    {tTool('badge')}
                  </span>
                </div>

                {/* HeroTool 组件 - 添加背景和阴影 */}
                <div className="relative">
                  {/* 模糊背景装饰 */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-3xl blur-2xl -z-10" />

                  {/* 工具卡片 */}
                  <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
                    <HeroTool
                      file={file}
                      prompt={prompt}
                      onFileChange={setFile}
                      onPromptChange={setPrompt}
                      onGenerate={handleGenerate}
                      isProcessing={isProcessing}
                    />
                  </div>
                </div>

                {/* 处理中提示 */}
                {showNotice && (
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-sm text-center transition-apple">
                    {tTool('processing')}
                  </div>
                )}

                {/* 条款提示 */}
                <div className="text-sm text-muted-foreground text-center">
                  <p>
                    {tLegal('uploadAgree')}{' '}
                    <Link
                      href="#"
                      className="underline underline-offset-4 hover:text-foreground transition-apple focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
                    >
                      {tLegal('terms')}
                    </Link>
                    {' '}{tLegal('and')}{' '}
                    <Link
                      href="#"
                      className="underline underline-offset-4 hover:text-foreground transition-apple focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
                    >
                      {tLegal('privacy')}
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
