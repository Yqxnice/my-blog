import type { Metadata } from 'next';
import { getBlogById } from './md-utils';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const blog = getBlogById(params.id);
  
  if (!blog) {
    return {
      title: '博客不存在 - 木子博客',
      description: '找不到指定的博客文章',
    };
  }

  const baseUrl = 'https://www.muzi.dev';
  const blogUrl = `${baseUrl}/blogs/${blog.slug}`;

  return {
    title: blog.title,
    description: blog.excerpt,
    keywords: [...blog.tags, '前端开发', '技术博客'],
    openGraph: {
      type: 'article',
      title: blog.title,
      description: blog.excerpt,
      url: blogUrl,
      siteName: '木子博客',
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
