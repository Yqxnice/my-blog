/**
 * 功能：API请求速率限制
 * 目的：防止API被滥用，限制请求频率
 * 作者：Yqxnice
 */
import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  /** 时间窗口（毫秒） */
  windowMs: number;
  /** 时间窗口内最大请求数 */
  maxRequests: number;
  /** 使用的存储类型 */
  storage?: 'memory' | 'redis';
}

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

/**
 * 内存存储的速率限制器
 * 注意：重启服务器会重置计数，生产环境建议使用 Redis
 */
class RateLimiter {
  private requests: Map<string, RateLimitInfo> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;

    // 定期清理过期记录
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.requests.entries()) {
        if (now > value.resetTime) {
          this.requests.delete(key);
        }
      }
    }, 60000); // 每分钟清理一次
  }

  /**
   * 检查请求是否超过限制
   * @param identifier - 唯一标识符（IP 地址或用户 ID）
   * @returns { allowed: boolean, limit: number, remaining: number, resetTime: number }
   */
  check(identifier: string) {
    const now = Date.now();
    const record = this.requests.get(identifier);

    // 如果没有记录或已过期，创建新记录
    if (!record || now > record.resetTime) {
      const resetTime = now + this.config.windowMs;
      this.requests.set(identifier, {
        count: 1,
        resetTime,
      });

      return {
        allowed: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - 1,
        resetTime,
      };
    }

    // 如果在时间窗口内，增加计数
    if (record.count < this.config.maxRequests) {
      record.count++;
      return {
        allowed: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - record.count,
        resetTime: record.resetTime,
      };
    }

    // 超过限制
    return {
      allowed: false,
      limit: this.config.maxRequests,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  /**
   * 重置指定标识符的计数
   */
  reset(identifier: string) {
    this.requests.delete(identifier);
  }
}

/**
 * 创建速率限制器实例
 */
export function createRateLimiter(config: RateLimitConfig) {
  return new RateLimiter(config);
}

/**
 * 从请求中获取客户端 IP 地址
 */
export function getClientIp(request: NextRequest): string {
  // 检查各种可能的 IP 头
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  if (forwardedFor) {
    // x-forwarded-for 可能包含多个 IP，取第一个
    return forwardedFor.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // 如果所有头都不存在，返回 unknown
  return 'unknown';
}

/**
 * API 速率限制中间件
 *
 * @example
 * ```ts
 * export async function GET(request: NextRequest) {
 *   const rateLimit = await rateLimitMiddleware(request, {
 *     windowMs: 60000, // 1 分钟
 *     maxRequests: 10, // 最多 10 次请求
 *   });
 *
 *   if (!rateLimit.allowed) {
 *     return rateLimit.response;
 *   }
 *
 *   // 处理正常的 API 请求
 *   return NextResponse.json({ data: '...' });
 * }
 * ```
 */
export async function rateLimitMiddleware(
  request: NextRequest,
  config: RateLimitConfig
): Promise<{
  allowed: boolean;
  response?: NextResponse;
  limit: number;
  remaining: number;
  resetTime: number;
}> {
  const limiter = createRateLimiter(config);
  const ip = getClientIp(request);
  const result = limiter.check(ip);

  if (!result.allowed) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${Math.ceil((result.resetTime - Date.now()) / 1000)} seconds.`,
          limit: result.limit,
          remaining: result.remaining,
          resetTime: new Date(result.resetTime).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          },
        }
      ),
      limit: result.limit,
      remaining: result.remaining,
      resetTime: result.resetTime,
    };
  }

  return {
    allowed: true,
    limit: result.limit,
    remaining: result.remaining,
    resetTime: result.resetTime,
  };
}

/**
 * 预设的速率限制配置
 */
export const rateLimitPresets = {
  /** 严格限制：每分钟 10 次请求 */
  strict: { windowMs: 60000, maxRequests: 10 },
  /** 中等限制：每分钟 30 次请求 */
  moderate: { windowMs: 60000, maxRequests: 30 },
  /** 宽松限制：每分钟 100 次请求 */
  loose: { windowMs: 60000, maxRequests: 100 },
  /** 每小时限制 */
  hourly: { windowMs: 3600000, maxRequests: 1000 },
  /** 每天限制 */
  daily: { windowMs: 86400000, maxRequests: 10000 },
};
