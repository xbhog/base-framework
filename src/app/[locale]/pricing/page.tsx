import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { generateAlternates, generateCanonical } from '@/i18n/path';
import ScrollHeader from "@/components/home/ScrollHeader";
import Footer from "@/components/home/Footer";
import PricingSection from "@/components/home/PricingSection";

/**
 * 为定价页面生成页面级 metadata（包括 canonical 和 hreflang）
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const tMetadata = await getTranslations({ locale, namespace: 'metadata' });
  const tPricing = await getTranslations({ locale, namespace: 'pricing' });

  // 生成定价页面的 canonical URL（指向当前语言版本）
  const canonical = generateCanonical('/pricing', locale);

  // 生成所有语言版本的 alternates（包括 x-default）
  const alternates = generateAlternates('/pricing');

  return {
    title: `${tPricing('title')} | ${tMetadata('title')}`,
    description: tPricing('description'),
    openGraph: {
      type: 'website',
      locale,
      url: canonical,
      title: `${tPricing('title')} | ${tMetadata('title')}`,
      description: tPricing('description'),
      siteName: tMetadata('title'),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tPricing('title')} | ${tMetadata('title')}`,
      description: tPricing('description'),
    },
    alternates: {
      canonical,
      languages: alternates,
    },
  };
}

export default async function Pricing({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - 全宽背景，带滚动效果 */}
      <ScrollHeader />

      {/* Main - 内容居中 */}
      <main className="flex-1">
        {/* Pricing 区：全宽 + 内容居中 */}
        <section className="w-full py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 sm:px-8 lg:px-10">
            <PricingSection />
          </div>
        </section>
      </main>

      {/* Footer - 全宽 */}
      <footer className="w-full border-t bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-10">
          <Footer />
        </div>
      </footer>
    </div>
  );
}
