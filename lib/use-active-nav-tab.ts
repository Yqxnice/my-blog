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

