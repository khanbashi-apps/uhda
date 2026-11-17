/* عُهدة · Uhda 1.0 — عامل الخدمة: عمل بدون إنترنت + تنبيهات في الخلفية */
const CACHE = 'uhda-v1.0';
const SHELL = ['./', 'index.html', 'app.js', 'dc-runtime.js', 'manifest.webmanifest', 'fonts/almarai.css',
  'fonts/almarai-arabic-300-normal.woff2', 'fonts/almarai-arabic-400-normal.woff2', 'fonts/almarai-arabic-700-normal.woff2',
  'fonts/almarai-latin-300-normal.woff2', 'fonts/almarai-latin-400-normal.woff2', 'fonts/almarai-latin-700-normal.woff2',
  'lib/preact.min.js', 'lib/html2canvas.min.js', 'lib/jspdf.umd.min.js', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-32.png', 'icons/logo.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
/* الشبكة أولاً ثم النسخة المخزّنة — التحديثات تصل فوراً والتطبيق يعمل بدون إنترنت */
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then((res) => {
    if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(req, cp)).catch(() => {}); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('index.html'))));
});

/* ---- قراءة جدول التنبيهات الذي يكتبه التطبيق في IndexedDB ---- */
function kv(mode, key, val) {
  return new Promise((res) => {
    const q = indexedDB.open('uhda', 1);
    q.onupgradeneeded = () => q.result.createObjectStore('kv');
    q.onerror = () => res(null);
    q.onsuccess = () => {
      try {
        const t = q.result.transaction('kv', mode), st = t.objectStore('kv');
        if (mode === 'readonly') { const g = st.get(key); g.onsuccess = () => res(g.result); g.onerror = () => res(null); }
        else { st.put(val, key); t.oncomplete = () => res(true); t.onerror = () => res(false); }
      } catch (err) { res(null); }
    };
  });
}
const today = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
/* يُظهر تنبيه كل موعد حلّ وقته، مرة واحدة في اليوم، ويتكرر يومياً حتى يجدّد المستخدم أو يُسكت التنبيه داخل التطبيق */
async function dailyCheck() {
  const raw = await kv('readonly', 'sched');
  if (!raw) return;
  let data; try { data = JSON.parse(raw); } catch (e) { return; }
  const sent = JSON.parse((await kv('readonly', 'swSent')) || '{}'), now = Date.now(), day = today();
  for (const x of (data.items || [])) {
    if (x.at > now || sent[x.key] === day) continue;
    if (x.once && now - x.at > 864e5) continue;
    await self.registration.showNotification(x.title, { body: x.body, tag: 'uhda-' + x.key, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', data: { id: x.id }, renotify: true });
    sent[x.key] = day;
  }
  await kv('readwrite', 'swSent', JSON.stringify(sent));
}
/* أندرويد (Chrome): فحص دوري في الخلفية بعد تثبيت التطبيق */
self.addEventListener('periodicsync', (e) => { if (e.tag === 'uhda-daily') e.waitUntil(dailyCheck()); });
/* Web Push: جاهز لاستقبال إشعار من خادم إرسال إن رُبط لاحقاً (مطلوب للتنبيه والتطبيق مغلق تماماً على الآيفون) */
self.addEventListener('push', (e) => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (err) { d = { title: 'عُهدة', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(d.check ? dailyCheck() : self.registration.showNotification(d.title || 'عُهدة', { body: d.body || '', tag: d.tag || 'uhda-push', icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', data: { id: d.id } }));
});
/* الضغط على التنبيه يفتح التطبيق على العنصر نفسه */
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const id = e.notification.data && e.notification.data.id;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
    for (const c of cs) { if ('focus' in c) { if (id != null) c.postMessage({ open: id }); return c.focus(); } }
    return self.clients.openWindow(id != null ? './?open=' + encodeURIComponent(id) : './');
  }));
});
