/**
 * 功能：活动导航标签钩子
 * 目的：根据当前路径确定活动的导航标签
 * 作者：Yqxnice
 */
import { useMemo } from "react";
import type { NavItem } from "@/lib/config";

export function useActiveNavTab(pathname: string, tabs: NavItem[]) {
  return useMemo(() => {
    // 优先精确匹配
    const exact = tabs.find((tab) => pathname === tab.path);
    if (exact) return exact.title;

    // 兼容子路由映射到父 Tab（例如 /blogs/[id] → /blogs）
    const parent = tabs.find((tab) => tab.path === "/blogs" && pathname.startsWith("/blogs/"));
    if (parent) return parent.title;

    return tabs[0]?.title ?? "";
  }, [pathname, tabs]);
}

