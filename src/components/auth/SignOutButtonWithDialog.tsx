/**
 * SignOutButtonWithDialog 组件
 *
 * 功能：在注销前通过 Dialog 弹窗进行二次确认
 * 增强用户体验和防止误操作
 */

'use client';

import { useState } from 'react';
import { signOut } from '@/lib/auth-client';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LogOut } from 'lucide-react';

interface SignOutButtonWithDialogProps {
  /**
   * 登出成功后的回调 URL
   */
  redirectTo?: string;

  /**
   * 自定义按钮文本
   */
  children?: React.ReactNode;

  /**
   * 登出成功后的回调函数
   */
  onSuccess?: () => void;

  /**
   * 是否为菜单项模式（用于下拉菜单）
   */
  asMenuItem?: boolean;
}

export function SignOutButtonWithDialog({
  redirectTo,
  children,
  onSuccess,
  asMenuItem = false,
}: SignOutButtonWithDialogProps) {
  const t = useTranslations('Auth');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 调用 Better Auth 的登出方法
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            // 执行自定义回调
            if (onSuccess) {
              onSuccess();
            }

            // 如果指定了重定向 URL，则跳转
            if (redirectTo) {
              window.location.href = redirectTo;
            } else {
              // 否则刷新页面以清除状态
              window.location.reload();
            }
          },
          onError: (ctx) => {
            console.error('Logout failed:', ctx.error);
            setError(t('logout_failed'));
            setIsLoading(false);
          },
        },
      });
    } catch (err) {
      console.error('Logout failed:', err);
      setError(err instanceof Error ? err.message : t('logout_failed'));
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {asMenuItem ? (
          <div className="flex items-center w-full cursor-pointer">
            {children}
          </div>
        ) : (
          <Button variant="destructive" className="gap-2">
            <LogOut className="h-4 w-4" />
            <span>{children || t('sign_out')}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{t('sign_out_confirm_title') || 'Confirm Sign Out'}</DialogTitle>
          <DialogDescription>
            {t('sign_out_confirm_message') || 'Are you sure you want to sign out? You will need to sign in again to access your account.'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
            {error}
          </div>
        )}

        <DialogFooter className="gap-3 sm:gap-3">
          {/* 按照苹果规范：左侧是次要/危险操作，右侧是安全操作（取消） */}
          <Button
            variant="ghost"
            onClick={handleSignOut}
            disabled={isLoading}
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>{t('signing_out')}</span>
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                <span>{t('sign_out')}</span>
              </>
            )}
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            className="sm:min-w-[100px]"
          >
            {t('cancel') || 'Cancel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
