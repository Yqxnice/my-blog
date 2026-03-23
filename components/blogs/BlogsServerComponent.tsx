import { getAllBlogPosts } from "@/lib/md-utils.server";
import { BlogsClientComponent } from "./BlogsClientComponent";

export function BlogsServerComponent() {
  const posts = getAllBlogPosts();

  return <BlogsClientComponent posts={posts} />;
}