'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";

// ── 类型定义 ──────────────────────────────────────────────────────────────────
export type NoteType = 'idea' | 'bug' | 'excerpt' | 'question' | 'tool' | 'other';

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  readTime: string;
  views: number;
  comments: number;
  imageUrl: string;
  slug: string;
  tags: string[];
  status: 'published' | 'draft';
  wordCount: number;
  aiInvolvement?: string;
  noteType?: NoteType;
};

interface NotesClientComponentProps {
  posts: BlogPost[];
  tags: string[];
}

// ── 类型配置 ──────────────────────────────────────────────────────────────────
const NOTE_TYPES: Record<NoteType, {
  emoji: string; label: string;
  bg: string; border: string; color: string;
  darkBg: string; darkBorder: string; darkColor: string;
}> = {
  idea:     { emoji:'💡', label:'想法',   bg:'#fef9ec', border:'#f5c842', color:'#7a5c00', darkBg:'#2a2410', darkBorder:'#8a6c00', darkColor:'#f5c842' },
  bug:      { emoji:'🔧', label:'踩坑',   bg:'#fef0ee', border:'#f0a090', color:'#8c2b1a', darkBg:'#2a1410', darkBorder:'#8c3020', darkColor:'#f0a090' },
  excerpt:  { emoji:'📖', label:'摘录',   bg:'#edf4ff', border:'#90b8f0', color:'#1a3d7a', darkBg:'#101c2a', darkBorder:'#2a5090', darkColor:'#90b8f0' },
  question: { emoji:'❓', label:'待验证', bg:'#f2f0fc', border:'#b0a0e8', color:'#3d2a8c', darkBg:'#18102a', darkBorder:'#5040a0', darkColor:'#b0a0e8' },
  tool:     { emoji:'⚙️', label:'工具',   bg:'#eef6ee', border:'#90c890', color:'#1a5c1a', darkBg:'#101a10', darkBorder:'#2a6c2a', darkColor:'#90c890' },
  other:    { emoji:'📝', label:'其他',   bg:'var(--muted)', border:'var(--border)', color:'var(--muted-foreground)', darkBg:'var(--muted)', darkBorder:'var(--border)', darkColor:'var(--muted-foreground)' },
};

// ── 工具函数 ──────────────────────────────────────────────────────────────────
function groupByMonth(posts: BlogPost[]) {
  const map: Record<string, BlogPost[]> = {};
  posts.forEach(p => {
    const k = p.date.slice(0, 7);
    if (!map[k]) map[k] = [];
    map[k].push(p);
  });
  return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
}

function getYears(posts: BlogPost[]) {
  return [...new Set(posts.map(p => p.date.slice(0, 4)))].sort((a, b) => Number(b) - Number(a));
}

// ── 类型徽章 ──────────────────────────────────────────────────────────────────
function TypePill({ type }: { type?: NoteType }) {
  if (!type) return null;
  const t = NOTE_TYPES[type];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      fontSize: '11px', padding: '1px 6px', borderRadius: '3px',
      border: `1px solid ${t.border}`,
      background: t.bg, color: t.color,
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {t.emoji} {t.label}
    </span>
  );
}

// ── 弹窗 ──────────────────────────────────────────────────────────────────────
function NoteModal({ post, onClose }: { post: BlogPost | null; onClose: () => void }) {
  useEffect(() => {
    if (!post) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [post, onClose]);

  useEffect(() => {
    document.body.style.overflow = post ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [post]);

  if (!post) return null;

  return (
    <>
      <style>{`
        @keyframes nmOvIn { from{opacity:0} to{opacity:1} }
        @keyframes nmBxIn { from{opacity:0;transform:scale(0.94) translateY(-8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .nm-ov { animation:nmOvIn .22s ease both }
        .nm-bx { animation:nmBxIn .28s cubic-bezier(.16,1,.3,1) both }
        .nm-bx::-webkit-scrollbar{width:5px}
        .nm-bx::-webkit-scrollbar-track{background:transparent}
        .nm-bx::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
        .nm-cls:hover{background:var(--secondary)!important;color:var(--foreground)!important}
        .nm-lnk:hover{border-bottom-color:var(--primary)!important}
      `}</style>
      <div className="nm-ov" onClick={onClose} style={{
        position:'fixed',inset:0,background:'rgba(0,0,0,0.55)',
        zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',
      }}>
        <div className="nm-bx" onClick={e => e.stopPropagation()} style={{
          background:'var(--card)',border:'1px solid var(--border)',borderRadius:'6px',
          width:'100%',maxWidth:'600px',maxHeight:'82vh',overflowY:'auto',position:'relative',
        }}>
          <div style={{
            padding:'1.5rem 1.5rem 1rem',borderBottom:'1px solid var(--border)',
            position:'sticky',top:0,background:'var(--card)',zIndex:1,
          }}>
            <button className="nm-cls" onClick={onClose} aria-label="关闭" style={{
              position:'absolute',top:'1rem',right:'1rem',background:'none',
              border:'1px solid var(--border)',borderRadius:'4px',width:'28px',height:'28px',
              cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',
              color:'var(--muted-foreground)',fontSize:'14px',transition:'background .15s,color .15s',
            }}>✕</button>
            <div style={{ marginBottom:'10px' }}><TypePill type={post.noteType} /></div>
            <h2 style={{
              fontFamily:'var(--font-serif)',fontSize:'clamp(17px,2.5vw,22px)',fontWeight:700,
              color:'var(--foreground)',lineHeight:1.35,marginBottom:'10px',
            }}>{post.title}</h2>
            <div style={{ display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap' }}>
              <span style={{ fontSize:'12px',color:'var(--muted-foreground)' }}>{post.date}</span>
              <span style={{
                fontSize:'11px',color:'var(--muted-foreground)',background:'var(--muted)',
                padding:'1px 6px',borderRadius:'3px',fontFamily:'var(--font-mono)',
              }}>{post.readTime}</span>
              {post.tags.map((tag, i) => (
                <span key={i} style={{ fontSize:'11px',color:'var(--muted-foreground)' }}>
                  {i > 0 && <span style={{ marginRight:'6px',opacity:0.35 }}>·</span>}{tag}
                </span>
              ))}
            </div>
          </div>
          <div style={{ padding:'1.25rem 1.5rem 1.5rem' }}>
            {post.excerpt && (
              <div style={{
                fontSize:'13px',color:'var(--muted-foreground)',lineHeight:1.75,
                padding:'.9rem 1rem',borderLeft:'2px solid var(--primary)',
                background:'var(--muted)',borderRadius:'0 4px 4px 0',marginBottom:'1.25rem',
              }}>{post.excerpt}</div>
            )}
            {post.content
              ? <div style={{ fontSize:'14px',color:'var(--foreground)',lineHeight:1.85 }}
                  dangerouslySetInnerHTML={{ __html: post.content }} />
              : <p style={{ fontSize:'13px',color:'var(--muted-foreground)',fontStyle:'italic' }}>
                  点击下方链接阅读完整内容 →
                </p>
            }
          </div>
          <div style={{
            padding:'.875rem 1.5rem',borderTop:'1px solid var(--border)',
            display:'flex',justifyContent:'space-between',alignItems:'center',
          }}>
            <div style={{ display:'flex',gap:'14px' }}>
              {post.views > 0 && (
                <span style={{ display:'flex',alignItems:'center',gap:'5px',fontSize:'12px',color:'var(--muted-foreground)' }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3C4.5 3 1.5 8 1.5 8S4.5 13 8 13s6.5-5 6.5-5S11.5 3 8 3z" stroke="currentColor" strokeWidth="1.4"/>
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
                  </svg>{post.views}
                </span>
              )}
              {post.comments > 0 && (
                <span style={{ display:'flex',alignItems:'center',gap:'5px',fontSize:'12px',color:'var(--muted-foreground)' }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M2 2h12v9H9l-3 3V11H2V2z" stroke="currentColor" strokeWidth="1.4"/>
                  </svg>{post.comments}
                </span>
              )}
            </div>
            <a href={`/blogs/${post.slug}`} className="nm-lnk" style={{
              fontSize:'12px',color:'var(--primary)',textDecoration:'none',
              borderBottom:'1px solid transparent',transition:'border-color .15s',
            }}>查看完整文章 →</a>
          </div>
        </div>
      </div>
    </>
  );
}

// ── 主组件 ────────────────────────────────────────────────────────────────────
export default function NotesClientComponent({ posts }: NotesClientComponentProps) {
  const [activeType, setActiveType] = useState<NoteType | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalPost, setModalPost]   = useState<BlogPost | null>(null);
  const [scrollPct, setScrollPct]   = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // 过滤
  const filtered = useMemo(() => (
    activeType ? posts.filter(p => p.noteType === activeType) : posts
  ), [posts, activeType]);

  // 分组
  const groups   = useMemo(() => groupByMonth(filtered), [filtered]);
  const maxCount = useMemo(() => Math.max(...groups.map(([, g]) => g.length), 1), [groups]);
  const years    = useMemo(() => getYears(posts), [posts]);

  // 行内展开 toggle（同时打开弹窗——长按/双击可换成其他触发，这里单击切换展开）
  const toggleExpand = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  // 进度条
  useEffect(() => {
    const handler = () => {
      const el = contentRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      setScrollPct(Math.min(100, Math.max(0, Math.round(((window.innerHeight - top) / height) * 100))));
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollToYear = (y: string) => {
    document.getElementById(`year-anchor-${y}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const closeModal = useCallback(() => setModalPost(null), []);

  return (
    <>
      <style>{`
        /* 类型徽章颜色（亮/暗） */
        :root {
          --type-idea-bg:#fef9ec;     --type-idea-bd:#f5c842;    --type-idea-c:#7a5c00;
          --type-bug-bg:#fef0ee;      --type-bug-bd:#f0a090;     --type-bug-c:#8c2b1a;
          --type-excerpt-bg:#edf4ff;  --type-excerpt-bd:#90b8f0; --type-excerpt-c:#1a3d7a;
          --type-question-bg:#f2f0fc; --type-question-bd:#b0a0e8;--type-question-c:#3d2a8c;
          --type-tool-bg:#eef6ee;     --type-tool-bd:#90c890;    --type-tool-c:#1a5c1a;
        }
        .dark {
          --type-idea-bg:#2a2410;     --type-idea-bd:#8a6c00;    --type-idea-c:#f5c842;
          --type-bug-bg:#2a1410;      --type-bug-bd:#8c3020;     --type-bug-c:#f0a090;
          --type-excerpt-bg:#101c2a;  --type-excerpt-bd:#2a5090; --type-excerpt-c:#90b8f0;
          --type-question-bg:#18102a; --type-question-bd:#5040a0;--type-question-c:#b0a0e8;
          --type-tool-bg:#101a10;     --type-tool-bd:#2a6c2a;    --type-tool-c:#90c890;
        }
        /* 进度条 */
        .nt-prog { position:fixed;top:0;left:0;height:2px;z-index:40;background:var(--primary);transition:width .1s linear; }
        /* 年份锚点 chip */
        .yr-chip { font-size:11px;padding:3px 12px;border-radius:20px;cursor:pointer;border:1px solid var(--border);color:var(--muted-foreground);background:none;transition:all .15s; }
        .yr-chip:hover { background:var(--primary);color:#fff;border-color:var(--primary); }
        /* 类型 chip */
        .type-chip { display:inline-flex;align-items:center;gap:4px;font-size:11px;padding:3px 10px;border-radius:20px;border:1px solid var(--border);color:var(--muted-foreground);background:none;cursor:pointer;transition:all .15s;white-space:nowrap; }
        .type-chip-all.on { background:var(--foreground);color:var(--background);border-color:var(--foreground); }
        /* 时间轴行 */
        @keyframes tlIn { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
        .tl-month { animation:tlIn .3s ease both; }
        .tl-row-head {
          display:flex;align-items:flex-start;gap:10px;
          padding:10px 8px;margin:0 -8px;
          cursor:pointer;transition:background .15s;position:relative;
        }
        .tl-row-head::before {
          content:'';position:absolute;left:0;top:0;bottom:0;width:2px;
          background:var(--primary);transform:scaleY(0);transform-origin:bottom;
          transition:transform .2s cubic-bezier(.4,0,.2,1);
        }
        .tl-row-head:hover::before { transform:scaleY(1); }
        .tl-row-head:hover { background:var(--secondary); }
        .tl-row.open .tl-row-head::before { transform:scaleY(1); }
        /* 展开区 */
        .tl-expand {
          overflow:hidden;max-height:0;
          transition:max-height .28s cubic-bezier(.4,0,.2,1),opacity .2s;
          opacity:0;
        }
        .tl-row.open .tl-expand { max-height:200px;opacity:1; }
        /* chevron */
        .tl-chevron { font-size:9px;color:var(--muted-foreground);flex-shrink:0;margin-top:4px;transition:transform .22s; }
        .tl-row.open .tl-chevron { transform:rotate(180deg); }
        /* 装饰大字 */
        .header-deco { position:absolute;right:-8px;top:-28px;font-size:6rem;font-family:var(--font-serif);font-weight:700;color:var(--border);line-height:1;pointer-events:none;user-select:none;letter-spacing:-4px; }
      `}</style>

      {/* 进度条 */}
      <div className="nt-prog" style={{ width: `${scrollPct}%` }} />

      <div className="w-full py-16 min-h-screen" style={{ background: 'var(--background)' }}>
        <div className="max-w-[860px] mx-auto px-5 md:px-8">

          {/* ── 页头 */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="block h-px flex-1" style={{ background: 'var(--border)' }} />
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: 'var(--muted-foreground)' }}>Notes</span>
              <span className="block h-px flex-1" style={{ background: 'var(--border)' }} />
            </div>
            <div className="relative">
              <span className="header-deco" aria-hidden="true">记</span>
              <div className="inline-block text-[10px] font-medium tracking-[0.25em] uppercase mb-3 px-2 py-0.5"
                style={{ border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '2px' }}>
                手记
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-snug"
                style={{ color: 'var(--foreground)' }}>
                随手记
              </h1>
              <p className="text-sm font-light leading-relaxed max-w-md" style={{ color: 'var(--muted-foreground)' }}>
                随手记下来的想法、判断与踩坑，不求完整，只求留痕。
              </p>
            </div>
          </header>

          {/* ── ① 年份锚点 */}
          <div className="flex gap-2 flex-wrap mb-6">
            {years.map(y => (
              <button key={y} className="yr-chip" onClick={() => scrollToYear(y)}>{y}</button>
            ))}
          </div>

          {/* ── ③ 类型过滤 */}
          <div className="flex gap-2 flex-wrap mb-10">
            <button
              className={`type-chip type-chip-all${activeType === null ? ' on' : ''}`}
              onClick={() => { setActiveType(null); setExpandedId(null); }}
            >全部</button>
            {(Object.keys(NOTE_TYPES) as NoteType[]).map(k => {
              const t = NOTE_TYPES[k];
              const on = activeType === k;
              return (
                <button key={k}
                  className="type-chip"
                  style={on ? { background: t.bg, borderColor: t.border, color: t.color } : {}}
                  onClick={() => { setActiveType(on ? null : k); setExpandedId(null); }}
                >
                  {t.emoji} {t.label}
                </button>
              );
            })}
          </div>

          {/* ── 时间轴 */}
          <div ref={contentRef} className="mb-16">
            {groups.length === 0 ? (
              <div className="py-20 text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
                这个类型下还没有手记
              </div>
            ) : (
              groups.map(([month, items], mi) => {
                const yr = month.slice(0, 4);
                const isFirstOfYear = mi === 0 || groups[mi - 1][0].slice(0, 4) !== yr;
                const [y, m] = month.split('-');
                const pct = Math.round((items.length / maxCount) * 100);

                return (
                  <div key={month}>
                    {/* ① 年份锚点隐形元素 */}
                    {isFirstOfYear && (
                      <div id={`year-anchor-${yr}`} style={{ height: 0, overflow: 'hidden', marginTop: '-80px', paddingTop: '80px' }} />
                    )}

                    <div className="tl-month" style={{ animationDelay: `${mi * 50}ms`, marginBottom: '2rem' }}>
                      {/* 月份标题 + 密度条 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '.65rem' }}>
                        <span style={{
                          fontSize: '11px', fontWeight: 500, letterSpacing: '.15em',
                          textTransform: 'uppercase', color: 'var(--muted-foreground)', whiteSpace: 'nowrap',
                        }}>
                          {y} 年 {parseInt(m)} 月
                        </span>
                        <div style={{ flex: 1, height: '3px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: 'var(--primary)', borderRadius: '2px', width: `${pct}%` }} />
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>
                          {items.length} 篇
                        </span>
                      </div>

                      {/* 该月手记 */}
                      {items.map(post => {
                        const isOpen = expandedId === post.id;
                        return (
                          <div
                            key={post.id}
                            className={`tl-row${isOpen ? ' open' : ''}`}
                            style={{ borderBottom: '.5px solid var(--border)' }}
                          >
                            {/* ② 行头：点击展开摘要 */}
                            <div
                              className="tl-row-head"
                              onClick={() => toggleExpand(post.id)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={e => e.key === 'Enter' && toggleExpand(post.id)}
                            >
                              {/* 日期 */}
                              <span style={{
                                fontSize: '11px', color: 'var(--muted-foreground)',
                                width: '22px', flexShrink: 0, marginTop: '3px',
                                fontVariantNumeric: 'tabular-nums',
                              }}>{post.date.slice(8)}</span>

                              {/* 主体 */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                  fontSize: '13px', fontWeight: 500, color: 'var(--foreground)',
                                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                }}>{post.title}</p>
                                <div style={{ display: 'flex', gap: '6px', marginTop: '3px', alignItems: 'center', flexWrap: 'wrap' }}>
                                  <TypePill type={post.noteType} />
                                  {post.tags.slice(0, 3).map((tag, i) => (
                                    <span key={i} style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>· {tag}</span>
                                  ))}
                                </div>
                              </div>

                              {/* 阅读时间 */}
                              <span style={{
                                fontSize: '11px', color: 'var(--muted-foreground)',
                                background: 'var(--muted)', padding: '1px 6px',
                                borderRadius: '3px', fontFamily: 'var(--font-mono)',
                                flexShrink: 0, marginTop: '3px',
                              }}>{post.readTime}</span>

                              {/* chevron */}
                              <span className="tl-chevron">▾</span>
                            </div>

                            {/* ② 行内展开区 */}
                            <div className="tl-expand">
                              <div style={{
                                fontSize: '12px', color: 'var(--muted-foreground)',
                                lineHeight: 1.75, padding: '.65rem 1rem .65rem 2.5rem',
                                borderLeft: '2px solid var(--primary)',
                                margin: '2px 8px 10px',
                                background: 'var(--muted)',
                                borderRadius: '0 4px 4px 0',
                              }}>
                                {post.excerpt}
                                {/* 弹窗入口 */}
                                {post.content && (
                                  <button
                                    onClick={e => { e.stopPropagation(); setModalPost(post); }}
                                    style={{
                                      display: 'block', marginTop: '8px', fontSize: '11px',
                                      color: 'var(--primary)', background: 'none', border: 'none',
                                      cursor: 'pointer', padding: 0, textDecoration: 'underline',
                                    }}
                                  >阅读全文 →</button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── 底部提示 */}
          <footer className="p-6 rounded-sm"
            style={{ background: 'var(--muted)', borderLeft: '3px solid var(--primary)' }}>
            <div className="flex items-start gap-4">
              <span className="text-base mt-0.5" aria-hidden="true">💡</span>
              <div>
                <h3 className="text-sm font-semibold mb-1.5"
                  style={{ color: 'var(--foreground)', fontFamily: 'var(--font-serif)' }}>
                  关于手记
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  手记是比正式博客更轻量的记录形式——可以是技术踩坑、工具备忘、一个还没想清楚的问题、一段触动自己的阅读摘录，或者某个决定背后的推理过程。不求完整，只求留痕。
                </p>
              </div>
            </div>
          </footer>

        </div>
      </div>

      {/* 弹窗 */}
      <NoteModal post={modalPost} onClose={closeModal} />
    </>
  );
}
