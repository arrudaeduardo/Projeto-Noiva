// Projeto Noiva: modo offline e atualizações.
// A cada publicação, aumente VERSION (aqui e em APP_VERSION no index.html).
// Com isso o iPhone detecta a versão nova, guarda tudo e o app mostra a faixa "Nova versão disponível".
const VERSION = '2026-11-19.1';
const CACHE = 'pn-' + VERSION;
const FILES = ['./', './index.html', './manifest.webmanifest', './fonts/fonts.css',
  './fonts/f0.woff2', './fonts/f1.woff2', './fonts/f2.woff2', './fonts/f3.woff2',
  './icons/apple-touch-icon.png', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // cache:'reload' evita pegar arquivo antigo do cache HTTP
    await c.addAll(FILES.map(u => new Request(u, {cache: 'reload'})));
    // A primeira versão (pn-v1) não sabia mostrar a faixa: nesse caso troca direto.
    if (await caches.has('pn-v1')) self.skipWaiting();
  })());
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('pn-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const key = req.mode === 'navigate' ? './index.html' : req;
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    const hit = await c.match(key, {ignoreSearch: true});
    if (hit) return hit;
    try { return await fetch(req); }
    catch (_) { return new Response('Sem conexão', {status: 503}); }
  })());
});
