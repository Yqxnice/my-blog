import Link from 'next/link';
import { Calendar, Clock, Eye, MessageSquare } from 'lucide-react';

export function BlogCardHorizontal({
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
      className="flex flex-col md:flex-row group rounded-xl overflow-hidden bg-card border border-border hover:shadow-md transition-all duration-300 cursor-pointer"
      aria-label={`Read blog post: ${title}`}
    >
      {/* 博客图片 */}
      {imageUrl && imageUrl !== '' && (
        <div className="relative w-full md:w-1/3 h-48 md:h-auto overflow-hidden">
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
      <div className="flex-1 p-6">
        {/* 标题 */}
        <h3 className="text-xl font-semibold mb-2 text-foreground line-clamp-2 transition-colors duration-200 group-hover:text-primary">
          {title}
        </h3>
        
        {/* 标签 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                aria-label={`标签: ${tag}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* 摘要 */}
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {excerpt}
        </p>
        
        {/* 元数据 */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>{date}</span>
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>{readTime}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Eye size={14} className="mr-1" />
              <span>{views}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare size={14} className="mr-1" />
              <span>{comments}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}