/**
 * 功能：OG 图像生成 API
 * 目的：为社交媒体分享生成预览图像
 * 作者：Yqxnice
 */
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '木子博客';
  const date = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          backgroundColor: '#f7f5f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
          fontFamily: 'Noto Sans SC, sans-serif'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#c0392b'
          }}
        >
          木子博客
        </div>
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#1a1714',
            textAlign: 'center',
            marginBottom: '40px',
            lineHeight: '1.3'
          }}
        >
          {title}
        </h1>
        <div
          style={{
            fontSize: '24px',
            color: '#8a8480'
          }}
        >
          {date}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            fontSize: '18px',
            color: '#c0392b'
          }}
        >
          https://www.muzi.dev
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
