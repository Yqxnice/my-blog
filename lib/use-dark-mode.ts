import { useEffect, useState } from "react";

/**
 * 统一管理深色模式状态的 Hook
 * - 读取 localStorage 中的用户偏好
 * - 回退到系统 prefers-color-scheme
 * - 同步 <html> 的 dark class
 */
export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 初始化主题（只在客户端运行）
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedDarkMode = window.localStorage.getItem("darkMode");
    let enabled = false;

    if (savedDarkMode === "true") {
      enabled = true;
    } else if (savedDarkMode === "false") {
      enabled = false;
    } else {
      // 没有显式设置时，根据系统偏好决定
      enabled = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    setIsDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;

      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      window.localStorage.setItem("darkMode", next.toString());
      return next;
    });
  };

  return { isDarkMode, toggleDarkMode };
}

