'use client';

import { useState, useEffect } from 'react';
import { algoliasearch } from 'algoliasearch';
import { Highlight, Hits, InstantSearch, SearchBox, Configure, useInstantSearch } from 'react-instantsearch';
import type { Hit } from 'instantsearch.js';
import { algoliaConfig, isAlgoliaConfigured } from '@/lib/algolia-config';

interface BlogHit {
  objectID: string;
  title: string;
  excerpt: string;
  slug: string;
  tags: string[];
  date: string;
}

/**
 * 搜索结果组件
 */
function SearchResults() {
  const { status } = useInstantSearch();
  const hasQuery = status !== 'idle';

  if (!hasQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
          <svg
            className="text-muted-foreground"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">搜索文章</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          输入关键词搜索文章标题、内容和标签
        </p>
      </div>
    );
  }

  return (
    <Hits
      hitComponent={({ hit }: { hit: Hit<BlogHit> }) => (
        <a
          href={`/blogs/${hit.slug}`}
          className="block p-4 rounded-lg hover:bg-secondary transition-colors group border border-transparent hover:border-border"
        >
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mb-2">
            <Highlight attribute="title" hit={hit} />
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            <Highlight attribute="excerpt" hit={hit} />
          </p>
          {hit.tags && hit.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {hit.tags.slice(0, 4).map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 bg-muted rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </a>
      )}
      classNames={{
        root: 'space-y-4',
        emptyRoot: 'text-center py-12 text-muted-foreground',
        list: 'space-y-4',
      }}
    />
  );
}

/**
 * Algolia 搜索配置组件
 */
function SearchConfig() {
  return (
    <div className="p-8 text-center">
      <svg
        className="mx-auto mb-4 text-muted-foreground"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <h3 className="text-lg font-medium mb-2">搜索功能未配置</h3>
      <p className="text-muted-foreground mb-4">
        请在 .env.local 文件中配置 Algolia 凭证
      </p>
      <div className="text-sm text-left bg-muted p-4 rounded-lg max-w-md mx-auto">
        <p className="font-mono mb-2">NEXT_PUBLIC_ALGOLIA_APP_ID=your-app-id</p>
        <p className="font-mono mb-2">NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your-search-key</p>
        <p className="font-mono">NEXT_PUBLIC_ALGOLIA_INDEX_NAME=blogs</p>
      </div>
    </div>
  );
}

/**
 * 博客搜索组件 - 直接集成在页面中
 */
export function BlogSearch() {
  const [searchClient, setSearchClient] = useState<ReturnType<typeof algoliasearch> | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const configured = isAlgoliaConfigured();
    setIsConfigured(configured);

    if (configured) {
      const client = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey);
      setSearchClient(client);
    }
  }, []);

  if (!isConfigured || !searchClient) {
    return <SearchConfig />;
  }

  return (
    <InstantSearch searchClient={searchClient} indexName={algoliaConfig.indexName}>
      <Configure hitsPerPage={10} />

      {/* 搜索框 */}
      <div className="mb-6">
        <SearchBox
          classNames={{
            root: 'relative',
            form: 'relative',
            input: 'w-full pl-11 pr-4 py-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground',
            submit: 'absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground',
            reset: 'absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground',
            loadingIcon: 'absolute right-3.5 top-1/2 -translate-y-1/2',
          }}
          placeholder="搜索文章标题、内容和标签..."
          autoFocus
        />
      </div>

      {/* 搜索结果 */}
      <div className="bg-background rounded-lg">
        <SearchResults />
      </div>
    </InstantSearch>
  );
}