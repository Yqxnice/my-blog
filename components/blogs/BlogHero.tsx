/**
 * 功能：博客首页英雄区组件
 * 目的：展示博客作者信息和基本介绍
 * 作者：Yqxnice
 */
import me from "@/public/me.jpg";
import Image from "next/image";
import { Github, Link, Rss } from "lucide-react";

interface BlogHeroProps {
  title?: string;
  subtitle?: string;
}

export function BlogHero({ 
  title = "你好，我是木子", 
  subtitle = "前端开发者 · 记录技术、思考与生活的碎片" 
}: BlogHeroProps) {
  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8 text-center md:text-left">
      <div className="flex-shrink-0 w-16 h-16 md:w-17 md:h-17 rounded-full border-2 border-border overflow-hidden relative">
        <Image
          src={me.src}
          alt="木子"
          fill
          className="object-cover"
          priority={true}
          sizes="(max-width: 768px) 64px, 68px"
          quality={75}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/adventurer/svg?seed=Muzi&backgroundColor=f0ede8';
          }}
        />
      </div>
      <div className="flex-1">
        <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
          {title} <em className="text-primary">—</em>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground font-light tracking-wider">
          {subtitle}
        </p>
        <div className="flex gap-2 mt-3 flex-wrap justify-center md:justify-start">
          <a href="https://github.com/" target="_blank" rel="noopener" className="flex items-center gap-1 text-xs text-muted-foreground tracking-wider px-2 py-1 border border-border rounded-full hover:border-primary hover:text-primary hover:bg-secondary transition-all duration-200">
            <Github size={12} />
            GitHub
          </a>
          <a href="/links" className="flex items-center gap-1 text-xs text-muted-foreground tracking-wider px-2 py-1 border border-border rounded-full hover:border-primary hover:text-primary hover:bg-secondary transition-all duration-200">
            <Link size={12} />
            友情链接
          </a>
          <a href="/feed.xml" className="flex items-center gap-1 text-xs text-muted-foreground tracking-wider px-2 py-1 border border-border rounded-full hover:border-primary hover:text-primary hover:bg-secondary transition-all duration-200">
            <Rss size={12} />
            RSS
          </a>
        </div>
      </div>
    </div>
  );
}