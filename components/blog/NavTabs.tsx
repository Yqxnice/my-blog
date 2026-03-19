"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import type { NavItem } from "@/lib/config";

export function NavTabs({
  tabs,
  activeTitle,
  onTabClick,
}: {
  tabs: NavItem[];
  activeTitle: string;
  onTabClick: (tab: NavItem) => void;
}) {
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({ left: "0%", width: "0%" });

  useLayoutEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.title === activeTitle);
    const activeTabElement = tabRefs.current[activeIndex];

    if (!activeTabElement) return;

    const navElement = activeTabElement.parentElement;
    if (!navElement) return;

    const navRect = navElement.getBoundingClientRect();
    const tabRect = activeTabElement.getBoundingClientRect();

    const computedStyle = window.getComputedStyle(activeTabElement);
    const paddingLeft = parseFloat(computedStyle.paddingLeft);
    const paddingRight = parseFloat(computedStyle.paddingRight);

    const adjustedTabWidth = tabRect.width - (paddingLeft + paddingRight);
    const adjustedLeft = tabRect.left - navRect.left + paddingLeft;

    const left = (adjustedLeft / navRect.width) * 100;
    const width = (adjustedTabWidth / navRect.width) * 100;
    setUnderlineStyle({ left: `${left}%`, width: `${width}%` });
  }, [activeTitle, tabs]);

  return (
    <nav className="flex items-center justify-center bg-background/80 backdrop-blur-sm border border-border/50 rounded-full px-8 h-[52px] shadow-md relative transition-all duration-300 hover:shadow-lg min-w-[400px] md:min-w-[500px] lg:min-w-[600px]">
      <span
        className="absolute bottom-2 h-[3px] bg-primary rounded-full transition-all duration-500 ease-in-out"
        style={{
          left: underlineStyle.left,
          width: underlineStyle.width,
          transform: "none",
        }}
      />

      {tabs.map((tab, index) => {
        const isActive = activeTitle === tab.title;
        const Icon = tab.icon;

        return (
          <Link
            key={tab.title}
            href={tab.path}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            className={`text-sm font-medium flex items-center justify-center h-full relative transition-all duration-300 ${
              isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
            style={{ padding: "0 24px", flex: "0 0 auto" }}
            onClick={(e) => {
              e.preventDefault();
              onTabClick(tab);
            }}
          >
            {isActive && Icon && (
              <span className="mr-2 transition-all duration-300 opacity-100 scale-100 w-5" style={{ flexShrink: 0 }}>
                <Icon size={18} className="transition-all duration-300 text-primary" />
              </span>
            )}
            <span className="transition-all duration-300">{tab.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

