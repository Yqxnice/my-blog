/**
 * 功能：博客列表组件
 * 目的：展示博客文章列表，只显示最新的5篇文章
 * 作者：Yqxnice
 */
import Link from 'next/link'
import { Skeleton } from '../common/skeleton'
export interface BlogListItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  views: number;
  comments: number;
  imageUrl: string;
  slug: string;
  tags: string[];
}

interface BlogListProps {
  posts: BlogListItem[];
  loading?: boolean;
}

export function BlogList({ posts, loading = false }: BlogListProps) {
  // 只显示前5条最新文章
  const filtered = posts.slice(0, 5);

  if (loading) {
    return (
      <div className="mb-12 md:mb-16 space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-4 px-3 sm:px-0 rounded-lg">
            <span className="font-serif text-xs text-muted-foreground w-6 flex-shrink-0 text-right">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton height="1.125rem" width="70%" />
              <div className="flex gap-2 mt-1">
                <Skeleton height="0.875rem" width="3rem" />
                <Skeleton height="0.875rem" width="2.5rem" />
                <Skeleton height="0.875rem" width="2rem" />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Skeleton height="0.875rem" width="5rem" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-12 md:mb-16">
      {filtered.length > 0 ? (
        filtered.map((post, index) => (
          <Link
            key={post.id}
            href={`/blogs/${post.slug}`}
            aria-label={`博客：${post.title}`}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-4 px-3 sm:px-0 hover:bg-secondary transition-colors duration-200 rounded-lg"
          >
            <span className="font-serif text-xs text-muted-foreground w-6 flex-shrink-0 text-right transition-colors duration-200 hover:text-primary">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground whitespace-nowrap overflow-hidden text-ellipsis transition-colors duration-200 hover:text-primary">
                {post.title}
              </div>
              <div className="flex gap-2 mt-1 flex-wrap">
                {post.tags.slice(0, 3).map((tag, tagIndex) => (
                  <span key={tagIndex} className="text-xs text-muted-foreground whitespace-nowrap">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-between w-full sm:w-auto sm:justify-end">
              <span className="text-xs text-muted-foreground font-light whitespace-nowrap">
                {post.date}
              </span>
            </div>
            </Link>
        ))
      ) : (
        <div className="py-10 text-center text-muted-foreground text-sm">
          没有找到匹配的文章 ·_·
        </div>
      )}
    </div>
  );
}
