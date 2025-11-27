/**
 * 加载指定语言的模块化JSON消息文件
 * @param locale 语言代码
 * @returns 合并后的消息对象
 */
export async function loadMessages(locale: string): Promise<Record<string, any>> {
  try {
    // 从构建的静态JSON文件加载消息
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000'}/messages/${locale}.json`);
    
    if (!response.ok) {
      console.warn(`无法加载语言文件: ${locale}`);
      return {};
    }
    
    const messages = await response.json();
    return messages;
  } catch (error) {
    console.error(`加载消息文件时出错 (${locale}):`, error);
    return {};
  }
}