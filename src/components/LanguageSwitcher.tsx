'use client';

import { routing, usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Check, Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: (typeof routing.locales)[number]) => {
    router.replace(pathname, { locale: newLocale });
  };

  // 优先尝试用目标语言自身的本地名称，不行则退回到当前语言，再退回语言代码
  const getLanguageLabel = (code: string) => {
    try {
      const native = new Intl.DisplayNames([code], { type: 'language' }).of(code);
      if (native) return native;
    } catch {}
    try {
      const localized = new Intl.DisplayNames([currentLocale], { type: 'language' }).of(code);
      if (localized) return localized;
    } catch {}
    return code;
  };

  // 获取当前语言的短代码显示
  const getCurrentLanguageShort = () => {
    return currentLocale.toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Globe className="h-4 w-4" />
          <Badge variant="secondary" className="px-2 py-0">
            {getCurrentLanguageShort()}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {routing.locales.map((code) => {
          const active = currentLocale === code;
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => switchLocale(code)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <span>{getLanguageLabel(code)}</span>
                {active && <Check className="h-4 w-4" />}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
