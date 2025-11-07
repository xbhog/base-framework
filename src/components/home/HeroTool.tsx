'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface HeroToolProps {
  /** 当前上传的文件 */
  file: File | null;
  /** 当前输入的 Prompt */
  prompt: string;
  /** 文件变更回调 */
  onFileChange: (file: File | null) => void;
  /** Prompt 变更回调 */
  onPromptChange: (prompt: string) => void;
  /** 生成按钮点击回调 */
  onGenerate: () => void;
  /** 是否正在处理 */
  isProcessing?: boolean;
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * Hero 区域的最小交互工具
 *
 * 功能：
 * - 单图上传与预览
 * - Prompt 输入
 * - 示例 Prompt 填充
 * - 生成按钮（触发登录检查或占位提示）
 */
export default function HeroTool({
  file,
  prompt,
  onFileChange,
  onPromptChange,
  onGenerate,
  isProcessing = false,
  className = '',
}: HeroToolProps) {
  const t = useTranslations('hero.tool');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      onFileChange(selectedFile);
    }
  };

  // 处理拖拽上传
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      onFileChange(droppedFile);
    }
  };

  // 处理清除文件
  const handleClearFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 处理示例 Prompt
  const handleUseExample = () => {
    onPromptChange(t('exampleText'));
  };

  // 生成预览 URL（使用 useMemo 避免重复创建）
  const previewUrl = useMemo(() =>
    file ? URL.createObjectURL(file) : null,
    [file]
  );

  // 清理预览 URL（避免内存泄漏）
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      {/* 文件上传区域 */}
      <div className="relative">
        {!file ? (
          /* 未上传状态：显示上传区域 */
          <div
            className="group w-full h-40 border-2 border-dashed border-muted-foreground/25 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <svg
              className="w-12 h-12 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="text-center px-4">
              <span className="text-sm font-medium block">{t('uploading')}</span>
              <span className="text-xs text-muted-foreground/70 mt-1 block">{t('maxSize')}</span>
            </div>
          </div>
        ) : (
          /* 已上传状态：显示预览和清除按钮 */
          <div className="relative w-full h-64 rounded-xl overflow-hidden bg-muted shadow-sm">
            {previewUrl && (
              <Image
                src={previewUrl}
                alt={t('previewAlt')}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                className="object-contain"
                loading="lazy"
              />
            )}
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-3 right-3 shadow-md"
              onClick={handleClearFile}
            >
              {t('clear')}
            </Button>
          </div>
        )}

        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          aria-label={t('upload')}
        />
      </div>

      {/* Prompt 输入区域 */}
      <div className="space-y-2">
        <Textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={t('promptPlaceholder')}
          className="min-h-[100px] resize-none rounded-xl border-muted-foreground/25 focus:border-primary/50 transition-colors"
          aria-label={t('promptAriaLabel')}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleUseExample}
          className="w-full sm:w-auto rounded-lg hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
        >
          {t('examplePrompt')}
        </Button>
      </div>

      {/* 生成按钮 */}
      <Button
        size="lg"
        onClick={onGenerate}
        disabled={isProcessing}
        className="w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
      >
        {isProcessing ? t('processing') : t('generateNow')}
      </Button>
    </div>
  );
}
