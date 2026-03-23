/**
 * 功能：推送通知取消订阅 API
 * 目的：处理用户的推送通知取消订阅请求
 * 作者：Yqxnice
 */
import { NextRequest, NextResponse } from 'next/server';

// 存储订阅信息的临时存储（实际应用中应使用数据库）
let subscriptions: PushSubscription[] = [];

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();
    
    // 找到并移除订阅
    const initialLength = subscriptions.length;
    subscriptions = subscriptions.filter(
      (sub) => sub.endpoint !== subscription.endpoint
    );
    
    if (subscriptions.length < initialLength) {
      console.log('Subscription removed:', subscription.endpoint);
      return NextResponse.json({ success: true });
    } else {
      console.log('Subscription not found:', subscription.endpoint);
      return NextResponse.json({ success: true, message: 'Subscription not found' });
    }
  } catch (error) {
    console.error('Error handling unsubscription:', error);
    return NextResponse.json({ success: false, error: 'Failed to unsubscribe' }, { status: 500 });
  }
}
