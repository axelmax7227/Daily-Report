// ===================================
// Service Worker for MASKA Reports PWA
// ===================================

const CACHE_NAME = 'maska-reports-v2';
const RUNTIME_CACHE = 'maska-runtime-v1';

// Files to cache immediately
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/db.js',
    '/auth.js',
    '/onedrive.js',
    '/sw-register.js',
    '/auth-callback.html',
    '/manifest.json',
    '/favicon.svg',
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// ===================================
// Install Event - Cache Static Assets
// ===================================

self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                console.log('[ServiceWorker] Skip waiting');
                return self.skipWaiting();
            })
            .catch((err) => {
                console.error('[ServiceWorker] Cache failed:', err);
            })
    );
});

// ===================================
// Activate Event - Clean Old Caches
// ===================================

self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
                        })
                        .map((cacheName) => {
                            console.log('[ServiceWorker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[ServiceWorker] Claiming clients');
                return self.clients.claim();
            })
    );
});

// ===================================
// Fetch Event - Serve from Cache
// ===================================

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }
    
    // Skip Microsoft Graph API requests (need fresh data)
    if (url.hostname === 'graph.microsoft.com' || 
        url.hostname === 'login.microsoftonline.com') {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    // Update cache in background
                    updateCache(request);
                    return cachedResponse;
                }
                
                // Fetch from network
                return fetch(request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }
                        
                        // Cache runtime resources
                        if (shouldCache(request)) {
                            const responseToCache = response.clone();
                            caches.open(RUNTIME_CACHE)
                                .then((cache) => {
                                    cache.put(request, responseToCache);
                                });
                        }
                        
                        return response;
                    })
                    .catch((err) => {
                        console.error('[ServiceWorker] Fetch failed:', err);
                        
                        // Return offline page for navigation requests
                        if (request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        
                        throw err;
                    });
            })
    );
});

// ===================================
// Background Sync
// ===================================

self.addEventListener('sync', (event) => {
    console.log('[ServiceWorker] Background sync:', event.tag);
    
    if (event.tag === 'sync-reports') {
        event.waitUntil(syncReports());
    }
});

// ===================================
// Push Notifications (Future Feature)
// ===================================

self.addEventListener('push', (event) => {
    console.log('[ServiceWorker] Push received');
    
    const options = {
        body: event.data ? event.data.text() : 'New update available',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('MASKA Reports', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    console.log('[ServiceWorker] Notification clicked');
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});

// ===================================
// Helper Functions
// ===================================

function shouldCache(request) {
    const url = new URL(request.url);
    
    // Cache static assets and API responses
    return request.method === 'GET' && (
        url.pathname.endsWith('.js') ||
        url.pathname.endsWith('.css') ||
        url.pathname.endsWith('.html') ||
        url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.jpg') ||
        url.pathname.endsWith('.json')
    );
}

function updateCache(request) {
    fetch(request)
        .then((response) => {
            if (response && response.status === 200) {
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(request, response);
                    });
            }
        })
        .catch((err) => {
            // Silently fail - using cached version
            console.log('[ServiceWorker] Update cache failed:', err);
        });
}

async function syncReports() {
    try {
        // This would be called from the main app
        // Here we just log that sync was requested
        console.log('[ServiceWorker] Syncing reports with OneDrive...');
        
        // In a full implementation, you would:
        // 1. Open IndexedDB
        // 2. Get all unsynced reports
        // 3. Upload to OneDrive
        // 4. Update sync status
        
        return Promise.resolve();
    } catch (err) {
        console.error('[ServiceWorker] Sync failed:', err);
        return Promise.reject(err);
    }
}

// ===================================
// Message Handler
// ===================================

self.addEventListener('message', (event) => {
    console.log('[ServiceWorker] Message received:', event.data);
    
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(RUNTIME_CACHE)
                .then((cache) => {
                    return cache.addAll(event.data.urls);
                })
        );
    }
    
    if (event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys()
                .then((cacheNames) => {
                    return Promise.all(
                        cacheNames.map((cacheName) => {
                            return caches.delete(cacheName);
                        })
                    );
                })
        );
    }
});

// ===================================
// Version Info
// ===================================

console.log('[ServiceWorker] Version 1.0.0 loaded');
