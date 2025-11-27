'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { pricingConfig } from '@/lib/pricingConfig';

/**
 * PricingSection 组件
 * 
 * 功能：展示定价页面的主要内容，包括不同的定价方案
 * 样式：使用卡片布局，支持响应式设计
 * 可访问性：语义化标签、清晰的视觉层次
 */
export default function PricingSection() {
  const t = useTranslations('pricing');

  return (
    <div className="flex flex-col gap-16">
      {/* 页面标题 */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{t('title')}</h1>
        <p className="text-lg text-muted-foreground">{t('description')}</p>
      </div>

      {/* 定价方案卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingConfig.plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
              plan.isPopular ? 'border-primary shadow-md scale-105' : ''
            }`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium">
                {t('popular')}
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{t(`plans.${plan.id}.name`)}</CardTitle>
              <CardDescription>{t(`plans.${plan.id}.description`)}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/{t('billingCycle')}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {Array.from({ length: plan.featureCount }).map((_, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{t(`plans.${plan.id}.features.${index}`)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg">
                {t(`plans.${plan.id}.cta`)}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
