const CACHE_NAME = 'github-repo-analyzer-v1';
const STATIC_CACHE_NAME = 'github-repo-analyzer-static-v1';

// Assets to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Runtime cachable resources
const RUNTIME_CACHE = [
  'https://api.github.com',
  'https://avatars.githubusercontent.com'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS.filter(url => !url.startsWith('http')));
      }),
      
      // Cache external resources with error handling
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Caching external resources');
        const externalAssets = STATIC_ASSETS.filter(url => url.startsWith('http'));
        return Promise.allSettled(
          externalAssets.map(url => 
            fetch(url)
              .then(response => response.ok ? cache.put(url, response) : Promise.reject())
              .catch(() => console.log(`Failed to cache: ${url}`))
          )
        );
      })
    ]).then(() => {
      console.log('Service Worker installed successfully');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.origin === location.origin) {
    // Same-origin requests (app shell)
    event.respondWith(handleAppShell(request));
  } else if (url.hostname === 'api.github.com') {
    // GitHub API requests
    event.respondWith(handleApiRequest(request));
  } else if (url.hostname === 'avatars.githubusercontent.com') {
    // GitHub avatars
    event.respondWith(handleImageRequest(request));
  } else if (url.hostname.includes('googleapis.com') || url.hostname.includes('gstatic.com')) {
    // Google Fonts
    event.respondWith(handleFontRequest(request));
  }
});

// App shell caching strategy (Cache First)
async function handleAppShell(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If not in cache, fetch from network
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('App shell request failed:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/') || createOfflineResponse();
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// API request caching strategy (Network First with Cache Fallback)
async function handleApiRequest(request) {
  try {
    // Try network first
    const response = await fetch(request, {
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout ? AbortSignal.timeout(10000) : undefined
    });
    
    if (response.ok) {
      // Cache successful API responses
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('API request failed, trying cache:', error);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return error response if no cache
    return createApiErrorResponse();
  }
}

// Image caching strategy (Cache First)
async function handleImageRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fetch from network
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache images for future use
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('Image request failed:', error);
    return new Response('', { status: 404 });
  }
}

// Font caching strategy (Cache First with Stale While Revalidate)
async function handleFontRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // Return cached version immediately
      // But also update cache in background
      fetch(request).then(response => {
        if (response.ok) {
          caches.open(CACHE_NAME).then(cache => cache.put(request, response));
        }
      }).catch(() => {}); // Ignore background update errors
      
      return cachedResponse;
    }

    // If not in cache, fetch and cache
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('Font request failed:', error);
    return new Response('', { status: 404 });
  }
}

// Create offline response for app shell
function createOfflineResponse() {
  const offlineHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>GitHub Repository Analyzer - Offline</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0;
            padding: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
          }
          .offline-container {
            background: white;
            color: #1f2937;
            padding: 3rem 2rem;
            border-radius: 16px;
            max-width: 500px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
          .offline-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
          .offline-title {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 1rem;
          }
          .offline-message {
            color: #6b7280;
            margin-bottom: 2rem;
            line-height: 1.6;
          }
          .retry-button {
            background: #2563eb;
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="offline-container">
          <div class="offline-icon">📱</div>
          <h1 class="offline-title">You're Offline</h1>
          <p class="offline-message">
            GitHub Repository Analyzer is currently offline. 
            Please check your internet connection and try again.
          </p>
          <button class="retry-button" onclick="location.reload()">
            Retry Connection
          </button>
        </div>
      </body>
    </html>
  `;
  
  return new Response(offlineHTML, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Create API error response
function createApiErrorResponse() {
  return new Response(
    JSON.stringify({
      message: 'Unable to fetch data. Please check your internet connection.',
      status: 0
    }),
    {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Handle background sync for future enhancements
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    // Could be used for queuing failed requests
  }
});

// Handle push notifications for future enhancements
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    console.log('Push notification received:', data);
    
    // Could show notifications about repository updates
    // self.registration.showNotification(data.title, {
    //   body: data.body,
    //   icon: '/logo192.png'
    // });
  }
});

console.log('Service Worker script loaded');
