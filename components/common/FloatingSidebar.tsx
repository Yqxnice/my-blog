'use client';

import { useEffect, useState } from 'react';
import { Hash, ArrowUp, Bell, Search } from 'lucide-react';
import { Modal } from './Modal';
import PushNotificationSubscribe from './PushNotificationSubscribe';
import SearchModal from '../search/SearchModal';

interface FloatingSidebarProps {
  tags?: string[];
  moods?: string[];
  moodEmojis?: Record<string, string>;
  activeTag?: string | null;
  activeMood?: string | null;
  page?: 'blogs' | 'talks' | 'notes';
  onTagClick?: (tag: string) => void;
  onMoodClick?: (mood: string) => void;
  onClearFilters?: () => void;
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

export default function FloatingSidebar({ tags = [], moods = [], moodEmojis = {}, activeTag = null, activeMood = null, page = 'blogs', onTagClick, onMoodClick, onClearFilters }: FloatingSidebarProps) {
  const [showBackTop, setShowBackTop] = useState(false);
  const [showPushNotification, setShowPushNotification] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [sidebarBottom, setSidebarBottom] = useState(24);
  const [sidebarRef, setSidebarRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const threshold = 300;
    const footer = document.querySelector('footer.ft');
    const defaultBottom = 24;
    const margin = 20;
    
    const handleScroll = () => {
      setShowBackTop(window.scrollY > threshold);
      
      if (footer && sidebarRef) {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (footerRect.top < windowHeight) {
          const newBottom = windowHeight - footerRect.top + margin;
          setSidebarBottom(newBottom);
        } else {
          setSidebarBottom(defaultBottom);
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [sidebarRef]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      ref={setSidebarRef}
      className={`fixed right-5 flex flex-col gap-2.5 z-50 transition-all duration-300`}
      style={{
        bottom: `${sidebarBottom}px`
      }}
    >
      <SideBtn title="标签" onClick={() => setShowTagsModal(true)}>
        <Hash size={18} />
      </SideBtn>

      <SideBtn title="推送通知" onClick={() => setShowPushNotification(!showPushNotification)}>
        <Bell size={18} />
      </SideBtn>

      <SideBtn title="搜索" onClick={() => setShowSearchModal(true)}>
        <Search size={18} />
      </SideBtn>

      <SideBtn title="回到顶部" onClick={scrollToTop} visible={showBackTop}>
        <ArrowUp size={18} />
      </SideBtn>

      <Modal
        isOpen={showPushNotification}
        onClose={() => setShowPushNotification(false)}
        title="推送通知"
        maxWidth="md"
      >
        <div className="p-6">
          <PushNotificationSubscribe />
        </div>
      </Modal>

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />

      <Modal
        isOpen={showTagsModal}
        onClose={() => setShowTagsModal(false)}
        title={`${page === 'blogs' ? '博客' : page === 'talks' ? '碎碎念' : '手记'}标签`}
        maxWidth="md"
      >
        <div className="p-6">
          <div className="space-y-4">
            {/* 清除筛选按钮 */}
            {(activeTag || activeMood) && onClearFilters && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    onClearFilters();
                    setShowTagsModal(false);
                  }}
                  className="text-xs text-primary hover:underline underline-offset-2"
                >
                  清除筛选
                </button>
              </div>
            )}
            
            {/* 心情标签 */}
            {moods && moods.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-3">心情</p>
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (onMoodClick) {
                          onMoodClick(mood);
                          setShowTagsModal(false);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer flex items-center gap-1.5 ${activeMood === mood ? 'bg-primary text-white' : 'bg-muted hover:bg-primary hover:text-white'}`}
                    >
                      <span>{moodEmojis[mood] || ''}</span>
                      <span>{mood}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* 分隔线 */}
            {moods && moods.length > 0 && tags && tags.length > 0 && (
              <div className="border-t border-border my-4"></div>
            )}
            
            {/* 普通标签 */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                {tags && tags.length > 0 ? '标签' : `暂无${page === 'blogs' ? '博客' : page === 'talks' ? '碎碎念' : '手记'}标签`}
              </p>
              <div className="flex flex-wrap gap-2">
                  {tags && tags.length > 0 ? (
                    tags.map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (onTagClick) {
                            onTagClick(tag);
                            setShowTagsModal(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${activeTag === tag ? 'bg-primary text-white' : 'bg-muted hover:bg-primary hover:text-white'}`}
                      >
                        #{tag}
                      </button>
                    ))
                  ) : (
                    !moods || moods.length === 0 ? (
                      <span className="text-sm text-muted-foreground">
                        还没有标签
                      </span>
                    ) : null
                  )}
                </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
