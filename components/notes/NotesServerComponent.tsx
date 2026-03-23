/**
 * 功能：手记服务器组件
 * 目的：获取和过滤手记文章数据
 * 作者：Yqxnice
 */
import { getAllNotes, type BlogPost } from "@/lib/md-utils.server";
import NotesClientComponent from "./NotesClientComponent";

// 获取所有手记文章
const getNotePosts = () => {
  const allPosts = getAllNotes();
  return allPosts
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

interface NotesServerComponentProps {
  onTagClick?: (tag: string) => void;
}

export default function NotesServerComponent({ onTagClick }: NotesServerComponentProps) {
  const notePosts = getNotePosts();
  const noteTags  = getNoteTags(notePosts);

  return <NotesClientComponent posts={notePosts} tags={noteTags} onTagClick={onTagClick} />;
}
