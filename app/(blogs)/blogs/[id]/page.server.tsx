import { notFound } from 'next/navigation';
import BlogDetailPage from './page';
import { getBlogById } from '@/lib/md-utils';

export default function BlogDetailPageServer({ params }: { params: { id: string } }) {
  const { id } = params;
  const blog = getBlogById(id);

  if (!blog) {
    notFound();
  }

  return <BlogDetailPage />;
}