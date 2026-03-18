import { fetchPageViews } from '@/lib/umami-utils';
import { siteConfig } from '@/lib/config';

/**
 * 处理获取单个页面访问量的请求
 * 示例：GET /api/share?pathname=/blogs/nodejs-performance
 */
export async function GET(request: Request) {
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

    // 返回响应
    return new Response(
      JSON.stringify({ pageViews }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
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
