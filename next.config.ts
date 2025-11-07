import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  // 优化 Windows 上的编译性能
  experimental: {
    // 减少并行工作进程数量以避免 EPIPE 错误
    webpackBuildWorker: false,
  },
};

export default withNextIntl(nextConfig);
