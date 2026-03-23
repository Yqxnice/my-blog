# Talks 页面更新包

## 文件结构

```
talks-package/
├── layout.tsx                    # 路由 layout（未改动）
├── page.tsx                      # 主页面（已更新）
├── globals.css                   # 全局样式（已更新）
└── components/
    ├── CodeBlock.tsx             # 代码块（已更新）
    ├── ContentRenderer.tsx       # 内容渲染器（已更新）
    └── TalkCard.tsx              # 话题卡片（已更新）
```

## 放置位置

```
app/
└── talks/
    ├── layout.tsx                ← talks-package/layout.tsx
    ├── page.tsx                  ← talks-package/page.tsx
    └── components/
        ├── CodeBlock.tsx         ← talks-package/components/CodeBlock.tsx
        ├── ContentRenderer.tsx   ← talks-package/components/ContentRenderer.tsx
        └── TalkCard.tsx          ← talks-package/components/TalkCard.tsx

app/
└── globals.css                   ← talks-package/globals.css（合并或替换）
```

## 安装依赖

```bash
npm install swr
```

## 本次更新内容

### 第一轮：功能补全
- **CodeBlock** — 新增复制按钮，hover 显示，点击后变绿色 ✓ + "已复制"，2s 后重置
- **ContentRenderer** — 图片支持灯箱放大（点击或 Esc 关闭），链接卡片显示网站 favicon
- **page.tsx** — 按年份分组时间线，心情 + 标签筛选栏
- **TalkCard** — 显示 tags 胶囊标签，`<time>` 补上 dateTime 属性

### 第二轮：稳定性
- **page.tsx** — 裸 fetch 换成 SWR（缓存、自动重试、断网重连）
- **骨架屏** — 加载时显示占位卡片，替代转圈圈
- **错误边界** — 区分 404 / 网络错误，提供重试按钮
- **回到顶部** — 滚动 400px 后右下角滑入，passive scroll 监听

### globals.css 变化
- 将原 `ContentRenderer` 里用 `useEffect` 动态注入的滚动条样式
  迁移到 `globals.css`，class 名为 `.custom-scrollbar`
