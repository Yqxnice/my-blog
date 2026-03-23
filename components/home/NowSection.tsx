'use client';

// 类型定义
type StatusType = 'reading' | 'listening' | 'hacking';
interface StatusItem {
  type: StatusType;
  title: string;
  sub: string;
  note: string;
  cover: string;
  progress?: number;
  link?: string;
  github?: string;
}

// 常量
const STATUS_ITEMS: StatusItem[] = [
  { type: 'reading',   title: '置身事内',   sub: '兰小欢',              note: '终于认真读一遍，政治经济学写得很接地气。',         cover: 'https://api.dicebear.com/7.x/shapes/svg?seed=book1&backgroundColor=fbbf24,f59e0b',  progress: 60 },
  { type: 'listening', title: 'Bright Future', sub: 'Adrianne Lenker', note: '最近睡前单曲循环，嗓音像流水。',                   cover: 'https://api.dicebear.com/7.x/shapes/svg?seed=music1&backgroundColor=93c5fd,60a5fa' },
  { type: 'hacking',   title: '这个博客',    sub: 'Next.js · TypeScript', note: '持续在折腾，主题和评论系统还没做完。',           cover: 'https://api.dicebear.com/7.x/shapes/svg?seed=hack1&backgroundColor=6ee7b7,34d399', progress: 45, link: 'https://github.com/', github: 'torvalds' },
];
const STATUS_META: Record<StatusType, { label: string }> = {
  reading: { label: '在读' }, listening: { label: '在听' }, hacking: { label: '在折腾' },
};

// 图标组件
const IExternal = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M11 11H4V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;

// GitHub 贡献图组件
function ContribGraph({ username }: { username: string }) {
  // 使用固定的种子生成一致的贡献图，避免hydration mismatch
  const getIntensity = (index: number) => {
    let seed = username.length + index;
    for (let i = 0; i < username.length; i++) {
      seed += username.charCodeAt(i);
    }
    return (seed * (index + 1)) % 5;
  };

  return (
    <div className="mt-3">
      <div className="text-xs text-muted-foreground mb-2">GitHub 贡献</div>
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 100 }, (_, i) => {
            const intensity = getIntensity(i);
            const colors = ['bg-gray-100', 'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500'];
            return (
              <div 
                key={i} 
                className={`w-2 h-2 rounded ${colors[intensity]}`}
                title={`贡献 ${i + 1}`}
              />
            );
          })}
        </div>
        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-gray-100"></span>
          <span>较少</span>
          <span className="w-2 h-2 rounded bg-green-300 ml-2"></span>
          <span>中等</span>
          <span className="w-2 h-2 rounded bg-green-500 ml-2"></span>
          <span>较多</span>
        </div>
      </div>
    </div>
  );
}

// NowSection组件
export function NowSection() {
  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-3.5 h-[1.5px] bg-primary"></span>
          <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">近况</span>
        </div>
        <div>
          {STATUS_ITEMS.map((item, i) => (
            <div key={i} className="flex items-start gap-4 py-4" style={{ animationDelay: `${i * 0.07}s`, animation: 'fadeUp .45s ease both' }}>
              <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden">
                <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <span className={`mz-now-badge-dot ${item.type}`} style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    backgroundColor: item.type === 'reading' ? '#f59e0b' : item.type === 'listening' ? '#3b82f6' : '#10b981'
                  }} />
                  <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
                    {STATUS_META[item.type].label}
                  </span>
                </div>
                <div className="text-sm font-medium text-foreground whitespace-nowrap overflow-hidden text-ellipsis mb-1">
                  {item.title}
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  {item.sub}
                </div>
                <div className="text-xs text-muted-foreground italic mb-3">
                  {item.note}
                </div>
                {item.type === 'hacking' && item.github && (
                  <ContribGraph username={item.github} />
                )}
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-2 min-w-[80px]">
                {item.progress != null && (
                  <div className="w-18">
                    <div className="h-1 bg-border rounded overflow-hidden mb-1">
                      <div 
                        className="h-full rounded" 
                        style={{
                          width: `${item.progress}%`,
                          backgroundColor: item.type === 'reading' ? '#f59e0b' : item.type === 'listening' ? '#3b82f6' : '#10b981'
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {item.progress}%
                    </div>
                  </div>
                )}
                {item.link && (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener" 
                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                    onClick={e => e.stopPropagation()}
                  >
                    查看 <IExternal />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          上次更新于 2026-03-20
        </div>
      </div>
    </div>
  );
}
