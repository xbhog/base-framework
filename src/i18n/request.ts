import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// 注意：这个函数只在服务端执行，不会发送到客户端
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  // 动态导入i18n-utils，确保只在服务端执行
  const { loadMessages } = await import('@/lib/i18n-utils');
  
  return {
    locale,
    messages: await loadMessages(locale)
  };
});