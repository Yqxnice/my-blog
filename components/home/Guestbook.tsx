'use client';

import { useState, useEffect, useRef } from "react";
import { EmojiPickerButton } from "@/components/common/emoji/EmojiPickerButton";

// 类型定义
interface GuestMsg { id: string; name: string; msg: string; date: string; emoji: string }

// 常量
const SEED_MSGS: GuestMsg[] = [
  { id: '1', name: '访客', msg: '很棒的博客！', date: '2024-01-01', emoji: '🔥' },
  { id: '2', name: '路人', msg: '加油，继续创作！', date: '2024-01-02', emoji: '✨' },
  { id: '3', name: '读者', msg: '内容很有帮助', date: '2024-01-03', emoji: '🎯' },
];

// Guestbook（跑马灯版）组件
export function Guestbook() {
  const STORAGE_KEY = 'mz_guest_msgs'
  // 服务器端只使用种子消息，避免 hydration mismatch
  const [msgs, setMsgs] = useState<GuestMsg[]>(SEED_MSGS)

  // 只在客户端加载后从 localStorage 读取用户消息
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const user = JSON.parse(saved) as GuestMsg[]
        if (user.length > 0) {
          // 使用函数式更新避免在effect中直接调用setState
          setMsgs(prev => [...user, ...prev])
        }
      }
    } catch { /* ignore */ }
  }, [])
  const [name, setName]       = useState('')
  const [text, setText]       = useState('')
  const [emoji, setEmoji]     = useState('✨')
  const [submitting, setSub]  = useState(false)
  const [thanks, setThanks]   = useState(false)
  const emojiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        // 关闭 emoji picker
      }
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const submit = async () => {
    if (!name.trim() || !text.trim()) return
    setSub(true)
    await new Promise(r => setTimeout(r, 450))
    const newMsg: GuestMsg = { id: Date.now().toString(), name: name.trim(), msg: text.trim(), emoji, date: new Date().toISOString().slice(0, 10) }
    const updated = [newMsg, ...msgs]
    setMsgs(updated)
    try {
      const userMsgs = updated.filter(m => !SEED_MSGS.find(s => s.id === m.id))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userMsgs))
    } catch { /* ignore */ }
    setName(''); setText(''); setEmoji('✨')
    setSub(false); setThanks(true); setTimeout(() => setThanks(false), 3000)
  }

  // 复制一份让跑马灯无缝循环
  const doubled = [...msgs, ...msgs]

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase flex items-center gap-2">
          <span className="w-3.5 h-[1.5px] bg-primary"></span>
          留言墙
        </span>
        <span className="text-xs text-muted-foreground">{msgs.length} 条留言</span>
      </div>

      {/* 无限滚动跑马灯 */}
      <div className="relative overflow-hidden mb-6">
        <div 
          className="flex gap-4 animate-marquee"
          style={{
            animation: 'marquee 30s linear infinite',
          }}
        >
          {doubled.map((m, i) => (
            <div key={`${m.id}-${i}`} className="flex-shrink-0 bg-secondary px-4 py-3 rounded-lg shadow-sm border border-border min-w-[200px]">
              <div className="flex items-start gap-3">
                <div className="text-xl">{m.emoji}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground mb-1">{m.msg}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{m.name}</span>
                    <span>·</span>
                    <span>{m.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 写留言 */}
      <div className="p-4">
        <div className="flex gap-3 items-end">
          <EmojiPickerButton 
            onEmojiSelect={setEmoji}
            selectedEmoji={emoji}
          />
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex gap-2">
              <input 
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                placeholder="你的名字" 
                value={name}
                onChange={e => setName(e.target.value)} 
                maxLength={20} 
              />
              <input 
                className="flex-2 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                placeholder="留下几个字…" 
                value={text}
                onChange={e => setText(e.target.value)} 
                maxLength={100}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submit()} 
              />
              <button 
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:border-primary hover:text-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                onClick={submit}
                disabled={submitting || !name.trim() || !text.trim()}
              >
                {submitting ? '发送中…' : thanks ? '谢谢 🎉' : '留言'}
              </button>
            </div>
            <div className="text-xs text-muted-foreground">留言会滚动展示 · Enter 发送</div>
          </div>
        </div>
      </div>
    </div>
  )
}
