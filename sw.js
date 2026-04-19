



































                    


const urlsToCache = [
  './',
  './index.html',
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

const CACHE_NAME = 'notes-cache-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
