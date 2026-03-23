/**
 * 功能：错误边界包装器
 * 目的：在服务端组件中导入并使用错误边界
 * 作者：Yqxnice
 */
'use client';

import ErrorBoundaryClass from './ErrorBoundary';

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
}

/**
 * 客户端错误边界包装器
 * 用于在服务端组件中导入错误边界
 */
export default function ErrorBoundaryWrapper({ children }: ErrorBoundaryWrapperProps) {
  return <ErrorBoundaryClass>{children}</ErrorBoundaryClass>;
}

// 同时导出原始的 ErrorBoundaryClass 供直接使用
export { ErrorBoundaryClass as ErrorBoundary };
