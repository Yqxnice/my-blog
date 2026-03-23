<!--
功能：碎碎念数据格式说明
目的：说明talks.json数据结构和各字段含义
作者：Yqxnice
-->
# 碎碎念数据格式说明 (Talks Data Format)

本文件说明 `talks.json` 数据结构和各字段含义。

## 文件位置

```
data/talks.json
```

## 数据结构

### 顶层结构

```json
{
  "talks": [...],      // 碎碎念列表
  "metadata": {...}    // 数据元信息
}
```

### metadata (元信息)

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `title` | string | 标题 | "碎碎念" |
| `description` | string | 描述 | "记录生活中的点滴思考" |
| `version` | string | 数据版本 | "1.0.0" |
| `lastUpdated` | string | 最后更新时间 | "2024-12-15T10:30:00Z" |

---

## TalkItem (碎碎念条目)

### 必填字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `id` | string | 唯一标识符 | "talk-001" |
| `content` | array | 内容数组 | [{...}] |
| `createdAt` | string | 创建时间 (ISO 8601) | "2024-12-15T10:30:00Z" |

### 可选字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `title` | string | 标题 | "今日心情" |
| `tags` | string[] | 标签数组 | ["生活", "思考"] |
| `mood` | string | 心情 | "愉快" |
| `location` | string | 地点 | "咖啡馆" |
| `isPinned` | boolean | 是否置顶 | true |
| `isDraft` | boolean | 是否草稿 | false |
| `updatedAt` | string | 更新时间 | "2024-12-16T08:00:00Z" |

---

## 心情选项 (mood)

| 心情 | 图标 | 说明 |
|------|------|------|
| `愉快` | 😊 | 开心、快乐 |
| `思考` | 💭 | 正在思考 |
| `好奇` | 🤔 | 好奇心 |
| `疲惫但满足` | 😌 | 累但有成就感 |
| `放松` | ☕ | 休闲放松 |
| `惬意` | 🍃 | 舒适自在 |
| `期待` | ✨ | 期待某事 |
| `分享` | 🎁 | 分享内容 |
| `宁静` | 🌙 | 平静安宁 |

---

## Content Types (内容类型)

### 1. 文本 (text)

```json
{
  "type": "text",
  "id": "content-001",
  "content": "今天天气真好！"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | "text" | 固定值 |
| `id` | string | 唯一标识 |
| `content` | string | 文本内容 |

**注意**: 支持换行，可以用 ``` 包裹代码块。

---

### 2. 图片 (image)

```json
{
  "type": "image",
  "id": "content-002",
  "url": "https://example.com/photo.jpg",
  "alt": "蓝天白云",
  "caption": "今天的天空格外蓝"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | "image" | 固定值 |
| `id` | string | 唯一标识 |
| `url` | string | 图片URL (必填) |
| `alt` | string | 替代文本 (无障碍) |
| `caption` | string | 图片说明 |

---

### 3. 链接 (link)

```json
{
  "type": "link",
  "id": "content-003",
  "url": "https://dribbble.com",
  "title": "Dribbble - 设计师社区",
  "description": "全球设计师的灵感源泉",
  "siteName": "Dribbble"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | "link" | 固定值 |
| `id` | string | 唯一标识 |
| `url` | string | 链接地址 (必填) |
| `title` | string | 链接标题 |
| `description` | string | 链接描述 |
| `siteName` | string | 网站名称 |

---

### 4. 引用 (quote)

```json
{
  "type": "quote",
  "id": "content-004",
  "text": "程序是关于抽象的艺术",
  "author": "John Johnson"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | "quote" | 固定值 |
| `id` | string | 唯一标识 |
| `text` | string | 引用文本 (必填) |
| `author` | string | 作者 |
| `source` | string | 来源 |

---

### 5. 视频 (video)

```json
{
  "type": "video",
  "id": "content-005",
  "url": "https://www.youtube.com/embed/xxxxx",
  "title": "视频标题",
  "duration": "3:45"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | "video" | 固定值 |
| `id` | string | 唯一标识 |
| `url` | string | 嵌入URL (必填) |
| `title` | string | 视频标题 |
| `thumbnail` | string | 缩略图URL |
| `duration` | string | 时长 |

---

## 完整示例

```json
{
  "id": "talk-001",
  "title": "关于编程的思考",
  "content": [
    {
      "type": "text",
      "id": "content-001",
      "content": "今天在写代码的时候突然想到，编程其实就像是在和计算机对话。"
    },
    {
      "type": "quote",
      "id": "content-002",
      "text": "程序是关于抽象的艺术，而不是关于细节的科学。",
      "author": "John Johnson"
    }
  ],
  "tags": ["编程", "思考", "技术"],
  "createdAt": "2024-12-15T10:30:00Z",
  "location": "家里",
  "mood": "思考",
  "isPinned": true
}
```

---

## 类型定义

详细的 TypeScript 类型定义请查看：

```
types/talks.ts
```

---

## 添加新碎碎念

1. 打开 `data/talks.json`
2. 在 `talks` 数组中添加新条目
3. 确保 `id` 唯一
4. 至少包含 `id`、`content` 和 `createdAt`
5. 保存文件，刷新页面即可看到

---

## 注意事项

1. **ID 唯一性**: 每条碎碎念和每个内容块都需要唯一的 ID
2. **时间格式**: 使用 ISO 8601 格式，如 "2024-12-15T10:30:00Z"
3. **内容块顺序**: `content` 数组中的内容块会按顺序显示
4. **草稿**: 设置 `isDraft: true` 可以隐藏条目
5. **置顶**: 设置 `isPinned: true` 会显示在列表最前面