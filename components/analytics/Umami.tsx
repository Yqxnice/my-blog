'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { siteConfig } from '@/lib/config';

export function Umami() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const { umami } = siteConfig.analytics;
    
    if (!umami || !umami.websiteId || !umami.scriptUrl) {
      return;
    }

    // 检查 umami 脚本是否已加载
    if (typeof window !== 'undefined' && !window.umami) {
      // 创建并加载 umami 脚本
      const script = document.createElement('script');
      script.src = umami.scriptUrl;
      script.async = true;
      script.defer = true;
      script.setAttribute('data-website-id', umami.websiteId);
      
      // 启用自动跟踪
      script.setAttribute('data-auto-track', 'true');
      
      // 启用缓存
      script.setAttribute('data-cache', 'true');
      
      document.head.appendChild(script);
    } else if (typeof window !== 'undefined' && window.umami) {
      // 手动跟踪页面视图
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      window.umami('pageview', url);
    }
  }, [pathname, searchParams]);

  return null;
}

// 事件跟踪钩子
export function useUmamiEvent() {
  return function trackEvent(eventName: string, eventData?: Record<string, any>) {
    if (typeof window !== 'undefined' && window.umami) {
      window.umami('event', eventName, eventData);
    }
  };
}
