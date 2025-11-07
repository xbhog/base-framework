'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function HeaderBrand() {
  const t = useTranslations('brand');

  return (
    <Link
      href="/"
      className="text-xl font-semibold hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1"
      aria-label={t('name')}
    >
      {t('name')}
    </Link>
  );
}
