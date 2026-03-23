/**
 * 功能：Algolia搜索配置
 * 目的：提供Algolia搜索服务的配置信息
 * 作者：Yqxnice
 */
// Algolia 配置
export const algoliaConfig = {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  apiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || '',
  indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'blogs',
};

// 检查配置是否完整
export function isAlgoliaConfigured(): boolean {
  const configured = !!(
    algoliaConfig.appId &&
    algoliaConfig.apiKey &&
    algoliaConfig.indexName
  );

  // 调试信息
  if (typeof window !== 'undefined') {
    console.log('Algolia Config Debug:', {
      appId: algoliaConfig.appId ? '已设置' : '未设置',
      apiKey: algoliaConfig.apiKey ? '已设置' : '未设置',
      indexName: algoliaConfig.indexName,
      configured
    });
  }

  return configured;
}
