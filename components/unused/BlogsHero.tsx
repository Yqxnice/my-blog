"use client";

import { useEffect, useMemo, useState } from "react";
import me from "@/public/me.jpg";
import { siteConfig } from "@/lib/config";

export function BlogsHero() {
  const titleText = "木子博客";
  const subtitleText = "Code. Create. Care.";

  const subtitleWords = useMemo(() => subtitleText.split(" "), [subtitleText]);

  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  // 序列动画：标题 → 子标题 → 社交
  useEffect(() => {
    const t1 = window.setTimeout(() => setIsTitleVisible(true), 0);
    const t2 = window.setTimeout(() => {
      setSubtitleVisible(true);
      window.setTimeout(() => setContactVisible(true), subtitleWords.length * 300);
    }, 300);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [subtitleWords.length]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-0 py-12">
      {/* 左侧：标题 + 子标题 + 社交 */}
      <div className="flex-1">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-4">
            <div className="relative min-h-[120px] md:min-h-[150px] lg:min-h-[180px] flex items-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                {isTitleVisible &&
                  titleText.split("").map((char, index) => (
                    <span
                      key={index}
                      style={{
                        opacity: 0,
                        transform: "translateY(40px)",
                        animation: `slideUp 0.8s ease-out ${index * 0.15}s forwards`,
                      }}
                    >
                      {char}
                    </span>
                  ))}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2 items-center min-h-[40px] md:min-h-[50px]">
              {subtitleVisible &&
                subtitleWords.map((word, index) => (
                  <h2
                    key={index}
                    className="text-xl md:text-2xl text-muted-foreground"
                    style={{
                      opacity: 0,
                      transform: "translateY(20px)",
                      animation: `slideUp 0.5s ease-out ${index * 0.2}s forwards`,
                    }}
                  >
                    {word}
                  </h2>
                ))}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex gap-4 min-h-[40px]">
              {contactVisible &&
                siteConfig.socialLinks.map((social, index) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                    aria-label={social.name}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{
                      opacity: 0,
                      transform: "translateY(20px)",
                      animation: `slideUp 0.5s ease-out ${index * 0.15}s forwards`,
                    }}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* 右侧：大头像 */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full shadow-2xl overflow-hidden">
            <a href="#" className="block">
              <img
                src={me.src}
                alt="用户头像"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

