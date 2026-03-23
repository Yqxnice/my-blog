/**
 * 功能：推送通知订阅 API
 * 目的：处理用户的推送通知订阅请求
 * 作者：Yqxnice
 */
import { NextRequest, NextResponse } from 'next/server';
import { rateLimitMiddleware, rateLimitPresets } from '@/lib/rate-limit';

// 存储订阅信息的临时存储（实际应用中应使用数据库）
const subscriptions: PushSubscription[] = [];

export async function POST(request: NextRequest) {
  // 应用速率限制：每分钟 5 次请求（订阅操作应该更严格）
  const rateLimit = await rateLimitMiddleware(request, {
    windowMs: 60000,
    maxRequests: 5,
  });

  if (!rateLimit.allowed) {
    return rateLimit.response!;
  }

  try {
    const subscription = await request.json();

    // 验证订阅数据
    if (!subscription.endpoint) {
      return NextResponse.json(
        { success: false, error: 'Invalid subscription data' },
        { status: 400 }
      );
    }

    // 检查是否已经存在相同的订阅
    const existingIndex = subscriptions.findIndex(
      (sub) => sub.endpoint === subscription.endpoint
    );

    if (existingIndex === -1) {
      subscriptions.push(subscription);
      console.log('New subscription added:', subscription.endpoint);
    } else {
      // 更新现有订阅
      subscriptions[existingIndex] = subscription;
      console.log('Subscription updated:', subscription.endpoint);
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
        },
      }
    );
  } catch (error) {
    console.error('Error handling subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
