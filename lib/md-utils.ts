import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  mdxContent: string;
  date: string;
  readTime: string;
  views: number;
  comments: number;
  imageUrl: string;
  slug: string;
  tags: string[];
  status: 'published' | 'draft';
  wordCount: number;
  aiInvolvement?: string;
}

const contentDir = path.join(process.cwd(), 'content');

/**
 * 格式化日期，保留时分秒部分
 */
function formatDate(date: any): string {
  if (typeof date === 'string') {
    return date.includes('T') ? date.replace('T', ' ') : date;
  } else if (date instanceof Date) {
    return date.toISOString().replace('T', ' ');
  } else {
    return String(date);
  }
}

/**
 * 统计字数（去除markdown标记）
 */
function countWords(content: string): number {
  const plainText = content.replace(/[#*`\[\]()]/g, '').replace(/\n/g, ' ').trim();
  return plainText.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * 从内容中提取摘要
 */
function extractExcerpt(data: any, content: string): string {
  return data.summary || data.excerpt || content.substring(0, 150) + '...';
}

export const getAllBlogs = cache((): BlogPost[] => {
  const files = fs.readdirSync(contentDir);
  const markdownFiles = files.filter(file => file.endsWith('.md'));

  const posts = markdownFiles
    .map(file => {
      try {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        const id = file.replace('.md', '');
        // 从内容中提取摘要，优先使用 frontmatter 中的 summary，其次是 excerpt
        const excerpt = extractExcerpt(data, content);
        
        // 格式化日期，保留时分秒部分
        const formattedDate = formatDate(data.date);

        // 统计字数（去除markdown标记）
        const wordCount = countWords(content);

        return {
          id,
          title: data.title || `无标题文章 - ${id}`,
          excerpt: excerpt,
          content: content,
          mdxContent: content,
          date: formattedDate,
          readTime: data.readTime || '0 min',
          views: data.views || 0,
          comments: data.comments || 0,
          imageUrl: data.imageUrl || '',
          slug: id,
          tags: data.tags || [],
          status: 'published' as 'published' | 'draft',
          wordCount: wordCount,
          aiInvolvement: data.aiInvolvement,
        } as BlogPost;
      } catch (error) {
        console.warn(`处理文件 ${file} 时出错:`, error);
        return null;
      }
    })
    .filter((post): post is BlogPost => post !== null);

  return posts;
});

export const getBlogById = cache((id: string): BlogPost | null => {
  const filePath = path.join(contentDir, `${id}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // 从内容中提取摘要，优先使用 frontmatter 中的 summary，其次是 excerpt
    const excerpt = extractExcerpt(data, content);

    // 格式化日期，保留时分秒部分
    const formattedDate = formatDate(data.date);

    // 统计字数（去除markdown标记）
    const wordCount = countWords(content);

    return {
      id,
      title: data.title || `无标题文章 - ${id}`,
      excerpt: excerpt,
      content: content,
      mdxContent: content,
      date: formattedDate,
      readTime: data.readTime || '0 min',
      views: data.views || 0,
      comments: data.comments || 0,
      imageUrl: data.imageUrl || '',
      slug: id,
      tags: data.tags || [],
      status: 'published' as const,
      wordCount: wordCount,
      aiInvolvement: data.aiInvolvement,
    };
  } catch (error) {
    console.warn(`处理文件 ${id}.md 时出错:`, error);
    return null;
  }
});
