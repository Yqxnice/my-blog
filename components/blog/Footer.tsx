"use client";

import React, { useState, useEffect } from "react";
// 已通过第一处导入引入 Link，避免重复导入
import { ArrowUpToLine } from "lucide-react";
import { socialLinks, navigationItems } from "@/data/contact";
import Link from "next/link";

export function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // 监听滚动，控制回到顶部按钮显示
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 回到顶部功能
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-background border-t border-border mt-auto">
      {/* 回到顶部按钮 */}
      <div className="relative">
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="absolute -top-10 right-4 md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all duration-300 hover:scale-110 active:scale-95 z-10"
            aria-label="回到顶部"
          >
            <ArrowUpToLine size={20} />
          </button>
        )}
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        {/* 导航链接区（Footer，统一数据源 navigationItems） */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-8">
          {navigationItems.map((item) => (
            <Link key={item.path} href={item.path} className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors duration-200 group">
              {item.title}
              
            </Link>
          ))}
        </div>

        {/* 社交媒体图标区 */}
        <div className="flex justify-center items-center gap-4 md:gap-6 mb-8">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-border/50 bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:scale-110 transition-all duration-300 shadow-sm"
              aria-label={social.name}
              target={social.href.startsWith("http") ? "_blank" : undefined}
              rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              <social.icon size={18} />
            </a>
          ))}
        </div>

        {/* 版权信息区 */}
        <div className="border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            © {new Date().getFullYear()} 木子博客。All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            京 ICP 备 XXXXXXXX 号
          </p>
        </div>
      </div>
    </footer>
  );
}
