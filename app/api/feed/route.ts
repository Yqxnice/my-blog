/**
 * 功能：RSS 订阅 API 路由
 * 目的：生成并提供 RSS 订阅内容
 * 作者：Yqxnice
 */
import { NextResponse } from 'next/server';
import { generateRssFeed } from '@/lib/rss-utils';

export async function GET() {
  const rssFeed = generateRssFeed();
  
  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
