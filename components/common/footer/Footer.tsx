/**
 * 功能：页脚组件
 * 目的：显示网站的页脚信息，包括节气、地图、博客运行时间等
 * 作者：Yqxnice
 */
"use client";
import { useState, useEffect } from "react";
import './footer.css';
import { siteConfig } from '@/lib/config';

// ── Config ─────────────────────────────────────────────────────
const BLOG_FOUNDED = new Date("2020-03-01T00:00:00+08:00");
const BLOGGER_CITY = "北京";
const BLOGGER_TZ = "Asia/Shanghai";
// Beijing in SVG map space: x = lon+180, y = 90-lat  (viewBox 0 0 360 180)
const CITY_X = 296; // 116°E + 180
const CITY_Y = 50;  // 90 - 40°N



// ── Solar terms (节气) ─────────────────────────────────────────
const SOLAR_TERMS: [number, string][] = [
  [104,"小寒"],[120,"大寒"],
  [204,"立春"],[219,"雨水"],
  [306,"惊蛰"],[320,"春分"],
  [405,"清明"],[420,"谷雨"],
  [506,"立夏"],[521,"小满"],
  [606,"芒种"],[621,"夏至"],
  [707,"小暑"],[723,"大暑"],
  [807,"立秋"],[823,"处暑"],
  [908,"白露"],[923,"秋分"],
  [1008,"寒露"],[1023,"霜降"],
  [1107,"立冬"],[1122,"小雪"],
  [1207,"大雪"],[1222,"冬至"],
];

function getCurrentTerm(month: number, day: number): string {
  const md = month * 100 + day;
  let result = "冬至";
  for (const [start, name] of SOLAR_TERMS) {
    if (md >= start) result = name;
    else break;
  }
  return result;
}

interface SeasonTheme {
  name: string;
  bg: string;
  accent: string;
  borderTop: string;
  divider: string;
  desc: string;
}

function getSeason(month: number, day: number): SeasonTheme {
  const md = month * 100 + day;
  if (md >= 204 && md < 506) return {
    name: "春",
    bg: "linear-gradient(170deg, #edf5eb 0%, #f5f3ee 50%, #f1f5ef 100%)",
    accent: "#7aaa68",
    borderTop: "#cddfc8",
    divider: "#d8e5d5",
    desc: "草木萌发",
  };
  if (md >= 506 && md < 807) return {
    name: "夏",
    bg: "linear-gradient(170deg, #f4f0e5 0%, #f7f5ee 50%, #f2eed8 100%)",
    accent: "#c0983a",
    borderTop: "#e0d4a0",
    divider: "#e5ddb8",
    desc: "烈阳蝉鸣",
  };
  if (md >= 807 && md < 1107) return {
    name: "秋",
    bg: "linear-gradient(170deg, #f5ece0 0%, #f5f0ea 50%, #f0e4d2 100%)",
    accent: "#b07040",
    borderTop: "#dfc0a0",
    divider: "#e5cbb0",
    desc: "金叶飘落",
  };
  return {
    name: "冬",
    bg: "linear-gradient(170deg, #edf0f7 0%, #f2f2f6 50%, #e4e8f4 100%)",
    accent: "#7080b0",
    borderTop: "#c0cce0",
    divider: "#ccd4e8",
    desc: "霜寒玉洁",
  };
}

// ── Component ──────────────────────────────────────────────────
export function Footer() {
  const [now, setNow] = useState(new Date());
  const [localTime, setLocalTime] = useState("--:--:--");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // local time (client only to avoid SSR mismatch)
  useEffect(() => {
    const update = () => {
      const t = new Date().toLocaleTimeString("zh-CN", {
        timeZone: BLOGGER_TZ, hour12: false,
        hour: "2-digit", minute: "2-digit", second: "2-digit"
      });
      setLocalTime(t);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const month = now.getMonth() + 1;
  const day   = now.getDate();
  const season = getSeason(month, day);
  const term   = getCurrentTerm(month, day);

  // ── Blog age ──
  const elapsed  = now.getTime() - BLOG_FOUNDED.getTime();
  const totalSec = Math.floor(elapsed / 1000);
  const ss       = totalSec % 60;
  const totalMin = Math.floor(totalSec / 60);
  const mm       = totalMin % 60;
  const totalHr  = Math.floor(totalMin / 60);
  const hh       = totalHr % 24;
  const totalDays = Math.floor(totalHr / 24);
  const years    = Math.floor(totalDays / 365);
  const remDays  = totalDays % 365;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <footer 
      className="ft" 
      style={{ 
        background: season.bg,
        '--season-border-top': season.borderTop,
        '--season-accent': season.accent,
        '--season-divider': season.divider,
      } as React.CSSProperties}
    >
      <div className="ft-wrap">

        {/* ── 顶部 meta：节气 + 地图 + 年龄 ── */}
        <div className="ft-meta">

          {/* 左：节气 */}
          <div className="ft-season">
            <span className="ft-season-badge">
              <span className="ft-season-dot" />
              二十四节气
            </span>
            <span className="ft-season-name">{season.name} · {term}</span>
            <span className="ft-season-desc">{season.desc}</span>
          </div>

          {/* 中：世界地图 */}
          <div className="ft-map-wrap">
            <svg
              className="ft-map"
              viewBox="0 0 360 180"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 大洲轮廓 */}
              {/* 北美洲 */}
              <path className="continent" d="M 22,28 L 55,10 L 95,8 L 122,22 L 125,38 L 115,52 L 100,65 L 90,74 L 72,68 L 62,57 L 55,44 L 38,34 Z" />
              {/* 南美洲 */}
              <path className="continent" d="M 100,80 L 118,75 L 148,92 L 150,110 L 136,120 L 125,130 L 112,148 L 104,138 L 98,118 L 97,92 Z" />
              {/* 欧洲 */}
              <path className="continent" d="M 170,53 L 174,44 L 177,35 L 180,27 L 196,20 L 212,18 L 238,22 L 240,36 L 228,42 L 210,47 L 205,53 L 192,54 L 182,49 L 173,50 Z" />
              {/* 非洲 */}
              <path className="continent" d="M 163,55 L 190,52 L 210,54 L 232,57 L 232,79 L 220,98 L 213,115 L 203,130 L 194,130 L 183,110 L 165,88 L 162,70 Z" />
              {/* 亚洲 */}
              <path className="continent" d="M 210,47 L 238,22 L 272,12 L 322,16 L 352,28 L 345,36 L 328,44 L 312,48 L 308,58 L 295,65 L 285,78 L 280,88 L 268,78 L 260,68 L 248,68 L 242,62 L 228,72 L 220,68 L 214,58 L 210,47 Z" />
              {/* 印度半岛 */}
              <path className="continent" d="M 248,68 L 268,60 L 270,78 L 260,88 L 252,82 L 248,72 Z" />
              {/* 澳大利亚 */}
              <path className="continent" d="M 294,112 L 312,102 L 326,107 L 332,117 L 330,125 L 322,130 L 310,128 L 296,124 Z" />
              {/* 日本（小岛） */}
              <path className="continent" d="M 318,48 L 322,50 L 318,58 L 312,56 L 312,52 Z" />

              {/* 城市标记：博主所在地（北京） */}
              <circle className="city-ring" cx={CITY_X} cy={CITY_Y} r="3" />
              <circle className="city-dot" cx={CITY_X} cy={CITY_Y} r="2.2" />
            </svg>

            <div className="ft-map-info">
              <span className="ft-map-city">{BLOGGER_CITY}</span>
              <div className="ft-map-sep" />
              <span className="ft-map-time" suppressHydrationWarning>{localTime}</span>
            </div>
          </div>

          {/* 右：博客年龄 */}
          <div className="ft-age">
            <span className="ft-age-label">本站已运行</span>
            <span className="ft-age-main">{years} 年 · {remDays} 天</span>
            <span className="ft-age-time" suppressHydrationWarning>
              {pad(hh)}:{pad(mm)}:{pad(ss)}
            </span>
            <span className="ft-age-sub">时 · 分 · 秒</span>
          </div>

        </div>

        <div className="ft-divider" />

        {/* ── 导航 + 社交图标 ── */}
        <div className="ft-row">
          <ul className="ft-nav">
            {siteConfig.navigation.items.map((item) => (
              <li key={item.path}><a href={item.path}>{item.title}</a></li>
            ))}
          </ul>
          <div className="ft-socials">
            {siteConfig.socialLinks.map((s) => {
              const Icon = s.icon;
              const isExternal = s.href.startsWith("http");
              return (
                <a
                  key={s.name}
                  href={s.href}
                  className="ft-icon"
                  aria-label={s.name}
                  title={s.name}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  <Icon size={14} />
                </a>
              );
            })}
          </div>
        </div>

        {/* ── 版权 ── */}
        <div className="ft-copy">
          <span>© 2026 木子博客。All rights reserved.</span>
          <div className="ft-copy-dot" />
          <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">
            京 ICP 备 XXXXXXXX 号
          </a>
        </div>

      </div>
    </footer>
  );
}