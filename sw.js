



































                    


const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './favicon.ico',
  'https://cdnjs.cloudflare.com/ajax/libs/jsdiff/8.0.2/diff.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/marked/16.3.0/lib/marked.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.2.7/purify.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github.min.css',
  'https://cdn.jsdelivr.net/npm/marked-katex-extension@5.1.8/lib/index.umd.min.js',

  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_AMS-Regular.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Caligraphic-Bold.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Caligraphic-Regular.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Fraktur-Bold.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Fraktur-Regular.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Main-Bold.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Main-BoldItalic.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Main-Italic.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Main-Regular.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Math-BoldItalic.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Math-Italic.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_SansSerif-Bold.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_SansSerif-Italic.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_SansSerif-Regular.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Script-Regular.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Size1-Regular.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Size2-Regular.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Size3-Regular.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Size4-Regular.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Typewriter-Regular.woff2',
  
];

const allowedHosts = new Set(
  urlsToCache.map(requestUrl => new URL(requestUrl, location.origin).hostname)
);

// One cache per build (20261022T023743Z-10d09c5-dirty comes from make), so a new build installs a
// new worker with fresh copies of the app files. The new worker waits until
// the page tells it to take over (app/boot shows "New version available").
const CACHE_PREFIX = 'notes-cache-';
const CACHE_NAME = CACHE_PREFIX + '20261022T023743Z-10d09c5-dirty';

const isLocal = (requestUrl) => new URL(requestUrl, location.href).origin === location.origin;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => Promise.all(urlsToCache.map(async requestUrl => {
    if (isLocal(requestUrl)) {
      // Bypass the HTTP cache, which may still hold the previous build.
      return cache.add(new Request(requestUrl, { cache: 'reload' }));
    }
    // CDN URLs are versioned and never change: reuse a copy from an older cache.
    const cached = await caches.match(requestUrl);
    return cached ? cache.put(requestUrl, cached) : cache.add(requestUrl);
  }))));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names
        .filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
        .map(name => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (!allowedHosts.has(url.hostname)) {
    return;
  }

  // Only this build's cache: a waiting worker's newer files must not leak
  // into a page still run by the old one.
  event.respondWith(
    caches.open(CACHE_NAME)
      .then(cache => cache.match(event.request))
      .then(response => response || fetch(event.request))
  );
});
