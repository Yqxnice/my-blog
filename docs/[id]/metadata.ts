import type { Metadata } from 'next';
import { getBlogById } from '@/lib/md-utils.server';
import { siteConfig } from '@/lib/config';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const blog = getBlogById(id);

    if (!blog) {
      return {
        title: '博客不存在',
        description: '找不到指定的博客文章',
      };
    }

    return {
      title: blog.title,
      description: blog.excerpt,
      keywords: [...blog.tags, ...siteConfig.keywords],
      openGraph: {
        type: 'article',
        title: blog.title,
        description: blog.excerpt,
        url: `${siteConfig.url}/blogs/${blog.slug}`,
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
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '博客',
      description: siteConfig.description,
    };
  }
}

