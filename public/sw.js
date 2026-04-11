const CACHE_NAME = 'omamori-tag-v1'

// キャッシュするアセット（アプリシェル）
const PRECACHE_ASSETS = [
  '/',
]

// インストール時：アプリシェルをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS)
    })
  )
  self.skipWaiting()
})

// アクティベート時：古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// フェッチ：Network First（オフライン時はキャッシュにフォールバック）
self.addEventListener('fetch', (event) => {
  // API / Supabase / 外部リクエストはキャッシュしない
  const url = new URL(event.request.url)
  if (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('resend.com') ||
    event.request.method !== 'GET'
  ) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 有効なレスポンスをキャッシュに保存
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // オフライン時はキャッシュから返す
        return caches.match(event.request).then((cached) => {
          if (cached) return cached
          // ナビゲーションリクエストはルートページを返す
          if (event.request.mode === 'navigate') {
            return caches.match('/')
          }
          return new Response('Offline', { status: 503 })
        })
      })
  )
})
