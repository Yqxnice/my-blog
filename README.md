# 个人博客网站

这是一个使用 Next.js 16 构建的个人博客网站，具有现代化的设计和完整的功能。

## 技术栈

- **前端框架**: Next.js 16 (App Router)
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
- ✅ 暗黑模式支持
- ✅ 搜索功能（Pagefind）
- ✅ 留言墙
- ✅ 一言功能
- ✅ 摸鱼倒计时
- ✅ 随机调色板

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

### 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint 检查
- `npm run lint:fix` - 自动修复 ESLint 问题
- `npm run typecheck` - 运行 TypeScript 类型检查
- `npm run test` - 运行测试
- `npm run test:watch` - 监视模式运行测试
- `npm run test:coverage` - 运行测试并生成覆盖率报告
- `npm run analyze` - 分析打包大小

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── (blogs)/           # 博客相关页面
│   ├── api/               # API 路由
│   ├── layout.tsx         # 全局布局
│   └── page.tsx           # 首页
├── components/            # UI 组件
│   ├── blog/              # 博客相关组件
│   ├── common/            # 通用组件（错误边界、加载状态等）
│   ├── home/              # 首页组件
│   └── mdx/               # Markdown 渲染组件
├── content/               # 博客文章（Markdown）
├── data/                  # 静态数据
├── lib/                   # 工具函数和hooks
├── public/                # 静态资源
├── types/                 # TypeScript 类型定义
├── __tests__/             # 测试文件
├── jest.config.ts         # Jest 配置
└── jest.setup.ts          # Jest 设置
```

## 开发指南

### 代码规范

- 使用 TypeScript 编写所有代码
- 遵循 ESLint 和 Prettier 代码规范
- 组件使用函数式组件和 Hooks
- 使用 Tailwind CSS 进行样式开发

### 添加新页面

1. 在 `app/` 目录下创建新的路由文件
2. 在 `components/` 目录下创建相应的组件
3. 添加适当的 SEO 元数据

### 添加新组件

1. 在 `components/` 目录下创建组件文件
2. 使用 TypeScript 定义 props 接口
3. 添加适当的可访问性属性
4. 编写单元测试

### 测试

- 使用 Jest 和 React Testing Library 编写测试
- 测试文件放在 `__tests__/` 目录下
- 运行 `npm run test` 执行测试
- 运行 `npm run test:coverage` 查看测试覆盖率

## 部署

1. 推送代码到 GitHub 仓库
2. 登录 Vercel 控制台
3. 导入项目并配置环境变量
4. 部署项目

### Vercel 部署

项目已配置 Vercel 部署，支持：
- 自动构建和部署
- 边缘函数
- 图片优化
- 分析和监控

## 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 报告问题

- 使用 GitHub Issues 报告问题
- 提供详细的问题描述和重现步骤
- 包含浏览器和操作系统信息

## 许可证

MIT
