import { NextRequest, NextResponse } from 'next/server';
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
