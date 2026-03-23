'use client';

import { useState, useEffect, useCallback } from "react";
import holidaysData from '@/data/chinese-holidays.json';

// 类型定义
interface Hitokoto { hitokoto: string; from: string; from_who: string | null }

interface Holiday {
  name: string;
  date: string;
  type: string;
  description: string;
}

// 常量
const HITOKOTO_TYPES = [
  { key: 'a', label: '动画' }, { key: 'b', label: '漫画' },
  { key: 'c', label: '游戏' }, { key: 'd', label: '文学' },
  { key: 'i', label: '诗词' }, { key: 'k', label: '哲理' },
];

// 从JSON文件加载节日数据并转换为Date对象
const HOLIDAYS = holidaysData.holidays.map((holiday: Holiday) => ({
  name: holiday.name,
  date: new Date(holiday.date),
  type: holiday.type,
  description: holiday.description,
}));

const PALETTE_SEEDS = ['forest','ocean','sunset','candy','neon','earth','aurora','dusk','lavender','mint'];

// 辅助函数
function genPalette(seed: string): string[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = seed.charCodeAt(i) + ((h << 5) - h);
  return Array.from({ length: 8 }, (_, i) => {
    const hue = (((h * (i + 1) * 73) % 360) + 360) % 360;
    return `hsl(${hue},${42 + ((h * (i + 3)) % 36)}%,${50 + ((h * (i + 7)) % 20)}%)`;
  });
}

function toHex(hsl: string): string {
  const m = hsl.match(/hsl\((\d+),(\d+)%,(\d+)%\)/);
  if (!m) return hsl;
  const [hh, s, l] = [+m[1] / 360, +m[2] / 100, +m[3] / 100];
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => { const k = (n + hh * 12) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, '0'); };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function nextHoliday() {
  const now = new Date();
  const up = HOLIDAYS.filter(h => h.date > now).sort((a, b) => a.date.getTime() - b.date.getTime());
  if (!up.length) return null;
  const days = Math.ceil((up[0].date.getTime() - now.getTime()) / 86400000);
  const dow = now.getDay();
  return { name: up[0].name, days, weekend: (dow === 0 || dow === 6) ? 0 : 6 - dow };
}

// 图标组件
const IRefresh = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M13.5 8A5.5 5.5 0 1 1 8 2.5c1.8 0 3.4.87 4.4 2.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M12 2v3h-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ICopy = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/><path d="M3 11V3h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;

// FunZone组件
export function FunZone() {
  const [quote, setQuote] = useState<Hitokoto | null>(null);
  const [fading, setFading] = useState(false);
  const [spinning, setSpin] = useState(false);
  const [qtype, setQtype] = useState('d');
  const [clipCopied, setClipCopied] = useState(false);

  // 加载一言的函数
  const loadQuote = useCallback(async (type: string) => {
    setFading(true);
    setSpin(true);
    
    // 使用setTimeout来延迟setState，避免级联渲染
    setTimeout(async () => {
      try {
        const res = await fetch(`https://v1.hitokoto.cn/?c=${type}`);
        const data = await res.json();
        setQuote(data);
      } catch {
        setQuote({ hitokoto: '纸上得来终觉浅，绝知此事要躬行。', from: '冬夜读书示子聿', from_who: '陆游' });
      }
      setFading(false);
      setTimeout(() => setSpin(false), 500);
    }, 220);
  }, []);
  
  // 初始化加载一言 - 只在组件挂载时运行一次
  useEffect(() => {
    loadQuote(qtype);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空依赖数组，只在挂载时运行

  // 复制到剪贴板
  const copyQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!quote) return;
    const text = `「${quote.hitokoto}」—— ${quote.from_who ? quote.from_who + '《' + quote.from + '》' : quote.from}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setClipCopied(true); setTimeout(() => setClipCopied(false), 1800);
  };

  // 使用状态来存储下一个假期信息，避免 hydration mismatch
  const [nextHolidayInfo, setNextHolidayInfo] = useState(() => {
    // 服务器端返回一个默认值
    return { name: '劳动节', days: 99, weekend: 0 };
  });
  
  // 只在客户端计算真实的假期信息
  useEffect(() => {
    setNextHolidayInfo(nextHoliday() || { name: '劳动节', days: 99, weekend: 0 });
  }, []);
  const [palCopied, setPalCopied] = useState<string | null>(null);
  
  // 在客户端使用随机值 - 使用惰性初始化避免useEffect
  // 注意：必须确保服务器端和客户端的初始值一致，否则会导致 hydration mismatch
  const [pidx, setPidx] = useState(0);

  // 只在客户端挂载后设置随机值
  useEffect(() => {
    setPidx(Math.floor(Math.random() * PALETTE_SEEDS.length));
  }, []);
  
  const seed = PALETTE_SEEDS[pidx];
  const colors = genPalette(seed);

  const doCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setPalCopied(label); setTimeout(() => setPalCopied(null), 1600);
  };

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 lg:px-8 py-8">
      {/* 一言 */}
      <div className="mb-8">
        <div className="relative pb-4">
          <div className="absolute top-0 left-0 font-serif text-6xl text-primary opacity-10 pointer-events-none">&quot;
          </div>
          {!quote
            ? <div className="pl-6 pt-4 text-sm text-muted-foreground font-light italic animate-pulse">思考中…</div>
            : <div className={`pl-6 pt-4 font-serif text-lg md:text-xl font-normal italic leading-relaxed text-foreground transition-opacity duration-200 ${fading ? 'opacity-0' : 'opacity-100'} cursor-pointer`} onClick={() => loadQuote(qtype)}>
                {quote.hitokoto}
              </div>
          }
          <div className="mt-3 flex flex-wrap items-center justify-between pl-6 gap-3">
            <span className="text-xs text-muted-foreground font-light">
              {quote?.from_who ? `${quote.from_who} · ` : ''}{quote?.from ?? ''}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex gap-1 flex-wrap">
                {HITOKOTO_TYPES.map(t => (
                  <span 
                    key={t.key} 
                    className={`text-xs text-muted-foreground px-2 py-0.5 rounded cursor-pointer transition-all duration-150 hover:border hover:border-border hover:text-foreground ${qtype === t.key ? 'text-primary border border-primary' : ''}`}
                    onClick={e => { e.stopPropagation(); setQtype(t.key); loadQuote(t.key); }}
                  >
                    {t.label}
                  </span>
                ))}
              </div>
              {/* 复制按钮和刷新按钮 */}
              <div className="flex gap-1">
                <button 
                  className={`flex items-center gap-1 text-xs text-muted-foreground px-2 py-0.5 border border-border rounded transition-all duration-150 hover:border-primary hover:text-primary ${clipCopied ? 'bg-primary text-white border-primary' : ''}`} 
                  onClick={copyQuote}
                >
                  <ICopy /> {clipCopied ? '已复制' : '复制'}
                </button>
                <button 
                  className={`flex items-center justify-center w-6 h-6 text-muted-foreground border border-border rounded transition-all duration-150 hover:border-primary hover:text-primary ${spinning ? 'animate-spin' : ''}`}
                  onClick={e => { e.stopPropagation(); loadQuote(qtype); }}
                >
                  <IRefresh />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 摸鱼 + 调色板 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-4">
          <div className="text-xs font-medium text-muted-foreground tracking-wider uppercase mb-3">摸鱼倒计时</div>
          {nextHolidayInfo && (
            <>
              <div className="font-serif text-lg md:text-xl text-foreground mb-2">
                距离 {nextHolidayInfo.name} 还有 <strong className="text-primary text-2xl md:text-3xl font-bold">{nextHolidayInfo.days}</strong> 天
              </div>
              <div className="text-sm text-muted-foreground font-light">
                {nextHolidayInfo.weekend === 0 ? '🎉 今天是周末，好好休息！'
                  : nextHolidayInfo.weekend === 1 ? '明天就是周末了，快撑住！'
                  : `距离周末还有 ${nextHolidayInfo.weekend} 天，加油打工人`}
              </div>
            </>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-muted-foreground tracking-wider uppercase">随机调色板</div>
            <div className="flex gap-1">
              <button 
                className="flex items-center justify-center w-6 h-6 text-muted-foreground border border-border rounded transition-all duration-150 hover:border-primary hover:text-primary"
                onClick={() => setPidx(i => (i + 1) % PALETTE_SEEDS.length)}
              >
                <IRefresh />
              </button>
              <button 
                className="flex items-center justify-center w-6 h-6 text-muted-foreground border border-border rounded transition-all duration-150 hover:border-primary hover:text-primary"
                onClick={() => doCopy(colors.map(toHex).join(', '), '全部')}
              >
                <ICopy />
              </button>
            </div>
          </div>
          <div className="flex h-9 rounded overflow-hidden gap-1 mb-3">
            {colors.map((c, i) => (
              <div 
                key={i} 
                className="flex-1 cursor-pointer transition-all duration-300 hover:flex-2 hover:brightness-105 relative"
                style={{ background: c }}
                onClick={() => doCopy(toHex(c), toHex(c))}
              >
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-foreground text-background text-xs px-2 py-0.5 rounded whitespace-nowrap opacity-0 transition-opacity duration-150 hover:opacity-100">
                  {toHex(c)}
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground font-light">
            {palCopied ? <span className="text-primary">✓ 已复制 {palCopied}</span>
              : <span>{seed} · 点色块复制 HEX</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
