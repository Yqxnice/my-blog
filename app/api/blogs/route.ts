import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogs, getBlogById } from '@/lib/md-utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const blog = getBlogById(id);
    if (blog) {
      return NextResponse.json(blog);
    } else {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
  } else {
    const blogs = getAllBlogs();
    return NextResponse.json(blogs);
  }
}
