import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "@/lib/auth";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "缺少 postId" }, { status: 400 });
  }

  // 获取所有评论
  const { data, error, count } = await supabase
    .from("comments")
    .select("id, content, created_at, parent_id, author_name, author_image, author_id", { count: "exact" })
    .eq("post_id", postId)
    .eq("status", "published")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 转换数据格式
  const comments = (data || []).map((row: any) => ({
    id: row.id,
    content: row.content,
    createdAt: row.created_at,
    parentId: row.parent_id,
    user: {
      id: row.author_id,
      name: row.author_name,
      image: row.author_image,
    },
  }));

  return NextResponse.json({
    comments,
    total: count ?? 0,
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const body = await request.json();
  const { postId, content, parentId } = body as { postId?: string; content?: string; parentId?: string };

  if (!postId || !content || !content.trim()) {
    return NextResponse.json({ error: "参数不完整" }, { status: 400 });
  }

  const trimmed = content.trim();
  if (trimmed.length < 2) {
    return NextResponse.json({ error: "评论内容太短" }, { status: 400 });
  }
  if (trimmed.length > 500) {
    return NextResponse.json({ error: "评论内容过长" }, { status: 400 });
  }

  // 从 session 获取用户信息
  const userId = (session.user as any).id || "unknown";
  const userName = session.user.name || "匿名用户";
  const userImage = session.user.image || null;

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      author_id: userId,
      author_name: userName,
      author_image: userImage,
      parent_id: parentId || null,
      content: trimmed,
      status: "published",
    })
    .select("id, content, created_at, parent_id, author_name, author_image, author_id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const comment = {
    id: data.id,
    content: data.content,
    createdAt: data.created_at,
    parentId: data.parent_id,
    user: {
      id: data.author_id,
      name: data.author_name,
      image: data.author_image,
    },
  };

  return NextResponse.json({ comment }, { status: 201 });
}
