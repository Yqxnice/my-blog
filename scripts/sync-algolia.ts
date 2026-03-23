/**
 * 功能：同步博客到Algolia
 * 目的：将博客内容同步到Algolia搜索服务
 * 作者：Yqxnice
 */
import { config } from 'dotenv';
import { resolve } from 'path';

// 加载 .env.local 文件
config({ path: resolve(process.cwd(), '.env.local') });

// 动态导入并运行同步脚本
(async () => {
  const { syncBlogsToAlgolia } = await import('../lib/algolia-sync');
  const result = await syncBlogsToAlgolia();

  if (result) {
    if (result.success) {
      console.log(`✅ Synced ${result.count} blogs`);
      process.exit(0);
    } else {
      console.error('❌ Sync failed');
      process.exit(1);
    }
  } else {
    console.log('⚠️  Sync skipped - Algolia not configured');
    process.exit(0);
  }
})();
