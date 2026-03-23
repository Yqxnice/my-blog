/**
 * 功能：导航栏组件
 * 目的：提供网站的导航功能，包括桌面端和移动端菜单
 * 作者：Yqxnice
 */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// 注入动画样式
let stylesInjected = false;
function injectStyles() {
  if (stylesInjected) return;
  const el = document.createElement('style');
  el.textContent = `
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes menuFadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes menuFadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-8px); }
    }
    .menu-enter {
      animation: menuFadeIn 0.25s ease-out forwards;
    }
    .menu-exit {
      animation: menuFadeOut 0.2s ease-in forwards;
    }
  `;
  document.head.appendChild(el);
  stylesInjected = true;
}

import { siteConfig, type NavItem } from "@/lib/config";
import { useActiveNavTab } from "@/lib/use-active-nav-tab";
import me from "../../public/me.jpg";

export function Navbar() {
  // 注入动画样式
  useEffect(() => {
    injectStyles();
  }, []);

  const router = useRouter();
  const pathname = usePathname();

  // 受控显隐的导航项，数据来自配置文件
  const headerTabs = React.useMemo(() => siteConfig.navigation.items, []);
  const derivedActiveTab = useActiveNavTab(pathname, headerTabs);
  const [activeTab, setActiveTab] = useState(derivedActiveTab);

  const handleTabClick = (tab: NavItem) => {
    // 提前更新高亮，提升点击反馈；路由切换后 derivedActiveTab 会保持一致
    setActiveTab(tab.title);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // 导航到目标路径
    router.push(tab.path);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuAnimating, setMenuAnimating] = useState(false);
  const [scrolled, setScrolled] = useState(0);

  const toggleMobileMenu = () => {
    if (menuAnimating) return;
    
    if (mobileMenuOpen) {
      setMenuAnimating(true);
      setTimeout(() => {
        setMobileMenuOpen(false);
        setMenuAnimating(false);
      }, 200);
    } else {
      setMobileMenuOpen(true);
    }
  };

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menuButton = document.querySelector('[aria-label="菜单"]');
      const mobileMenu = document.querySelector('.md\:hidden.absolute');
      
      if (menuButton && mobileMenu && !menuButton.contains(event.target as Node) && !mobileMenu.contains(event.target as Node)) {
        toggleMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // 阻止页面滚动
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, menuAnimating]);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* 导航栏 */}
      <nav className="sticky top-0 z-100 bg-background/90 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-6 lg:px-8 h-14 transition-all duration-300" style={{
        opacity: Math.max(1 - scrolled / 300, 0),
        pointerEvents: scrolled > 300 ? 'none' : 'auto'
      }}>
        {/* 左侧：Logo和头像 */}
        <Link href="/" className="flex items-center gap-2 font-serif text-lg font-bold">
          <div className="relative w-7 h-7">
            <Image
              src={me.src}
              alt="木子"
              fill
              className="rounded-full border border-border object-cover"
              priority={true}
              sizes="(max-width: 768px) 28px, 28px"
              quality={75}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/adventurer/svg?seed=Muzi&backgroundColor=f0ede8';
              }}
            />
          </div>
          木子<span className="text-primary">·</span>博客
        </Link>

        {/* 中间：导航链接 */}
        <ul className="hidden md:flex gap-6 list-none">
          {headerTabs.map((tab, index) => {
            const isActive = (activeTab || derivedActiveTab) === tab.title;
            return (
              <li key={tab.title} style={{ animation: `fadeUp .4s ease both`, animationDelay: `${index * 0.05}s` }}>
                <a
                  href={tab.path}
                  className={`text-sm text-muted-foreground hover:text-primary transition-colors relative ${isActive ? 'text-foreground font-medium' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick(tab);
                  }}
                  style={{
                    letterSpacing: '0.06em',
                    position: 'relative'
                  } as React.CSSProperties}
                >
                  {tab.title}
                  <span className={`absolute bottom-[-3px] left-0 h-[1.5px] transition-all duration-250 ${isActive ? 'w-full bg-foreground' : 'w-0 bg-accent hover:w-full'}`} />
                </a>
              </li>
            );
          })}
        </ul>

        {/* 右侧：移动端菜单按钮 */}
        <div className="flex items-center gap-2">
          <button
            className={`md:hidden w-9 h-9 flex items-center justify-center transition-all duration-300 hover:bg-muted rounded-full ${mobileMenuOpen ? 'bg-muted' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="菜单"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* 移动端菜单 */}
        {(mobileMenuOpen || menuAnimating) && (
          <div className={`md:hidden absolute top-14 left-0 right-0 bg-background border-t border-border shadow-md z-50 ${mobileMenuOpen ? 'menu-enter' : 'menu-exit'}`}>
            <div className="flex flex-col py-2">
              {headerTabs.map((tab, index) => {
                const isActive = (activeTab || derivedActiveTab) === tab.title;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.title}
                    onClick={() => {
                      handleTabClick(tab);
                      toggleMobileMenu();
                    }}
                    className={`px-6 py-3 text-left transition-all duration-200 ${isActive ? "text-primary bg-muted/50" : "text-foreground hover:bg-muted"}`}
                    style={{ animation: `fadeUp .4s ease both`, animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center">
                      {Icon ? <Icon size={18} className="mr-2" /> : null}
                      {tab.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
    </>
  );
}
