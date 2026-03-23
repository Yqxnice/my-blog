/**
 * 功能：友情链接页面
 * 目的：展示友情链接列表和友链申请表单
 * 作者：Yqxnice
 */
'use client'
import { useState, useEffect } from 'react'
import styles from './links.module.css'




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

// ── Icons ─────────────────────────────────────────────────────────────────────
const ISend  = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M14 2L2 7l5 2 2 5 5-12z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
const ICheck = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>


// ── FriendItem ────────────────────────────────────────────────────────────────
function FriendItem({ friend, idx }: { friend: Friend; idx: number }) {
  return (
    <a
      href={friend.url} target="_blank" rel="noopener"
      className={styles.item}
      style={{ animationDelay: `${idx * 0.03}s` }}
    >
      <div className={styles.itemAvatar}>
        <img src={friend.avatar} alt={friend.name}
          onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }} />
      </div>
      <div className={styles.itemBody}>
        <div className={styles.itemName}>{friend.name}</div>
        <div className={styles.itemDesc}>{friend.desc}</div>
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
    <div className={styles.form}>
      <div className={styles.formTitle}>提交申请</div>
      {sent ? (
        <div className={styles.sent}><ICheck /> 收到了！我会尽快审核，谢谢你的友链申请 🎉</div>
      ) : (
        <>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>博客名称 *</label>
              <input className={styles.input} placeholder="你的博客名" value={form.name} onChange={set('name')} maxLength={30} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>博客地址 *</label>
              <input className={styles.input} placeholder="https://..." value={form.url} onChange={set('url')} maxLength={100} />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>一句话简介 *</label>
            <input className={styles.input} placeholder="用一句话介绍你的博客" value={form.desc} onChange={set('desc')} maxLength={60} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>联系邮箱（可选）</label>
            <input className={styles.input} type="email" placeholder="方便我联系你" value={form.email} onChange={set('email')} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>头像图片地址（可选）</label>
            <input className={styles.input} placeholder="https://... (建议正方形，会裁成圆形)" />
          </div>
          <button className={styles.submit} onClick={submit} disabled={!valid || submitting}>
            <ISend /> {submitting ? '提交中…' : '提交申请'}
          </button>
        </>
      )}
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function LinksPage() {
  // 初始使用原始顺序，确保服务器端和客户端一致
  const [shuffled, setShuffled] = useState<Friend[]>(FRIENDS);
  
  // 在客户端挂载后再随机排序
  useEffect(() => {
    const arr = [...FRIENDS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr);
  }, []);

  return (
    <>
      {/* Page header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>
              互联网上的<br /><em>好朋友们</em>
            </h1>
            <p className={styles.subtitle}>
              这里收录了一些我常逛的博客和工具——技术的、生活的、设计的，都是觉得值得一读的地方。
              如果你也想出现在这里，欢迎申请互换友链。
            </p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.statBubble}>
              <span className={styles.statNum}>{FRIENDS.length}</span>
              <span className={styles.statLabel}>个友链</span>
            </div>
          </div>
        </div>
      </div>


      <main className={styles.main}>

        {shuffled.length > 0 && (
          <>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>全部友链</span>
            </div>
            <div className={styles.grid}>
              {shuffled.map((f, i) => (
                <FriendItem key={f.id} friend={f} idx={i} />
              ))}
            </div>
          </>
        )}

        {/* Apply */}
        <div className={styles.apply}>
          <div className={styles.applyInner}>
            <div className={styles.applyLeft}>
              <div className={styles.applyEyebrow}>申请互换</div>
              <h2 className={styles.applyTitle}>把你的博客<br />加进来</h2>
              <p className={styles.applyDesc}>
                如果你有一个持续更新、内容认真的博客，欢迎互换友链。
                我会在一周内审核，通过后将你的博客加入列表。
              </p>
              <div className={styles.reqs}>
                {[
                  '博客已正常运营，内容以原创为主',
                  '博客内容健康，不含违法或不良信息',
                  '请先将本站加入你的友链，再提交申请',
                  '本站信息：木子博客 · w-blogs.top',
                ].map((req, i) => (
                  <div key={i} className={styles.req}>
                    <div className={styles.reqIcon}>{i + 1}</div>
                    {req}
                  </div>
                ))}
              </div>
            </div>
            <ApplyForm />
          </div>
        </div>

      </main>
    </>
  )
}