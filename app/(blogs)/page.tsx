'use client';

import { useState, useEffect } from 'react';
import { BlogCard } from '@/components/blog/BlogCard';

import me from '@/public/me.jpg';
import { siteConfig } from '@/lib/config';

export default function BlogsPage() {
  const [posts, setPosts] = useState<Array<{
    id: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    views: number;
    comments: number;
    imageUrl: string;
    slug: string;
    tags: string[];
  }>>([]);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [subtitleWords, setSubtitleWords] = useState<string[]>([]);
  const titleText = '木子博客';
  const subtitleText = 'Code. Create. Care.';

  // 获取博客数据
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  // 定义动画样式（确保在客户端首次渲染时加载）
  useEffect(() => {
    if (!document.getElementById('slide-up-animation')) {
      const style = document.createElement('style');
      style.id = 'slide-up-animation';
      style.textContent = `
        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // 序列动画逻辑，使用定时器推迟状态更新，避免同步 setState
  useEffect(() => {
    const t1 = setTimeout(() => setIsTitleVisible(true), 0);
    const t2 = setTimeout(() => {
      const words = subtitleText.split(' ');
      setSubtitleWords(words);
      setSubtitleVisible(true);
      // 延迟后开始联系方式动画
      setTimeout(() => {
        setContactVisible(true);
      }, words.length * 300);
    }, 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [subtitleText]);

  return (
    <div className="w-full">
      {/* 新的头部区域 - 打字机特效 + 大头像 */}
      <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-0 py-12">
        {/* 左侧：打字机特效文字 + 联系方式 */}
        <div className="flex-1">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="relative min-h-[120px] md:min-h-[150px] lg:min-h-[180px] flex items-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                  {isTitleVisible && titleText.split('').map((char, index) => (
                    <span
                      key={index}
                      style={{
                        opacity: 0,
                        transform: 'translateY(40px)',
                        animation: `slideUp 0.8s ease-out ${index * 0.15}s forwards`
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </h1>
              </div>
              <div className="flex flex-wrap gap-2 items-center min-h-[40px] md:min-h-[50px]">
                {subtitleVisible && subtitleWords.map((word, index) => (
                  <h2 
                    key={index}
                    className="text-xl md:text-2xl text-muted-foreground"
                    style={{
                      opacity: 0,
                      transform: 'translateY(20px)',
                      animation: `slideUp 0.5s ease-out ${index * 0.2}s forwards`
                    }}
                  >
                    {word}
                  </h2>
                ))}
              </div>
            </div>
            
            {/* 联系方式 */}
            <div className="flex flex-col space-y-4">
              <div className="flex gap-4 min-h-[40px]">
                {contactVisible && siteConfig.socialLinks.map((social, index) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                    aria-label={social.name}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{
                      opacity: 0,
                      transform: 'translateY(20px)',
                      animation: `slideUp 0.5s ease-out ${index * 0.15}s forwards`
                    }}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* 右侧：大头像 */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full shadow-2xl overflow-hidden">
              <a href="#" className="block">
                <img 
                  src={me.src} 
                  alt="用户头像" 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer" 
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 博客卡片网格 */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">全部文章</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((blog) => (
            <BlogCard
              key={blog.id}
              title={blog.title}
              excerpt={blog.excerpt}
              date={blog.date}
              readTime={blog.readTime}
              views={blog.views}
              comments={blog.comments}
              imageUrl={blog.imageUrl}
              slug={blog.slug}
              tags={blog.tags}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
