/**
 * 功能：处理Markdown/MDX文件的工具函数
 * 目的：提供博客和手记内容的读取、解析和处理功能
 * 作者：Yqxnice
 */
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
  noteType?: 'idea' | 'bug' | 'excerpt' | 'question' | 'tool' | 'other';
}

const blogsDir = path.join(process.cwd(), 'content', 'blogs');
const notesDir = path.join(process.cwd(), 'content', 'notes');

/**
 * 格式化日期，保留时分秒部分
 */
function formatDate(date: string | Date): string {
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
  // 去除markdown标记
  const plainText = content
    .replace(/[#*`\[\]()]/g, '')
    .replace(/\n/g, ' ')
    .trim();
  
  // 统计英文单词（通过空格分割）
  const englishWords = plainText
    .split(/\s+/)
    .filter(word => /^[a-zA-Z]+$/.test(word))
    .length;
  
  // 统计中文字符（包括中文、日文、韩文等）
  const chineseChars = (plainText.match(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g) || []).length;
  
  // 统计数字
  const numbers = (plainText.match(/\b\d+\b/g) || []).length;
  
  // 总字数 = 英文单词数 + 中文字符数 + 数字数
  return englishWords + chineseChars + numbers;
}

/**
 * 从内容中提取摘要
 */
interface GrayMatterData {
  summary?: string;
  excerpt?: string;
  [key: string]: unknown;
}

function extractExcerpt(data: GrayMatterData, content: string): string {
  return data.summary || data.excerpt || '';
}

// 处理单个目录下的文件
function processFilesFromDir(directory: string): BlogPost[] {
  const files = fs.existsSync(directory) ? fs.readdirSync(directory) : [];
  const markdownFiles = files.filter(file => file.endsWith('.md') || file.endsWith('.mdx'));

  return markdownFiles
    .map(file => {
      try {
        const filePath = path.join(directory, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        const id = file.replace(/\.(md|mdx)$/, '');
        // 从内容中提取摘要，优先使用 frontmatter 中的 summary，其次是 excerpt
        const excerpt = extractExcerpt(data, content);
        
        // 格式化日期，保留时分秒部分
        const formattedDate = formatDate(data.date);

        // 使用frontmatter中的wordCount，如果没有则计算
        const wordCount = data.wordCount || countWords(content);

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
          noteType: data.noteType,
        } as BlogPost;
      } catch (error) {
        console.warn(`处理文件 ${file} 时出错:`, error);
        return null;
      }
    })
    .filter((post): post is BlogPost => post !== null);
}

/**
 * 获取所有博客文章（不包含手记）
 */
export const getAllBlogPosts = cache((): BlogPost[] => {
  return processFilesFromDir(blogsDir);
});

/**
 * 获取所有手记文章
 */
export const getAllNotes = cache((): BlogPost[] => {
  return processFilesFromDir(notesDir);
});

/**
 * 获取所有文章（包含博客和手记）
 */
export const getAllBlogs = cache((): BlogPost[] => {
  const blogPosts = processFilesFromDir(blogsDir);
  const notePosts = processFilesFromDir(notesDir);
  return [...blogPosts, ...notePosts];
});

export const getBlogById = cache((id: string): BlogPost | null => {
  let filePath = null;
  
  // 检查blogs目录
  const blogsMdxPath = path.join(blogsDir, `${id}.mdx`);
  const blogsMdPath = path.join(blogsDir, `${id}.md`);
  
  // 检查notes目录
  const notesMdxPath = path.join(notesDir, `${id}.mdx`);
  const notesMdPath = path.join(notesDir, `${id}.md`);
  
  // 按顺序检查文件是否存在
  if (fs.existsSync(blogsMdxPath)) {
    filePath = blogsMdxPath;
  } else if (fs.existsSync(blogsMdPath)) {
    filePath = blogsMdPath;
  } else if (fs.existsSync(notesMdxPath)) {
    filePath = notesMdxPath;
  } else if (fs.existsSync(notesMdPath)) {
    filePath = notesMdPath;
  }
  
  // 如果没有找到文件，返回 null
  if (!filePath) {
    return null;
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // 从内容中提取摘要，优先使用 frontmatter 中的 summary，其次是 excerpt
    const excerpt = extractExcerpt(data, content);

    // 格式化日期，保留时分秒部分
    const formattedDate = formatDate(data.date);

    // 使用frontmatter中的wordCount，如果没有则计算
    const wordCount = data.wordCount || countWords(content);

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
      noteType: data.noteType,
    };
  } catch (error) {
    console.warn(`处理文件 ${id} 时出错:`, error);
    return null;
  }
});