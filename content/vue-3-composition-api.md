---
title: Vue 3 Composition API 实践
date: 2024-02-05
readTime: 6 min
views: 896
comments: 29
imageUrl: https://api.dicebear.com/7.x/adventurer/svg?seed=Vue&backgroundColor=41b883
tags: [vue, javascript, frontend]
summary: 本文介绍了Vue 3 Composition API的基本用法、响应式系统、生命周期钩子以及其优势，帮助开发者更好地组织和复用代码。
aiInvolvement: 辅助创作
---

# Vue 3 Composition API 实践

## 基本用法

Composition API 允许你按功能组织代码：

```vue
<template>
  <div>{{ count }}</div>
  <button @click="increment">增加</button>
</template>

<script setup>
import { ref, computed } from 'vue';

const count = ref(0);
const doubleCount = computed(() => count.value * 2);

function increment() {
  count.value++
}
</script>
```

## 响应式系统

Composition API 提供了更灵活的响应式系统：

- `ref()` - 创建响应式引用
- `reactive()` - 创建响应式对象
- `computed()` - 创建计算属性
- `watch()` - 监听响应式变化

## 生命周期钩子

使用组合式生命周期钩子：

```javascript
import { onMounted, onUnmounted } from 'vue';

function useTimer() {
  let timer;
  
  onMounted(() => {
    timer = setInterval(() => {
      console.log('Tick');
    }, 1000);
  });
  
  onUnmounted(() => {
    clearInterval(timer);
  });
}
```

### 优势

- 更好的代码组织
- [更灵活的逻辑复用](https://www.baidu.com)
- 更好的 TypeScript 支持
- 更清晰的代码结构

