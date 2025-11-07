'use client';

import { useTranslations } from 'next-intl';
import { Sparkles, Wand2 } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

interface PromoSectionProps {
  className?: string;
}

export default function PromoSection({ className }: PromoSectionProps) {
  const t = useTranslations('promo');

  return (
    <section className={className}>
      <Reveal direction="up" delay={0}>
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          {t('title')}
        </h2>
      </Reveal>

      {/* 双卡布局：桌面并排，移动纵向堆叠 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左卡：AI 裁剪与扩展功能介绍 */}
        <Reveal direction="up" delay={80}>
          <div className="flex flex-col p-8 border rounded-xl bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wand2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">
              {t('aiCropExtend')}
            </h3>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {t('aiCropExtendDesc')}
          </p>
          {/* 可选：添加小图示意（占位） */}
          <div className="mt-auto pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span>{t('poweredByAi')}</span>
            </div>
          </div>
          </div>
        </Reveal>

        {/* 右卡：动效演示占位 */}
        <Reveal direction="up" delay={160}>
          <div className="flex flex-col p-8 border rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 text-card-foreground shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-2xl font-semibold mb-4">
            {t('animation.title')}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {t('animation.desc')}
          </p>

          {/* 动效占位区域 - 使用渐变背景和轻量 CSS 动画 */}
          <div className="flex-1 flex items-center justify-center min-h-[200px] rounded-lg bg-gradient-to-br from-background/50 to-muted/30 border-2 border-dashed border-muted-foreground/20 relative overflow-hidden">
            {/* 轻量动画效果 - 脉冲圆环 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-primary/30 animate-ping" />
              <div className="absolute w-16 h-16 rounded-full border-4 border-primary/50 animate-pulse" />
              <div className="absolute w-8 h-8 rounded-full bg-primary/70" />
            </div>

            {/* 占位文字 */}
            <div className="relative z-10 text-center px-4">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary animate-pulse" />
              <p className="text-sm text-muted-foreground font-medium">
                {t('animation.demo')}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                {t('animation.comingSoon')}
              </p>
            </div>
          </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
