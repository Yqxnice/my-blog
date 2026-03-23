import { getAllBlogs, type BlogPost } from "@/lib/md-utils.server";
import NotesClientComponent from "./NotesClientComponent";

// 过滤出手记文章（含 '手记' 或 'note' 标签的文章）
const getNotePosts = () => {
  const allPosts = getAllBlogs();
  return allPosts
    .filter(post =>
      post.tags.some(
        tag =>
          tag.toLowerCase().includes('手记') ||
          tag.toLowerCase().includes('note')
      )
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// 提取所有唯一标签
const getNoteTags = (posts: BlogPost[]) => {
  const tagsSet = new Set<string>();
  posts.forEach(post => {
    post.tags.forEach((tag: string) => tagsSet.add(tag));
  });
  return Array.from(tagsSet);
};

export default function NotesServerComponent() {
  const notePosts = getNotePosts();
  const noteTags  = getNoteTags(notePosts);

  return <NotesClientComponent posts={notePosts} tags={noteTags} />;
}
