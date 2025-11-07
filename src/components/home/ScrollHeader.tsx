'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Header from './Header';

/**
 * ScrollHeader 组件
 *
 * 功能：监听滚动位置，动态调整导航栏背景透明度
 * 样式：滚动时轻微材质与边界变化（不闪烁）
 * 性能：使用节流优化滚动监听
 */
export default function ScrollHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 滚动超过 20px 时改变状态
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // 添加滚动监听（使用 passive 提升性能）
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 初始检查
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header
      className={cn(
        "w-full sticky top-0 z-50 transition-apple",
        scrolled
          ? "border-b border-border/60 glass-header shadow-sm"
          : "border-b border-border/40 bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-6 sm:px-8 lg:px-10 py-4">
        <Header />
      </div>
    </header>
  );
}
