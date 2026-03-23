# Algolia 搜索配置指南

## 1. 创建 Algolia 账号

1. 访问 [Algolia 官网](https://www.algolia.com/)
2. 注册账号（免费计划支持 10,000 条记录和 100,000 次搜索/月）
3. 创建一个新的 Index（索引），命名为 `blogs`

## 2. 获取 API 密钥

在 Algolia 控制台中：
- **Application ID**: 在 Settings → API Keys 中找到
- **Search-only API Key**: 在 Settings → API Keys 中找到（可以公开）
- **Admin API Key**: 在 Settings → API Keys 中找到（**仅用于数据同步，不要提交到 Git**）

## 3. 配置环境变量

在项目根目录的 `.env.local` 文件中添加：

```bash
# Algolia 搜索
NEXT_PUBLIC_ALGOLIA_APP_ID=your-app-id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your-search-api-key
ALGOLIA_ADMIN_API_KEY=your-admin-api-key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=blogs
```

**⚠️ 重要提示**：
- `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY` 可以安全地暴露给客户端
- `ALGOLIA_ADMIN_API_KEY` 仅用于数据同步，永远不要提交到 Git 或暴露给客户端

## 4. 同步数据到 Algolia

### 首次同步

运行以下命令将现有博客数据同步到 Algolia：

```bash
npm run algolia:sync
```

### 自动同步

你可以在以下情况同步数据：
1. 每次添加、编辑或删除博客文章后
2. 在部署流程中添加同步步骤

示例部署配置：

```json
{
  "scripts": {
    "build": "next build && npm run algolia:sync"
  }
}
```

## 5. 使用搜索功能

配置完成后：
1. 启动开发服务器：`npm run dev`
2. 访问博客列表页面
3. 点击右侧浮动搜索按钮（放大镜图标）
4. 在搜索框中输入关键词进行搜索

## 6. 自定义搜索配置

你可以在 `lib/algolia-sync.ts` 中自定义索引设置：

```typescript
await index.setSettings({
  // 搜索属性
  searchableAttributes: ['title', 'content', 'excerpt', 'tags'],

  // 属性权重
  attributesToHighlight: ['title', 'excerpt'],
  attributesToSnippet: ['excerpt:50'],

  // 排序
  customRanking: ['desc(date)'],

  // 分面
  attributesForFaceting: ['tags', 'date'],
});
```

## 7. 故障排除

### 搜索功能未配置
如果看到"搜索功能未配置"提示：
- 检查 `.env.local` 文件是否存在
- 确认所有必需的环境变量都已设置
- 重启开发服务器

### 搜索结果为空
- 确认已运行 `npm run algolia:sync` 同步数据
- 检查 Algolia 控制台中的索引是否有数据

### API 错误
- 验证 API 密钥是否正确
- 确认 Admin API Key 有权限写入索引
- 检查网络连接

## 8. 进阶功能

### 添加过滤器

在搜索组件中添加过滤器：

```typescript
<Configure filters="status:published" />
```

### 自定义搜索界面

修改 `components/blog/SearchModal.tsx` 来自定义搜索界面的外观和行为。

### 搜索分析

在 Algolia 控制台中查看：
- 搜索量统计
- 热门搜索词
- 无结果搜索
- 用户点击率

## 资源链接

- [Algolia 官方文档](https://www.algolia.com/doc/)
- [React InstantSearch 文档](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/)
- [Algolia 中文文档](https://www.algolia.com/doc/guides/getting-started/)
