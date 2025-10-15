const CACHE_NAME = 'hamcap-images-v1';
const IMAGE_CACHE_MAX = 200;

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (evt) => {
  const req = evt.request;
  // only handle GET requests for image files matching pattern (adjust if needed)
  if (req.method !== 'GET' || !req.url.match(/UT-\d{2}-\d+MHz\.(gif|png|jpg|webp)$/)) return;

  evt.respondWith(caches.open(CACHE_NAME).then(async cache => {
    const cached = await cache.match(req);
    if (cached) return cached;
    try {
      const resp = await fetch(req, { mode: 'no-cors' });
      // only put successful opaque responses (or check resp.ok)
      cache.put(req, resp.clone());
      // optional: prune oldest entries to keep cache size bounded
      return resp;
    } catch (err) {
      // fallback to cache if fetch failed
      return cached || Response.error();
    }
  }));
});