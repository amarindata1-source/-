/* Service worker ขนาดเล็ก: เปิดหน้าแอปจากแคชทันที แล้วอัปเดตเบื้องหลัง (ฉบับใหม่จะเห็นในการเปิดครั้งถัดไป) ไม่แคช API */
const CACHE = 'assign-shell-v2';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', 'index.html'])).catch(() => {})); });
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(c => c.match(r).then(m => {
    const net = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => m || c.match('index.html'));
    return m || net;
  })));
});
