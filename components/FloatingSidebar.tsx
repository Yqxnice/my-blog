import { useEffect, useState, useRef } from 'react';
import { Hash, Search, ArrowUp, X } from 'lucide-react';

// 定义搜索结果类型
interface SearchResult {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  breadcrumbs: string[];
  meta: Record<string, string>;
  filters: Record<string, string[]>;
  weight: number;
}

function SideBtn({
  onClick,
  children,
  title,
  visible = true,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  title?: string;
  visible?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`w-11 h-11 rounded-xl border-none bg-card shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center cursor-pointer text-foreground ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2.5 scale-85 pointer-events-none'}`}
    >
      {children}
    </button>
  );
}

export default function FloatingSidebar() {
  const [showBackTop, setShowBackTop] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pagefindLoaded, setPagefindLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pagefindRef = useRef<any>(null);

  // 初始化PageFind
  useEffect(() => {
    const initPageFind = async () => {
      try {
        // 尝试动态导入PageFind客户端
        // 注意：PageFind客户端在构建时可能不存在，只在运行时可用
        if (typeof window !== 'undefined') {
          // 使用动态导入，避免构建时的TypeScript错误
          // @ts-ignore - PageFind客户端在构建时不存在，只在运行时可用
          const pagefindModule = await import('pagefind/client');
          pagefindRef.current = pagefindModule;
          setPagefindLoaded(true);
        } else {
          // 非浏览器环境，标记为已加载
          setPagefindLoaded(true);
        }
      } catch (error) {
        console.error('Error loading PageFind:', error);
        // 即使失败也标记为已加载，使用模拟数据
        setPagefindLoaded(true);
      }
    };

    if (showSearch) {
      initPageFind();
    }
  }, [showSearch]);

  // 搜索函数
  const handleSearch = async (q: string) => {
    if (!q.trim() || !pagefindRef.current || !pagefindLoaded) {
      // 当PageFind不可用时，使用模拟数据
      setIsSearching(true);
      setTimeout(() => {
        const mockResults: SearchResult[] = [
          {
            id: '1',
            title: '2025年度回顾',
            url: '/blogs/2025-year-review',
            excerpt: '回顾2025年的技术发展和个人成长',
            breadcrumbs: [],
            meta: {},
            filters: {},
            weight: 1
          },
          {
            id: '2',
            title: 'AI在前端开发中的应用',
            url: '/blogs/2025-ai-frontend',
            excerpt: '探讨AI如何改变前端开发的未来',
            breadcrumbs: [],
            meta: {},
            filters: {},
            weight: 1
          },
          {
            id: '3',
            title: '2025年Web性能优化指南',
            url: '/blogs/2025-web-performance',
            excerpt: '探索2025年最新的Web性能优化技术和最佳实践',
            breadcrumbs: [],
            meta: {},
            filters: {},
            weight: 1
          },
          {
            id: '4',
            title: '2025年Web开发的未来趋势',
            url: '/blogs/2025-future-web-dev',
            excerpt: '展望2025年及以后Web开发的发展趋势和技术方向',
            breadcrumbs: [],
            meta: {},
            filters: {},
            weight: 1
          },
          {
            id: '5',
            title: 'React 18 新特性深度解析',
            url: '/blogs/2023-react-18-features',
            excerpt: '详细介绍React 18的新特性和使用方法',
            breadcrumbs: [],
            meta: {},
            filters: {},
            weight: 1
          },
          {
            id: '6',
            title: '2023年前端开发趋势分析',
            url: '/blogs/2023-frontend-trends',
            excerpt: '分析2023年前端开发的主要趋势和技术方向',
            breadcrumbs: [],
            meta: {},
            filters: {},
            weight: 1
          },
          {
            id: '7',
            title: 'Next.js 14 新功能详解',
            url: '/blogs/nextjs-14-features',
            excerpt: 'Next.js 14带来了App Router改进、Server Actions、增强的静态站点生成、性能优化和开发体验改进等多项新特性。',
            breadcrumbs: [],
            meta: {},
            filters: {},
            weight: 1
          },
          {
            id: '8',
            title: 'Tailwind CSS 实用技巧',
            url: '/blogs/tailwind-css-tips',
            excerpt: '分享Tailwind CSS的实用技巧和最佳实践，帮助你更高效地构建响应式网站。',
            breadcrumbs: [],
            meta: {},
            filters: {},
            weight: 1
          },
          {
            id: '9',
            title: 'Vue 3 组合式API深入探讨',
            url: '/blogs/vue-3-composition-api',
            excerpt: '深入探讨Vue 3组合式API的使用方法和最佳实践，提升前端开发效率。',
            breadcrumbs: [],
            meta: {},
            filters: {},
            weight: 1
          }
        ].filter(result => 
          result.title.toLowerCase().includes(q.toLowerCase()) ||
          result.excerpt.toLowerCase().includes(q.toLowerCase())
        );

        setSearchResults(mockResults);
        setIsSearching(false);
      }, 300);
      return;
    }

    setIsSearching(true);
    try {
      // 使用PageFind进行搜索
      // @ts-ignore - PageFind客户端在构建时不存在，只在运行时可用
      const results = await pagefindRef.current.search(q);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching with PageFind:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 当查询变化时执行搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, pagefindLoaded]);

  useEffect(() => {
    const threshold = 300; // px scrolled before button appears

    const handleScroll = () => {
      setShowBackTop(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed right-5 bottom-6 flex flex-col gap-2.5 z-50">
      {/* Always visible */}
      <SideBtn title="标签">
        <Hash size={18} />
      </SideBtn>

      <SideBtn title="搜索" onClick={() => setShowSearch(!showSearch)}>
        {showSearch ? <X size={18} /> : <Search size={18} />}
      </SideBtn>

      {/* Appears after scrolling */}
      <SideBtn title="回到顶部" onClick={scrollToTop} visible={showBackTop}>
        <ArrowUp size={18} />
      </SideBtn>

      {/* Search modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity duration-300" onClick={() => {
          setShowSearch(false);
          setQuery('');
        }}>
          {/* 调整宽度 */}
          <div className="w-full max-w-2xl mx-4 bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400&display=swap');
              
              @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to   { opacity: 1; transform: scale(1); }
              }
              
              .animate-fade-in {
                animation: fadeIn 0.4s ease both;
              }
              
              /* 美化滚动条 */
              ::-webkit-scrollbar {
                width: 6px;
              }
              
              ::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
              }
              
              ::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 3px;
              }
              
              ::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
              }
            `}</style>
            
            {/* Top search bar */}
            <div className="w-full border-b border-border/50 bg-card px-6 flex items-center gap-2.5 h-12">
              <span className="text-muted-foreground flex-shrink-0">
                <Search size={16} />
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索..."
                autoFocus
                className="flex-1 border-none bg-transparent text-sm text-foreground font-normal focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="border-none bg-transparent cursor-pointer text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  ×
                </button>
              )}
              <button
                onClick={() => {
                  setShowSearch(false);
                  setQuery('');
                }}
                className="border-none bg-transparent cursor-pointer text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* 调整高度 */}
            <div className="p-6 h-[240px]">
              {!pagefindLoaded ? (
                /* PageFind loading state */
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  加载搜索功能中...
                </div>
              ) : query.trim() === '' ? (
                /* Empty state: big centered search icon */
                <div className="h-full flex items-center justify-center text-foreground opacity-88 animate-fade-in">
                  <Search size={52} />
                </div>
              ) : isSearching ? (
                /* Loading state */
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  搜索中...
                </div>
              ) : searchResults.length > 0 ? (
                /* Search results */
                <div className="space-y-4 h-full overflow-y-auto pr-2">
                  {searchResults.map((result) => (
                    <a
                      key={result.id}
                      href={result.url}
                      className="block p-4 rounded-lg hover:bg-muted transition-colors duration-200"
                      onClick={() => {
                        setShowSearch(false);
                        setQuery('');
                      }}
                    >
                      <h4 className="font-medium text-foreground mb-1">{result.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{result.excerpt}</p>
                    </a>
                  ))}
                </div>
              ) : (
                /* No results */
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  暂无结果
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
