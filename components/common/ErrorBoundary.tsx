/**
 * 功能：错误边界组件
 * 目的：捕获并处理应用中的JavaScript错误，显示友好的错误界面
 * 作者：Yqxnice
 */
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * 全局错误边界组件
 * 捕获子组件树中的 JavaScript 错误，显示友好的错误界面
 */
class ErrorBoundaryClass extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误到控制台
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 更新 state 以包含错误信息
    this.setState({
      error,
      errorInfo,
    });

    // 调用自定义错误处理函数
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: 这里可以添加错误上报服务
    // logErrorToService(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  public render() {
    if (this.state.hasError) {
      // 如果提供了自定义的 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认的错误 UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="max-w-md w-full text-center">
            {/* 错误图标 */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* 错误标题 */}
            <h1 className="text-2xl font-bold text-foreground mb-2">
              出错了
            </h1>

            {/* 错误描述 */}
            <p className="text-muted-foreground mb-6">
              抱歉，应用程序遇到了一个错误。请尝试刷新页面或返回首页。
            </p>

            {/* 错误详情（仅开发环境） */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground mb-2">
                  查看错误详情
                </summary>
                <div className="bg-muted p-4 rounded-lg text-xs font-mono overflow-auto max-h-40">
                  <p className="text-destructive font-semibold mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="whitespace-pre-wrap text-muted-foreground">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors min-w-[120px]"
              >
                重试
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 border border-border rounded-lg hover:bg-secondary transition-colors min-w-[120px]"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryClass;