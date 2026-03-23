/**
 * 功能：Algolia搜索同步
 * 目的：将博客内容同步到Algolia搜索服务
 * 作者：Yqxnice
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { algoliasearch } from 'algoliasearch';

/**
 * 同步博客数据到 Algolia
 * 这个脚本应该在构建时或更新内容时运行
 */
export async function syncBlogsToAlgolia() {
  // 检查配置
  if (
    !process.env.ALGOLIA_ADMIN_API_KEY ||
    !process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ||
    !process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME
  ) {
    console.warn('Algolia credentials not configured. Skipping sync.');
    return;
  }

  try {
    // 初始化 Algolia 客户端（使用 Admin API Key）
    const client = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      process.env.ALGOLIA_ADMIN_API_KEY
    );

    const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;

    // 直接读取 content 目录中的所有 markdown 文件
    const contentDir = path.join(process.cwd(), 'content');
    const files = fs.readdirSync(contentDir).filter((file) => file.endsWith('.md'));

    // 读取并解析所有博客文章
    const records = files.map((filename) => {
      const filePath = path.join(contentDir, filename);
      let fileContent = fs.readFileSync(filePath, 'utf-8');

      // 处理不同的 frontmatter 分隔符
      if (fileContent.startsWith('***')) {
        fileContent = fileContent.replace('***', '---');
      }

      const { data, content } = matter(fileContent);

      return {
        objectID: filename.replace('.md', ''),
        title: data.title || 'Untitled',
        excerpt: data.summary || data.excerpt || '',
        content: content, // 用于全文搜索
        slug: data.slug || filename.replace('.md', ''),
        tags: data.tags || [],
        date: data.date || new Date().toISOString(),
        readTime: data.readTime || '5 min',
        imageUrl: data.imageUrl || '',
        status: data.status || 'published', // 默认为 published
      };
    });

    // 只同步已发布的文章（status 不为 draft 的都视为已发布）
    const publishedRecords = records.filter((record) => record.status !== 'draft');

    if (publishedRecords.length === 0) {
      console.warn('⚠️  No published blogs found to sync');
      return { success: true, count: 0 };
    }

    // 批量保存到 Algolia
    await client.saveObjects({
      indexName,
      objects: publishedRecords,
    });

    console.log(`✅ Successfully synced ${publishedRecords.length} blogs to Algolia`);

    // 配置索引设置（可选）
    try {
      await client.setSettings({
        indexName,
        indexSettings: {
          // 搜索属性
          searchableAttributes: ['unordered(title)', 'unordered(content)', 'excerpt', 'tags'],
          // 属性权重
          attributesToHighlight: ['title', 'excerpt'],
          attributesToSnippet: ['excerpt:50'],
          // 排序
          ranking: ['typo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom'],
          // 自定义排序
          customRanking: ['desc(date)'],
          // 分面
          attributesForFaceting: ['filterOnly(tags)', 'filterOnly(date)'],
        },
      });
      console.log('✅ Index settings updated');
    } catch (settingsError) {
      console.warn('⚠️  Failed to update index settings:', settingsError);
    }

    return { success: true, count: publishedRecords.length };
  } catch (error) {
    console.error('❌ Error syncing to Algolia:', error);
    return { success: false, error };
  }
}

// CLI 运行
if (require.main === module) {
  syncBlogsToAlgolia()
    .then((result) => {
      if (result) {
        if (result.success) {
          console.log(`Synced ${result.count} blogs`);
          process.exit(0);
        } else {
          console.error('Sync failed');
          process.exit(1);
        }
      } else {
        console.log('Sync skipped - Algolia not configured');
        process.exit(0);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}
