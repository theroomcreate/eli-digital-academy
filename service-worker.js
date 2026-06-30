const CACHE_NAME = 'eli-academy-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/course.html',
    '/lesson.html',
    '/resources.html',
    '/achievements.html',
    '/progress.html',
    '/settings.html',
    '/404.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/storage.js',
    '/js/quiz-engine.js',
    '/js/progress.js',
    '/js/achievements.js',
    '/js/content-loader.js',
    '/js/ui.js',
    '/content/course.json',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'
];

// Content pages to cache for offline access
const DYNAMIC_CACHE = 'eli-academy-dynamic-v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        }).catch(() => {
            // If some assets fail, still complete install
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME && key !== DYNAMIC_CACHE)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // API/content requests: stale-while-revalidate
    if (url.pathname.startsWith('/content/') || url.pathname.endsWith('.json')) {
        event.respondWith(
            caches.match(request).then((cached) => {
                const fetchPromise = fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const clone = networkResponse.clone();
                        caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
                    }
                    return networkResponse;
                }).catch(() => cached);
                return cached || fetchPromise;
            })
        );
        return;
    }

    // Static assets: cache-first
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((response) => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const clone = response.clone();
                caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
                return response;
            }).catch(() => {
                // Return offline fallback if available
                if (request.mode === 'navigate') {
                    return caches.match('/404.html').then(r => r || caches.match('/index.html'));
                }
            });
        })
    );
});

// Sync queued progress when coming back online
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-progress') {
        event.waitUntil(syncProgress());
    }
});

async function syncProgress() {
    const clients = await self.clients.matchAll();
    clients.forEach((client) => client.postMessage({ type: 'SYNC_PROGRESS' }));
}
