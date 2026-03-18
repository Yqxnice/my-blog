import { getAllBlogs } from './md-utils';
import { siteConfig } from './config';

/**
 * 生成 RSS 订阅内容
 * @returns RSS XML 字符串
 */
export function generateRssFeed() {
  const blogs = getAllBlogs();
  const sortedBlogs = blogs.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const rssItems = sortedBlogs.map(blog => `
    <item>
      <title>${escapeXml(blog.title)}</title>
      <link>${siteConfig.url}/blogs/${blog.slug}</link>
      <description>${escapeXml(blog.excerpt)}</description>
      <pubDate>${new Date(blog.date).toUTCString()}</pubDate>
      <guid>${siteConfig.url}/blogs/${blog.slug}</guid>
      ${blog.tags.map(tag => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <description>${escapeXml(siteConfig.description)}</description>
    <link>${siteConfig.url}</link>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml" />
    <language>${siteConfig.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js</generator>
    ${rssItems}
  </channel>
</rss>`;
}

/**
 * 转义 XML 特殊字符
 * @param text 要转义的文本
 * @returns 转义后的文本
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
