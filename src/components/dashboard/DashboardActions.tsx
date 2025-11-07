/**
 * DashboardActions 组件
 *
 * 包含 Dashboard 页面的操作按钮，并增强了以下交互：
 * - 为按钮添加 Tooltip 提示
 * - 为注销按钮添加 Dialog 确认
 */

'use client';

import { SignOutButtonWithDialog } from '@/components/auth/SignOutButtonWithDialog';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Home } from 'lucide-react';
import Link from 'next/link';

interface DashboardActionsProps {
  locale: string;
  signOutText: string;
  backToHomeText: string;
  signOutTooltip?: string;
  homeTooltip?: string;
}

export function DashboardActions({
  locale,
  signOutText,
  backToHomeText,
  signOutTooltip,
  homeTooltip,
}: DashboardActionsProps) {
  return (
    <TooltipProvider>
      <div className="pt-6 flex gap-4">
        {/* 注销按钮 - 带 Dialog 确认和 Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <SignOutButtonWithDialog redirectTo={`/${locale}`}>
                {signOutText}
              </SignOutButtonWithDialog>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{signOutTooltip || 'Sign out from your account'}</p>
          </TooltipContent>
        </Tooltip>

        {/* 返回首页按钮 - 带 Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" asChild>
              <Link href={`/${locale}`} className="gap-2">
                <Home className="h-4 w-4" />
                <span>{backToHomeText}</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{homeTooltip || 'Return to home page'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
