"use client";

import { useState, useEffect } from 'react';
import { Clock, Calendar, TrendingUp } from 'lucide-react';

interface TimeProgress {
  today: {
    hours: number;
    minutes: number;
    seconds: number;
    percentage: number;
  };
  month: {
    days: number;
    hours: number;
    percentage: number;
  };
  year: {
    months: number;
    days: number;
    percentage: number;
  };
}

export function TimeProgress() {
  const [timeProgress, setTimeProgress] = useState<TimeProgress>({
    today: { hours: 0, minutes: 0, seconds: 0, percentage: 0 },
    month: { days: 0, hours: 0, percentage: 0 },
    year: { months: 0, days: 0, percentage: 0 },
  });

  useEffect(() => {
    const updateTimeProgress = () => {
      const now = new Date();

      // 计算今天的进度
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const totalSecondsToday = hours * 3600 + minutes * 60 + seconds;
      const totalSecondsInDay = 86400;
      const todayPercentage = (totalSecondsToday / totalSecondsInDay) * 100;

      // 计算本月的进度
      const dayOfMonth = now.getDate();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const totalHoursToday = hours + minutes / 60;
      const monthPercentage = ((dayOfMonth - 1 + totalHoursToday / 24) / daysInMonth) * 100;

      // 计算本年的进度
      const month = now.getMonth() + 1;
      const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      const daysInYear = ((now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || now.getFullYear() % 400 === 0) ? 366 : 365;
      const yearPercentage = (dayOfYear / daysInYear) * 100;

      setTimeProgress({
        today: {
          hours,
          minutes,
          seconds,
          percentage: todayPercentage,
        },
        month: {
          days: dayOfMonth,
          hours: hours,
          percentage: monthPercentage,
        },
        year: {
          months: month,
          days: dayOfYear,
          percentage: yearPercentage,
        },
      });
    };

    // 立即执行一次
    updateTimeProgress();

    // 每秒更新一次
    const timer = setInterval(updateTimeProgress, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-8 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2 justify-center">
        <TrendingUp size={20} className="text-primary" />
        时间进度
      </h2>

      <div className="space-y-5">
        {/* 今天进度 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              <span className="font-medium text-foreground text-sm">今天</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {timeProgress.today.hours.toString().padStart(2, '0')}:
              {timeProgress.today.minutes.toString().padStart(2, '0')}:
              {timeProgress.today.seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-xs font-medium text-primary">
              {timeProgress.today.percentage.toFixed(2)}%
            </div>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${timeProgress.today.percentage}%` }}
            />
          </div>
        </div>

        {/* 本月进度 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              <span className="font-medium text-foreground text-sm">本月</span>
            </div>
            <div className="text-xs text-muted-foreground">
              第 {timeProgress.month.days} 天
            </div>
            <div className="text-xs font-medium text-primary">
              {timeProgress.month.percentage.toFixed(2)}%
            </div>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${timeProgress.month.percentage}%` }}
            />
          </div>
        </div>

        {/* 本年进度 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              <span className="font-medium text-foreground text-sm">本年</span>
            </div>
            <div className="text-xs text-muted-foreground">
              第 {timeProgress.year.days} 天
            </div>
            <div className="text-xs font-medium text-primary">
              {timeProgress.year.percentage.toFixed(2)}%
            </div>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${timeProgress.year.percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
