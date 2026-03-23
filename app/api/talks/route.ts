/**
 * 功能：碎碎念 API 路由
 * 目的：提供碎碎念数据
 * 作者：Yqxnice
 */
import { NextRequest, NextResponse } from 'next/server';
import talksData from '@/data/talks.json';
import type { TalksData } from '@/types/talks';
import { rateLimitMiddleware, rateLimitPresets } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  // 应用速率限制：每分钟 100 次请求（读取数据可以宽松一些）
  const rateLimit = await rateLimitMiddleware(request, rateLimitPresets.loose);

  if (!rateLimit.allowed) {
    return rateLimit.response!;
  }

  try {
    const data = talksData as TalksData;
    return NextResponse.json(data, {
      headers: {
        'X-RateLimit-Limit': rateLimit.limit.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching talks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
