import { getBlogById } from '@/lib/md-utils.server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetailClient from './page.client';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
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
    description: blog.excerpt || '',
    keywords: blog.tags.join(', '),
    openGraph: {
      title: blog.title,
      description: blog.excerpt || '',
      images: blog.imageUrl ? [blog.imageUrl] : undefined,
      type: 'article',
      publishedTime: blog.date,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const blog = getBlogById(id);

  if (!blog) {
    notFound();
  }

  // 获取页面浏览量
  let pageViews = 0;
  try {
    const response = await fetch(`/api/share?pathname=/blogs/${id}`);
    if (response.ok) {
      const result = await response.json();
      pageViews = Number(result?.pageViews ?? 0);
    }
  } catch {
    pageViews = 0;
  }

  return <BlogDetailClient blog={blog} pageViews={pageViews} />;
}
