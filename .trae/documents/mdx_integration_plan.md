# 博客 MDX 集成实现计划

## 项目现状分析
- 项目使用 Next.js 16.1.6
- 当前使用 TinyMCE 作为富文本编辑器
- 博客内容存储在 blog store 中

## 实现计划

### [ ] 任务 1: 安装 MDX 相关依赖
- **优先级**: P0
- **依赖**: 无
- **描述**:
  - 安装 `@next/mdx` 包，Next.js 16 内置的 MDX 支持
  - 安装 `react-syntax-highlighter` 用于代码高亮
  - 安装 `rehype-highlight` 用于 MDX 代码高亮
- **成功标准**:
  - 所有依赖安装成功
- **测试要求**:
  - `programmatic` TR-1.1: 运行 `npm install` 后无错误
- **注意**:
  - Next.js 16 已经内置了 MDX 支持，只需要安装必要的插件

### [ ] 任务 2: 配置 Next.js 以支持 MDX
- **优先级**: P0
- **依赖**: 任务 1
- **描述**:
  - 修改 `next.config.ts` 文件，添加 MDX 配置
  - 配置 MDX 插件，如代码高亮
- **成功标准**:
  - Next.js 配置正确，能够处理 MDX 文件
- **测试要求**:
  - `programmatic` TR-2.1: 运行 `npm run build` 无错误
- **注意**:
  - Next.js 16 使用新的配置方式，需要正确设置 MDX 插件

### [ ] 任务 3: 创建 MDX 组件
- **优先级**: P1
- **依赖**: 任务 2
- **描述**:
  - 创建 `components/mdx` 目录
  - 创建 `MdxContent.tsx` 组件，用于渲染 MDX 内容
  - 创建 `CodeBlock.tsx` 组件，用于代码高亮
- **成功标准**:
  - MDX 组件能够正确渲染 MDX 内容
  - 代码块能够正确高亮
- **测试要求**:
  - `human-judgement` TR-3.1: 查看 MDX 组件代码结构清晰
  - `human-judgement` TR-3.2: 测试 MDX 组件能够渲染简单的 MDX 内容
- **注意**:
  - 确保 MDX 组件支持常见的 MDX 语法和组件

### [ ] 任务 4: 修改博客页面以支持 MDX
- **优先级**: P1
- **依赖**: 任务 3
- **描述**:
  - 修改 `app/(blogs)/blogs/[id]/page.tsx` 文件，支持渲染 MDX 内容
  - 修改 `app/(admin)/admin/posts/[id]/page.tsx` 文件，支持编辑 MDX 内容
  - 修改 `app/(admin)/admin/posts/new/page.tsx` 文件，支持创建 MDX 内容
- **成功标准**:
  - 博客详情页能够正确渲染 MDX 内容
  - 后台管理页面能够编辑和创建 MDX 内容
- **测试要求**:
  - `human-judgement` TR-4.1: 查看博客详情页能够显示 MDX 内容
  - `human-judgement` TR-4.2: 测试后台管理页面能够编辑 MDX 内容
- **注意**:
  - 确保向后兼容，支持现有的博客内容格式

### [ ] 任务 5: 更新博客存储以支持 MDX
- **优先级**: P1
- **依赖**: 任务 4
- **描述**:
  - 修改 `store/blog.ts` 文件，添加对 MDX 内容的支持
  - 确保博客存储能够处理 MDX 格式的内容
- **成功标准**:
  - 博客存储能够正确处理 MDX 内容
- **测试要求**:
  - `programmatic` TR-5.1: 运行应用无错误
  - `human-judgement` TR-5.2: 测试博客存储能够保存和加载 MDX 内容
- **注意**:
  - 确保数据结构的向后兼容

### [ ] 任务 6: 测试 MDX 功能
- **优先级**: P2
- **依赖**: 任务 5
- **描述**:
  - 创建测试 MDX 内容
  - 测试各种 MDX 语法和组件
  - 测试代码高亮功能
- **成功标准**:
  - 所有 MDX 功能正常工作
  - 代码高亮功能正常工作
- **测试要求**:
  - `human-judgement` TR-6.1: 测试 MDX 基本语法（标题、列表、链接等）
  - `human-judgement` TR-6.2: 测试 MDX 代码块和代码高亮
  - `human-judgement` TR-6.3: 测试 MDX 组件嵌入
- **注意**:
  - 测试各种边缘情况，确保 MDX 功能的稳定性

## 预期结果
- 博客能够支持 MDX 格式的内容
- 后台管理页面能够编辑和创建 MDX 内容
- 代码块能够正确高亮显示
- 保持向后兼容，支持现有的博客内容格式

## 技术栈
- Next.js 16.1.6 (内置 MDX 支持)
- @next/mdx
- react-syntax-highlighter
- rehype-highlight