"use client";
import React, { useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Moon, Sun } from "lucide-react";
import { siteConfig, type NavItem } from "@/lib/config";
import me from "../../public/me.jpg";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem("darkMode");
    if (stored === "true") return true;
    if (stored === "false") return false;
    return document.documentElement.classList.contains("dark");
  });

  // 受控显隐的导航项，数据来自配置文件
  const headerTabs = React.useMemo(() => siteConfig.navigation.items, []);
  // 管理当前激活的标签
  const [activeTab, setActiveTab] = useState("首页");
  // 将下划线样式提前声明，避免 useEffect 先访问未定义的状态
  const [underlineStyle, setUnderlineStyle] = useState({ left: "0%", width: "0%" });

  // 监听路由变化，更新激活标签
  useEffect(() => {
    // 找到匹配的标签，优先精确匹配，再匹配父路径
    let matchedTab = headerTabs.find((tab) => pathname === tab.path);

    // 如果没有精确匹配，尝试匹配父路径
    if (!matchedTab) {
      matchedTab = headerTabs.find((tab) => {
        // 匹配博客页面
        if (tab.path === "/blogs" && pathname.startsWith("/blogs/")) {
          return true;
        }
        return false;
      });
    }

    if (matchedTab) {
      // 只在标签实际变化时更新状态
      if (matchedTab.title !== activeTab) {
        setTimeout(() => setActiveTab(matchedTab.title), 0);
      }
    }
  }, [pathname, headerTabs, activeTab]);

  // 更新激活下划线的位置和宽度
  useLayoutEffect(() => {
    const activeIndex = headerTabs.findIndex((tab) => tab.title === activeTab);
    const activeTabElement = tabRefs.current[activeIndex];
    
    if (activeTabElement) {
      const navElement = activeTabElement.parentElement;
      if (navElement) {
        const navRect = navElement.getBoundingClientRect();
        const tabRect = activeTabElement.getBoundingClientRect();
        
        // 获取tab元素的实际padding值
        const computedStyle = window.getComputedStyle(activeTabElement);
        const paddingLeft = parseFloat(computedStyle.paddingLeft);
        const paddingRight = parseFloat(computedStyle.paddingRight);
        
        // 计算padding总和
        const paddingTotal = paddingLeft + paddingRight;
        
        // 计算调整后的宽度（减去padding）
        const adjustedTabWidth = tabRect.width - paddingTotal;
        
        // 计算调整后的左侧位置（加上左侧padding）
        const adjustedLeft = tabRect.left - navRect.left + paddingLeft;
        
        const left = (adjustedLeft / navRect.width) * 100;
        const width = (adjustedTabWidth / navRect.width) * 100;
        setUnderlineStyle({ left: `${left}%`, width: `${width}%` });
      }
    }
  }, [activeTab, headerTabs]);

  // 切换深色模式
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    // 更新DOM
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // 保存到localStorage
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  const handleTabClick = (tab: NavItem) => {
    // 先跳转路由，让useEffect处理状态更新
    router.push(tab.path);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const tabRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 计算导航栏透明度
  const getNavbarOpacity = () => {
    // 当滚动超过100px后开始逐渐消失
    if (scrollY < 100) {
      return 1;
    } else if (scrollY < 200) {
      // 100px到200px之间逐渐透明
      return 1 - (scrollY - 100) / 100;
    } else {
      return 0;
    }
  };

  return (
    <>
      {/* 导航栏占位符 */}
      <div className="h-[70px]"></div>

      {/* 导航栏 */}
      <header
        className="flex items-center px-4 md:px-0 py-4 h-[70px] w-full box-border bg-background fixed top-0 left-0 right-0 z-50 transition-opacity duration-300"
        style={{ opacity: getNavbarOpacity() }}
      >
        <div className="hidden md:flex w-full max-w-[1200px] mx-auto items-center px-4 md:px-6 lg:px-8">
          {/* 左侧：头像 */}
          <div className="flex-1 flex items-center">
            <img
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=b6e3f4"
              alt="User Avatar"
              className="w-[42px] h-[42px] rounded-full object-cover shadow-sm"
            />
          </div>

          {/* 中间：胶囊导航菜单 */}
          <div className="flex flex-2/3 justify-center">
            <nav className="flex items-center justify-center bg-background/80 backdrop-blur-sm border border-border/50 rounded-full px-8 h-[52px] shadow-md relative transition-all duration-300 hover:shadow-lg min-w-[400px] md:min-w-[500px] lg:min-w-[600px]">
              {/* 移动的激活指示器 */}
              <span
                className="absolute bottom-2 h-[3px] bg-primary rounded-full transition-all duration-500 ease-in-out"
                style={{
                  left: underlineStyle.left,
                  width: underlineStyle.width,
                  transform: "none",
                }}
              />
              {headerTabs.map((tab, index) => {
                const isActive = activeTab === tab.title;
                const Icon = tab.icon;
                return (
                    <Link
                      key={tab.title}
                      href={tab.path}
                      ref={(el) => { tabRefs.current[index] = el; }}
                      className={`text-sm font-medium flex items-center justify-center h-full relative transition-all duration-300 ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                      style={{ padding: "0 24px", flex: "0 0 auto" }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabClick(tab);
                      }}
                    >
                    {isActive && Icon && (
                      <span className="mr-2 transition-all duration-300 opacity-100 scale-100 w-5" style={{ flexShrink: 0 }}>
                        <Icon size={18} className="transition-all duration-300 text-primary" />
                      </span>
                    )}
                    <span className="transition-all duration-300">
                      {tab.title}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* 右侧：圆形图标按钮 */}
          <div className="flex-1 flex justify-end gap-3">
            <button
              className="w-[42px] h-[42px] rounded-full border border-border/50 bg-background/80 backdrop-blur-sm flex items-center justify-center cursor-pointer text-foreground transition-all duration-500 hover:bg-muted hover:border-border shadow-sm hover:scale-110 hover:rotate-12 active:scale-95 relative overflow-hidden"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "切换到浅色模式" : "切换到深色模式"}
            >
              <span className="relative z-10 transition-all duration-500 transform">
                {isDarkMode ? <Sun size={20} className="hover:rotate-90" /> : <Moon size={20} className="hover:-rotate-12" />}
              </span>
              <span className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </button>
            <button
              className="w-[42px] h-[42px] rounded-full border border-border/50 bg-background/80 backdrop-blur-sm flex items-center justify-center cursor-pointer text-foreground transition-all duration-300 hover:bg-muted hover:border-border shadow-sm"
              aria-label="用户中心"
            >
              <img
                src={me.src}
                alt="用户头像"
                className="w-full h-full rounded-full object-cover"
              />
            </button>
          </div>
        </div>

        {/* 移动端导航 */}
        <div className="md:hidden flex items-center justify-between w-full">
          {/* 左侧：菜单按钮 */}
          <button
            className="w-[38px] h-[38px] flex items-center justify-center transition-all duration-300 hover:bg-gray-100 rounded-full"
            onClick={toggleMobileMenu}
            aria-label="菜单"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={24} />
          </button>

          {/* 中间：网址logo */}
          <div className="flex-1 flex justify-center">
            <span className="text-lg font-bold text-primary">My Blog</span>
          </div>

          {/* 右侧：深色模式切换和用户图标 */}
          <div className="flex gap-2">
            <button
              className="w-[38px] h-[38px] flex items-center justify-center transition-all duration-500 hover:bg-muted rounded-full hover:scale-110 hover:rotate-12 active:scale-95 relative overflow-hidden"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "切换到浅色模式" : "切换到深色模式"}
            >
              <span className="relative z-10 transition-all duration-500 transform">
                {isDarkMode ? <Sun size={18} className="hover:rotate-90" /> : <Moon size={18} className="hover:-rotate-12" />}
              </span>
            </button>
            <button
              className="w-[38px] h-[38px] flex items-center justify-center transition-all duration-500 hover:bg-muted rounded-full hover:scale-110 active:scale-95"
              aria-label="用户中心"
            >
              <img
                src={me.src}
                alt="用户头像"
                className="w-full h-full rounded-full object-cover"
              />
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-[70px] left-0 right-0 bg-background border-t border-border shadow-md z-50">
            <div className="flex flex-col py-2">
              {headerTabs.map((tab) => {
                const isActive = activeTab === tab.title;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.title}
                    onClick={() => {
                      handleTabClick(tab);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-6 py-3 text-left ${isActive ? "text-primary" : "text-foreground hover:bg-muted"}`}
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
      </header>
    </>
  );
}
