import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { generateAlternates, generateCanonical } from '@/i18n/path';
import ScrollHeader from "@/components/home/ScrollHeader";
import HeroSection from "@/components/home/HeroSection";
import HowToSection from "@/components/home/HowToSection";
import FaqSection from "@/components/home/FaqSection";
import Footer from "@/components/home/Footer";

/**
 * 为首页生成页面级 metadata（包括 canonical 和 hreflang）
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  // 生成首页的 canonical URL（指向当前语言版本）
  const canonical = generateCanonical('/', locale);

  // 生成所有语言版本的 alternates（包括 x-default）
  const alternates = generateAlternates('/');

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      type: 'website',
      locale,
      url: canonical,
      title: t('title'),
      description: t('description'),
      siteName: t('title'),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical,
      languages: alternates,
    },
  };
}

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // 获取翻译用于 JSON-LD
  const faqT = await getTranslations({ locale, namespace: 'faq' });
  const metaT = await getTranslations({ locale, namespace: 'Metadata' });
  const brandT = await getTranslations({ locale, namespace: 'brand' });

  // 生成网站 URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  // WebSite JSON-LD（用于站点级搜索优化）
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': brandT('name'),
    'description': metaT('description'),
    'url': siteUrl,
    'inLanguage': locale,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${siteUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  // Organization JSON-LD（用于品牌识别）
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': brandT('name'),
    'url': siteUrl,
    'logo': `${siteUrl}/logo.png`,
    'sameAs': []
  };

  // FAQPage JSON-LD（用于 FAQ 区块）
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': faqT('items.q1.q'),
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faqT('items.q1.a')
        }
      },
      {
        '@type': 'Question',
        'name': faqT('items.q2.q'),
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faqT('items.q2.a')
        }
      },
      {
        '@type': 'Question',
        'name': faqT('items.q3.q'),
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faqT('items.q3.a')
        }
      },
      {
        '@type': 'Question',
        'name': faqT('items.q4.q'),
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faqT('items.q4.a')
        }
      }
    ]
  };

  return (
    <>
      {/* WebSite JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* Organization JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* FAQPage JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/*首页展示区域*/}
      <div className="flex flex-col min-h-screen">
        {/* Header - 全宽背景，带滚动效果 */}
        <ScrollHeader />

      {/* Main - 内容居中 */}
      <main className="flex-1">
        {/* Hero 区：全宽背景 + 内容居中 */}
        <section className="w-full bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-6 sm:px-8 lg:px-10 py-16 sm:py-20 lg:py-24">
            <HeroSection />
          </div>
        </section>

        

        


        {/* How-to 区：全宽 + 内容居中 */}
        <section className="w-full">
          <div className="container mx-auto px-6 sm:px-8 lg:px-10 py-16 sm:py-20 lg:py-24">
            <HowToSection />
          </div>
        </section>

        {/* FAQ 区：全宽 + 内容居中 */}
        <section className="w-full">
          <div className="container mx-auto px-6 sm:px-8 lg:px-10 py-16 sm:py-20 lg:py-24">
            <FaqSection />
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
    </>
  );
}
