// Umami 分析数据工具函数

// 缓存键和过期时间
const TOKEN_CACHE_KEY = "umami-token-cache";
const CACHE_TTL = 3600_000; // 1h

// 内存缓存
let memoryCache: Map<string, any> | null = null;
let tokenPromise: Promise<string> | null = null;

/**
 * 初始化内存缓存
 */
function initializeMemoryCache() {
  if (!memoryCache) {
    memoryCache = new Map();
  }
}

/**
 * 获取本地存储中的数据
 */
function getFromLocalStorage(key: string) {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * 存储数据到本地存储
 */
function setToLocalStorage(key: string, value: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // 忽略本地存储错误
  }
}

/**
 * 从本地存储中移除数据
 */
function removeFromLocalStorage(key: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // 忽略本地存储错误
  }
}

/**
 * 获取 Umami 认证 token
 * @param baseUrl Umami 实例基础 URL
 * @param username Umami 用户名
 * @param password Umami 密码
 * @returns 认证 token
 */
async function getUmamiToken(baseUrl: string, username: string, password: string) {
  // 检查本地存储缓存
  const cached = getFromLocalStorage(TOKEN_CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        return parsed.token;
      }
    } catch {
      removeFromLocalStorage(TOKEN_CACHE_KEY);
    }
  }

  // 避免重复请求
  if (tokenPromise) {
    return tokenPromise;
  }

  // 从 API 获取 token
  tokenPromise = (async () => {
    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error(`获取 Umami 认证 token 失败: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const token = data.token;

      // 存储到本地存储
      setToLocalStorage(
        TOKEN_CACHE_KEY,
        JSON.stringify({ timestamp: Date.now(), token }),
      );

      return token;
    } finally {
      tokenPromise = null;
    }
  })();

  return tokenPromise;
}

/**
 * 通用 Umami API 请求函数
 * @param baseUrl Umami 实例基础 URL
 * @param username Umami 用户名
 * @param password Umami 密码
 * @param endpoint API 端点
 * @param params 查询参数
 * @param retryCount 重试次数（内部使用）
 * @returns API 响应数据
 */
async function umamiApiRequest(
  baseUrl: string,
  username: string,
  password: string,
  endpoint: string,
  params: Record<string, string> = {},
  retryCount: number = 0
) {
  try {
    // 获取认证 token
    const token = await getUmamiToken(baseUrl, username, password);

    // 构建完整 URL
    const url = new URL(`${baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const res = await fetch(url.toString(), {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401 && retryCount < 1) {
        // Token 过期，清除缓存并重新获取
        removeFromLocalStorage(TOKEN_CACHE_KEY);
        tokenPromise = null;
        // 重新调用函数，增加重试计数
        return umamiApiRequest(baseUrl, username, password, endpoint, params, retryCount + 1);
      }
      throw new Error(`Umami API 请求失败: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    // 清除失败的 promise
    tokenPromise = null;
    throw error;
  }
}

/**
 * 获取 Umami 统计数据
 * @param baseUrl Umami 实例基础 URL
 * @param username Umami 用户名
 * @param password Umami 密码
 * @param websiteId 网站 ID
 * @param queryParams 查询参数
 * @returns 统计数据
 */
export async function fetchUmamiStats(
  baseUrl: string,
  username: string,
  password: string,
  websiteId: string,
  queryParams: any = {}
) {
  // 初始化内存缓存
  initializeMemoryCache();

  // 生成缓存键
  const cacheKey = `${baseUrl}|${websiteId}|${JSON.stringify(queryParams)}`;
  
  // 检查内存缓存
  if (memoryCache?.has(cacheKey)) {
    const data = memoryCache.get(cacheKey);
    return { ...data, _fromCache: true };
  }

  try {
    const currentTimestamp = Date.now();
    const params = {
      startAt: '0',
      endAt: currentTimestamp.toString(),
      unit: "hour",
      timezone: queryParams.timezone || "Asia/Shanghai",
      compare: "false",
      ...queryParams,
    };

    const data = await umamiApiRequest(
      baseUrl,
      username,
      password,
      `/api/websites/${websiteId}/stats`,
      params
    );

    // 写入内存缓存
    memoryCache?.set(cacheKey, data);
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * 获取指定页面的访问量
 * @param baseUrl Umami 实例基础 URL
 * @param username Umami 用户名
 * @param password Umami 密码
 * @param websiteId 网站 ID
 * @param pagePath 页面路径
 * @returns 页面访问量
 */
export async function fetchPageViews(
  baseUrl: string,
  username: string,
  password: string,
  websiteId: string,
  pagePath: string
) {
  // 初始化内存缓存
  initializeMemoryCache();

  // 生成缓存键
  const cacheKey = `${baseUrl}|${websiteId}|pageviews|${pagePath}`;
  
  // 检查内存缓存
  if (memoryCache?.has(cacheKey)) {
    const data = memoryCache.get(cacheKey);
    return data;
  }

  try {
    const currentTimestamp = Date.now();
    const params = {
      startAt: '0',
      endAt: currentTimestamp.toString(),
      unit: "day",
      timezone: "Asia/Shanghai",
      compare: "false",
      path: `eq.${pagePath}`,
    };

    const data = await umamiApiRequest(
      baseUrl,
      username,
      password,
      `/api/websites/${websiteId}/stats`,
      params
    );

    const pageViews = data.pageviews || 0;
    
    // 写入内存缓存
    memoryCache?.set(cacheKey, pageViews);
    return pageViews;
  } catch (error) {
    throw error;
  }
}

/**
 * 清除 Umami 缓存
 */
export function clearUmamiCache() {
  // 清除本地存储缓存
  removeFromLocalStorage(TOKEN_CACHE_KEY);
  
  // 清除内存缓存
  memoryCache?.clear();
  
  // 清除正在进行的请求
  tokenPromise = null;
}
