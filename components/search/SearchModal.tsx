/**
 * 功能：搜索模态框组件
 * 目的：提供文章搜索功能，使用Algolia搜索服务
 * 作者：Yqxnice
 */
"use client";

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { algoliasearch } from 'algoliasearch';
import { InstantSearch, Hits, Highlight, Snippet, useSearchBox, useInstantSearch, useHits, PoweredBy } from 'react-instantsearch';
import { algoliaConfig } from '@/lib/algolia-config';

import styles from './SearchModal.module.css';

const searchClient = algoliasearch(
  algoliaConfig.appId,
  algoliaConfig.apiKey
);

// --- 1. 防抖搜索框 ---
const DebouncedSearchBox = ({ delay = 300, onClose }: { delay?: number, onClose: () => void }) => {
  const { query, refine } = useSearchBox();
  const [inputValue, setInputValue] = useState(query);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value); 
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => refine(value), delay);
  };

  return (
    <div className={styles.header}>
      <div className={styles.searchIcon}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      
      <input
        autoFocus
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="搜索文章内容或关键词..."
        className={styles.input}
      />

      <div className={styles.headerRight}>
        {inputValue ? (
          <button onClick={() => { setInputValue(''); refine(''); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        ) : (
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', fontSize: '14px' }}>
            取消
          </button>
        )}
      </div>
    </div>
  );
};

// --- 2. 主组件 ---
export default function SearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [mounted, setMounted] = useState(false); // 用于处理 SSR 下的 Portal
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleModalKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleModalKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleModalKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const Hit = ({ hit }: { hit: any }) => {
    const targetUrl = `/blogs/${hit.slug}`;
    return (
      <article 
        onClick={() => { router.push(targetUrl); onClose(); }}
        onMouseEnter={() => router.prefetch(targetUrl)}
        className={styles.hitItem}
      >
        <h3 className={styles.hitTitle}><Highlight attribute="title" hit={hit} /></h3>
        <p className={styles.hitDesc}><Snippet attribute="content" hit={hit} /></p>
      </article>
    );
  };

  const SearchResults = () => {
    const { query } = useSearchBox();
    const { hits } = useHits();
    const { status } = useInstantSearch();

    // 状态 A：没有输入关键词，显示提示语
    if (!query || query.trim() === '') {
      return (
        <div className={styles.resultsWrapper}>
          <div className={styles.statusContainer}>
            <svg style={{ width: '40px', height: '40px', color: '#cbd5e1', marginBottom: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            请输入关键词开始搜索...
          </div>
        </div>
      );
    }

    const isLoading = status === 'loading' || status === 'stalled';

    return (
      <div className={styles.resultsWrapper}>
        {/* 1. 中心加载覆盖层 - 当搜索中且已有查询时出现 */}
        {isLoading && (
            <div className={styles.centralLoadingOverlay}>
                <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {/* 只有在初次加载（hits为空）时显示文字，避免打字更新时文字闪烁 */}
                {hits.length === 0 ? <span style={{ marginTop: '12px' }}>正在为您检索...</span> : null}
            </div>
        )}

        {/* 2. 核心：结果展示区 / 无结果区 */}
        {/* 我们不在 .resultsWrapper 层面切换，而是把 Hits 包裹起来，
            这保证了即使 isLoading 时，老数据列表依然在下面被模糊覆盖 */}
        <div className={styles.scrollableArea}>
            {hits.length === 0 && !isLoading ? (
                // 只有在加载完成且确实没数据时才显示这个
                <div className={styles.statusContainer} style={{ background: 'white' }}>
                    找不到与 &quot;{query}&quot; 相关的结果
                </div>
            ) : (
                <Hits 
                    hitComponent={Hit} 
                    classNames={{ list: '', item: '' }} 
                />
            )}
        </div>
      </div>
    );
  };

  // 模态框内容 (将被 Portal 传送)
  const modalContent = isOpen ? (
    <div className={styles.overlay}>
      <div ref={modalRef} className={styles.modal}>
        <InstantSearch searchClient={searchClient} indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME as string}>
          <DebouncedSearchBox delay={300} onClose={onClose} />
          <SearchResults />
          <div className={styles.footer}>
            <PoweredBy classNames={{ root: styles.algoliaLogo }} />
          </div>
        </InstantSearch>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* 使用 Portal 将模态框挂载到 body 下，彻底脱离父级 DOM 的束缚 */}
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
