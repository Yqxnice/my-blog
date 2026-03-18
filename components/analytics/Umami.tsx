'use client';

import { useEffect } from 'react';
import { siteConfig } from '@/lib/config';

const Umami = () => {
  useEffect(() => {
    // 从配置文件中获取 Umami 配置
    const { baseUrl, websiteId } = siteConfig.analytics.umami || {};
    
    // 检查配置是否存在
    if (!baseUrl || !websiteId) {
      return;
    }

    // 动态加载 Umami 跟踪脚本
    const script = document.createElement('script');
    script.src = `${baseUrl}/script.js`;
    script.defer = true;
    script.setAttribute('data-website-id', websiteId);
    
    // 添加到 head 标签
    document.head.appendChild(script);

    // 清理函数
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default Umami;
