/* عُهدة · Uhda — يحفظ ملفات التطبيق ليعمل بدون إنترنت */
const CACHE = 'uhda-v1.0-r2';
const ASSETS = [
  './', './index.html', './app.js', './dc-runtime.js', './lib/preact.min.js', './lib/html2canvas.min.js', './lib/jspdf.umd.min.js', './manifest.webmanifest',
  './fonts/almarai.css',
  './fonts/almarai-arabic-300-normal.woff2', './fonts/almarai-arabic-400-normal.woff2', './fonts/almarai-arabic-700-normal.woff2',
  './fonts/almarai-latin-300-normal.woff2', './fonts/almarai-latin-400-normal.woff2', './fonts/almarai-latin-700-normal.woff2',
  './icons/icon-32.png', './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png', './icons/logo.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // الشبكة أولاً (حتى تصل الإصلاحات فوراً)، وبدون نت نرجع للنسخة المحفوظة
  e.respondWith(
    new Promise(resolve => {
      let done = false;
      const fromCache = () => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('./index.html'));
      const timer = setTimeout(() => { if (!done) { done = true; resolve(fromCache()); } }, 4000);
      fetch(req, { cache: 'no-cache' }).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        if (!done) { done = true; clearTimeout(timer); resolve(res); }
      }).catch(() => { if (!done) { done = true; clearTimeout(timer); resolve(fromCache()); } });
    })
  );
});
