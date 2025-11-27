/**
 * AuthSection 组件
 *
 * 功能:根据用户登录状态显示登录或登出按钮
 * 样式:使用 ShadCN UI 组件
 * 类型:客户端组件(使用 Better Auth 的 useSession Hook)
 */

'use client';

import { useSession } from '@/lib/auth-client';
import { SignInButton } from './SignInButton';
import { SignOutButtonWithDialog } from './SignOutButtonWithDialog';
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import Link from 'next/link';

export function AuthSection() {
  const t = useTranslations('auth.index');
  const tDashboard = useTranslations('Dashboard');
  const { data: session, isPending } = useSession();

  // 加载中状态
  if (isPending) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-pulse text-gray-500">
          {t('loading')}
        </div>
      </div>
    );
  }

  // 已登录:显示用户信息和下拉菜单
  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.user.image || ''} alt={session.user.name || t('user_avatar')} />
              <AvatarFallback className="text-xs">
                {session.user.name?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                {session.user.name || t('unknown_user')}
              </span>
              <span className="text-xs text-muted-foreground">
                {session.user.email}
              </span>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.name || t('unknown_user')}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>{tDashboard('menu_label')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <SignOutButtonWithDialog redirectTo="/" asMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('sign_out')}</span>
            </SignOutButtonWithDialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // 未登录:显示登录按钮（登录后跳转到 Dashboard）
  return <SignInButton callbackURL="/dashboard" />;
}
