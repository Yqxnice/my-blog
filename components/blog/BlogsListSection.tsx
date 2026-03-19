import { BlogCard } from "@/components/blog/BlogCard";

export type BlogListItem = {
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
};

export function BlogsListSection({ posts }: { posts: BlogListItem[] }) {
  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground">全部文章</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((blog) => (
          <BlogCard
            key={blog.id}
            title={blog.title}
            excerpt={blog.excerpt}
            date={blog.date}
            readTime={blog.readTime}
            views={blog.views}
            comments={blog.comments}
            imageUrl={blog.imageUrl}
            slug={blog.slug}
            tags={blog.tags}
          />
        ))}
      </div>
    </div>
  );
}

