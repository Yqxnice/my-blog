import { BlogsHero } from "@/components/blog/BlogsHero";
import { BlogsListSection, type BlogListItem } from "@/components/blog/BlogsListSection";
import { getAllBlogs } from "@/lib/md-utils";

export default function HomePage() {
  const posts: BlogListItem[] = getAllBlogs();

  return (
    <div className="w-full">
      <BlogsHero />
      <BlogsListSection posts={posts} />
    </div>
  );
}

