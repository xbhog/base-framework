'use client';

import { useTranslations } from 'next-intl';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Reveal from '@/components/ui/Reveal';

interface FaqSectionProps {
  className?: string;
}

export default function FaqSection({ className }: FaqSectionProps) {
  const t = useTranslations('home.faq');

  const faqs = ['q1', 'q2', 'q3', 'q4'] as const;

  return (
    <section className={className}>
      <Reveal direction="up" delay={0}>
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          {t('title')}
        </h2>
      </Reveal>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <Reveal key={faq} delay={index * 60} direction="up">
              <AccordionItem
                value={faq}
                className="border rounded-lg bg-card px-6 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline py-6">
                  {t(`items.${faq}.q`)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 pt-2">
                  {t(`items.${faq}.a`)}
                </AccordionContent>
              </AccordionItem>
            </Reveal>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
