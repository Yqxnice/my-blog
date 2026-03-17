# 木子博客 - umami.is 集成计划

## [x] 任务 1: 安装 umami.is 依赖
- **优先级**: P0
- **依赖**: 无
- **描述**:
  - 安装 @umami/react 包作为项目依赖
  - 确保包版本与项目的 React 版本兼容
- **成功标准**:
  - 依赖已成功安装，无版本冲突
- **测试要求**:
  - `programmatic` TR-1.1: 运行 `npm install @umami/react` 命令无错误
  - `programmatic` TR-1.2: 检查 package.json 文件中已添加 @umami/react 依赖

## [x] 任务 2: 配置 umami.is 跟踪代码
- **优先级**: P0
- **依赖**: 任务 1
- **描述**:
  - 在 lib/config.ts 中添加 umami.is 配置项
  - 创建 umami 跟踪组件
  - 在根布局中集成 umami 跟踪
- **成功标准**:
  - umami 配置已添加到配置文件
  - 跟踪组件已创建并正确集成
- **测试要求**:
  - `programmatic` TR-2.1: 配置文件中包含 umami 配置项
  - `programmatic` TR-2.2: 跟踪组件文件已创建
  - `programmatic` TR-2.3: 根布局中已导入并使用跟踪组件

## [x] 任务 3: 验证 umami.is 集成效果
- **优先级**: P1
- **依赖**: 任务 2
- **描述**:
  - 运行开发服务器
  - 检查浏览器控制台是否有 umami 相关错误
  - 验证 umami 数据是否正确发送
- **成功标准**:
  - 网站正常运行，无 umami 相关错误
  - umami 跟踪代码已正确加载
- **测试要求**:
  - `programmatic` TR-3.1: 开发服务器启动无错误
  - `human-judgement` TR-3.2: 浏览器控制台无 umami 相关错误
  - `human-judgement` TR-3.3: 网络请求中可看到 umami 相关请求

## [x] 任务 4: 优化 umami.is 配置
- **优先级**: P2
- **依赖**: 任务 3
- **描述**:
  - 根据需要调整 umami 配置
  - 添加页面视图跟踪
  - 添加事件跟踪（可选）
- **成功标准**:
  - umami 配置已优化，满足项目需求
- **测试要求**:
  - `human-judgement` TR-4.1: umami 仪表板中可看到页面视图数据
  - `human-judgement` TR-4.2: 事件跟踪（如果启用）工作正常

## 实施说明
1. umami.is 需要在其官方网站注册账号并获取跟踪代码
2. 跟踪代码包含 website ID 和 umami 服务器 URL
3. 这些信息需要添加到项目配置中
4. 集成后，umami 将开始收集网站访问数据