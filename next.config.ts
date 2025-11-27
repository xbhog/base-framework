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
  // 禁用 webpack 持久缓存以避免缓存损坏问题
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // 开发模式下禁用持久缓存
      config.cache = false;
    } else {
      // 生产模式下使用内存缓存而不是磁盘缓存
      config.cache = {
        type: 'memory',
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
