# Giscus 评论系统集成指南

## 概述

已成功集成 [Giscus](https://giscus.app/zh-CN) 评论系统，这是一个基于 GitHub Discussions 的轻量级评论组件。

## 前置条件

1. **GitHub 公开仓库** - 你的博客仓库必须是公开的
2. **启用 Discussions** - 在仓库设置中启用 Discussions 功能
3. **安装 Giscus App** - 访问 [giscus app](https://github.com/apps/giscus) 并安装到你的仓库

## 配置步骤

### 1. 获取配置参数

访问 [https://giscus.app/zh-CN](https://giscus.app/zh-CN)，填写以下信息：

- **仓库**: `your-username/your-repo`
- **页面 ↔️ discussions 映射关系**: 选择 `pathname` (推荐)
- **Discussion 分类**: 选择一个分类（如 `Announcements`）
- **主题**: 选择 `light` 或 `dark`（博客会自动适配）
- **功能**: 根据需要启用

### 2. 添加环境变量

复制配置页面生成的参数，添加到 `.env.local` 文件：

```bash
# GitHub 仓库
NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo

# 仓库 ID
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDOG...

# 讨论分类
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements

# 分类 ID
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOG...
```

### 3. 重启开发服务器

```bash
npm run dev
```

## 配置选项

### 映射方式 (data-mapping)

选择博客文章与 GitHub Discussions 的映射关系：

- **pathname** (推荐) - 使用页面路径标识
- **url** - 使用完整 URL
- **title** - 使用页面标题
- **og:title** - 使用 Open Graph 标题
- **specific** - 使用特定术语
- **number** - 使用讨论编号

### 主题配置

Giscus 组件会自动跟随博客的深色/浅色模式切换。

可用的主题值：
- `light` - 浅色主题
- `dark` - 深色主题
- `dark_dimmed` - 深色柔和主题 (推荐)
- `transparent_dark` - 透明深色主题
- `preferred_color_scheme` - 跟随系统偏好

### 其他配置

- **strict** (严格模式) - 标题必须完全匹配才关联讨论
- **reactionsEnabled** - 启用反应表情
- **emitMetadata** - 发送讨论元数据到 GitHub
- **inputPosition** - 评论框位置 (`top` 或 `bottom`)
- **lang** - 语言设置 (默认 `zh-CN`)

## 文件结构

```
components/common/giscus/
├── Giscus.tsx          # 核心 Giscus 组件
├── BlogGiscus.tsx      # 博客专用的包装组件
└── index.ts            # 导出文件
```

## 使用方法

### 在博客文章中

```tsx
import GiscusComments from '@/components/common/giscus';

<GiscusComments slug={blogId} />
```

### 自定义配置

```tsx
import { Giscus } from '@/components/common/giscus';

<Giscus
  repo="username/repo"
  repoId="R_kgDOG..."
  category="Announcements"
  categoryId="DIC_kwDOG..."
  mapping="pathname"
  lang="zh-CN"
/>
```

## 特性

✅ **自动主题切换** - 跟随博客深色/浅色模式
✅ **懒加载** - 优化页面加载性能
✅ **响应式设计** - 移动端友好
✅ **支持 Markdown** - 评论支持完整 Markdown 语法
✅ **GitHub 登录** - 使用 GitHub 账号直接登录
✅ **实时通知** - GitHub 自动发送回复通知
✅ **无数据库** - 所有数据存储在 GitHub Discussions
✅ **免费开源** - 无需额外成本

## 故障排查

### 评论不显示

1. 检查环境变量是否正确配置
2. 确认仓库已启用 Discussions
3. 确认已安装 Giscus App
4. 检查浏览器控制台是否有错误信息

### 主题不切换

1. 确认博客的主题切换功能正常
2. 检查 `useTheme` hook 是否正确配置
3. 查看 iframe 是否正确接收主题消息

### 评论数据丢失

- Giscus 使用 GitHub Discussions 存储，数据不会丢失
- 可在仓库的 Discussions 标签页查看所有评论

## 相关链接

- [Giscus 官方文档](https://giscus.app/zh-CN)
- [Giscus GitHub](https://github.com/giscus/giscus-component)
- [GitHub Discussions 文档](https://docs.github.com/en/discussions)

## 管理评论

所有评论存储在 GitHub Discussions 中，你可以：

1. 在仓库的 Discussions 页面查看所有评论
2. 删除不当评论或垃圾信息
3. 置顶重要讨论
4. 使用 GitHub 的管理功能（锁定、转移等）
