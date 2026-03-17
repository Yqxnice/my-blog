import { Github, Twitter, MessageCircle, Share2, Rss, Mail, House, Book, BookOpen, Clock, BrainCircuit, Link as LinkIcon } from 'lucide-react';

// 社交媒体链接数据
export const socialLinks = [
  { name: "GitHub", href: "https://github.com", icon: Github },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "微信", href: "/wechat", icon: MessageCircle },
  { name: "微博", href: "https://weibo.com", icon: Share2 },
  { name: "RSS", href: "/feed.xml", icon: Rss },
  { name: "邮箱", href: "mailto:contact@muzi.blog", icon: Mail },
];

// 统一的导航数据结构：Header 与 Footer 公用
export type NavItem = { title: string; path: string; icon?: any };
export const navigationItems: NavItem[] = [
  { title: "首页", path: "/", icon: House },
  { title: "博客", path: "/blogs", icon: Book },
  { title: "手记", path: "/blogs/1", icon: BookOpen },
  { title: "时光", path: "/blogs/2", icon: Clock },
  { title: "思考", path: "/blogs/3", icon: BrainCircuit },
  { title: "友情链接", path: "/links", icon: LinkIcon },
];
