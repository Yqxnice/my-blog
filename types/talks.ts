/**
 * 功能：碎碎念数据类型定义
 * 目的：定义碎碎念功能的所有数据结构和类型
 * 作者：Yqxnice
 */
// ===================================================================
// 碎碎念数据类型定义 (Talks Data Types)
// ===================================================================
// 
// 数据文件位置: data/talks.json
// 
// 本文件定义了碎碎念功能的所有数据结构和类型
// ===================================================================

// -------------------------------------------------------------------
// 内容类型 (Content Types)
// -------------------------------------------------------------------

/**
 * 支的内容类型
 * - text: 纯文本
 * - image: 图片
 * - link: 链接
 * - quote: 引用/名言
 * - video: 视频
 */
export type TalkContentType = 'text' | 'image' | 'link' | 'quote' | 'video';

/** 基础内容接口，所有内容类型都必须包含 type 和 id */
export interface BaseTalkContent {
  type: TalkContentType;  // 内容类型标识
  id: string;             // 唯一标识符，如 "content-001"
}

// -------------------------------------------------------------------
// 文本内容 (Text Content)
// -------------------------------------------------------------------
export interface TextContent extends BaseTalkContent {
  type: 'text';
  content: string;  // 文本内容，支持换行，可以用 ``` 包裹代码块
}

// -------------------------------------------------------------------
// 图片内容 (Image Content)
// -------------------------------------------------------------------
export interface ImageContent extends BaseTalkContent {
  type: 'image';
  url: string;       // 图片URL（必填）
  alt?: string;      // 图片替代文本，用于无障碍访问
  caption?: string;  // 图片说明/标题，显示在图片下方
  width?: number;    // 图片宽度（可选）
  height?: number;   // 图片高度（可选）
}

// -------------------------------------------------------------------
// 链接内容 (Link Content)
// -------------------------------------------------------------------
export interface LinkContent extends BaseTalkContent {
  type: 'link';
  url: string;         // 链接地址（必填）
  title?: string;      // 链接标题
  description?: string; // 链接描述
  image?: string;      // 链接预览图
  siteName?: string;   // 网站名称
}

// -------------------------------------------------------------------
// 引用内容 (Quote Content)
// -------------------------------------------------------------------
export interface QuoteContent extends BaseTalkContent {
  type: 'quote';
  text: string;      // 引用的文本内容（必填）
  author?: string;   // 作者名称
  source?: string;   // 来源（书籍、文章等）
}

// -------------------------------------------------------------------
// 视频内容 (Video Content)
// -------------------------------------------------------------------
export interface VideoContent extends BaseTalkContent {
  type: 'video';
  url: string;        // 视频嵌入URL（必填）
  thumbnail?: string; // 视频缩略图
  title?: string;     // 视频标题
  duration?: string;  // 视频时长，如 "3:45"
}

// -------------------------------------------------------------------
// 联合类型 (Union Types)
// -------------------------------------------------------------------

/** 所有可能的内容类型 */
export type TalkContentItem = TextContent | ImageContent | LinkContent | QuoteContent | VideoContent;

// -------------------------------------------------------------------
// 碎碎念条目 (Talk Item)
// -------------------------------------------------------------------

/**
 * 单条碎碎念的数据结构
 * 
 * 示例:
 * {
 *   "id": "talk-001",
 *   "title": "今日心情",
 *   "content": [{ "type": "text", "id": "c1", "content": "今天天气真好！" }],
 *   "tags": ["生活", "天气"],
 *   "createdAt": "2024-12-15T10:30:00Z",
 *   "mood": "愉快",
 *   "location": "公园"
 * }
 */
export interface TalkItem {
  /** 
   * 唯一标识符
   * 格式: "talk-XXX"，如 "talk-001"
   */
  id: string;

  /** 
   * 标题（可选）
   * 用于显示在内容上方的标题
   * 例如: "今日天气"、"代码分享"
   */
  title?: string;

  /** 
   * 内容数组（必填）
   * 包含一条碎碎念的所有内容块
   * 可以包含多个不同类型的内容
   */
  content: TalkContentItem[];

  /** 
   * 标签数组（可选）
   * 用于分类和筛选
   * 例如: ["生活", "思考", "技术"]
   */
  tags?: string[];

  /** 
   * 创建时间（必填）
   * ISO 8601 格式: "YYYY-MM-DDTHH:mm:ssZ"
   * 例如: "2024-12-15T10:30:00Z"
   */
  createdAt: string;

  /** 
   * 更新时间（可选）
   * 如果内容被修改过，记录最后修改时间
   */
  updatedAt?: string;

  /** 
   * 地点（可选）
   * 发布时的位置信息
   * 例如: "家里"、"咖啡馆"、"公园"
   */
  location?: string;

  /** 
   * 心情（可选）
   * 发布时的心情状态
   * 可选值: "愉快"、"思考"、"好奇"、"疲惫但满足"、"放松"、"惬意"、"期待"、"分享"、"宁静"
   */
  mood?: string;

  /** 
   * 是否置顶（可选）
   * true: 显示在列表最前面
   * false 或 undefined: 正常排序
   */
  isPinned?: boolean;

  /** 
   * 是否为草稿（可选）
   * true: 不显示在列表中
   * false 或 undefined: 正常显示
   */
  isDraft?: boolean;
}

// -------------------------------------------------------------------
// 数据集合 (Data Collection)
// -------------------------------------------------------------------

/** 碎碎念数据集合的顶层结构 */
export interface TalksData {
  /** 碎碎念列表 */
  talks: TalkItem[];
  
  /** 数据元信息 */
  metadata: {
    title: string;        // 标题，如 "碎碎念"
    description: string;  // 描述
    version: string;      // 数据版本，如 "1.0.0"
    lastUpdated: string;  // 最后更新时间
  };
}

// -------------------------------------------------------------------
// 筛选选项 (Filter Options)
// -------------------------------------------------------------------

/** 碎碎念筛选选项 */
export interface TalksFilter {
  search?: string;           // 搜索关键词
  tags?: string[];           // 按标签筛选
  contentType?: TalkContentType; // 按内容类型筛选
  startDate?: string;        // 开始日期
  endDate?: string;          // 结束日期
  sortBy?: 'newest' | 'oldest' | 'pinned'; // 排序方式
}

// -------------------------------------------------------------------
// 心情选项 (Mood Options)
// -------------------------------------------------------------------

/** 可用的心情选项及对应的图标 */
export const MOOD_OPTIONS = [
  { value: '愉快', emoji: '😊' },
  { value: '思考', emoji: '💭' },
  { value: '好奇', emoji: '🤔' },
  { value: '疲惫但满足', emoji: '😌' },
  { value: '放松', emoji: '☕' },
  { value: '惬意', emoji: '🍃' },
  { value: '期待', emoji: '✨' },
  { value: '分享', emoji: '🎁' },
  { value: '宁静', emoji: '🌙' },
] as const;