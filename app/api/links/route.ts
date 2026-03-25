/**
 * 功能：友情链接 API 路由
 * 目的：提供友情链接数据
 * 作者：Yqxnice
 */
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .eq('status', 'approved')
      .eq('is_blocked', false)
      .eq('is_lost', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching friends:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Unexpected error:', error);
    // 如果出错，返回空数组，让前端能够正常显示
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, url, description, email, avatar } = body;

    // 验证必填字段
    if (!name || !url || !description || !email || !avatar) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('friends')
      .insert({
        name,
        url,
        description,
        email,
        avatar,
        status: 'pending'
      })
      .select();

    if (error) {
      console.error('Error creating friend request:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    // 返回错误状态码，让前端知道请求失败
    return NextResponse.json({ error: '提交失败' }, { status: 500 });
  }
}
