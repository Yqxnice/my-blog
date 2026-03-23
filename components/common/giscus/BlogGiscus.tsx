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
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Giscus 评论系统需要配置。请参考
          <a
            href="https://giscus.app/zh-CN"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-1 text-primary hover:underline"
          >
            Giscus 文档
          </a>
          进行配置，并将环境变量添加到 .env.local
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <Giscus {...config} />
    </div>
  );
}
