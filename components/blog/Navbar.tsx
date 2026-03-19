"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Moon, Sun } from "lucide-react";
import { siteConfig, type NavItem } from "@/lib/config";
import { useDarkMode } from "@/lib/use-dark-mode";
import { useScrollY } from "@/lib/use-scroll-y";
import { useActiveNavTab } from "@/lib/use-active-nav-tab";
import me from "../../public/me.jpg";
import { NavTabs } from "@/components/blog/NavTabs";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // 受控显隐的导航项，数据来自配置文件
  const headerTabs = React.useMemo(() => siteConfig.navigation.items, []);
  const derivedActiveTab = useActiveNavTab(pathname, headerTabs);
  const [activeTab, setActiveTab] = useState(derivedActiveTab);

  const handleTabClick = (tab: NavItem) => {
    // 提前更新高亮，提升点击反馈；路由切换后 derivedActiveTab 会保持一致
    setActiveTab(tab.title);
    router.push(tab.path);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollY = useScrollY();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
            <NavTabs tabs={headerTabs} activeTitle={activeTab || derivedActiveTab} onTabClick={handleTabClick} />
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
                const isActive = (activeTab || derivedActiveTab) === tab.title;
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
