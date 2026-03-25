/**
 * 功能：通用骨架屏组件
 * 目的：提供加载状态的视觉反馈
 * 作者：Yqxnice
 */

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  borderRadius?: string;
}

export function Skeleton({ className = '', height = '1rem', width = '100%', borderRadius = '0.25rem' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-muted ${className}`}
      style={{
        height,
        width,
        borderRadius,
      }}
    />
  );
}
