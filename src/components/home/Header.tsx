'use client';

import { AuthSection } from '@/components/auth';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import HeaderBrand from './HeaderBrand';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface HeaderProps {
  className?: string;
}

/**
 * Header 组件
 *
 * 功能：在顶栏左侧显示品牌名，右侧编排登录/语言/主题控件
 * 样式：支持桌面与移动响应式布局
 * 可访问性：语义化 nav 标签、焦点可见、Tab 顺序合理
 *
 * 注意：此组件应放在全宽容器内，外层容器负责 padding 和最大宽度
 */
export default function Header({ className }: HeaderProps) {
  const t = useTranslations('common');
  
  return (
    <nav
      className={cn(
        "flex flex-col sm:flex-row gap-4 items-center sm:items-center w-full justify-between",
        className
      )}
      aria-label="Main"
    >
      {/* 左侧：品牌名 */}
      <div className="flex items-center">
        <HeaderBrand />
      </div>

      {/* 中间：导航链接 */}
      <div className="flex gap-6 items-center">
        <Link 
          href="/pricing" 
          className="text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          {t('navigation.pricing')}
        </Link>
      </div>

      {/* 右侧：登录/语言/主题控件 */}
      <div className="flex gap-3 items-center flex-wrap justify-center sm:justify-end">
        <AuthSection />
        <div className="flex gap-3 items-center">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
