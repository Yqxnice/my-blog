import { useState, useEffect, useCallback } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────
type Theme = 'light' | 'dark'


interface Friend {
  id: string
  name: string
  url: string
  desc: string
  avatar: string
  since?: string
}

// ── 友链数据 ──────────────────────────────────────────────────────────────────
const FRIENDS: Friend[] = [
  { id: 'f1',  name: 'Anthony Fu',        url: 'https://antfu.me',                   desc: 'Vue、Vite 核心成员，开源创作者，工具链和 DX 方向的标杆博客。',              avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=antfu&backgroundColor=4ade80,22c55e',      since: '2023-08' },
  { id: 'f2',  name: '阮一峰的网络日志',   url: 'https://www.ruanyifeng.com/blog',    desc: '科技、经济与生活，每周科技爱好者周刊是我的固定阅读。',                       avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=ruanyifeng&backgroundColor=60a5fa,3b82f6', since: '2022-11' },
  { id: 'f3',  name: 'Josh W. Comeau',    url: 'https://www.joshwcomeau.com',         desc: '把 CSS 和 React 讲得最有趣的博主之一，文章配图和交互设计都很精彩。',           avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=joshcomeau&backgroundColor=f9a8d4,ec4899', since: '2023-03' },
  { id: 'f4',  name: 'Overreacted',       url: 'https://overreacted.io',             desc: 'Dan Abramov 的个人博客，React 深度思考文章，每篇都值得反复读。',               avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=overreacted&backgroundColor=818cf8,6366f1', since: '2022-09' },
  { id: 'f5',  name: '程序员的喵',         url: 'https://catcoding.me',               desc: '独立开发者，写代码也写生活，是那种文字里有温度的技术博客。',                   avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=catcoding&backgroundColor=fde68a,fbbf24',  since: '2023-06' },
  { id: 'f6',  name: '少数派',             url: 'https://sspai.com',                  desc: '高质量生产力工具媒体，效率应用和数字生活方式的好去处。',                       avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=sspai&backgroundColor=ff6b6b,ef4444',      since: '2022-07' },
  { id: 'f7',  name: 'Refactoring UI',    url: 'https://www.refactoringui.com',       desc: 'Tailwind 作者写的设计方法论，教程序员用系统化方式思考视觉设计。',              avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=refactoringui&backgroundColor=34d399,10b981', since: '2023-01' },
  { id: 'f8',  name: 'Leerob',            url: 'https://leerob.io',                  desc: 'Vercel 产品 VP，Next.js 生态的布道者，博客本身也是极好的设计参考。',           avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=leerob&backgroundColor=a5b4fc,818cf8',     since: '2023-04' },
  { id: 'f9',  name: '一休',               url: 'https://yihuixiaoxi.com',            desc: '写产品、写设计、写生活，思维很清晰的国内独立博主。',                           avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=yihui&backgroundColor=6ee7b7,34d399',      since: '2024-01' },
  { id: 'f10', name: 'Dribbble',          url: 'https://dribbble.com',               desc: '设计师灵感社区，刷 UI 灵感和配色方案的好地方。',                              avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=dribbble&backgroundColor=f9a8d4,fb7185',   since: '2022-06' },
  { id: 'f11', name: 'Excalidraw',        url: 'https://excalidraw.com',             desc: '白板式协作绘图工具，画架构图和草图的必备，开源且好看。',                       avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=excali&backgroundColor=fcd34d,f59e0b',     since: '2023-09' },
  { id: 'f12', name: '面包多',             url: 'https://mianbaoduo.com',             desc: '国内独立创作者变现平台，关注独立创作者经济的好资源。',                         avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=mbd&backgroundColor=fbbf24,f59e0b',        since: '2024-02' },
]

const NAV_LINKS = [
  { href: 'https://w-blogs.top/',        label: '首页',    active: false },
  { href: 'https://w-blogs.top/blogs',   label: '博客',    active: false },
  { href: 'https://w-blogs.top/blogs/1', label: '手记',    active: false },
  { href: 'https://w-blogs.top/archive', label: '归档',    active: false },
  { href: 'https://w-blogs.top/blogs/3', label: '思考',    active: false },
  { href: 'https://w-blogs.top/links',   label: '友情链接', active: true  },
]

const AVATAR      = 'https://w-blogs.top/_next/static/media/me.5d763194.jpg'
const AVATAR_FALL = 'https://api.dicebear.com/7.x/adventurer/svg?seed=Muzi&backgroundColor=f0ede8'

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;600&family=Noto+Sans+SC:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
:root{--bg:#f7f5f0;--bg2:#efece6;--surface:#fff;--ink:#1a1714;--ink-2:#4a4540;--ink-3:#8a8480;--accent:#c0392b;--accent-bg:#f9ecea;--border:#e2ddd6;--tag-bg:#eeebe5;--serif:'Playfair Display','Noto Serif SC',serif;--sans:'Noto Sans SC',sans-serif;--r:5px;--max-w:900px;--px:clamp(1.2rem,5vw,3.5rem)}
[data-theme=dark]{--bg:#141210;--bg2:#1c1916;--surface:#211e1b;--ink:#f0ece4;--ink-2:#b8b0a6;--ink-3:#706860;--accent:#e05a4b;--accent-bg:#2a1a18;--border:#2e2a26;--tag-bg:#2a2620}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:15px;line-height:1.7;-webkit-font-smoothing:antialiased;transition:background .3s,color .3s}
a{color:inherit;text-decoration:none}img{display:block;max-width:100%}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes popIn{from{opacity:0;transform:scale(.94) translateY(6px)}to{opacity:1;transform:none}}

/* ── NAV ── */
.lk-nav{position:sticky;top:0;z-index:100;background:rgba(247,245,240,.9);backdrop-filter:blur(14px);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 var(--px);height:54px;transition:background .3s,border-color .3s}
[data-theme=dark] .lk-nav{background:rgba(20,18,16,.9)}
.lk-logo{display:flex;align-items:center;gap:.55rem;font-family:var(--serif);font-size:1.1rem;font-weight:700;letter-spacing:.02em}
.lk-logo img{width:28px;height:28px;border-radius:50%;border:1.5px solid var(--border);object-fit:cover}
.lk-dot{color:var(--accent)}
.lk-navlinks{display:flex;gap:1.8rem;list-style:none}
.lk-navlinks a{font-size:.82rem;color:var(--ink-2);letter-spacing:.06em;position:relative;transition:color .2s}
.lk-navlinks a::after{content:'';position:absolute;bottom:-3px;left:0;width:0;height:1.5px;background:var(--accent);transition:width .25s ease}
.lk-navlinks a:hover{color:var(--accent)}.lk-navlinks a:hover::after{width:100%}
.lk-navlinks .on{color:var(--ink);font-weight:500}.lk-navlinks .on::after{width:100%;background:var(--ink)}
.lk-ibtn{background:none;border:none;cursor:pointer;color:var(--ink-2);display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;transition:background .2s,color .2s}
.lk-ibtn:hover{background:var(--tag-bg);color:var(--ink)}

/* ── PAGE HEADER ── */
.lk-header{
  max-width:var(--max-w);margin:0 auto;
  padding:clamp(2.5rem,6vw,4.5rem) var(--px) 0;
  border-bottom:1px solid var(--border);
  animation:fadeUp .55s ease both;
}
.lk-header-inner{
  display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;
  padding-bottom:2rem;
}
.lk-header-text{}
.lk-breadcrumb{
  font-size:.72rem;color:var(--ink-3);letter-spacing:.06em;
  display:flex;align-items:center;gap:.4rem;margin-bottom:.8rem;
}
.lk-breadcrumb a{transition:color .2s}.lk-breadcrumb a:hover{color:var(--accent)}
.lk-breadcrumb-sep{opacity:.4}
.lk-title{
  font-family:var(--serif);
  font-size:clamp(2rem,5vw,3rem);
  font-weight:700;line-height:1.15;letter-spacing:-.02em;
}
.lk-title em{font-style:italic;color:var(--accent)}
.lk-subtitle{
  margin-top:.6rem;
  font-size:.9rem;color:var(--ink-3);font-weight:300;
  line-height:1.7;max-width:480px;
}
/* 统计气泡 */
.lk-header-stats{
  display:flex;flex-direction:column;gap:.5rem;align-items:flex-end;flex-shrink:0;
}
.lk-stat-bubble{
  display:flex;flex-direction:column;align-items:center;
  background:var(--surface);border:1px solid var(--border);
  border-radius:var(--r);padding:.6rem 1.1rem;
  min-width:80px;
}
.lk-stat-num{
  font-family:var(--serif);font-size:1.6rem;font-weight:700;
  color:var(--accent);line-height:1;
}
.lk-stat-label{font-size:.62rem;color:var(--ink-3);margin-top:.2rem;letter-spacing:.05em}




/* ── MAIN ── */
.lk-main{max-width:var(--max-w);margin:0 auto;padding:2.5rem var(--px) 5rem}
.lk-sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.2rem}
.lk-st{font-size:.72rem;font-weight:500;color:var(--ink-3);letter-spacing:.14em;text-transform:uppercase;display:flex;align-items:center;gap:.5rem}
.lk-st::before{content:'';display:block;width:14px;height:1.5px;background:var(--accent)}


/* ── FRIEND CARD GRID ── */
.lk-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:.75rem;
}
.lk-item{
  display:flex;align-items:center;gap:1rem;
  padding:1rem 1.1rem;
  background:var(--bg2);
  border:1px solid var(--border);
  border-radius:10px;
  transition:border-color .2s, box-shadow .2s, transform .2s;
  animation:fadeUp .4s ease both;
  position:relative;
  overflow:hidden;
}
.lk-item::after{
  content:'';
  position:absolute;inset:0;
  border-radius:10px;
  box-shadow:0 0 0 2px var(--accent);
  opacity:0;
  transition:opacity .2s;
  pointer-events:none;
}
.lk-item:hover{
  border-color:color-mix(in srgb, var(--accent) 25%, transparent);
  box-shadow:0 4px 20px rgba(0,0,0,.07);
  transform:translateY(-1px);
  background:var(--bg);
}
.lk-item:hover::after{ opacity:1; }
.lk-item:hover .lk-item-name{ color:var(--accent); }
[data-theme=dark] .lk-item:hover{
  box-shadow:0 4px 20px rgba(0,0,0,.3);
}
.lk-item-avatar{
  flex-shrink:0;
  width:56px;height:56px;
  border-radius:10px;
  overflow:hidden;
  background:var(--tag-bg);
}
.lk-item-avatar img{width:100%;height:100%;object-fit:cover}
.lk-item-body{flex:1;min-width:0}
.lk-item-name{
  font-size:.92rem;font-weight:500;color:var(--ink);
  transition:color .2s;letter-spacing:.01em;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.lk-item-desc{
  font-size:.78rem;color:var(--ink-3);font-weight:300;
  margin-top:.18rem;line-height:1.5;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
}
.lk-empty{
  padding:3rem 0;text-align:center;
  color:var(--ink-3);font-size:.88rem;
}

/* ── APPLY SECTION ── */
.lk-apply{
  margin-top:4rem;padding-top:3rem;
  border-top:1px solid var(--border);
  animation:fadeUp .5s .1s ease both;
}
.lk-apply-inner{
  display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:start;
}
.lk-apply-left{}
.lk-apply-eyebrow{
  font-size:.68rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;
  color:var(--accent);margin-bottom:.7rem;
}
.lk-apply-title{
  font-family:var(--serif);
  font-size:1.5rem;font-weight:700;line-height:1.3;
  letter-spacing:-.01em;margin-bottom:.8rem;
}
.lk-apply-desc{
  font-size:.85rem;color:var(--ink-2);line-height:1.8;
  font-weight:300;
}
.lk-reqs{margin-top:1.4rem;display:flex;flex-direction:column;gap:.6rem}
.lk-req{
  display:flex;align-items:flex-start;gap:.7rem;
  font-size:.8rem;color:var(--ink-2);font-weight:300;line-height:1.5;
}
.lk-req-icon{
  flex-shrink:0;width:18px;height:18px;border-radius:50%;
  background:var(--accent-bg);border:1px solid color-mix(in srgb,var(--accent) 30%,transparent);
  display:flex;align-items:center;justify-content:center;
  color:var(--accent);margin-top:.15rem;font-size:.6rem;font-weight:700;
}

/* 申请表单 */
.lk-form{
  display:flex;flex-direction:column;gap:.8rem;
  background:var(--bg2);border:1px solid var(--border);
  border-radius:var(--r);padding:1.4rem 1.5rem;
  transition:border-color .2s;
}
.lk-form:focus-within{
  border-color:color-mix(in srgb,var(--accent) 35%,transparent);
}
.lk-form-title{
  font-size:.8rem;font-weight:500;color:var(--ink);
  margin-bottom:.2rem;letter-spacing:.03em;
}
.lk-field{display:flex;flex-direction:column;gap:.3rem}
.lk-label{font-size:.68rem;color:var(--ink-3);letter-spacing:.04em;font-weight:400}
.lk-input{
  background:var(--tag-bg);border:1px solid transparent;
  outline:none;border-radius:4px;
  padding:.45rem .7rem;
  font-size:.82rem;font-family:var(--sans);color:var(--ink);
  transition:border-color .2s,background .2s;width:100%;
}
.lk-input::placeholder{color:var(--ink-3)}
.lk-input:focus{border-color:var(--border);background:var(--surface)}
.lk-textarea{resize:none;min-height:72px;line-height:1.6}
.lk-form-row{display:grid;grid-template-columns:1fr 1fr;gap:.7rem}
.lk-submit{
  background:var(--accent);color:#fff;border:none;
  border-radius:4px;padding:.5rem 1.2rem;
  font-size:.82rem;font-family:var(--sans);cursor:pointer;
  transition:opacity .2s,transform .15s;
  display:flex;align-items:center;gap:.4rem;width:fit-content;
  margin-top:.2rem;
}
.lk-submit:hover{opacity:.88}
.lk-submit:active{transform:scale(.97)}
.lk-submit:disabled{opacity:.45;cursor:not-allowed}
.lk-sent{
  display:flex;align-items:center;gap:.5rem;
  font-size:.82rem;color:#10b981;font-weight:500;
  padding:.5rem 0;animation:fadeIn .3s ease;
}

/* ── FOOTER ── */
.lk-ft{border-top:1px solid var(--border);padding:1.8rem var(--px);max-width:var(--max-w);margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.lk-fc-copy{font-size:.75rem;color:var(--ink-3);font-weight:300}
.lk-fn{display:flex;gap:1.5rem;list-style:none}
.lk-fn a{font-size:.75rem;color:var(--ink-3);transition:color .2s}
.lk-fn a:hover{color:var(--ink)}

@media(max-width:700px){
  .lk-navlinks li:nth-child(n+5){display:none}
  .lk-header-inner{flex-direction:column;align-items:flex-start;gap:1.2rem}
  .lk-header-stats{flex-direction:row;align-items:flex-start}
  .lk-grid{grid-template-columns:1fr}
  .lk-apply-inner{grid-template-columns:1fr;gap:2rem}
  .lk-form-row{grid-template-columns:1fr}
  .lk-item-right{display:none}
  .lk-ft{flex-direction:column;align-items:flex-start}
}
`

let injected = false
function injectStyles() {
  if (injected) return
  const el = document.createElement('style'); el.textContent = CSS
  document.head.appendChild(el); injected = true
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const ISun  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
const IMoon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
const ISend  = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M14 2L2 7l5 2 2 5 5-12z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
const ICheck = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <nav className="lk-nav">
      <a className="lk-logo" href="https://w-blogs.top/">
        <img src={AVATAR} alt="木子" onError={e => { (e.target as HTMLImageElement).src = AVATAR_FALL }} />
        木子<span className="lk-dot">·</span>博客
      </a>
      <ul className="lk-navlinks">
        {NAV_LINKS.map(({ href, label, active }) => (
          <li key={href}><a href={href} className={active ? 'on' : ''}>{label}</a></li>
        ))}
      </ul>
      <button className="lk-ibtn" onClick={onToggle}>{theme === 'dark' ? <ISun /> : <IMoon />}</button>
    </nav>
  )
}


// ── FriendItem ────────────────────────────────────────────────────────────────
function FriendItem({ friend, idx }: { friend: Friend; idx: number }) {
  return (
    <a
      href={friend.url} target="_blank" rel="noopener"
      className="lk-item"
      style={{ animationDelay: `${idx * 0.03}s` }}
    >
      <div className="lk-item-avatar">
        <img src={friend.avatar} alt={friend.name}
          onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }} />
      </div>
      <div className="lk-item-body">
        <div className="lk-item-name">{friend.name}</div>
        <div className="lk-item-desc">{friend.desc}</div>
      </div>
    </a>
  )
}

// ── Apply Form ────────────────────────────────────────────────────────────────
function ApplyForm() {
  const [form, setForm] = useState({ name: '', url: '', desc: '', email: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSub] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const valid = form.name.trim() && form.url.trim() && form.desc.trim()

  const submit = async () => {
    if (!valid) return
    setSub(true)
    await new Promise(r => setTimeout(r, 600))
    setSent(true)
    setSub(false)
  }

  return (
    <div className="lk-form">
      <div className="lk-form-title">提交申请</div>
      {sent ? (
        <div className="lk-sent"><ICheck /> 收到了！我会尽快审核，谢谢你的友链申请 🎉</div>
      ) : (
        <>
          <div className="lk-form-row">
            <div className="lk-field">
              <label className="lk-label">博客名称 *</label>
              <input className="lk-input" placeholder="你的博客名" value={form.name} onChange={set('name')} maxLength={30} />
            </div>
            <div className="lk-field">
              <label className="lk-label">博客地址 *</label>
              <input className="lk-input" placeholder="https://..." value={form.url} onChange={set('url')} maxLength={100} />
            </div>
          </div>
          <div className="lk-field">
            <label className="lk-label">一句话简介 *</label>
            <input className="lk-input" placeholder="用一句话介绍你的博客" value={form.desc} onChange={set('desc')} maxLength={60} />
          </div>
          <div className="lk-field">
            <label className="lk-label">联系邮箱（可选）</label>
            <input className="lk-input" type="email" placeholder="方便我联系你" value={form.email} onChange={set('email')} />
          </div>
          <div className="lk-field">
            <label className="lk-label">头像图片地址（可选）</label>
            <input className="lk-input" placeholder="https://... (建议正方形，会裁成圆形)" />
          </div>
          <button className="lk-submit" onClick={submit} disabled={!valid || submitting}>
            <ISend /> {submitting ? '提交中…' : '提交申请'}
          </button>
        </>
      )}
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function LinksPage() {
  injectStyles()

  const [theme, setTheme] = useState<Theme>(() => {
    const s = localStorage.getItem('theme') as Theme | null
    return s ?? (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light')
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])
  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), [])

  // shuffle once on mount
  const [shuffled] = useState<Friend[]>(() => {
    const arr = [...FRIENDS]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  })

  return (
    <>
      <Nav theme={theme} onToggle={toggleTheme} />

      {/* Page header */}
      <div className="lk-header">
        <div className="lk-header-inner">
          <div className="lk-header-text">
            <div className="lk-breadcrumb">
              <a href="https://w-blogs.top/">首页</a>
              <span className="lk-breadcrumb-sep">/</span>
              <span>友情链接</span>
            </div>
            <h1 className="lk-title">
              互联网上的<br /><em>好朋友们</em>
            </h1>
            <p className="lk-subtitle">
              这里收录了一些我常逛的博客和工具——技术的、生活的、设计的，都是觉得值得一读的地方。
              如果你也想出现在这里，欢迎申请互换友链。
            </p>
          </div>
          <div className="lk-header-stats">
            <div className="lk-stat-bubble">
              <span className="lk-stat-num">{FRIENDS.length}</span>
              <span className="lk-stat-label">个友链</span>
            </div>
          </div>
        </div>
      </div>


      <main className="lk-main">

        {shuffled.length > 0 && (
          <>
            <div className="lk-sh">
              <span className="lk-st">全部友链</span>
              <span style={{ fontSize: '.72rem', color: 'var(--ink-3)' }}>{shuffled.length} 个</span>
            </div>
            <div className="lk-grid">
              {shuffled.map((f, i) => (
                <FriendItem key={f.id} friend={f} idx={i} />
              ))}
            </div>
          </>
        )}

        {/* Apply */}
        <div className="lk-apply">
          <div className="lk-apply-inner">
            <div className="lk-apply-left">
              <div className="lk-apply-eyebrow">申请互换</div>
              <h2 className="lk-apply-title">把你的博客<br />加进来</h2>
              <p className="lk-apply-desc">
                如果你有一个持续更新、内容认真的博客，欢迎互换友链。
                我会在一周内审核，通过后将你的博客加入列表。
              </p>
              <div className="lk-reqs">
                {[
                  '博客已正常运营，内容以原创为主',
                  '博客内容健康，不含违法或不良信息',
                  '请先将本站加入你的友链，再提交申请',
                  '本站信息：木子博客 · w-blogs.top',
                ].map((req, i) => (
                  <div key={i} className="lk-req">
                    <div className="lk-req-icon">{i + 1}</div>
                    {req}
                  </div>
                ))}
              </div>
            </div>
            <ApplyForm />
          </div>
        </div>

      </main>

      <footer className="lk-ft">
        <span className="lk-fc-copy">© 2026 木子博客 · All rights reserved · 京 ICP 备 XXXXXXXX 号</span>
        <ul className="lk-fn">
          <li><a href="https://w-blogs.top/">首页</a></li>
          <li><a href="https://w-blogs.top/blogs">博客</a></li>
          <li><a href="https://w-blogs.top/archive">归档</a></li>
          <li><a href="https://w-blogs.top/links">友情链接</a></li>
        </ul>
      </footer>
    </>
  )
}