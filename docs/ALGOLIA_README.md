# Algolia 搜索功能已集成

## ✅ 已完成的功能

1. **搜索模态框组件** - `components/blog/SearchModal.tsx`
   - 优雅的居中弹窗设计
   - 实时搜索和结果高亮
   - 支持键盘快捷键（ESC 关闭）
   - 响应式设计

2. **Algolia 配置** - `lib/algolia-config.ts`
   - 集中管理 Algolia 配置
   - 配置验证功能

3. **数据同步脚本** - `lib/algolia-sync.ts`
   - 自动同步博客数据到 Algolia
   - 索引设置优化（中文支持）
   - 可通过 CLI 或程序调用

4. **浮动搜索按钮**
   - 固定在右侧，一直可见
   - 点击打开搜索模态框

## 🚀 快速开始

### 1. 配置 Algolia

在 `.env.local` 文件中添加：

```bash
NEXT_PUBLIC_ALGOLIA_APP_ID=your-app-id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your-search-api-key
ALGOLIA_ADMIN_API_KEY=your-admin-api-key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=blogs
```

### 2. 同步数据

```bash
npm run algolia:sync
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:3002/blogs

## 📝 详细配置指南

完整的配置和故障排除指南，请查看：
- **[Algolia 配置指南](./ALGOLIA_SETUP.md)**

## 🔧 常用命令

```bash
# 同步数据到 Algolia
npm run algolia:sync

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📦 已安装的依赖

- `algoliasearch` - Algolia 搜索客户端
- `instantsearch.js` - InstantSearch 核心库
- `react-instantsearch` - React InstantSearch 组件

## 🎨 功能特性

- ✨ 实时搜索
- 🎯 搜索结果高亮
- 🏷️ 标签过滤
- 🌏 中文搜索优化
- ⌨️ 键盘快捷键支持
- 📱 响应式设计
- 🚀 极速搜索体验

## 🔐 安全提示

- `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY` 可以安全地暴露给客户端
- `ALGOLIA_ADMIN_API_KEY` 仅用于数据同步，不要提交到 Git
- 确保 `.env.local` 文件在 `.gitignore` 中

## 📚 相关资源

- [Algolia 官方文档](https://www.algolia.com/doc/)
- [React InstantSearch 文档](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/)
