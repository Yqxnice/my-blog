/**
 * 功能：滚动位置钩子
 * 目的：提供滚动位置的监听和状态管理
 * 作者：Yqxnice
 */
import { useEffect, useState } from "react";

export function useScrollY() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
}

