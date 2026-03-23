/**
 * 功能：分享和访问量 API
 * 目的：提供页面访问量数据
 * 作者：Yqxnice
 */
import { NextRequest } from 'next/server';
import { fetchPageViews } from '@/lib/umami-utils';
import { siteConfig } from '@/lib/config';
import { rateLimitMiddleware, rateLimitPresets } from '@/lib/rate-limit';

/**
 * 处理获取单个页面访问量的请求
 * 示例：GET /api/share?pathname=/blogs/nodejs-performance
 */
export async function GET(request: NextRequest) {
  // 应用速率限制：每分钟 30 次请求
  const rateLimit = await rateLimitMiddleware(request, rateLimitPresets.moderate);

  if (!rateLimit.allowed) {
    return rateLimit.response!;
  }

  try {
    // 解析查询参数
    const url = new URL(request.url);
    const pathname = url.searchParams.get('pathname');

    // 验证参数
    if (!pathname) {
      return new Response(
        JSON.stringify({ error: 'Missing pathname parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 获取 Umami 配置
    const { baseUrl, username, password, websiteId } = siteConfig.analytics.umami;

    if (!baseUrl || !username || !password || !websiteId) {
      return new Response(
        JSON.stringify({ error: 'Umami configuration not found' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 调用 fetchPageViews 函数获取真实的页面访问量
    const pageViews = await fetchPageViews(baseUrl, username, password, websiteId, pathname);

    // 返回响应，包含速率限制信息
    return new Response(
      JSON.stringify({ pageViews }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
        },
      }
    );
  } catch (error) {
    console.error('Error fetching page views:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch page views',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
