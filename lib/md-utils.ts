import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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

export const getAllBlogs = (): BlogPost[] => {
  const files = fs.readdirSync(contentDir);
  const markdownFiles = files.filter(file => file.endsWith('.md'));

  return markdownFiles.map(file => {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    const id = file.replace('.md', '');
    // 从内容中提取摘要，优先使用 frontmatter 中的 summary，其次是 excerpt
    const excerpt = data.summary || data.excerpt || content.substring(0, 150) + '...';
    
    // 格式化日期，保留时分秒部分
    const formattedDate = typeof data.date === 'string' 
      ? data.date.includes('T') 
        ? data.date.replace('T', ' ') 
        : data.date 
      : data.date;

    // 统计字数（去除markdown标记）
    const plainText = content.replace(/[#*`\[\]()]/g, '').replace(/\n/g, ' ').trim();
    const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;

    return {
      id,
      title: data.title,
      excerpt: excerpt,
      content: content,
      mdxContent: content,
      date: formattedDate,
      readTime: data.readTime,
      views: data.views,
      comments: data.comments,
      imageUrl: data.imageUrl,
      slug: id,
      tags: data.tags || [],
      status: 'published' as const,
      wordCount: wordCount,
      aiInvolvement: data.aiInvolvement,
    };
  });
};

export const getBlogById = (id: string): BlogPost | null => {
  const filePath = path.join(contentDir, `${id}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  // 从内容中提取摘要，优先使用 frontmatter 中的 summary，其次是 excerpt
  const excerpt = data.summary || data.excerpt || content.substring(0, 150) + '...';

  // 格式化日期，保留时分秒部分
  const formattedDate = typeof data.date === 'string' 
    ? data.date.includes('T') 
      ? data.date.replace('T', ' ') 
      : data.date 
    : data.date;

  // 统计字数（去除markdown标记）
  const plainText = content.replace(/[#*`\[\]()]/g, '').replace(/\n/g, ' ').trim();
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;

  return {
    id,
    title: data.title,
    excerpt: excerpt,
    content: content,
    mdxContent: content,
    date: formattedDate,
    readTime: data.readTime,
    views: data.views,
    comments: data.comments,
    imageUrl: data.imageUrl,
    slug: id,
    tags: data.tags || [],
    status: 'published' as const,
    wordCount: wordCount,
    aiInvolvement: data.aiInvolvement,
  };
};
