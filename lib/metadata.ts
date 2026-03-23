/**
 * 功能：生成页面元数据
 * 目的：为不同页面提供统一的元数据生成功能
 * 作者：Yqxnice
 */
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';

interface CreateMetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  url?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  tags?: string[];
}

/**
 * 创建页面metadata的通用函数
 * @param options - 配置选项
 * @returns Metadata对象
 */
export function createMetadata(options: CreateMetadataOptions = {}): Metadata {
  const {
    title,
    description = siteConfig.description,
    keywords = siteConfig.keywords,
    url = siteConfig.url,
    image = siteConfig.ogImage,
    type = 'website',
    publishedTime,
    tags,
  } = options;

  const fullTitle = title ? `${title} - ${siteConfig.name}` : siteConfig.name;
  const fullUrl = url.startsWith('http') ? url : `${siteConfig.url}${url}`;
  const imageUrl = image.startsWith('http') ? image : `${siteConfig.url}${image}`;

  const metadata: Metadata = {
    title: title || siteConfig.name,
    description,
    keywords,
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };

  // 如果是文章类型，添加额外的属性
  if (type === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: publishedTime || new Date().toISOString(),
      tags: tags || [],
    };
  }

  return metadata;
}

/**
 * 创建博客文章metadata
 * @param blog - 博客文章数据
 * @returns Metadata对象
 */
export function createBlogMetadata(blog: {
  title: string;
  excerpt?: string;
  date: string;
  tags?: string[];
  slug?: string;
  imageUrl?: string;
}): Metadata {
  return createMetadata({
    title: blog.title,
    description: blog.excerpt,
    keywords: [...(blog.tags || []), ...siteConfig.keywords],
    url: blog.slug ? `/blogs/${blog.slug}` : undefined,
    image: blog.imageUrl,
    type: 'article',
    publishedTime: blog.date,
    tags: blog.tags,
  });
}

/**
 * 统一的页面metadata配置
 */
export const pageMetadata = {
  home: {
    title: '首页',
    description: siteConfig.description,
  },
  blogs: {
    title: '博客',
    description: '记录技术、思考与生活的碎片，分享我的学习历程和成长故事。',
    keywords: ['技术博客', '前端开发', '学习笔记'],
  },
  archive: {
    title: '归档',
    description: '按时间顺序浏览所有文章，了解我的写作历程和技术成长。',
    keywords: ['文章归档', '博客时间线'],
  },

  talks: {
    title: '碎碎念',
    description: '随手记录的思考、灵感和生活片段，展现最真实的自我。',
    keywords: ['碎碎念', '随笔', '生活感悟'],
  },
  links: {
    title: '友情链接',
    description: '我的朋友们的博客和网站，欢迎访问和交流。',
    keywords: ['友情链接', '博客推荐', '开发者社区'],
  },
  notes: {
    title: '手记',
    description: '学习笔记、技术总结和思考记录，持续积累的知识库。',
    keywords: ['学习笔记', '技术总结', '知识库'],
  },
  giscus: {
    title: '评论测试',
    description: '测试评论功能',
    keywords: ['评论测试', 'Giscus'],
  },
} as const;

/**
 * 根据页面类型获取metadata
 * @param page - 页面类型
 * @returns Metadata对象
 */
export function getPageMetadata(page: keyof typeof pageMetadata): Metadata {
  const config = pageMetadata[page];
  const keywords = 'keywords' in config ? config.keywords : [];
  return {
    title: config.title,
    description: config.description,
    keywords: [...keywords, ...siteConfig.keywords],
  };
}