import { Github, Twitter, MessageCircle, Share2, Rss, Mail, House, Book, BookOpen, Clock, BrainCircuit, Link as LinkIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * 网站配置
 * 集中管理网站的所有基本信息和设置
 */
export const siteConfig = {
  // 网站基本信息
  name: '木子博客', // 网站名称
  description: '独立开发者的技术与生活，分享前端开发、后端技术、工具使用等内容', // 网站描述
  url: 'https://www.muzi.dev', // 网站 URL
  
  // 作者信息
  author: {
    name: '木子', // 作者姓名
    email: 'muzi@example.com', // 作者邮箱
    bio: '独立开发者，专注于前端技术和用户体验' // 作者简介
  },
  
  // 社交媒体链接（用于页脚等地方）
  social: {
    github: 'https://github.com/muzi', // GitHub 链接
    twitter: 'https://twitter.com/muzi', // Twitter 链接
    linkedin: 'https://linkedin.com/in/muzi', // LinkedIn 链接
    email: 'mailto:muzi@example.com' // 邮箱链接
  },
  
  // 社交媒体链接数组（用于导航栏或其他需要图标展示的地方）
  socialLinks: [
    { name: "GitHub", href: "https://github.com", icon: Github },
    { name: "Twitter", href: "https://twitter.com", icon: Twitter },
    { name: "微信", href: "/wechat", icon: MessageCircle },
    { name: "微博", href: "https://weibo.com", icon: Share2 },
    { name: "RSS", href: "/feed.xml", icon: Rss },
    { name: "邮箱", href: "mailto:contact@muzi.blog", icon: Mail },
  ],
  
  // 导航菜单配置
  navigation: {
    items: [
      { title: "首页", path: "/", icon: House },
      { title: "博客", path: "/blogs", icon: Book },
      { title: "手记", path: "/blogs/1", icon: BookOpen },
      { title: "时光", path: "/blogs/2", icon: Clock },
      { title: "思考", path: "/blogs/3", icon: BrainCircuit },
      { title: "友情链接", path: "/links", icon: LinkIcon },
    ]
  },
  
  // 网站关键词（用于 SEO）
  keywords: ['前端开发', '后端技术', 'Next.js', 'React', 'TypeScript', '技术博客'],
  
  // 社交媒体分享图片
  ogImage: '/me.jpg',
  
  // 网站图标
  favicon: '/favicon.ico',
  
  // 主题颜色
  themeColor: '#000000',
  
  // 网站语言
  language: 'zh-CN',
  
  // 时区
  timezone: 'Asia/Shanghai',
  
  // 分页配置
  pagination: {
    perPage: 12 // 每页显示的文章数量
  },
  
  // 分析工具配置
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, // Google Analytics ID
    
    // Umami 分析配置（自托管实例）
    umami: {
      // Umami 实例基础 URL
      baseUrl: process.env.NEXT_PUBLIC_UMAMI_BASE_URL,
      
      // Umami 用户名
      username: process.env.UMAMI_USERNAME,
      
      // Umami 密码
      password: process.env.UMAMI_PASSWORD,
      
      // 网站 ID
      websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
    }
  }
};

/**
 * 导航项类型定义
 */
export type NavItem = { 
  title: string; // 导航项标题
  path: string; // 导航项路径
  icon?: LucideIcon; // 导航项图标（可选）
};
