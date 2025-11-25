'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Reveal from '@/components/ui/Reveal';

interface HowToSectionProps {
  className?: string;
}

export default function HowToSection({ className }: HowToSectionProps) {
  const t = useTranslations('howto');

  const steps = ['upload', 'canvas', 'crop', 'download'] as const;

  return (
    <section className={className}>
      <Reveal direction="up" delay={0}>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12">
          {t('title')}
        </h2>
      </Reveal>
      {/* 2×2 卡片布局 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <Reveal key={step} delay={index * 80} direction="up">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-base font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <CardTitle className="text-lg">
                    {t(`steps.${step}.title`)}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {t(`steps.${step}.desc`)}
                </CardDescription>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
