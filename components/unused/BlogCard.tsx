/**
 * 功能：博客卡片组件
 * 目的：展示博客文章的预览信息，包括标题、摘要、标签等
 * 作者：Yqxnice
 */
import Link from 'next/link';
import { Calendar, Clock, Eye, MessageSquare } from 'lucide-react';

export function BlogCard({
  title,
  excerpt,
  date,
  readTime,
  views,
  comments,
  imageUrl,
  slug,
  tags,
}: {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  views: number;
  comments: number;
  imageUrl: string;
  slug: string;
  tags?: string[];
}) {
  return (
    <Link
      href={`/blogs/${slug}`}
      className="group block bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      aria-label={`Read blog post: ${title}`}
    >
      {/* 博客图片 - 大图展示 */}
      {imageUrl && imageUrl !== '' && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      
      {/* 博客内容 */}
      <div className="p-6">
        {/* 标签 - 置顶展示 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-muted/50 rounded-full text-xs font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                aria-label={`Tag: ${tag}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* 标题 - 大字体突出 */}
        <h3 className="text-2xl font-bold mb-3 text-foreground line-clamp-2 transition-colors duration-200 group-hover:text-primary">
          {title}
        </h3>
        
        {/* 摘要 */}
        <p className="text-muted-foreground mb-5 line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
        
        {/* 元数据 - 精简布局 */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="opacity-70" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="opacity-70" />
              <span>{readTime}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Eye size={14} className="opacity-70" />
              <span>{views ? views.toLocaleString() : 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare size={14} className="opacity-70" />
              <span>{comments || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
