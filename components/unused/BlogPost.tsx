/**
 * 功能：博客文章页面组件
 * 目的：展示博客文章的完整内容，包括目录、阅读进度等功能
 * 作者：Yqxnice
 */
'use client'

import React, {
  useEffect,
  useRef,
  useState,
  ReactNode,
  useCallback,
} from 'react'
import Link from 'next/link'
import './blog-post.css'

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
export interface TocItem {
  id: string
  text: string
  depth: 2 | 3
}

export interface RelatedPost {
  slug: string
  title: string
  date: string
  readingTime: number
}

export interface PostMeta {
  title: string           // 支持 HTML（如 <em> 斜体）
  description?: string
  date: string            // e.g. '2024-02-15'
  updatedDate?: string
  readingTime: number
  tags: string[]
  views?: number
  authorName: string
  authorAvatar?: string
  prevPost?: { slug: string; title: string }
  nextPost?: { slug: string; title: string }
  relatedPosts?: RelatedPost[]
}

export interface BlogPostProps {
  meta: PostMeta
  children: ReactNode   // MDX 渲染结果
}

/* ─────────────────────────────────────────
   Components
───────────────────────────────────────── */
// 代码块复制按钮组件
function CodeBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLPreElement>(null)

  const copy = () => {
    const text = ref.current?.querySelector('code')?.textContent ?? ''
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <pre ref={ref} {...props}>
      <button className={`copy-btn${copied ? ' ok' : ''}`} onClick={copy} aria-label="复制代码">
        {copied ? '已复制' : '复制'}
      </button>
      {children}
    </pre>
  )
}

/* ─────────────────────────────────────────
   Hooks
───────────────────────────────────────── */
function useReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const total = scrollHeight - clientHeight
      setProgress(total > 0 ? (scrollTop / total) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return progress
}

function useToc(contentRef: React.RefObject<HTMLDivElement | null>) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const nodes = Array.from(el.querySelectorAll('h2, h3')) as HTMLHeadingElement[]
    const toc: TocItem[] = nodes.map((h, i) => {
      if (!h.id) {
        h.id = `heading-${i}-${(h.textContent ?? '')
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '')}`
      }
      return {
        id: h.id,
        text: h.textContent?.replace(/#$/, '').trim() ?? '',
        depth: h.tagName === 'H2' ? 2 : 3,
      }
    })
    setItems(toc)
  }, [contentRef])

  useEffect(() => {
    if (!items.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id) })
      },
      { rootMargin: '-10% 0px -80% 0px' }
    )
    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items])

  return { items, activeId }
}

function useBackToTop(threshold = 400) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > threshold)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [threshold])
  const scrollTop = useCallback(
    () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    []
  )
  return { visible, scrollTop }
}

/* ─────────────────────────────────────────
   Reading Progress Bar
───────────────────────────────────────── */
function ReadingBar({ progress }: { progress: number }) {
  return (
    <div className="reading-bar" role="progressbar" aria-valuenow={Math.round(progress)}>
      <div className="reading-fill" style={{ width: `${progress}%` }} />
    </div>
  )
}

/* ─────────────────────────────────────────
   Breadcrumb
───────────────────────────────────────── */
function Breadcrumb({ tags }: { tags: string[] }) {
  return (
    <nav className="crumb" aria-label="面包屑">
      <Link href="/">首页</Link>
      <span className="crumb-sep" aria-hidden>›</span>
      <Link href="/blogs">博客</Link>
      {tags[0] && (
        <>
          <span className="crumb-sep" aria-hidden>›</span>
          <a href={`/blogs?tag=${encodeURIComponent(tags[0])}`}>{tags[0]}</a>
        </>
      )}
      <span className="crumb-sep" aria-hidden>›</span>
      <span style={{ color: 'var(--ink2)' }}>文章</span>
    </nav>
  )
}

/* ─────────────────────────────────────────
   Post Header
───────────────────────────────────────── */
function PostHeader({ meta }: { meta: PostMeta }) {
  return (
    <div className="post-hdr">
      <div className="ptags">
        {meta.tags.map((tag) => (
          <a key={tag} href={`/blogs?tag=${encodeURIComponent(tag)}`} className="ptag">
            {tag}
          </a>
        ))}
      </div>

      <h1 className="ptitle" dangerouslySetInnerHTML={{ __html: meta.title }} />

      {meta.description && <p className="pdesc">{meta.description}</p>}

      <div className="pmeta">
        <div className="pmeta-author">
          {meta.authorAvatar ? (
            <img
              className="pmeta-av pmeta-av--img"
              src={meta.authorAvatar}
              alt={meta.authorName}
              onError={(e) => { ;(e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <div className="pmeta-av">{meta.authorName.slice(0, 1)}</div>
          )}
          <span className="pmeta-name">{meta.authorName}</span>
        </div>

        <span className="dot" aria-hidden />

        <span className="pmeta-it">
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M5 2v2M11 2v2M2 7h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <time dateTime={meta.date}>{meta.date}</time>
          {meta.updatedDate && (
            <span className="pmeta-updated">· 更新于 {meta.updatedDate}</span>
          )}
        </span>

        <span className="dot" aria-hidden />
        <span className="badge">{meta.readingTime} min</span>

        {meta.views != null && (
          <span className="pmeta-it">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <path d="M8 3C4.5 3 1.5 8 1.5 8S4.5 13 8 13s6.5-5 6.5-5S11.5 3 8 3z"
                stroke="currentColor" strokeWidth="1.3" />
              <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            {meta.views.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Right TOC Sidebar
───────────────────────────────────────── */
function RightToc({
  items,
  activeId,
  relatedPosts,
}: {
  items: TocItem[]
  activeId: string
  relatedPosts?: RelatedPost[]
}) {
  const h2Count = items.filter((i) => i.depth === 2).length

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <aside className="right-toc">
      <div className="toc-header">
        <div className="toc-title-row">
          <div className="toc-accent-bar" aria-hidden />
          <span className="toc-label">目录</span>
        </div>
        {h2Count > 0 && <span className="toc-count">{h2Count} 节</span>}
      </div>

      {items.length > 0 ? (
        <div className="toc-items" role="list">
          {items.map((item, idx) => {
            const isActive = activeId === item.id
            const sectionNum = items.slice(0, idx + 1).filter((i) => i.depth === 2).length
            return (
              <div
                key={item.id}
                className={[
                  'toc-item',
                  item.depth === 3 ? 'depth-3' : '',
                  isActive ? 'act' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                role="listitem"
              >
                <div className="toc-track" aria-hidden />
                <button
                  className="toc-link"
                  onClick={() => scrollTo(item.id)}
                  aria-current={isActive ? 'location' : undefined}
                >
                  {item.depth === 2 && (
                    <span className="toc-num">{String(sectionNum).padStart(2, '0')}</span>
                  )}
                  <span className="toc-text">{item.text}</span>
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="toc-empty">暂无目录</p>
      )}

      {relatedPosts && relatedPosts.length > 0 && (
        <>
          <hr className="toc-divider" />
          <div className="rel-ttl">相关文章</div>
          <div className="rel-list">
            {relatedPosts.map((p) => (
              <a key={p.slug} className="rel-item" href={`/blogs/${p.slug}`}>
                <span className="rel-title">{p.title}</span>
                <span className="rel-meta">{p.date} · {p.readingTime} min</span>
              </a>
            ))}
          </div>
        </>
      )}
    </aside>
  )
}

/* ─────────────────────────────────────────
   Prev / Next Navigation
───────────────────────────────────────── */
function PostNav({
  prev,
  next,
}: {
  prev?: PostMeta['prevPost']
  next?: PostMeta['nextPost']
}) {
  if (!prev && !next) return null
  return (
    <nav className="pnav" aria-label="前后文章">
      {prev ? (
        <a className="pnav-item" href={`/blogs/${prev.slug}`}>
          <span className="pnav-dir">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M10 6H2M5 3L2 6l3 3" stroke="currentColor" strokeWidth="1.3"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            上一篇
          </span>
          <span className="pnav-title">{prev.title}</span>
        </a>
      ) : <div />}
      {next ? (
        <a className="pnav-item nxt" href={`/blogs/${next.slug}`}>
          <span className="pnav-dir">
            下一篇
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="pnav-title">{next.title}</span>
        </a>
      ) : <div />}
    </nav>
  )
}

/* ─────────────────────────────────────────
   Back to Top
───────────────────────────────────────── */
function BackToTop() {
  const { visible, scrollTop } = useBackToTop()
  return (
    <button
      className={`btt${visible ? ' on' : ''}`}
      onClick={scrollTop}
      aria-label="回到顶部"
      title="回到顶部"
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <path d="M8 13V3M3 8l5-5 5 5"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

/* ─────────────────────────────────────────
   MDX Custom Components
   用法：<MDXRemote source={source} components={mdxComponents} />
───────────────────────────────────────── */
export const mdxComponents = {
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id =
      typeof children === 'string'
        ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        : undefined
    return (
      <h2 id={id} {...props}>
        {children}
        {id && <a href={`#${id}`} className="anch" aria-hidden="true">#</a>}
      </h2>
    )
  },

  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id =
      typeof children === 'string'
        ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        : undefined
    return (
      <h3 id={id} {...props}>
        {children}
        {id && <a href={`#${id}`} className="anch" aria-hidden="true">#</a>}
      </h3>
    )
  },

  // 代码块 + 复制按钮
  pre: CodeBlock,

  // 外链新标签打开
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = typeof href === 'string' && href.startsWith('http')
    return (
      <a href={href} {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props}>
        {children}
      </a>
    )
  },

  // 图片加 figcaption
  img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <figure>
      <img src={src} alt={alt ?? ''} loading="lazy" {...props} />
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
  ),

  // <Callout type="tip" title="提示">内容</Callout>
  Callout: ({
    type = 'tip',
    title,
    children,
  }: {
    type?: 'tip' | 'info' | 'warn' | 'danger'
    title?: string
    children: ReactNode
  }) => {
    const icons: Record<string, string> = { tip: '💡', info: 'ℹ️', warn: '⚠️', danger: '🚨' }
    return (
      <div className={`callout ${type}`}>
        <span className="callout-icon" aria-hidden>{icons[type]}</span>
        <div className="callout-body">
          {title && <strong>{title}</strong>}
          {children}
        </div>
      </div>
    )
  },
}

/* ─────────────────────────────────────────
   Main Page Component
───────────────────────────────────────── */
export default function BlogPost({ meta, children }: BlogPostProps) {
  const progress = useReadingProgress()
  const contentRef = useRef<HTMLDivElement>(null)
  const { items: tocItems, activeId } = useToc(contentRef)

  return (
    <>
      <ReadingBar progress={progress} />
      <Breadcrumb tags={meta.tags} />
      <PostHeader meta={meta} />

      <div className="page-body">
        {/* 左：正文 */}
        <article>
          <div className="prose" ref={contentRef}>
            {children}
          </div>
          <PostNav prev={meta.prevPost} next={meta.nextPost} />
        </article>

        {/* 右：目录 + 相关文章 */}
        <RightToc items={tocItems} activeId={activeId} relatedPosts={meta.relatedPosts} />
      </div>

      <footer className="footer">
        <span className="footer-copy">
          © {new Date().getFullYear()} 木子博客 · All rights reserved
        </span>
        <ul className="footer-nav">
          <li><Link href="/">首页</Link></li>
          <li><Link href="/blogs">博客</Link></li>
          <li><Link href="/archive">归档</Link></li>
          <li><Link href="/links">友情链接</Link></li>
        </ul>
      </footer>

      <BackToTop />
    </>
  )
}
