'use client';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Direction = 'up' | 'down' | 'left' | 'right';

interface RevealProps {
  className?: string;
  children: React.ReactNode;
  threshold?: number; // 触发比例，默认 0.2
  once?: boolean;     // 是否只触发一次，默认 true
  direction?: Direction; // 初始位移方向，默认 'up'
  delay?: number;     // 过渡延时（ms）
}

export default function Reveal({
  className,
  children,
  threshold = 0.2,
  once = true,
  direction = 'up',
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) io.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold, once]);

  const offset =
    direction === 'up'
      ? 'translate-y-4' // 更克制的位移
      : direction === 'down'
      ? '-translate-y-4'
      : direction === 'left'
      ? 'translate-x-4'
      : '-translate-x-4';

  return (
    <div
      ref={ref}
      data-state={visible ? 'visible' : 'hidden'}
      className={cn(
        // 统一节奏：duration-300（进入动画）+ Apple 标准曲线
        'motion-safe:transition-all motion-safe:duration-[var(--duration-enter)] motion-safe:ease-[var(--ease-standard)]',
        'data-[state=hidden]:opacity-0',
        `data-[state=hidden]:${offset}`,
        'data-[state=visible]:opacity-100 data-[state=visible]:translate-x-0 data-[state=visible]:translate-y-0',
        // 降级：减少动态时关闭过渡与位移
        'motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
