# 个人博客网站

这是一个使用 Next.js 14 构建的个人博客网站，具有现代化的设计和完整的功能。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式方案**: Tailwind CSS v4
- **UI 组件**: shadcn/ui
- **内容管理**: Markdown 文件
- **分析工具**: Umami
- **部署平台**: Vercel

## 功能特点

- ✅ 响应式设计，适配各种设备
- ✅ 博客文章管理（Markdown 格式）
- ✅ 文章访问量统计
- ✅ 标签分类功能
- ✅ 代码高亮显示
- ✅ RSS 订阅功能
- ✅ 404 错误页面
- ✅ 友链管理

## 快速开始

### 开发环境

1. 克隆仓库
2. 安装依赖
   ```bash
   npm install
   ```
3. 启动开发服务器
   ```bash
   npm run dev
   ```
4. 访问 http://localhost:3000

### 环境变量

在 `.env.local` 文件中配置以下环境变量：

```env
# Umami 分析配置
UMAMI_BASE_URL=your-umami-base-url
UMAMI_USERNAME=your-umami-username
UMAMI_PASSWORD=your-umami-password
UMAMI_WEBSITE_ID=your-umami-website-id
```

## 项目结构

```
├── app/             # Next.js App Router
│   ├── (blogs)/     # 博客相关页面
│   ├── api/         # API 路由
│   ├── layout.tsx   # 全局布局
│   └── page.tsx     # 首页
├── components/      # UI 组件
│   ├── blog/        # 博客相关组件
│   ├── mdx/         # Markdown 渲染组件
│   └── ui/          # 通用 UI 组件
├── content/         # 博客文章（Markdown）
├── data/            # 静态数据
├── lib/             # 工具函数
└── public/          # 静态资源
```

## 部署

1. 推送代码到 GitHub 仓库
2. 登录 Vercel 控制台
3. 导入项目并配置环境变量
4. 部署项目

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT
