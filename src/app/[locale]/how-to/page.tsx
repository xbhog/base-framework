import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { generateAlternates, generateCanonical } from '@/i18n/path';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

/**
 * 为 How-to 页面生成 metadata（包括 canonical 和 hreflang）
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'howto' });

  // 生成 How-to 页面的 canonical URL（指向当前语言版本）
  const canonical = generateCanonical('/how-to', locale);

  // 生成所有语言版本的 alternates（包括 x-default）
  const alternates = generateAlternates('/how-to');

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    alternates: {
      canonical,
      languages: alternates,
    },
  };
}

export default async function HowToPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'howto' });

  const steps = ['upload', 'canvas', 'crop', 'download'] as const;

  return (
    <div className="min-h-screen">
      {/* Header Spacer - 与首页 header 保持一致 */}
      <div className="h-[73px]" />

      {/* 全宽背景 + 内容居中 */}
      <main className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* 返回首页按钮 */}
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t('backToHome')}
              </Link>
            </Button>
          </div>

          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              {t('pageTitle')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('pageDescription')}
            </p>
          </div>

          {/* 2×2 卡片布局 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <Card key={step} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <CardTitle className="text-xl">
                      {t(`steps.${step}.title`)}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {t(`steps.${step}.desc`)}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 返回首页 CTA */}
          <div className="flex justify-center mt-12">
            <Button asChild size="lg">
              <Link href="/">
                {t('backToHome')}
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
