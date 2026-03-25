/**
 * 功能：博客列表骨架屏组件
 * 目的：在博客列表加载时显示骨架屏
 * 作者：Yqxnice
 */
import { Skeleton } from './Skeleton';

export function BlogSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-4">
          {/* 缩略图 */}
          <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32">
            <Skeleton height="100%" width="100%" borderRadius="0.5rem" />
          </div>
          
          {/* 内容 */}
          <div className="flex-1 space-y-3">
            <Skeleton height="1.25rem" width="80%" />
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="1rem" width="60%" />
            <div className="flex items-center gap-4 pt-2">
              <Skeleton height="0.875rem" width="4rem" />
              <Skeleton height="0.875rem" width="5rem" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
