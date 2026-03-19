// 缓存名称
const CACHE_NAME = 'muzi-blog-cache-v1';

// 需要缓存的资源
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/me.jpg',
  '/next.svg',
  '/vercel.svg',
  '/globe.svg',
  '/window.svg',
  '/file.svg'
];

// 安装事件：缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('缓存已打开');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活事件：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('清理旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

//  fetch 事件：优先从缓存获取，否则网络请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果缓存中有响应，直接返回
        if (response) {
          return response;
        }

        // 否则发起网络请求
        return fetch(event.request)
          .then((networkResponse) => {
            // 只缓存 GET 请求的响应，并且只缓存 http/https 协议的请求
            if (event.request.method === 'GET' && 
                networkResponse && 
                networkResponse.ok &&
                (event.request.url.startsWith('http://') || event.request.url.startsWith('https://'))) {
              // 克隆响应，因为响应流只能使用一次
              const responseToCache = networkResponse.clone();
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  try {
                    cache.put(event.request, responseToCache);
                  } catch (error) {
                    console.warn('缓存失败:', error);
                  }
                })
                .catch((error) => {
                  console.warn('打开缓存失败:', error);
                });
            }
            
            return networkResponse;
          })
          .catch((error) => {
            console.error('Fetch 错误:', error);
            // 对于导航请求，返回离线页面
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
          });
      })
  );
});

// 推送事件：处理推送通知
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: {
      url: data.url
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 点击通知事件：打开对应页面
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      const url = event.notification.data.url;
      
      // 检查是否已有打开的窗口
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // 否则打开新窗口
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
