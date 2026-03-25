'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';

interface CommentSectionProps {
  postId: string;
}

interface User {
  id: string;
  name: string | null;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  user: User;
  replies?: Comment[];
}

// 构建树形结构
function buildCommentTree(comments: Comment[]): Comment[] {
  const map = new Map<string, Comment>();
  const roots: Comment[] = [];

  // 先创建所有评论的映射，并初始化 replies
  comments.forEach(comment => {
    map.set(comment.id, { ...comment, replies: [] });
  });

  // 构建树形结构
  comments.forEach(comment => {
    const node = map.get(comment.id)!;
    if (comment.parentId) {
      const parent = map.get(comment.parentId);
      if (parent) {
        parent.replies!.push(node);
      } else {
        // 找不到父评论，作为根评论处理
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}

// 递归渲染单条评论
function CommentItem({
  comment,
  depth = 0,
  session,
  onReply,
  replyingTo,
  onSubmitReply,
  replyContent,
  setReplyContent,
  submittingReply,
}: {
  comment: Comment;
  depth?: number;
  session: any;
  onReply: (commentId: string) => void;
  replyingTo: string | null;
  onSubmitReply: (parentId: string, content: string) => Promise<void>;
  replyContent: string;
  setReplyContent: (content: string) => void;
  submittingReply: boolean;
}) {
  const isReplying = replyingTo === comment.id;
  const maxDepth = 6; // 最大嵌套深度
  const showIndent = depth < maxDepth;

  return (
    <div className={`${depth > 0 ? 'ml-3 sm:ml-6 pl-3 sm:pl-4 border-l-2 border-border/40' : ''}`}>
      <div className="flex gap-2 sm:gap-3 py-2 sm:py-3">
        {/* 头像 */}
        {comment.user.image && (
          <img
            src={comment.user.image}
            alt={comment.user.name || '用户头像'}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-border object-cover flex-shrink-0"
          />
        )}
        
        <div className="flex-1 min-w-0">
          {/* 用户名和时间 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-medium text-foreground">
              {comment.user.name || '匿名用户'}
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* 评论内容 */}
          <p className="text-xs sm:text-sm text-foreground mt-1 whitespace-pre-wrap break-words">
            {comment.content}
          </p>

          {/* 回复按钮 */}
          {session?.user && (
            <button
              onClick={() => onReply(comment.id)}
              className="mt-1.5 text-[11px] sm:text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {isReplying ? '取消回复' : '回复'}
            </button>
          )}

          {/* 回复输入框 */}
          {isReplying && (
            <div className="mt-3 space-y-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-xs sm:text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-muted-foreground/70"
                placeholder={`回复 ${comment.user.name || '匿名用户'}...`}
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  {replyContent.length} / 500
                </span>
                <button
                  onClick={() => onSubmitReply(comment.id, replyContent)}
                  disabled={submittingReply || !replyContent.trim()}
                  className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submittingReply ? '发送中...' : '发送'}
                </button>
              </div>
            </div>
          )}

          {/* 子评论 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 space-y-1">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  session={session}
                  onReply={onReply}
                  replyingTo={replyingTo}
                  onSubmitReply={onSubmitReply}
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                  submittingReply={submittingReply}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`);
      if (!res.ok) throw new Error('加载评论失败');
      const data = await res.json();
      const tree = buildCommentTree(data.comments || []);
      setComments(tree);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!session?.user) {
      setError('请先登录后再发表评论');
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '发表评论失败');
      }
      setContent('');
      await fetchComments(); // 刷新评论列表
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (commentId: string) => {
    if (replyingTo === commentId) {
      setReplyingTo(null);
      setReplyContent('');
    } else {
      setReplyingTo(commentId);
      setReplyContent('');
    }
  };

  const handleSubmitReply = async (parentId: string, content: string) => {
    if (!content.trim() || !session?.user) return;
    
    setSubmittingReply(true);
    setError(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content, parentId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '回复失败');
      }
      setReplyContent('');
      setReplyingTo(null);
      await fetchComments(); // 刷新评论列表
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmittingReply(false);
    }
  };

  // 统计总评论数（包括嵌套）
  const countAllComments = (comments: Comment[]): number => {
    return comments.reduce((acc, c) => acc + 1 + (c.replies ? countAllComments(c.replies) : 0), 0);
  };

  const totalComments = countAllComments(comments);

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary rounded-full" />
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            评论 {totalComments > 0 && <span className="text-muted-foreground font-normal text-sm">({totalComments})</span>}
          </h2>
        </div>
        {status !== 'loading' && !session && (
          <div className="flex gap-2 text-xs sm:text-sm">
            <button
              type="button"
              className="px-2 sm:px-3 py-1 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              onClick={() => signIn('github')}
            >
              GitHub
            </button>
            <button
              type="button"
              className="px-2 sm:px-3 py-1 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              onClick={() => signIn('google')}
            >
              Google
            </button>
          </div>
        )}
      </div>

      {/* 输入区域 */}
      {session?.user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-start gap-3">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || '用户头像'}
                className="hidden sm:block w-9 h-9 rounded-full border border-border object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-muted-foreground/70"
                placeholder="写下你的想法..."
                maxLength={500}
              />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{content.length} / 500</span>
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? '发送中...' : '发布评论'}
                </button>
              </div>
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </form>
      ) : (
        <p className="text-xs sm:text-sm text-muted-foreground">
          登录后即可发表评论，支持 GitHub 与 Google 登录。
        </p>
      )}

      {/* 评论列表 */}
      <div className="space-y-1">
        {loading && <p className="text-xs text-muted-foreground py-4">评论加载中...</p>}
        {!loading && comments.length === 0 && (
          <p className="text-xs sm:text-sm text-muted-foreground py-4">还没有评论，快来抢沙发吧～</p>
        )}
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            session={session}
            onReply={handleReply}
            replyingTo={replyingTo}
            onSubmitReply={handleSubmitReply}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            submittingReply={submittingReply}
          />
        ))}
      </div>
    </div>
  );
}
