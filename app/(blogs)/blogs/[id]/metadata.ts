import type { Metadata } from 'next';
import { getBlogById } from '@/lib/md-utils';
import { siteConfig } from '@/lib/config';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const blog = getBlogById(params.id);
  
  if (!blog) {
    return {
      title: '博客不存在 - ' + siteConfig.name,
      description: '找不到指定的博客文章',
    };
  }

  const blogUrl = `${siteConfig.url}/blogs/${blog.slug}`;

  return {
    title: blog.title,
    description: blog.excerpt,
    keywords: [...blog.tags, ...siteConfig.keywords],
    openGraph: {
      type: 'article',
      title: blog.title,
      description: blog.excerpt,
      url: blogUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: blog.imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      publishedTime: blog.date,
      tags: blog.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt,
      images: [blog.imageUrl],
    },
    alternates: {
      canonical: blogUrl,
    },
  };
}
