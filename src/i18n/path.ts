import { routing } from './routing';

/**
 * 根据语言和路径生成本地化路径
 * @param pathname - 逻辑路径，如 '/' 或 '/about'
 * @param locale - 语言代码，如 'en' 或 'zh-CN'
 * @returns 本地化后的路径
 *
 * 示例：
 * - buildLocalizedPath('/', 'en') => '/'
 * - buildLocalizedPath('/', 'zh-CN') => '/zh-CN'
 * - buildLocalizedPath('/about', 'en') => '/about'
 * - buildLocalizedPath('/about', 'zh-CN') => '/zh-CN/about'
 */
export function buildLocalizedPath(pathname: string, locale: string): string {
  // 确保 pathname 以 / 开头
  const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;

  // 如果是默认语言且 localePrefix 为 'as-needed'，不添加语言前缀
  if (locale === routing.defaultLocale && routing.localePrefix === 'as-needed') {
    return normalizedPathname;
  }

  // 其他语言添加语言前缀
  // 如果 pathname 是根路径 '/'，不添加额外的斜杠
  if (normalizedPathname === '/') {
    return `/${locale}`;
  }
  return `/${locale}${normalizedPathname}`;
}

/**
 * 生成绝对 URL
 * @param pathname - 路径，如 '/' 或 '/zh-CN/'
 * @returns 完整的绝对 URL
 *
 * 示例：
 * - buildAbsoluteUrl('/') => 'https://example.com/'
 * - buildAbsoluteUrl('/zh-CN') => 'https://example.com/zh-CN'
 */
export function buildAbsoluteUrl(pathname: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_SITE_URL environment variable is not defined. Please set it in .env.local');
  }
  // 移除 baseUrl 末尾的斜杠（如果有）
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  // 确保 pathname 以 / 开头
  const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;

  return `${normalizedBaseUrl}${normalizedPathname}`;
}

/**
 * 为给定路径生成所有语言的 alternates 映射
 * @param pathname - 逻辑路径，如 '/' 或 '/about'
 * @returns alternates.languages 对象，包含各语言和 x-default
 *
 * 示例：
 * generateAlternates('/') => {
 *   'en': 'https://example.com/',
 *   'zh-CN': 'https://example.com/zh-CN',
 *   'x-default': 'https://example.com/'
 * }
 */
export function generateAlternates(pathname: string): Record<string, string> {
  const alternates: Record<string, string> = {};

  // 为每个语言生成 alternate 链接
  routing.locales.forEach((locale) => {
    const localizedPath = buildLocalizedPath(pathname, locale);
    alternates[locale] = buildAbsoluteUrl(localizedPath);
  });

  // 添加 x-default，指向默认语言
  const defaultPath = buildLocalizedPath(pathname, routing.defaultLocale);
  alternates['x-default'] = buildAbsoluteUrl(defaultPath);

  return alternates;
}

/**
 * 生成当前页面的 canonical URL（指向当前语言版本）
 * @param pathname - 逻辑路径，如 '/' 或 '/about'
 * @param locale - 当前语言代码，如 'en' 或 'zh-CN'
 * @returns canonical URL
 *
 * 示例：
 * - generateCanonical('/', 'en') => 'https://example.com/'
 * - generateCanonical('/', 'zh-CN') => 'https://example.com/zh-CN'
 * - generateCanonical('/about', 'en') => 'https://example.com/about'
 * - generateCanonical('/about', 'zh-CN') => 'https://example.com/zh-CN/about'
 */
export function generateCanonical(pathname: string, locale: string): string {
  const localizedPath = buildLocalizedPath(pathname, locale);
  return buildAbsoluteUrl(localizedPath);
}
