---
title: Tailwind CSS 实用技巧
date: 2024-02-20
readTime: 4 min
imageUrl: https://api.dicebear.com/7.x/adventurer/svg?seed=Tailwind&backgroundColor=ffd93d
tags: [css, tailwind, frontend]
summary: 本文分享了Tailwind CSS的实用技巧，包括自定义工具类、响应式设计、深色模式实现以及最佳实践。
aiInvolvement: 辅助创作
---

# Tailwind CSS 实用技巧

## 自定义工具类

你可以在 `tailwind.config.js` 中添加自定义工具类：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      },
    },
  },
};
```

## 响应式设计

Tailwind 提供了简洁的响应式前缀：

| 前缀 | 断点 |
|------|------|
| sm: | 640px |
| md: | 768px |
| lg: | 1024px |
| xl: | 1280px |

## 深色模式

轻松实现深色模式：

```html
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  内容
</div>
```

### 最佳实践

- 使用 `@apply` 提取重复样式
- 合理使用响应式前缀
- 结合自定义配置增强可维护性
