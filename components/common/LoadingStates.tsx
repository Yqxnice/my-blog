'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} border-2 border-primary/20 border-t-primary rounded-full animate-spin`}
        role="status"
        aria-label="加载中"
      />
      {text && (
        <span className="text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" text="页面加载中..." />
    </div>
  );
}

export function CardLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
      <div className="h-4 bg-muted rounded w-1/2 mb-4" />
      <div className="h-3 bg-muted rounded w-full mb-2" />
      <div className="h-3 bg-muted rounded w-5/6" />
    </div>
  );
}

export function ModalSkeleton() {
  return (
    <div className="p-6 animate-pulse space-y-4">
      <div className="h-6 bg-muted rounded w-1/2" />
      <div className="h-4 bg-muted rounded w-full mb-2" />
      <div className="h-4 bg-muted rounded w-5/6 mb-2" />
      <div className="h-4 bg-muted rounded w-4/6 mb-4" />
      <div className="flex justify-end space-x-2">
        <div className="h-10 bg-muted rounded w-20" />
        <div className="h-10 bg-muted rounded w-20" />
      </div>
    </div>
  );
}