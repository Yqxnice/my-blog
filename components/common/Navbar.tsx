/**
 * 功能：导航栏组件
 * 目的：提供网站的导航功能，包括桌面端和移动端菜单
 * 作者：Yqxnice
 */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

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

  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const loginMenuRef = useRef<HTMLDivElement>(null);

  // 受控显隐的导航项，数据来自配置文件
  const headerTabs = React.useMemo(() => siteConfig.navigation.items, []);
  const derivedActiveTab = useActiveNavTab(pathname, headerTabs);
  const [activeTab, setActiveTab] = useState<string | undefined>();

  const handleTabClick = (tab: NavItem) => {
    // 提前更新高亮，提升点击反馈；路由切换后 derivedActiveTab 会保持一致
    setActiveTab(tab.title);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // 导航到目标路径
    router.push(tab.path);
  };

  // 在客户端挂载后再设置 activeTab，避免 hydration mismatch
  useEffect(() => {
    setActiveTab(derivedActiveTab);
  }, [derivedActiveTab]);

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
      const mobileMenu = document.querySelector('[class*="md:hidden"]');
      
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

  // Escape key handling for mobile menu
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleMobileMenu();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  // 点击外部关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (loginMenuRef.current && !loginMenuRef.current.contains(event.target as Node)) {
        setShowLoginMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignIn = (provider: 'github' | 'google') => {
    signIn(provider);
    setShowLoginMenu(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    setShowUserMenu(false);
  };

  return (
    <> 
      {/* 导航栏 */}
      <nav aria-label="主导航" role="navigation" className="sticky top-0 z-100 bg-background/90 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-6 lg:px-8 h-14 transition-all duration-300" style={{
        opacity: Math.max(1 - scrolled / 300, 0),
        pointerEvents: scrolled > 300 ? 'none' : 'auto'
      }}>
        {/* 左侧：Logo和头像 */}
        <Link href="/" className="flex items-center gap-2 font-serif text-lg font-bold">
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

        {/* 右侧：登录按钮/用户头像 + 移动端菜单按钮 */}
        <div className="flex items-center gap-2">
          {/* 登录状态 */}
          {status === 'loading' ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : session?.user ? (
            // 已登录：显示用户头像
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                aria-label="用户菜单"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || '用户头像'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                    {session.user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </button>
              
              {/* 用户下拉菜单 */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground truncate">{session.user.name}</p>
                    {session.user.email && (
                      <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                    )}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            // 未登录：显示登录按钮
            <div className="relative" ref={loginMenuRef}>
              <button
                onClick={() => setShowLoginMenu(!showLoginMenu)}
                className="w-8 h-8 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                aria-label="登录"
              >
                <LogIn size={18} />
              </button>
              
              {/* 登录下拉菜单 */}
              {showLoginMenu && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                  <button
                    onClick={() => handleSignIn('github')}
                    className="w-full px-4 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub 登录
                  </button>
                  <button
                    onClick={() => handleSignIn('google')}
                    className="w-full px-4 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google 登录
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* 移动端菜单按钮 */}
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

      {/* 褪色遮罩层，为移动端菜单提供清晰聚焦区域 */}
      {(mobileMenuOpen || menuAnimating) && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={toggleMobileMenu} aria-hidden="true" />
      )}

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
