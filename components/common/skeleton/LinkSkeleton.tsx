/**
 * 功能：友链页面骨架屏组件
 * 目的：在友链加载时显示骨架屏
 * 作者：Yqxnice
 */
import { Skeleton } from './Skeleton';

export function LinkSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4 bg-secondary border border-border rounded-lg">
          {/* 头像 */}
          <div className="flex-shrink-0 w-14 h-14">
            <Skeleton height="100%" width="100%" borderRadius="0.5rem" />
          </div>
          
          {/* 内容 */}
          <div className="flex-1 space-y-2">
            <Skeleton height="1.125rem" width="60%" />
            <Skeleton height="0.9375rem" width="100%" />
            <Skeleton height="0.9375rem" width="80%" />
          </div>
        </div>
      ))}
    </div>
  );
}
