/**
 * 功能：手记 API 路由
 * 目的：提供手记文章的获取接口
 * 作者：Yqxnice
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAllNotes, getBlogById } from '@/lib/md-utils.server';
import { rateLimitMiddleware, rateLimitPresets } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  // 应用速率限制：使用预设的moderate配置（每分钟30次请求）
  let rateLimit;
  try {
    rateLimit = await rateLimitMiddleware(request, rateLimitPresets.moderate);

    if (!rateLimit.allowed) {
      return rateLimit.response!;
    }
  } catch (error) {
    console.error('Rate limit middleware error:', error);
    // 如果速率限制中间件出错，继续处理请求
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const note = getBlogById(id);
    if (note) {
      if (rateLimit) {
        return NextResponse.json(note, {
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          },
        });
      } else {
        return NextResponse.json(note);
      }
    } else {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }
  } else {
    const notes = getAllNotes();
    if (rateLimit) {
      return NextResponse.json(notes, {
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
        },
      });
    } else {
      return NextResponse.json(notes);
    }
  }
}
