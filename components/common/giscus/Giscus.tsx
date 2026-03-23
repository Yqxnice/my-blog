'use client';

import { useEffect, useRef, useState } from 'react';

interface GiscusProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
  term?: string;
  strict?: boolean;
  reactionsEnabled?: boolean;
  emitMetadata?: boolean;
  inputPosition?: 'top' | 'bottom';
  theme?: string;
  lang?: string;
  lazy?: boolean;
}

export default function Giscus({
  repo,
  repoId,
  category,
  categoryId,
  mapping = 'pathname',
  term,
  strict = false,
  reactionsEnabled = true,
  emitMetadata = false,
  inputPosition = 'bottom',
  theme: themeProp,
  lang = 'zh-CN',
  lazy = false,
}: GiscusProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState(() => themeProp || 'light');
  const [isVisible, setIsVisible] = useState(!lazy);

  // 主题同步
  useEffect(() => {
    const updateTheme = () => {
      if (themeProp) {
        setTheme(themeProp);
      } else {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark_dimmed' : 'light');
      }
    };

    updateTheme();

    // 监听主题变化
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [themeProp]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' } // 提前 200px 开始加载
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [lazy, isVisible]);

  // 加载 Giscus script
  useEffect(() => {
    if (!isVisible) return;

    const currentRef = ref.current;
    if (!currentRef) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', mapping);
    if (term) script.setAttribute('data-term', term);
    script.setAttribute('data-strict', String(strict));
    script.setAttribute('data-reactions-enabled', String(reactionsEnabled));
    script.setAttribute('data-emit-metadata', String(emitMetadata));
    script.setAttribute('data-input-position', inputPosition);
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', lang);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    currentRef!.appendChild(script);

    return () => {
      if (currentRef) {
        currentRef.innerHTML = '';
      }
    };
  }, [
    repo,
    repoId,
    category,
    categoryId,
    mapping,
    term,
    strict,
    reactionsEnabled,
    emitMetadata,
    inputPosition,
    theme,
    lang,
    isVisible,
  ]);

  // 主题变化时更新 Giscus
  useEffect(() => {
    if (!isVisible) return;

    const iframe = document.querySelector('iframe[src*="giscus"]') as HTMLIFrameElement | null;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { giscus: { setConfig: { theme } } },
        'https://giscus.app'
      );
    }
  }, [theme, isVisible]);

  return <div ref={ref} className="giscus" />;
}
