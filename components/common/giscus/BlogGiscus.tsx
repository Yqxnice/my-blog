import Giscus from './Giscus';

export default function BlogGiscus() {
  // 从环境变量读取 Giscus 配置
  const config = {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO || '',
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || '',
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || 'Announcements',
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '',
    mapping: 'pathname' as const,
    strict: true, // 严格模式：标题必须完全匹配
    reactionsEnabled: true, // 启用反应表情
    emitMetadata: false, // 不发送元数据
    inputPosition: 'top' as const, // 评论框在顶部
    lang: 'zh-CN',
  };

  // 如果配置不完整，显示提示
  if (!config.repo || !config.repoId || !config.categoryId) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-6 sm:p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">评论系统配置中</p>
            <p className="text-xs text-muted-foreground">
              请参考
              <a
                href="https://giscus.app/zh-CN"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 text-primary hover:underline"
              >
                Giscus 文档
              </a>
              进行配置
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-8">
      {/* 评论区域头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary rounded-full" />
          <h3 className="text-base sm:text-lg font-semibold text-foreground">评论</h3>
        </div>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
          GitHub Discussions
        </span>
      </div>
      
      {/* Giscus 容器 */}
      <div className="rounded-lg border border-border/60 bg-background overflow-hidden">
        <Giscus {...config} />
      </div>
      
      {/* 移动端提示 */}
      <p className="sm:hidden mt-3 text-xs text-center text-muted-foreground">
        使用 GitHub 账号登录以发表评论
      </p>
    </div>
  );
}
