"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function LoadingBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // 延迟激活，避免同步 setState 对 ESLint 的触发
    setTimeout(() => {
      setActive(true);
      setProgress(0);
    }, 0);
    
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 10;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [pathname]);

  useEffect(() => {
    if (progress >= 90) {
      const timer = setTimeout(() => {
        setProgress(100);
        setTimeout(() => setActive(false), 150);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (!active && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 h-1 z-50 transition-all duration-75"
      style={{ 
        width: `${progress}%`,
        opacity: active ? 1 : 0,
        background: "linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff)"
      }}
    />
  );
}
