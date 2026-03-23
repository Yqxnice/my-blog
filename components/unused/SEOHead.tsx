'use client';

import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

export function SEOHead({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime
}: SEOProps) {
  useEffect(() => {
    // 更新 document title
    if (title) {
      document.title = `${title} - 木子博客`;
    }

    // 更新 meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // 基础 meta tags
    if (description) updateMetaTag('description', description);
    if (keywords.length > 0) updateMetaTag('keywords', keywords.join(', '));
    
    // Open Graph tags
    if (title) updateMetaTag('og:title', title, true);
    if (description) updateMetaTag('og:description', description, true);
    if (image) updateMetaTag('og:image', image, true);
    if (url) updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', '木子博客', true);
    
    // Article specific tags
    if (type === 'article') {
      if (publishedTime) updateMetaTag('article:published_time', publishedTime, true);
      if (modifiedTime) updateMetaTag('article:modified_time', modifiedTime, true);
    }
    
    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    if (title) updateMetaTag('twitter:title', title);
    if (description) updateMetaTag('twitter:description', description);
    if (image) updateMetaTag('twitter:image', image);
  }, [title, description, keywords, image, url, type, publishedTime, modifiedTime]);

  return null;
}