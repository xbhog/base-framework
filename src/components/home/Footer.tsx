'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  const t = useTranslations('brand');
  const tLegal = useTranslations('legal');

  return (
    <footer className={className}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {t('name')}. {t('copyright')}
        </div>
        <div className="flex gap-4 text-sm">
          <Link
            href="/terms"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {tLegal('terms')}
          </Link>
          <Link
            href="/privacy"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {tLegal('privacy')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
