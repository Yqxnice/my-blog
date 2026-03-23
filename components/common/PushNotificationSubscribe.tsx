'use client';

import React, { useState } from 'react';

export default function PushNotificationSubscribe() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // 这里应该实现真实的推送通知订阅逻辑
      // 例如使用 Firebase Cloud Messaging 或其他推送服务
      console.log('Subscribing to push notifications...');
      // 模拟订阅成功
      setTimeout(() => {
        setIsSubscribed(true);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      // 这里应该实现真实的推送通知取消订阅逻辑
      console.log('Unsubscribing from push notifications...');
      // 模拟取消订阅成功
      setTimeout(() => {
        setIsSubscribed(false);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">推送通知</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            订阅推送通知，及时获取最新文章和重要更新。
          </p>
        </div>
        <div className="flex gap-2">
          {isSubscribed ? (
            <button
              onClick={handleUnsubscribe}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '取消订阅中...' : '取消订阅'}
            </button>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '订阅中...' : '订阅通知'}
            </button>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          <p>• 我们只会发送与博客相关的重要通知</p>
          <p>• 您可以随时取消订阅</p>
          <p>• 通知将通过浏览器推送</p>
        </div>
      </div>
    </div>
  );
}
