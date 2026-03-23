/**
 * 功能：深色模式管理钩子
 * 目的：提供深色模式的状态管理和切换功能
 * 作者：Yqxnice
 */
import { useState } from "react";

/**
 * 统一管理深色模式状态的 Hook
 * - 读取 localStorage 中的用户偏好
 * - 回退到系统 prefers-color-scheme
 * - 同步 <html> 的 dark class
 */
export function useDarkMode() {
  // 使用惰性初始化，避免在useEffect中直接调用setState
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    
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
    
    // 同步HTML class
    if (enabled) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    return enabled;
  });

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

