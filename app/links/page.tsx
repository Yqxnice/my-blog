/**
 * 功能：友情链接页面
 * 目的：展示友情链接列表和友链申请表单
 * 作者：Yqxnice
 */
'use client'
import { useState, useEffect } from 'react'
import styles from './links.module.css'
import { LinkSkeleton } from '@/components/common/skeleton'




interface Friend {
  id: string
  name: string
  url: string
  description: string
  avatar: string
  since?: string
  is_blocked?: boolean
  is_lost?: boolean
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const ISend  = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M14 2L2 7l5 2 2 5 5-12z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
const ICheck = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
const ILoading = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin"><path d="M8 1a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>


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
        <div className={styles.itemDesc}>{friend.description}</div>
      </div>
    </a>
  )
}

// ── Apply Form ────────────────────────────────────────────────────────────────
function ApplyForm() {
  const [form, setForm] = useState({ name: '', url: '', description: '', email: '', avatar: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSub] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const valid = form.name.trim() && form.url.trim() && form.description.trim() && form.email.trim() && form.avatar.trim()

  const submit = async () => {
    if (!valid) return
    setSub(true)
    setError(null)
    
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '提交失败')
      }

      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败，请稍后重试')
    } finally {
      setSub(false)
    }
  }

  return (
    <div className={styles.form}>
      <div className={styles.formTitle}>提交申请</div>
      {sent ? (
        <div className={styles.sent}><ICheck /> 收到了！我会尽快审核，谢谢你的友链申请 🎉</div>
      ) : (
        <>
          {error && <div className={styles.error}>{error}</div>}
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
            <input className={styles.input} placeholder="用一句话介绍你的博客" value={form.description} onChange={set('description')} maxLength={60} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>联系邮箱 *</label>
            <input className={styles.input} type="email" placeholder="方便我联系你" value={form.email} onChange={set('email')} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>头像图片地址 *</label>
            <input className={styles.input} placeholder="https://... (建议正方形，会裁成圆形)" value={form.avatar || ''} onChange={set('avatar')} />
          </div>
          <button className={styles.submit} onClick={submit} disabled={!valid || submitting}>
            {submitting ? <ILoading /> : <ISend />} {submitting ? '提交中…' : '提交申请'}
          </button>
        </>
      )}
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function LinksPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 获取友链数据
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch('/api/links');
        const data = await response.json();
        
        // 检查是否是错误响应
        if (data.error) {
          throw new Error(data.error);
        }
        
        // 随机排序
        const shuffled = [...(data || [])].sort(() => Math.random() - 0.5);
        setFriends(shuffled);
      } catch (err) {
        // 只在开发环境显示错误，生产环境显示空状态
        if (process.env.NODE_ENV === 'development') {
          setError(err instanceof Error ? err.message : '获取友链失败');
        } else {
          setError(null);
          setFriends([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
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
              <span className={styles.statNum}>{loading ? '...' : friends.length}</span>
              <span className={styles.statLabel}>个友链</span>
            </div>
          </div>
        </div>
      </div>


      <main className={styles.main}>

        {loading ? (
          <>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>全部友链</span>
            </div>
            <LinkSkeleton count={12} />
          </>
        ) : error ? (
          <div className={styles.error}>
            {error}
          </div>
        ) : friends.length > 0 ? (
          <>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>全部友链</span>
            </div>
            <div className={styles.grid}>
              {friends.map((f, i) => (
                <FriendItem key={f.id} friend={f} idx={i} />
              ))}
            </div>
          </>
        ) : (
          <div className={styles.empty}>
            暂无友链
          </div>
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
                {
                  [
                    '博客已正常运营，内容以原创为主',
                    '博客内容健康，不含违法或不良信息',
                    '请先将本站加入你的友链，再提交申请',
                    '本站信息：木子博客 · w-blogs.top',
                  ].map((req, i) => (
                    <div key={i} className={styles.req}>
                      <div className={styles.reqIcon}>{i + 1}</div>
                      {req}
                    </div>
                  ))
                }
              </div>
            </div>
            <ApplyForm />
          </div>
        </div>

      </main>
    </>
  )
}