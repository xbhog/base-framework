/**
 * 定价配置文件
 * 
 * 功能：定义定价页面的配置数据，包括不同的定价方案、价格标签等
 * 用途：在定价页面中使用这些配置数据渲染价格标签
 * 特点：支持动态配置，方便后续修改和扩展
 */

// 定义定价方案的类型
export interface PricingPlan {
  id: string;
  price: number;
  isPopular: boolean;
  featureCount: number;
}

// 定义定价配置的类型
export interface PricingConfig {
  plans: PricingPlan[];
  billingCycle: string;
}

// 定价配置的默认值
export const pricingConfig: PricingConfig = {
  billingCycle: 'month',
  plans: [
    {
      id: 'basic',
      price: 0,
      isPopular: false,
      featureCount: 5
    },
    {
      id: 'pro',
      price: 19,
      isPopular: true,
      featureCount: 7
    },
    {
      id: 'enterprise',
      price: 99,
      isPopular: false,
      featureCount: 9
    }
  ]
};
