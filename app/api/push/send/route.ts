/**
 * 功能：推送通知发送 API
 * 目的：向订阅用户发送推送通知
 * 作者：Yqxnice
 */
import { NextRequest, NextResponse } from 'next/server';
import { rateLimitMiddleware, rateLimitPresets } from '@/lib/rate-limit';

// 存储订阅信息的临时存储（实际应用中应使用数据库）
let subscriptions: PushSubscription[] = [];

// VAPID 密钥（实际应用中应从环境变量中获取）
const VAPID_PRIVATE_KEY = 'your-private-key-here';

export async function POST(request: NextRequest) {
  // 应用速率限制：每分钟 3 次请求（发送推送应该非常严格）
  const rateLimit = await rateLimitMiddleware(request, {
    windowMs: 60000,
    maxRequests: 3,
  });

  if (!rateLimit.allowed) {
    return rateLimit.response!;
  }

  try {
    const { title, body, url } = await request.json();

    if (!title || !body) {
      return NextResponse.json(
        { success: false, error: 'Title and body are required' },
        { status: 400 }
      );
    }

    // 向所有订阅者发送通知
    const promises = subscriptions.map(async (subscription) => {
      try {
        await fetch(subscription.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${VAPID_PRIVATE_KEY}`
          },
          body: JSON.stringify({
            title,
            body,
            url: url || '/'
          })
        });
      } catch (error) {
        console.error('Error sending push notification:', error);
        // 移除无效的订阅
        subscriptions = subscriptions.filter(sub => sub.endpoint !== subscription.endpoint);
      }
    });

    await Promise.all(promises);

    return NextResponse.json(
      { success: true, message: `Notification sent to ${subscriptions.length} subscribers` },
      {
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
        },
      }
    );
  } catch (error) {
    console.error('Error sending push notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
